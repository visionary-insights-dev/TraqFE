import {
  setResetToken,
  getResetToken,
  setResetEmail,
  getResetEmail,
  clearResetState,
} from "./passwordReset";

describe("passwordReset store", () => {
  beforeEach(() => {
    clearResetState();
  });

  it("stores and retrieves the reset token", () => {
    expect(getResetToken()).toBeNull();
    setResetToken("abc123");
    expect(getResetToken()).toBe("abc123");
  });

  it("stores and retrieves the reset email", () => {
    expect(getResetEmail()).toBeNull();
    setResetEmail("ada@example.com");
    expect(getResetEmail()).toBe("ada@example.com");
  });

  it("clears reset state", () => {
    setResetToken("abc");
    setResetEmail("ada@example.com");
    clearResetState();
    expect(getResetToken()).toBeNull();
    expect(getResetEmail()).toBeNull();
  });
});
