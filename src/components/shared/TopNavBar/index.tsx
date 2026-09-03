"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { type TopNavBarProps } from "./types";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#roles", label: "Roles" },
  { href: "#cta", label: "CTA" },
];

export const TopNavBar = ({
  className,
  ...props
}: TopNavBarProps) => {
  return (
    <nav
      className={cn(
        "border-b border-neutral-200 bg-neutral-0 sticky top-0 z-10",
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2"
            >
              <span className="text-xl font-bold tracking-trap">Traq</span>
            </Link>
            <button
              className="lg:hidden p-2"
              aria-label="Open navigation"
            >
              <svg
                className="h-6 w-6 stroke-current"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
          <div className="hidden lg:block">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-neutral-700 hover:text-brand-600 transition-colors font-medium"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex items-center gap-3">
                <Button
                  className="px-4 py-1.5 text-sm"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  className="px-4 py-1.5 text-sm"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu, hidden on desktop */}
        <div className="lg:hidden hidden">
          <div
            className="fixed inset-0 bg-neutral-900 top-16 left-0 z-50 flex flex-col h-screen p-6 gap-4"
            aria-label="Main navigation"
          >
            <div className="text-2xl font-bold text-neutral-100 hover:text-neutral-200">
              Traq
            </div>
            <nav>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-neutral-700 hover:text-brand-600 py-2"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-6 flex gap-3">
              <Button
                variant="primary"
                className="w-full py-2 text-sm"
              >
                Get Started
              </Button>
              <Button
                className="w-full py-2 text-sm"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};