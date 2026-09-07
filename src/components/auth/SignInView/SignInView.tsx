"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/useAuthMutations";
import { loginSchema, type LoginFormInput } from "@/validators/auth";
import { getUser } from "@/stores/auth";
import { Button, Input, Checkbox } from "@/components/ui";
import { AuthCard, AuthErrorBanner } from "@/components/auth";
import { ApiClientError } from "@/lib/api";

const roleHome: Record<string, string> = {
  SUPER_ADMIN: "/admin/dashboard",
  MENTOR: "/mentor/scholars",
  SCHOLAR: "/scholar/dashboard",
};

export const SignInView = () => {
  const router = useRouter();
  const loginMutation = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  const errorMessage =
    loginMutation.error instanceof ApiClientError
      ? loginMutation.error.message
      : loginMutation.isError
        ? "Unable to sign in. Please try again."
        : null;

  const onSubmit = (values: LoginFormInput) => {
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        const user = getUser();
        if (user && user.profileComplete === false) {
          router.push("/auth/onboarding");
          return;
        }
        const dest = data.user?.role ? roleHome[data.user.role] : undefined;
        router.push(dest ?? "/");
      },
    });
  };

  return (
    <AuthCard>
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
          Welcome back
        </h2>
        <p className="mt-1 text-neutral-600">
          Sign in to your Traq account
        </p>
      </div>

      <AuthErrorBanner message={errorMessage} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-5"
        noValidate
      >
        <Input
          id="email"
          type="email"
          label="Email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          id="password"
          type="password"
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex items-center justify-between">
          <Checkbox
            id="rememberMe"
            label="Remember me"
            {...register("rememberMe")}
          />
          <a
            href="/auth/forgot-password"
            className="text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline"
          >
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={loginMutation.isPending}
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-neutral-600">
        <span>Trouble signing in? </span>
        <a
          href="/auth/magic-link"
          className="font-medium text-brand-600 hover:text-brand-700 hover:underline"
        >
          Get a magic link
        </a>
      </div>
    </AuthCard>
  );
};
