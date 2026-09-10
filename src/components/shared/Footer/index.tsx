"use client";

import { cn } from "@/lib/utils";
import { type FooterProps } from "./types";

const footerLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: "/contact" },
];

export const Footer = ({
  className,
  year = new Date().getFullYear(),
  ...props
}: FooterProps) => {
  return (
    <footer
      className={cn(
        "border-t border-[var(--border-subtle)] bg-white py-8",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 sm:flex-row sm:px-6 lg:px-8">
          <span className="text-sm text-[var(--traq-muted)]">
            © {year} Traq. All rights reserved.
          </span>
          <nav aria-label="Footer navigation" className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-[var(--traq-muted)] transition-colors hover:text-[var(--traq-purple)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--traq-purple)] focus-visible:ring-offset-2"
              >
                {link.label}
              </a>
            ))}
          </nav>
      </div>
    </footer>
  );
};