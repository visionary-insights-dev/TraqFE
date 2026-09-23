import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";

const baseURL = process.env.TRAQ_API_BASE_URL ?? "https://traq-api-zwm6.onrender.com";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await axios.post<{
      success: boolean;
      data: { accessToken: string };
    }>(
      `${baseURL}/api/v1/auth/refresh`,
      null,
      {
        withCredentials: true,
        timeout: 15_000,
      }
    );

    if (!response.data.success) {
      return res.status(401).json({ error: "Token refresh failed" });
    }

    // Forward any set-cookie headers (refresh_token rotation)
    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      res.setHeader("Set-Cookie", setCookieHeader);
    }

    return res.status(200).json({
      success: true,
      data: {
        accessToken: response.data.data.accessToken,
      },
    });
  } catch (err) {
    const axiosError = err as AxiosError;
    console.error("Traq refresh error:", axiosError.message);

    if (axiosError.response?.status === 401) {
      return res.status(401).json({ error: "Refresh token expired" });
    }

    if (axiosError.code === "ECONNABORTED") {
      return res.status(504).json({ error: "Traq API request timed out" });
    }

    return res.status(502).json({ error: "Unable to reach Traq API" });
  }
}