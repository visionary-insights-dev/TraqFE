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
    // Use withCredentials to send the httpOnly refresh_token cookie
    const response = await axios.post<{
      success: boolean;
    }>(
      `${baseURL}/api/v1/auth/logout`,
      null,
      {
        withCredentials: true,
        timeout: 15_000,
      }
    );

    // Forward set-cookie if present (logout may clear the refresh_token cookie)
    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      res.setHeader("Set-Cookie", setCookieHeader);
    }

    return res.status(200).json({
      success: response.data.success,
    });
  } catch (err) {
    const axiosError = err as AxiosError;
    console.error("Traq logout error:", axiosError.message);

    // Best-effort logout — still signal success so the FE clears its state
    return res.status(200).json({
      success: false,
    });
  }
}