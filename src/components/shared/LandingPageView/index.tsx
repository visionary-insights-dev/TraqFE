'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CalendarCheck2,
  CheckCircle2,
  ClipboardList,
  FileText,
  GraduationCap,
  Menu,
  Network,
  ShieldCheck,
  UsersRound,
  X,
} from 'lucide-react';

const capabilities = [
  { title: 'Program Management', copy: 'Configure programs, define cohorts, and establish structural hierarchies for your organization.', icon: Network },
  { title: 'Scholar Management', copy: 'Organize scholar profiles, track contact information, and monitor individual program progress securely.', icon: UsersRound },
  { title: 'Mentor Coordination', copy: 'Provide mentors with dedicated tools for managing their assigned scholars and logging interactions.', icon: GraduationCap },
  { title: 'Assignments & Verification', copy: 'Distribute tasks, collect submissions, and verify completion through a structured review pipeline.', icon: ClipboardList },
  { title: 'Resources', copy: 'Centralize documents, links, and training materials in a searchable repository accessible by role.', icon: FileText },
  { title: 'Meetings & Attendance', copy: 'Schedule recurring sessions, track attendance automatically, and log meeting notes within one profile.', icon: CalendarCheck2 },
];

const roles = [
  { title: 'Super Admin', copy: 'Central workspace to oversee all cohorts, manage user access, and analyze program-wide metrics.', icon: ShieldCheck, tone: 'violet' },
  { title: 'Mentor', copy: 'Dedicated tools to guide assigned scholars, review assignments, and log meeting attendance efficiently.', icon: UsersRound, tone: 'mint' },
  { title: 'Scholar', copy: 'Focused interface for accessing resources, submitting assignments, and viewing individual progress.', icon: GraduationCap, tone: 'amber' },
];

const navItems = ['Features', 'How It Works', 'Roles'];

function ScrollLink({ children, href }: { children: React.ReactNode; href: string }) {
  return <a href={href} className="transition-colors hover:text-[#4328d8]">{children}</a>;
}

export default function LandingPageView() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#fbf9ff] text-[#171424]">
      <header className="sticky top-0 z-50 border-b border-[#ddd8ef] bg-[#fbf9ff]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link href="/" className="text-xl font-black tracking-[-0.06em] drop-shadow-[0_4px_12px_rgba(109,40,217,0.2)]" style={{ color: '#6d28d9' }} aria-label="TRAQ home">TRAQ</Link>
          <nav className="hidden items-center gap-8 text-[12px] font-medium text-[#514d60] lg:flex" aria-label="Main navigation">
            <ScrollLink href="#home">HOME</ScrollLink>
            <ScrollLink href="#features">FEATURES</ScrollLink>
            <ScrollLink href="#how-it-works">HOW IT WORKS</ScrollLink>
            <ScrollLink href="#roles">ROLES</ScrollLink>
          </nav>
          <div className="hidden items-center gap-3 sm:flex">
            <Link href="#get-started" className="rounded-lg border border-[#4328d8] px-4 py-2 text-xs font-semibold text-[#4328d8] transition hover:bg-[#eeeaff]">Sign In</Link>
            <Link href="#get-started" className="rounded-lg bg-[#4328d8] px-5 py-2 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(67,40,216,0.2)] transition hover:-translate-y-0.5 hover:bg-[#351dc1]">Get Started</Link>
          </div>
          <div className="flex items-center gap-3 sm:hidden">
            <Link href="#get-started" className="rounded-lg bg-[#4328d8] px-4 py-2 text-xs font-semibold text-white">Get Started</Link>
            <button type="button" onClick={() => setMenuOpen(true)} className="rounded-lg border border-[#d7d1e8] p-2 text-[#514d60]" aria-label="Open navigation menu"><Menu size={20} /></button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#fbf9ff] p-5 sm:hidden">
          <div className="flex items-center justify-between">
            <Link href="/" onClick={() => setMenuOpen(false)} className="text-xl font-black tracking-[-0.06em] drop-shadow-[0_4px_12px_rgba(109,40,217,0.2)]" style={{ color: '#6d28d9' }}>TRAQ</Link>
            <button type="button" onClick={() => setMenuOpen(false)} className="rounded-lg border border-[#d7d1e8] p-2" aria-label="Close navigation menu"><X size={20} /></button>
          </div>
          <nav className="mt-10 grid gap-2 text-sm" aria-label="Mobile navigation">
            {['Home', ...navItems].map((item, index) => (
              <a key={item} href={index === 0 ? '#home' : `#${item.toLowerCase().replaceAll(' ', '-')}`} onClick={() => setMenuOpen(false)} className={`rounded-lg px-4 py-4 ${index === 0 ? 'bg-[#eeeaff] text-[#4328d8]' : 'text-[#514d60]'}`}>{item}</a>
            ))}
          </nav>
        </div>
      )}

      <section id="home" className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 pb-16 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:pb-20 lg:pt-20">
        <div className="max-w-xl">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-[#6f62c6]">Operational clarity for every cohort</p>
          <h1 className="text-5xl font-bold leading-[1.02] tracking-[-0.07em] sm:text-6xl lg:text-[72px]">Manage Programs.<br /><span className="text-[#4328d8]">Empower Scholars.</span><br />Track Progress.</h1>
          <p className="mt-7 max-w-md text-base leading-7 text-[#625d6c] sm:text-lg">A unified platform designed for operational excellence in mentorship and scholarship programs.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="#get-started" className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[#4328d8] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(67,40,216,0.22)] transition hover:-translate-y-1">Get Started <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></Link>
            <Link href="#get-started" className="inline-flex items-center justify-center rounded-lg border border-[#4328d8] px-6 py-3.5 text-sm font-semibold text-[#4328d8] transition hover:bg-[#eeeaff]">Sign In</Link>
          </div>
        </div>
        <div className="relative aspect-[616/478] overflow-hidden rounded-2xl border border-[#cfc4f5] bg-[#e9e4fb] p-1 shadow-[0_24px_60px_rgba(79,62,150,0.15)] ring-1 ring-inset ring-white/70">
          <div className="relative h-full w-full overflow-hidden rounded-xl bg-white">
            <Image src="/landing/hero-programs.jpg" alt="A program team planning work around a laptop" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain object-center" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#4328d8]/10 via-transparent to-white/20" />
          </div>
        </div>
      </section>

      <section className="border-y border-[#ddd8ef] bg-[#f1edff]" aria-label="TRAQ capabilities">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-8 gap-y-4 px-5 py-5 text-center text-xs text-[#514d60] sm:px-8 lg:justify-between lg:px-12">
          <p className="w-full text-sm font-semibold text-[#292436] lg:w-auto">Everything your program needs, organized in one place.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <span className="inline-flex items-center gap-2"><BarChart3 size={15} className="text-[#4328d8]" /> Program Management</span>
            <span className="inline-flex items-center gap-2"><BookOpenCheck size={15} className="text-[#4328d8]" /> Scholar Tracking</span>
            <span className="inline-flex items-center gap-2"><UsersRound size={15} className="text-[#4328d8]" /> Mentor Coordination</span>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-2xl text-center"><h2 className="text-3xl font-bold tracking-[-0.05em] sm:text-4xl">Program management shouldn&apos;t feel fragmented.</h2><p className="mt-4 text-sm leading-6 text-[#625d6c] sm:text-base">TRAQ gives organizations one organized platform to manage scholars, mentors, courses, assignments, resources, meetings and program progress.</p></div>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(({ title, copy, icon: Icon }) => <article key={title} className="group rounded-xl border border-[#c8bff0] bg-white/75 p-6 transition duration-200 hover:-translate-y-1 hover:border-[#4328d8] hover:bg-white hover:shadow-[0_18px_36px_rgba(67,40,216,0.10)]"><Icon size={21} className="text-[#4328d8]" /><h3 className="mt-5 text-base font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-[#625d6c]">{copy}</p></article>)}
        </div>
      </section>

      <section id="how-it-works" className="border-y border-[#e2dfeb] bg-white">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12 lg:py-24">
          <div className="relative aspect-[588/473] overflow-hidden rounded-2xl border border-[#cfc4f5] bg-[#f6f3ff] p-1 shadow-[0_20px_50px_rgba(79,62,150,0.13)] ring-1 ring-inset ring-white"><div className="relative h-full w-full overflow-hidden rounded-xl bg-white"><Image src="/landing/workspace-program.jpg" alt="A connected workspace used for program coordination" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain object-center" /></div></div>
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6f62c6]">One connected workspace</p><h2 className="mt-5 text-3xl font-bold tracking-[-0.05em] sm:text-4xl">Everything your program needs, in one workspace.</h2><p className="mt-5 max-w-lg text-base leading-7 text-[#625d6c]">TRAQ brings every stage of your program into one connected workspace—from setting up programs and tracking scholars to coordinating mentors, assignments, and meetings.</p><div className="mt-7 flex items-center gap-3 text-sm font-semibold text-[#4328d8]"><CheckCircle2 size={19} /> Clear ownership from setup to progress</div></div>
        </div>
      </section>

      <section id="roles" className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-12 lg:py-24"><div className="text-center"><h2 className="text-2xl font-bold tracking-[-0.04em] sm:text-3xl">Role-Based Operational Clarity</h2></div><div className="mt-10 grid gap-4 md:grid-cols-3">{roles.map(({ title, copy, icon: Icon, tone }) => <article key={title} className={`rounded-xl border bg-white p-7 ${tone === 'violet' ? 'border-[#9d8df0]' : tone === 'mint' ? 'border-[#7dd9c4]' : 'border-[#edc96d]'}`}><div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone === 'violet' ? 'bg-[#eeeaff] text-[#4328d8]' : tone === 'mint' ? 'bg-[#e3fbf5] text-[#10a985]' : 'bg-[#fff1d7] text-[#e7a500]'}`}><Icon size={23} /></div><h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-[#625d6c]">{copy}</p></article>)}</div></section>

      <section id="get-started" className="border-y border-[#ddd8ef] bg-[#f1edff] px-5 py-20 text-center sm:px-8"><h2 className="text-3xl font-bold tracking-[-0.05em] sm:text-4xl">Ready to bring your program together?</h2><p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#625d6c]">Join the organizations utilizing TRAQ for centralized program management.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="#get-started" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#4328d8] px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5">Get Started <ArrowRight size={17} /></Link><Link href="#get-started" className="inline-flex items-center justify-center rounded-lg border border-[#4328d8] px-7 py-3.5 text-sm font-semibold text-[#4328d8] transition hover:bg-white">Sign In</Link></div></section>

      <footer className="bg-[#e9e4fb] px-5 py-8 sm:px-8 lg:px-12"><div className="mx-auto flex max-w-[1400px] flex-col gap-6 text-center text-xs text-[#625d6c] sm:flex-row sm:items-center sm:justify-between sm:text-left"><Link href="/" className="text-lg font-extrabold tracking-[-0.06em] text-[#4328d8]">TRAQ</Link><div className="flex flex-wrap justify-center gap-5"><a href="#">Privacy Policy</a><a href="#">Terms of Service</a><a href="#">Cookie Policy</a><a href="mailto:support@traq.example">Contact Support</a></div><p>© 2026 TRAQ. All rights reserved.</p></div></footer>
    </main>
  );
}
