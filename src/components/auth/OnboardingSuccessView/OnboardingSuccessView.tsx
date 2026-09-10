"use client";

import { getUser } from "@/stores/auth";
import { Button } from "@/components/ui";
import { AuthCard } from "@/components/auth";
import { PartyPopper } from "lucide-react";

const roleHome: Record<string, string> = {
  SUPER_ADMIN: "/admin/dashboard",
  MENTOR: "/mentor/scholars",
  SCHOLAR: "/scholar/dashboard",
};

export const OnboardingSuccessView = () => {
  const goToDashboard = () => {
    const user = getUser();
    const dest = user?.role ? roleHome[user.role] : "/";
    // Use a full page reload so the middleware re-evaluates the (now
    // refreshed) JWT cookie. A soft navigation via router.push can
    // sometimes resolve before the cookie is flushed, causing the
    // middleware to still see the old profileComplete:false claim.
    window.location.href = dest;
  };

  return (
    <AuthCard>
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-light ring-1 ring-success/20">
          <PartyPopper className="h-8 w-8 text-success-dark" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
          You&apos;re all set!
        </h2>
        <p className="mt-2 max-w-sm text-neutral-600">
          Your profile is complete. You&apos;re ready to start using Traq.
        </p>
      </div>

      <Button size="lg" className="w-full" onClick={goToDashboard}>
        Go to Dashboard
      </Button>
    </AuthCard>
  );
};
