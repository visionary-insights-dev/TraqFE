import { type User } from "./types";

const REMEMBER_ME_KEY = "traq_remember_me";

let accessToken: string | null = null;
let currentUser: User | null = null;

export function getRemembered(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(REMEMBER_ME_KEY) === "1";
  } catch {
    return false;
  }
}

export function setRemembered(remember: boolean): void {
  try {
    if (remember) {
      window.localStorage.setItem(REMEMBER_ME_KEY, "1");
    } else {
      window.localStorage.removeItem(REMEMBER_ME_KEY);
    }
  } catch {
    return;
  }
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function setUser(user: User | null): void {
  currentUser = user;
}

export function getUser(): User | null {
  return currentUser;
}

export function clearAccessToken(): void {
  accessToken = null;
}

export function clearUser(): void {
  currentUser = null;
}

export function isAuthenticated(): boolean {
  return accessToken !== null;
}

export function clearAuth(): void {
  clearAccessToken();
  clearUser();
}
