import axios, { type AxiosResponse } from "axios";

const API_ORIGIN = "https://traq-api-zwm6.onrender.com";
const LOGIN_ENDPOINT = `${API_ORIGIN}/api/v1/auth/login`;
const PROFILE_ENDPOINT = `${API_ORIGIN}/api/v1/users/me/profile`;
const REQUEST_TIMEOUT_MS = 30_000;

const REQUEST_OPTIONS = {
  maxRedirects: 0,
  timeout: REQUEST_TIMEOUT_MS,
  validateStatus: () => true,
  withCredentials: false,
};

function getLiveCredentials(): { email: string; password: string } | null {
  if (process.env.TRAQ_LIVE_TESTS !== "true") return null;

  const email = process.env.TRAQ_LIVE_EMAIL;
  const password = process.env.TRAQ_LIVE_PASSWORD;
  if (!email || !password) return null;

  return { email, password };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readAccessToken(value: unknown): string | null {
  if (!isRecord(value) || value.success !== true || !isRecord(value.data)) {
    return null;
  }

  const { accessToken, user } = value.data;
  if (
    typeof accessToken !== "string" ||
    accessToken.length === 0 ||
    !isRecord(user)
  ) {
    return null;
  }

  return accessToken;
}

async function login(
  email: string,
  password: string
): Promise<AxiosResponse<unknown>> {
  try {
    return await axios.post<unknown>(
      LOGIN_ENDPOINT,
      { email, password },
      {
        ...REQUEST_OPTIONS,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  } catch {
    throw new Error("Traq live login request failed.");
  }
}

async function readProfile(accessToken: string): Promise<AxiosResponse> {
  try {
    return await axios.get(PROFILE_ENDPOINT, {
      ...REQUEST_OPTIONS,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch {
    throw new Error("Traq live profile read failed.");
  }
}

const credentials = getLiveCredentials();
const describeLive = credentials ? describe : describe.skip;

describeLive("Traq live integration", () => {
  it("logs in and reads the authenticated profile", async () => {
    if (!credentials) {
      throw new Error("Traq live integration configuration is incomplete.");
    }

    const loginResponse = await login(credentials.email, credentials.password);
    if (loginResponse.status !== 200) {
      throw new Error(`Traq live login failed with HTTP ${loginResponse.status}.`);
    }

    const accessToken = readAccessToken(loginResponse.data);
    if (!accessToken) {
      throw new Error("Traq live login returned an invalid response schema.");
    }

    const profileResponse = await readProfile(accessToken);
    if (profileResponse.status !== 200) {
      throw new Error(
        `Traq live profile read failed with HTTP ${profileResponse.status}.`
      );
    }
  });
});
