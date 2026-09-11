"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { type TopNavBarProps } from "./types";

const navLinks = [
  { href: "#hero", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#roles", label: "Roles" },
];

export const TopNavBar = ({
  className,
  ...props
}: TopNavBarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header
      data-landing-header
      className={cn(
        "traq-glass-header sticky top-0 z-50 min-h-16 w-full",
        className
      )}
      {...props}
    >
      <div data-landing-header-content className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 text-xl font-bold text-[var(--traq-purple)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--traq-purple)] focus-visible:ring-offset-2"
          onClick={closeMenu}
        >
            TRAQ
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-lavender)]/70 px-6 py-2 md:flex"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--traq-muted)] transition-colors hover:text-[var(--traq-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--traq-purple)] focus-visible:ring-offset-2"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link href="/auth/sign-in">
            <Button
              variant="outline"
              size="sm"
              className="hidden whitespace-nowrap border-[var(--traq-purple)] bg-white/80 px-4 text-[var(--traq-purple)] md:inline-flex"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/auth/sign-in">
            <Button
              size="sm"
              className="whitespace-nowrap bg-[var(--traq-purple)] px-3 text-white hover:bg-[var(--traq-purple-hover)] sm:px-4"
            >
              Get Started
            </Button>
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-[var(--traq-ink)] transition-colors hover:bg-[var(--surface-lavender)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--traq-purple)] focus-visible:ring-offset-2 md:hidden"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="traq-glass-menu absolute inset-x-0 top-full px-4 pb-5 pt-3 shadow-lg md:hidden"
        >
          <button
            type="button"
            className="absolute right-4 top-3 inline-flex h-11 w-11 items-center justify-center rounded-md text-[var(--traq-ink)] transition-colors hover:bg-[var(--surface-lavender)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--traq-purple)] focus-visible:ring-offset-2"
            aria-label="Close navigation menu"
            onClick={closeMenu}
          >
            <X aria-hidden="true" />
          </button>
          <div className="flex flex-col gap-1 pr-14">
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={cn(
                  "rounded-md px-4 py-3 text-base font-medium text-[var(--traq-ink)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--traq-purple)] focus-visible:ring-inset",
                  index === 0
                    ? "bg-[var(--traq-purple-soft)] text-[var(--traq-purple)]"
                    : "hover:bg-[var(--surface-lavender)]"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
};