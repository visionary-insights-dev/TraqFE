import type { Metadata } from "next";

import { TopNavBar } from "@/components/shared/TopNavBar";
import { Footer } from "@/components/shared/Footer";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const heroTitle = "Manage Programs. Empower Scholars. Track Progress.";
const heroSubhead = "A unified platform designed for operational excellence in mentorship and scholarship programs.";
const ctaPrimary = "Get Started";
const ctaSecondary = "Sign In";

const valueStripItems = [
  { title: "Program Management", description: "Course and program management" },
  { title: "Scholar Tracking", description: "Progress and attendance monitoring" },
  { title: "Mentor Coordination", description: "Scholar communication tools" },
];

const featuresBentoItems = [
  { title: "Streamlined Enrollment", description: "Automated scholar onboarding" },
  { title: "Attendance Tracking", description: "Real-time presence monitoring" },
  { title: "Assignment Management", description: "Create & verify submissions" },
  { title: "Mentor Matching", description: "Optimal scholar-mentor pairing" },
  { title: "Outcome Reporting", description: "Program progress dashboards" },
  { title: "CSV Import", description: "Bulk user import from spreadsheets" },
];

const rolesItems = [
  {
    title: "Super Admin",
    description: "Full platform access + user management",
    accent: "primary",
  },
  {
    title: "Mentor",
    description: "Scholar roster + assignment verification",
    accent: "secondary",
  },
  {
    title: "Scholar",
    description: "Dashboard + assignments + resources",
    accent: "tertiary",
  },
];

export default function LandingPage() {
  return (
    <main
      className="w-full overflow-x-clip bg-[--surface-lavender] text-[#17151F] pt-16"
      style={{ scrollBehavior: "smooth" }}
    >
      <TopNavBar />

      {/* Hero Section */}
      <section
        id="hero"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="lg:w-1/2 order-2 lg:order-1">
            <h1
              className="max-w-[11ch] text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl text-[--traq-purple]"
            >
              Manage Programs. <span className="text-[--traq-purple]">Empower Scholars.</span> Track Progress.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[--traq-muted] sm:text-lg">
              A unified platform designed for operational excellence in mentorship and scholarship programs.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/auth/sign-in" className="inline-flex items-center justify-center gap-2">
                <Button variant="outline" className="px-4 py-2.5 text-sm font-medium rounded-lg border border-[var(--traq-purple)] text-[var(--traq-purple)] hover:bg-[var(--traq-purple)] hover:text-white transition-colors">
                  Get Started
                </Button>
              </Link>
              <Link href="/auth/sign-in" className="inline-flex items-center justify-center gap-2">
                <Button variant="outline" className="px-4 py-2.5 text-sm font-medium rounded-lg border border-[var(--traq-purple)] text-[var(--traq-purple)] hover:bg-[var(--traq-purple)] hover:text-white transition-colors">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:w-1/2 order-1 lg:order-2">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-black/10 bg-[var(--traq-purple-soft)] shadow-sm">
              <img
                src="/images/hero-visual.svg"
                alt="Traq platform overview"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Strip */}
      <section
        className="mt-8 lg:mt-16 max-w-7xl mx-auto px-6 lg:px-0"
      >
        <div className="text-center">
          <p
            className="text-[--color-secondary] text-sm lg:text-base max-w-2xl mx-auto mb-6"
          >
            Everything your program needs, organized in one place.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {valueStripItems.map((item, index) => (
            <Card
              key={index}
              className="grid-cols-1 overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] backdrop-blur-md hover:border-[var(--accent-hover)] hover:shadow-lg transition-all duration-300 hover:scale-105 reveal stagger-1"
            >
              <div className="h-14 flex items-center justify-center mb-4">
                <svg
                  className="w-12 h-12 flex-shrink-0 text-[--color-neutral-500]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 3h18v18H3z" />
                  <path d="M3 3l9 9" />
                  <path d="M3 21l9-9" />
                </svg>
              </div>
              <h3 className="text-[--color-primary] font-medium text-sm lg:text-base">
                {item.title}
              </h3>
              <p className="text-[--color-secondary] text-xs lg:text-sm">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Feature Grid */}
      <section
        className="mt-8 lg:mt-16 max-w-7xl mx-auto px-6 lg:px-0 lg:py-24 bg-[var(--surface-lavender)]"
      >
        <h2
          className="text-3xl font-bold tracking-tight text-[--accent-primary] text-center lg:text-4xl mb-6"
        >
          Program management shouldn&apos;t feel fragmented.
        </h2>
        <p
          className="text-[--color-secondary] text-lg lg:text-base text-center lg:w-2/3 mx-auto mb-10"
        >
          TRAQ gives organizations one organized platform to manage scholars, mentors, courses, assignments, resources, meetings and program progress.
        </p>
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {featuresBentoItems.map((item, index) => (
            <Card
              key={index}
              className="lg:p-8 lg:border lg:border-[var(--border-subtle)] lg:bg-[var(--surface-elevated)] lg:backdrop-blur-md rounded-xl shadow-[var(--shadow-soft)] overflow-hidden lg:transition-transform lg:transition-opacity duration-300 hover:scale-101 reveal stagger-{
                Math.floor(index / 2) + 1
              }"
            >
              <div className="h-14 flex items-center justify-center mb-6">
                <svg
                  className="w-12 h-12 flex-shrink-0 text-[--color-neutral-400]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 3h18v18H3z" />
                  <path d="M3 3l9 9" />
                  <path d="M3 21l9-9" />
                </svg>
              </div>
              <h3 className="text-[--color-primary] font-medium text-lg mb-3">
                {item.title}
              </h3>
              <p className="text-[--color-secondary] text-base lg:text-sm">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Workspace Section */}
      <section
        className="mt-8 lg:mt-16 max-w-7xl mx-auto px-6 lg:px-0"
      >
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <div
              className="relative rounded-xl overflow-hidden lg:shadow-[var(--shadow-soft)] lg:transition-shadow hover:shadow-lg lg:transition-opacity duration-300"
            >
              <img
                src="/images/workspace-visual.svg"
                alt="Traq workspace interface"
                className="w-full h-80 lg:h-full object-cover lg:transition-opacity hover:opacity-90"
              />
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-col">
            <h2 className="text-3xl font-bold tracking-tight text-[--accent-primary] mb-4">
              Everything your program needs, in one workspace.
            </h2>
            <p className="text-[--color-secondary] text-lg lg:text-base mb-8">
              Traq brings every stage of your program into one connected workspace—from setting up programs and tracking scholars to coordinating mentors, assignments, and meetings.
            </p>
            <div className="mt-8">
              <a
                href="/auth/sign-in"
                className="inline-flex h-12 items-center justify-center rounded-md bg-[var(--accent-primary)] px-8 text-base font-medium text-white transition-colors hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Section */}
      <section
        className="mt-8 lg:mt-16 max-w-7xl mx-auto px-6 lg:px-0"
      >
        <h2
          className="text-3xl font-bold tracking-tight text-[--accent-primary] text-center mb-12"
        >
          Role-Based Operational Clarity
        </h2>
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {rolesItems.map((item, index) => (
            <Card
              key={index}
              className="lg:p-8 lg:border lg:border-[var(--border-subtle)] lg:bg-[var(--surface-elevated)] lg:backdrop-blur-md rounded-xl shadow-[var(--shadow-soft)] lg:border-t-4 relative overflow-hidden"
              style={{ borderColor: item.accent === "primary" ? "var(--accent-primary)" : item.accent === "secondary" ? "var(--accent-secondary)" : "var(--accent-tertiary)" }}
            >
              <div className="h-14 flex items-center justify-center mb-6">
                <svg
                  className="lg:h-7 lg:w-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 3h18v18H3z" />
                  <path d="M3 3l9 9" />
                  <path d="M3 21l9-9" />
                </svg>
              </div>
              <h3 className="text-[--color-primary] font-medium text-lg mb-3">
                {item.title}
              </h3>
              <p className="text-[--color-secondary] text-base">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="mt-8 lg:mt-16 bg-[var(--surface-lavender)] py-16 lg:py-24 max-w-4xl mx-auto px-6 text-center"
      >
        <h2
          className="text-4xl font-bold tracking-tight text-[--accent-primary] mb-4"
        >
          Ready to bring your program together?
        </h2>
        <p
          className="text-[--color-secondary] text-lg mb-8"
        >
          Join the organizations utilizing TRAQ for centralized program management.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link href="/auth/sign-in" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto px-6 py-3 bg-[var(--accent-primary)] text-white font-medium rounded-lg">
              Get Started
            </Button>
          </Link>
          <Link href="/auth/sign-in" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto px-6 py-3 border border-[var(--traq-purple)] text-[var(--traq-purple)] font-medium rounded-lg">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}

export const metadata: Metadata = {
  title: "Home",
};
