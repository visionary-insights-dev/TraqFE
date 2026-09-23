import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";

const baseURL = process.env.TRAQ_API_BASE_URL ?? "https://traq-api-zwm6.onrender.com";

type TraqUser = {
  id: string;
  email: string;
  role: string;
  organizationId?: string;
  [key: string]: unknown;
};

type TraqLoginResponse = {
  success: boolean;
  data: { accessToken: string; user: TraqUser };
  error?: { message: string };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "username and password are required" });
  }

  try {
    const response = await axios.post<TraqLoginResponse>(
      `${baseURL}/api/v1/auth/login`,
      { email: username, password },
      {
        timeout: 15_000,
      }
    );

    if (!response.data.success) {
      return res.status(401).json({ error: response.data.error?.message || "Login failed" });
    }

    // Set httpOnly refresh_token cookie (same pattern as the FE session cookie)
    // The BE sets this on login/refresh responses; we forward it to the browser.
    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      res.setHeader("Set-Cookie", setCookieHeader);
    }

    return res.status(200).json({
      success: true,
      data: {
        accessToken: response.data.data.accessToken,
        user: response.data.data.user,
      },
    });
  } catch (err) {
    const axiosError = err as AxiosError;
    console.error("Traq login error:", axiosError.message);

    // Redact credentials from logs
    if (axiosError.response?.status === 401) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (axiosError.code === "ECONNABORTED") {
      return res.status(504).json({ error: "Traq API request timed out" });
    }

    return res.status(502).json({ error: "Unable to reach Traq API" });
  }
}