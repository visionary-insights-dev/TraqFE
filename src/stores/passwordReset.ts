let resetToken: string | null = null;
let resetEmail: string | null = null;

export function setResetToken(token: string | null): void {
  resetToken = token;
}

export function getResetToken(): string | null {
  return resetToken;
}

export function setResetEmail(email: string | null): void {
  resetEmail = email;
}

export function getResetEmail(): string | null {
  return resetEmail;
}

export function clearResetState(): void {
  resetToken = null;
  resetEmail = null;
}
