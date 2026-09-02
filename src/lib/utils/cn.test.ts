// src/lib/utils/cn.test.ts
import { cn } from "./cn";

describe("cn", () => {
  it("joins class names and drops falsy values", () => {
    expect(cn("a", "b", null, undefined, false, "c")).toBe("a b c");
  });

  it("merges conflicting Tailwind utility classes (later wins)", () => {
    // tailwind-merge dedupes conflicting utilities.
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("handles cva-style conditionals", () => {
    expect(cn("base", { active: true, disabled: false })).toBe("base active");
  });
});
