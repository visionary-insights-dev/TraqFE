/**
 * Builds a bare TanStack Query mutation result suitable for mocking an
 * `useMutate*` hook. `M` is the exact `UseMutationResult<TData, TError, TVariables>`
 * the real hook returns, so the component under test type-checks against its
 * own mock. All runnable callbacks (`mutate`, `reset`, etc.) are `jest.fn()`s.
 */
export function mockMutationResult<M>(
  overrides: Partial<M> = {}
): M {
  const base = {
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isPending: false,
    isError: false,
    error: null,
    status: "idle",
    isIdle: true,
    isSuccess: false,
    isPaused: false,
    submittedAt: 0,
    variables: undefined,
    data: undefined,
    failureCount: 0,
    failureReason: null,
    reset: jest.fn(),
    context: undefined,
  } as unknown as M;

  return { ...base, ...overrides };
}
