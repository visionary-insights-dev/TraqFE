import { cn } from "@/lib/utils";
import type { AuthLayoutProps } from "./types";

export const AuthLayout = ({
  children,
  visual,
  className,
  ...props
}: AuthLayoutProps) => {
  return (
    <div
      className={cn("grid min-h-screen grid-cols-1 lg:grid-cols-2", className)}
      {...props}
    >
      <div className="relative hidden overflow-hidden lg:block">
        {visual ? (
          visual
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-700 via-brand-600 to-secondary-500">
            <div className="px-8 text-center text-white">
              <h1 className="text-4xl font-bold tracking-tight">Traq</h1>
              <p className="mt-3 text-lg text-brand-100">
                Managing programs, scholars, and outcomes — all in one place.
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};
