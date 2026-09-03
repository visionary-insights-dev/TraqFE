import { renderHook, act } from "@testing-library/react";
import { useCooldown } from "./useCooldown";

describe("useCooldown", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("starts not ready (ready) initially", () => {
    const { result } = renderHook(() => useCooldown(60));
    expect(result.current.isReady).toBe(true);
    expect(result.current.remaining).toBe(0);
  });

  it("counts down after start and expires", () => {
    const { result } = renderHook(() => useCooldown(3));
    act(() => {
      result.current.start();
    });
    expect(result.current.isReady).toBe(false);
    expect(result.current.remaining).toBe(3);

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.remaining).toBe(2);

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current.remaining).toBe(0);
    expect(result.current.isReady).toBe(true);
  });

  it("does not tick below zero", () => {
    const { result } = renderHook(() => useCooldown(1));
    act(() => {
      result.current.start();
      jest.advanceTimersByTime(5000);
    });
    expect(result.current.remaining).toBe(0);
    expect(result.current.isReady).toBe(true);
  });
});
