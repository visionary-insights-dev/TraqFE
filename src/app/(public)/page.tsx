import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default function LandingPage() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
        Manage programs, scholars, and outcomes in one place.
      </h1>
      <p className="mt-4 max-w-xl text-lg text-neutral-600">
        Traq helps organizations run scholarship and learning programs end to end.
      </p>
      <a
        href="/auth/sign-in"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-md bg-brand-600 px-6 text-base font-medium text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        Get Started
      </a>
    </main>
  );
}
