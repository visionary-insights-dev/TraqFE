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
        "border-t border-neutral-200 bg-neutral-0 py-8",
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <span className="text-neutral-600 text-sm">
            © {year} Traq. All rights reserved.
          </span>
          <nav>
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};