// src/stores/auth.test.ts
import {
  setAccessToken,
  getAccessToken,
  setUser,
  getUser,
  isAuthenticated,
  clearAuth,
} from "./auth";
import { type User } from "./types";

describe("auth store", () => {
  beforeEach(() => {
    clearAuth();
  });

  // The access token is held in memory only (never localStorage/cookies) so it
  // cannot be harvested from client storage — a core security rule.
  it("returns null access token before any token is set", () => {
    expect(getAccessToken()).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });

  it("stores and returns the access token in memory", () => {
    setAccessToken("token-123");
    expect(getAccessToken()).toBe("token-123");
    expect(isAuthenticated()).toBe(true);
  });

  it("tracks the current user", () => {
    const user: User = {
      id: "u1",
      email: "ama@example.com",
      name: "Ama",
      role: "SCHOLAR",
      organizationId: "org-1",
    };
    setUser(user);
    expect(getUser()).toEqual(user);
  });

  it("clears both token and user on clearAuth", () => {
    setAccessToken("token-123");
    setUser({
      id: "u1",
      email: "a@b.com",
      name: "A",
      role: "SCHOLAR",
      organizationId: "org-1",
    });

    clearAuth();

    expect(getAccessToken()).toBeNull();
    expect(getUser()).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });
});
