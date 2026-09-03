import type { Metadata } from "next";
import { AuthLayout } from "@/components/layouts";
import { AuthBrandPanel } from "@/components/auth";

export const metadata: Metadata = {
  title: "Auth",
};

export default function AuthLayoutGroup({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthLayout visual={<AuthBrandPanel />}>
      {children}
    </AuthLayout>
  );
}
