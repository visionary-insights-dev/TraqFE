import { type User } from "./types";

let accessToken: string | null = null;
let currentUser: User | null = null;

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

export function isAuthenticated(): boolean {
  return accessToken !== null;
}

export function clearAuth(): void {
  accessToken = null;
  currentUser = null;
}
