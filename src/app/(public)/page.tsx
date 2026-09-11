import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarCheck,
  ChartNoAxesCombined,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  ShieldCheck,
  UploadCloud,
  UserRoundCog,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import { Footer } from "@/components/shared/Footer";
import { TopNavBar } from "@/components/shared/TopNavBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Accent = "purple" | "teal" | "amber";

type FeatureItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const valueStripItems: FeatureItem[] = [
  { title: "Program Management", description: "Course and program management", icon: LayoutDashboard },
  { title: "Scholar Tracking", description: "Progress and attendance monitoring", icon: GraduationCap },
  { title: "Mentor Coordination", description: "Scholar communication tools", icon: UsersRound },
];

const featureItems: FeatureItem[] = [
  { title: "Streamlined Enrollment", description: "Automated scholar onboarding", icon: UserRoundCog },
  { title: "Attendance Tracking", description: "Real-time presence monitoring", icon: CalendarCheck },
  { title: "Assignment Management", description: "Create and verify submissions", icon: ClipboardCheck },
  { title: "Mentor Matching", description: "Optimal scholar-mentor pairing", icon: UsersRound },
  { title: "Outcome Reporting", description: "Program progress dashboards", icon: ChartNoAxesCombined },
  { title: "CSV Import", description: "Bulk user import from spreadsheets", icon: UploadCloud },
];

const rolesItems: Array<FeatureItem & { accent: Accent }> = [
  { title: "Super Admin", description: "Full platform access and user management", icon: ShieldCheck, accent: "purple" },
  { title: "Mentor", description: "Scholar roster and assignment verification", icon: BriefcaseBusiness, accent: "teal" },
  { title: "Scholar", description: "Dashboard, assignments, and resources", icon: GraduationCap, accent: "amber" },
];

const accentClasses: Record<Accent, string> = {
  purple: "border-[var(--traq-purple)] text-[var(--traq-purple)] bg-[var(--traq-purple-soft)]",
  teal: "border-[var(--role-mentor-teal)] text-[var(--role-mentor-teal)] bg-teal-50",
  amber: "border-[var(--role-scholar-amber)] text-[var(--role-scholar-amber)] bg-amber-50",
};

function IconBadge({ icon: Icon, accent = "purple" }: { icon: LucideIcon; accent?: Accent }) {
  return <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${accentClasses[accent]}`}><Icon className="h-6 w-6" aria-hidden="true" /></div>;
}

function AuthLink({ children, variant = "primary" }: { children: React.ReactNode; variant?: "primary" | "outline" | "light" }) {
  return (
    <Link href="/auth/sign-in" className="inline-flex w-full sm:w-auto">
      <Button variant={variant === "primary" ? "primary" : "outline"} size="lg" className={`w-full sm:w-auto ${variant === "primary" ? "bg-[var(--traq-purple)] text-white hover:bg-[var(--traq-purple-hover)]" : variant === "light" ? "border-white bg-transparent text-white hover:bg-white/10" : "border-[var(--traq-purple)] text-[var(--traq-purple)] hover:bg-[var(--traq-purple-soft)]"}`}>
        {children}
      </Button>
    </Link>
  );
}

export default function LandingPage() {
  return (
    <main className="w-full overflow-x-clip bg-[var(--surface-lavender)] text-[var(--traq-ink)]">
      <TopNavBar />

      <section id="hero" className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24">
          <div className="order-2 lg:order-1">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--role-mentor-teal)]">Program operations, simplified</p>
            <h1 className="max-w-xl text-4xl font-semibold leading-[1.03] tracking-[-0.04em] text-[var(--traq-purple)] sm:text-5xl lg:text-7xl">Manage Programs. <span className="text-[var(--traq-purple-hover)]">Empower Scholars.</span> Track Progress.</h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-[var(--traq-muted)] sm:text-lg">A unified platform designed for operational excellence in mentorship and scholarship programs.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><AuthLink>Get Started <ArrowRight className="h-4 w-4" aria-hidden="true" /></AuthLink><AuthLink variant="outline">Sign In</AuthLink></div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-white/80 bg-white shadow-xl">
              <Image src="/images/traq-hero.jpg" alt="TRAQ program management dashboard preview" fill sizes="(max-width: 639px) 100vw, 0px" className="object-cover object-top sm:hidden" priority />
              <Image src="/images/traq-hero.jpg" alt="TRAQ program management dashboard preview" fill sizes="(min-width: 640px) 55vw, 0px" className="hidden object-cover object-top sm:block" priority />
              <div className="absolute inset-x-4 bottom-4 rounded-xl border border-white/40 bg-[var(--traq-ink)]/80 p-4 text-white backdrop-blur-sm sm:inset-x-6 sm:bottom-6 sm:p-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">One connected workspace</p><p className="mt-1 text-sm font-medium sm:text-base">From enrollment to outcomes, keep every program moving.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="feature-strip-heading" className="border-y border-white/70 bg-white/55"><div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><h2 id="feature-strip-heading" className="mx-auto max-w-2xl text-center text-base font-medium text-[var(--traq-muted)] sm:text-lg">Everything your program needs, organized in one place.</h2><div className="mt-8 grid gap-4 md:grid-cols-3">{valueStripItems.map(({ title, description, icon }) => <Card key={title} className="flex items-center gap-4 border-white/80 bg-white/75 p-5 shadow-sm transition-transform hover:-translate-y-1"><IconBadge icon={icon} /><div><h3 className="font-semibold text-[var(--traq-ink)]">{title}</h3><p className="mt-1 text-sm text-[var(--traq-muted)]">{description}</p></div></Card>)}</div></div></section>

      <section id="features" aria-labelledby="features-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"><div className="mx-auto max-w-3xl text-center"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--role-mentor-teal)]">Built for clarity</p><h2 id="features-heading" className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[var(--traq-purple)] sm:text-4xl">Program management shouldn&apos;t feel fragmented.</h2><p className="mt-5 text-base leading-7 text-[var(--traq-muted)]">TRAQ gives organizations one organized platform to manage scholars, mentors, courses, assignments, resources, meetings, and program progress.</p></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{featureItems.map(({ title, description, icon }) => <Card key={title} className="border-white/80 bg-white/75 p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[var(--traq-purple)] hover:shadow-lg"><IconBadge icon={icon} /><h3 className="mt-5 text-lg font-semibold text-[var(--traq-ink)]">{title}</h3><p className="mt-2 text-sm leading-6 text-[var(--traq-muted)]">{description}</p></Card>)}</div></section>

      <section id="how-it-works" aria-labelledby="workspace-heading" className="bg-white/60"><div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-24"><div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-white bg-[var(--traq-purple-soft)] shadow-xl"><Image src="/images/traq-workspace.jpg" alt="TRAQ workspace with connected program tools" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover object-[center_45%]" /><div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/90 p-4 shadow-lg backdrop-blur-sm sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-xs"><div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-[var(--role-mentor-teal)]" aria-hidden="true" /><span className="text-sm font-semibold text-[var(--traq-ink)]">Progress everyone can see</span></div></div></div><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--role-mentor-teal)]">How it works</p><h2 id="workspace-heading" className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[var(--traq-purple)] sm:text-4xl">Everything your program needs, in one workspace.</h2><p className="mt-5 text-base leading-7 text-[var(--traq-muted)]">TRAQ brings every stage of your program into one connected workspace, from setting up programs and tracking scholars to coordinating mentors, assignments, and meetings.</p><div className="mt-8"><AuthLink>Get Started <ArrowRight className="h-4 w-4" aria-hidden="true" /></AuthLink></div></div></div></section>

      <section id="roles" aria-labelledby="roles-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"><div className="mx-auto max-w-2xl text-center"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--role-mentor-teal)]">Designed around your team</p><h2 id="roles-heading" className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[var(--traq-purple)] sm:text-4xl">Role-Based Operational Clarity</h2></div><div className="mt-10 grid gap-4 lg:grid-cols-3">{rolesItems.map(({ title, description, icon, accent }) => <Card key={title} className={`border-t-4 border-white/80 bg-white/75 p-6 shadow-sm ${accent === "teal" ? "border-t-[var(--role-mentor-teal)]" : accent === "amber" ? "border-t-[var(--role-scholar-amber)]" : "border-t-[var(--traq-purple)]"}`}><IconBadge icon={icon} accent={accent} /><h3 className="mt-5 text-xl font-semibold text-[var(--traq-ink)]">{title}</h3><p className="mt-2 text-sm leading-6 text-[var(--traq-muted)]">{description}</p></Card>)}</div></section>

      <section id="cta" aria-labelledby="cta-heading" className="border-y border-white/70 bg-[var(--traq-purple)] px-4 py-16 text-center text-white sm:px-6 lg:py-24"><div className="mx-auto max-w-2xl"><h2 id="cta-heading" className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Ready to bring your program together?</h2><p className="mt-4 text-base leading-7 text-white/80">Join the organizations utilizing TRAQ for centralized program management.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><AuthLink>Get Started <ArrowRight className="h-4 w-4" aria-hidden="true" /></AuthLink><AuthLink variant="light">Sign In</AuthLink></div></div></section>

      <Footer />
    </main>
  );
}

export const metadata: Metadata = { title: "Home" };
