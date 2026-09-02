// src/lib/api/client.test.ts
import { apiClient, get, post, ApiClientError } from "./index";

// The client is a thin wrapper around the axios instance: it must unwrap the
// success envelope, attach the auth header from the in-memory store, and
// normalise error responses into machine-readable ApiClientError instances.
describe("api client", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("get", () => {
    it("unwraps the success envelope and returns data", async () => {
      const instanceGet = jest
        .spyOn(apiClient, "get")
        .mockResolvedValue({ data: { success: true, data: { id: "a1" } } });

      await expect(get("/assignments/1")).resolves.toEqual({ id: "a1" });
      expect(instanceGet).toHaveBeenCalledWith("/assignments/1", undefined);
    });
  });

  describe("post", () => {
    it("unwraps the success envelope and returns data", async () => {
      const instancePost = jest
        .spyOn(apiClient, "post")
        .mockResolvedValue({ data: { success: true, data: { id: "a2" } } });

      await expect(
        post("/assignments", { title: "Quiz" })
      ).resolves.toEqual({ id: "a2" });
      expect(instancePost).toHaveBeenCalledWith(
        "/assignments",
        { title: "Quiz" },
        undefined
      );
    });
  });

  describe("error normalisation", () => {
    // Server error envelopes carry a machine-readable code that the UI must
    // be able to branch on (e.g. ASSIGNMENT_EDIT_WINDOW_EXPIRED).
    it("throws an ApiClientError with the server error code on an API error", async () => {
      jest.spyOn(apiClient, "get").mockRejectedValue({
        isAxiosError: true,
        response: {
          status: 404,
          data: {
            success: false,
            error: {
              code: "ASSIGNMENT_EDIT_WINDOW_EXPIRED",
              message: "Edit window has closed.",
            },
          },
        },
      });

      const err = (await get("/assignments/1").catch((e) => e)) as unknown;
      expect(err).toBeInstanceOf(ApiClientError);
      expect(err).toMatchObject({
        code: "ASSIGNMENT_EDIT_WINDOW_EXPIRED",
        message: "Edit window has closed.",
        status: 404,
      });
    });

    it("throws a NETWORK_ERROR code when there is no response payload", async () => {
      jest.spyOn(apiClient, "get").mockRejectedValue({
        isAxiosError: true,
        response: undefined,
      });

      const err = (await get("/assignments").catch((e) => e)) as unknown;
      expect(err).toBeInstanceOf(ApiClientError);
      expect(err).toMatchObject({ code: "NETWORK_ERROR" });
    });

    it("throws an UNKNOWN_ERROR code for non-axios errors", async () => {
      jest.spyOn(apiClient, "get").mockRejectedValue(new Error("boom"));

      const err = (await get("/assignments").catch((e) => e)) as unknown;
      expect(err).toBeInstanceOf(ApiClientError);
      expect(err).toMatchObject({ code: "UNKNOWN_ERROR" });
    });
  });

  describe("auth header (interceptor)", () => {
    it("attaches the bearer token from the in-memory store", async () => {
      const { setAccessToken, clearAuth } = await import("@/stores/auth");
      setAccessToken("secret-token");
      try {
        const config = apiClient.interceptors.request as unknown as {
          handlers: Array<{
            fulfilled?: (
              config: { headers: Record<string, string> }
            ) => { headers: Record<string, string> };
          }>;
        };
        let applied: { headers: Record<string, string> } | undefined;
        for (const handler of config.handlers) {
          if (handler.fulfilled) {
            applied = handler.fulfilled({ headers: {} });
          }
        }
        expect(applied?.headers.Authorization).toBe("Bearer secret-token");
      } finally {
        clearAuth();
      }
    });
  });
});
