import { type ReactElement, type ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { clearAuth } from "@/stores/auth";

/**
 * Wraps a component with the providers the app relies on (TanStack Query)
 * plus a partially typed auth context, and resets the module-level auth store
 * before each render so tests never leak token/user state between cases.
 */
const AuthReset = ({ children }: { children: ReactNode }) => {
  clearAuth();
  return <>{children}</>;
};

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
    },
  });
}

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  queryClient?: QueryClient;
}

export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const { queryClient = createTestQueryClient(), ...renderOptions } = options;

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthReset>{children}</AuthReset>
    </QueryClientProvider>
  );

  return {
    queryClient,
    ...render(ui, { wrapper, ...renderOptions }),
  };
}

// Re-export everything from testing-library so consumers import a single source.
export * from "@testing-library/react";
export { userEvent } from "@testing-library/user-event";
