import type { Metadata } from "next";

import { TopNavBar } from "@/components/shared/TopNavBar";
import { Footer } from "@/components/shared/Footer";
import { Card } from "@/components/ui/Card";

const heroTitle = "Manage programs, scholars, and outcomes in one place.";
const heroSubhead = "Traq helps organizations run scholarship and learning programs end to end.";
const ctaPrimary = "Get Started";
const ctaSecondary = "Sign In";

const valueStripItems = [
  { title: "Organize", description: "Course and program management" },
  { title: "Track", description: "Progress and attendance monitoring" },
  { title: "Engage", description: "Scholar communication tools" },
  { title: "Report", description: "Analytics and insights" },
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
    accent: "brand",
  },
  {
    title: "Mentor",
    description: "Scholar roster + assignment verification",
    accent: "secondary",
  },
  {
    title: "Scholar",
    description: "Dashboard + assignments + resources",
    accent: "accent",
  },
];

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <TopNavBar />

      {/* Hero Section */}
      <section className="mt-16 max-w-3xl md:mt-24 text-center">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl">
          {heroTitle}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-neutral-600">
          {heroSubhead}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/auth/sign-in"
            className="inline-flex h-11 items-center justify-center rounded-md bg-brand-600 px-6 text-base font-medium text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            {ctaPrimary}
          </a>
          <a
            href="/auth/sign-in"
            className="inline-flex h-11 items-center justify-center rounded-md bg-secondary-500 px-6 text-base font-medium text-white transition-colors hover:bg-secondary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-400"
          >
            {ctaSecondary}
          </a>
        </div>
      </section>

      {/* Value Strip */}
      <section className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
        {valueStripItems.map((item, index) => (
          <Card
            key={index}
            className="p-4 border-neutral-200 rounded-lg hover:border-brand-300 transition-colors"
          >
            <div className="h-12 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-neutral-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="3" x2="21" y2="21" />
                <line x1="3" y1="21" x2="21" y2="3" />
              </svg>
            </div>
            <h3 className="mt-3 text-neutral-900 text-sm font-medium">{item.title}</h3>
            <p className="mt-1 text-neutral-600 text-xs">{item.description}</p>
          </Card>
        ))}
      </section>

      {/* Features Bento */}
      <section className="mt-24 max-w-7xl mx-auto">
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-neutral-900 text-center mb-12">
          Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuresBentoItems.map((item, index) => (
            <Card key={index} className="p-6">
              <h3 className="text-neutral-900 font-medium mb-2">
                {item.title}
              </h3>
              <p className="text-neutral-600 text-sm">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Roles Section */}
      <section className="mt-24 max-w-7xl mx-auto">
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-neutral-900 text-center mb-12">
          Roles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rolesItems.map((item, index) => (
            <Card key={index} className="p-6 border-gray-200">
              <h3 className="text-neutral-900 font-medium text-lg mb-2">
                {item.title}
              </h3>
              <p className="text-neutral-600 text-sm">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-24 bg-neutral-50 py-16 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mb-4">
          Ready to transform your program?
        </h2>
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/auth/sign-in"
            className="inline-flex h-11 items-center justify-center rounded-md bg-brand-600 px-6 text-base font-medium text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            Start Free Trial
          </a>
          <a
            href="/auth/sign-in"
            className="inline-flex h-11 items-center justify-center rounded-md bg-secondary-500 px-6 text-base font-medium text-white transition-colors hover:bg-secondary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-400"
          >
            Watch Demo
          </a>
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