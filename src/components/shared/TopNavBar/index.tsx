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
    <header
      className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4"
      {...props}
    >
      <div className="flex-shrink-0">
        <Link href="/" className="text-xl font-bold text-[var(--traq-purple)]">
          TRAQ
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-6 px-6 py-2 bg-gray-50/80 rounded-full border border-gray-100">
        <a href="#hero" className="text-sm font-medium text-gray-600 hover:text-gray-900">Home</a>
        <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900">Features</a>
        <a href="#roles" className="text-sm font-medium text-gray-600 hover:text-gray-900">Roles</a>
        <a href="#cta" className="text-sm font-medium text-gray-600 hover:text-gray-900">CTA</a>
      </nav>

      <div className="flex items-center gap-3 flex-shrink-0">
        <Link href="/auth/sign-in">
          <Button variant="outline" size="sm" className="whitespace-nowrap px-4 border border-[var(--traq-purple)] bg-white/80 text-[var(--traq-purple)]">
            Sign In
          </Button>
        </Link>
        <Link href="/auth/sign-in">
          <Button size="sm" className="whitespace-nowrap px-4 bg-[var(--traq-purple)] text-white hover:bg-[var(--traq-purple-hover)]">
            Get Started
          </Button>
        </Link>
      </div>
    </header>
  );
};