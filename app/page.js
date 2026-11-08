'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  ShieldCheck,
  FileSpreadsheet,
  MessageSquareWarning,
  Lock,
  ArrowRight,
  Sparkles,
  UserCheck,
  CheckCircle2,
  Clock,
  TrendingUp,
  BarChart3,
  Users,
  EyeOff,
  GraduationCap,
  Building2,
  Briefcase,
  ChevronDown,
  ChevronRight,
  Search,
  Bell,
  Menu,
  X,
  FileText,
  Sliders,
  LifeBuoy,
  Download,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeShowcaseTab, setActiveShowcaseTab] = useState('analytics');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* 1. TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0]/80 transition-all w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Brand Identity */}
          <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/15 group-hover:shadow-blue-500/25 transition-all">
              <Shield className="w-5 h-5 transition-transform group-hover:scale-105" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-[#111827]">
                Campus<span className="text-[#2563EB]">Voice</span>
              </span>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EEF2FF] text-[#4F46E5] border border-indigo-100">
                Institutional Edition
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Anchor Scrolling) */}
          <nav className="hidden md:flex items-center space-x-7 text-sm font-medium text-[#64748B]">
            <a href="#features" className="hover:text-[#2563EB] transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-[#2563EB] transition-colors">
              How It Works
            </a>
            <a href="#solutions" className="hover:text-[#2563EB] transition-colors">
              Solutions
            </a>
            <a href="#security" className="hover:text-[#2563EB] transition-colors">
              Security
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3 shrink-0">
            <Link
              href="/login"
              className="text-xs font-semibold text-[#111827] hover:text-[#2563EB] px-3.5 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] px-4 py-2 rounded-xl shadow-xs shadow-blue-600/20 hover:shadow-md hover:shadow-blue-600/25 transition-all flex items-center space-x-1.5"
            >
              <span>Student Register</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center space-x-2">
            <Link
              href="/login"
              className="text-xs font-semibold text-[#111827] px-2 py-1.5 rounded-md hover:bg-slate-100"
            >
              Sign In
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#111827] hover:bg-slate-100 transition-colors shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-800" /> : <Menu className="w-5 h-5 text-slate-800" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#E2E8F0] bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
            <nav className="flex flex-col space-y-2 text-sm font-medium text-[#64748B]">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-[#2563EB]"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-[#2563EB]"
              >
                How It Works
              </a>
              <a
                href="#solutions"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-[#2563EB]"
              >
                Solutions
              </a>
              <a
                href="#security"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-[#2563EB]"
              >
                Security & Trust
              </a>
            </nav>
            <div className="pt-3 border-t border-[#E2E8F0] flex flex-col space-y-2">
              <Link
                href="/login"
                className="w-full text-center text-xs font-semibold text-[#111827] py-2.5 rounded-lg border border-[#E2E8F0] hover:bg-slate-50"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="w-full text-center text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] py-2.5 rounded-xl shadow-xs"
              >
                Student Register
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT WRAPPER */}
      <main className="flex-1 w-full overflow-x-hidden">
        {/* 2. HERO SECTION — SPLIT LAYOUT WITH PRODUCT PREVIEW */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 w-full">
          {/* Subtle Ambient Radial Glows (Desktop only to prevent mobile overflow) */}
          <div className="hidden md:block pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[400px] bg-gradient-to-tr from-blue-400/15 via-indigo-400/10 to-violet-400/5 blur-3xl rounded-full" />
          <div className="hidden md:block pointer-events-none absolute top-1/2 right-0 w-[450px] h-[350px] bg-blue-500/10 blur-3xl rounded-full" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              {/* LEFT SIDE: Hero Content */}
              <div className="lg:col-span-6 space-y-6 text-left min-w-0">
                {/* Institutional Badge */}
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EEF2FF] border border-indigo-200/80 text-[#4F46E5] text-xs font-semibold shadow-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                  </span>
                  <span>Built for Modern College Institutions</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111827] leading-snug sm:leading-[1.12]">
                  Transform Campus Feedback <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED]">
                    Into Meaningful Change.
                  </span>
                </h1>

                {/* Supporting Text */}
                <p className="text-sm sm:text-base lg:text-lg text-[#64748B] leading-relaxed max-w-xl">
                  One centralized platform for student feedback, institutional insights, and
                  transparent grievance redressal — designed to help colleges listen, respond, and
                  improve.
                </p>

                {/* CTA Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/25 transition-all group"
                  >
                    <span>Access Institutional Portal</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-[#111827] border border-[#E2E8F0] text-xs sm:text-sm font-semibold shadow-xs hover:border-slate-300 transition-all"
                  >
                    <span>Explore Platform</span>
                    <ChevronDown className="w-4 h-4 text-[#64748B]" />
                  </a>
                </div>

                {/* Trust Note */}
                <div className="pt-3 flex items-center space-x-2 text-xs font-medium text-[#64748B]">
                  <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Secure • Role-Based • Student-Centric</span>
                </div>

                {/* Key Pillars Counter */}
                <div className="pt-4 border-t border-[#E2E8F0] grid grid-cols-3 gap-2 sm:gap-4">
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-[#111827]">100%</div>
                    <div className="text-[11px] sm:text-xs text-[#64748B] truncate">Decoupled Privacy</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-[#111827]">&lt; 48 hrs</div>
                    <div className="text-[11px] sm:text-xs text-[#64748B] truncate">Target SLA Triage</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-[#111827]">3 Roles</div>
                    <div className="text-[11px] sm:text-xs text-[#64748B] truncate">Student • HR • Admin</div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: Rich Product UI Dashboard Preview */}
              <div className="lg:col-span-6 w-full min-w-0">
                <div className="relative mx-auto max-w-full lg:max-w-none">
                  {/* Floating Notification Chip (Desktop/Tablet) */}
                  <div className="hidden sm:flex absolute -top-3 -right-2 sm:-right-4 z-20 bg-white/95 backdrop-blur-md border border-[#E2E8F0] px-3.5 py-1.5 rounded-full shadow-lg shadow-slate-200/60 items-center space-x-2 text-xs font-semibold text-[#111827]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>SLA Redressal Active</span>
                  </div>

                  {/* Dashboard Chrome Mockup */}
                  <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl shadow-indigo-500/10 overflow-hidden transition-all hover:border-slate-300 w-full min-w-0">
                    {/* Top Browser / Window Bar */}
                    <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-3 sm:px-4 py-2.5 flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                        <span className="text-[10px] sm:text-[11px] font-mono text-[#64748B] ml-2 truncate">
                          campusvoice.edu/hr
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                          HR Admin Desk
                        </span>
                      </div>
                    </div>

                    {/* Dashboard Inner App Mockup */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 min-h-[380px] sm:min-h-[420px] bg-[#F7F8FC]">
                      {/* Mock Mini Sidebar (Desktop only) */}
                      <div className="hidden sm:block col-span-3 bg-white border-r border-[#E2E8F0] p-3 space-y-4">
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                            Workspace
                          </div>
                          <div className="flex items-center space-x-2 px-2 py-1.5 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">
                            <BarChart3 className="w-3.5 h-3.5" />
                            <span>Overview</span>
                          </div>
                          <div className="flex items-center justify-between px-2 py-1.5 rounded-lg text-slate-600 text-xs font-medium hover:bg-slate-50">
                            <div className="flex items-center space-x-2">
                              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
                              <span>Forms</span>
                            </div>
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 rounded-full">
                              6
                            </span>
                          </div>
                          <div className="flex items-center justify-between px-2 py-1.5 rounded-lg text-slate-600 text-xs font-medium hover:bg-slate-50">
                            <div className="flex items-center space-x-2">
                              <MessageSquareWarning className="w-3.5 h-3.5 text-slate-400" />
                              <span>Grievances</span>
                            </div>
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 rounded-full">
                              3
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 px-2 py-1.5 rounded-lg text-slate-600 text-xs font-medium hover:bg-slate-50">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            <span>Participation</span>
                          </div>
                          <div className="flex items-center space-x-2 px-2 py-1.5 rounded-lg text-slate-600 text-xs font-medium hover:bg-slate-50">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>Departments</span>
                          </div>
                        </div>

                        <div className="pt-8">
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">
                              Active Cohort
                            </div>
                            <div className="text-xs font-bold text-slate-800">
                              IT • MJ • B-voc
                            </div>
                            <div className="text-[10px] text-emerald-600 font-medium">
                              ● Synchronized
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mock Main Dashboard View */}
                      <div className="col-span-12 sm:col-span-9 p-3 sm:p-4 space-y-3 sm:space-y-4 min-w-0">
                        {/* Header bar inside mock */}
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 pr-2">
                            <div className="text-xs font-bold text-[#111827] truncate">
                              Campus Voice Institutional Hub
                            </div>
                            <div className="text-[10px] sm:text-[11px] text-[#64748B] truncate">
                              Real-time feedback & grievance telemetry
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 shrink-0">
                            <div className="w-7 h-7 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-slate-600 shadow-2xs">
                              <Bell className="w-3.5 h-3.5" />
                            </div>
                            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                              AD
                            </div>
                          </div>
                        </div>

                        {/* Top KPI Metrics Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 min-w-0">
                          <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-[#E2E8F0] shadow-2xs flex sm:flex-col justify-between sm:justify-start items-center sm:items-start space-y-0 sm:space-y-1">
                            <div>
                              <div className="text-[10px] font-semibold text-[#64748B] uppercase">
                                Submissions
                              </div>
                              <div className="text-base sm:text-lg font-extrabold text-[#111827]">
                                1,428
                              </div>
                            </div>
                            <div className="text-[10px] font-semibold text-emerald-600 flex items-center">
                              <TrendingUp className="w-3 h-3 mr-0.5" /> +18.4%
                            </div>
                          </div>
                          <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-[#E2E8F0] shadow-2xs flex sm:flex-col justify-between sm:justify-start items-center sm:items-start space-y-0 sm:space-y-1">
                            <div>
                              <div className="text-[10px] font-semibold text-[#64748B] uppercase">
                                Forms Active
                              </div>
                              <div className="text-base sm:text-lg font-extrabold text-[#111827]">
                                6 Live
                              </div>
                            </div>
                            <div className="text-[10px] font-semibold text-indigo-600">
                              IT, MJ, B-voc
                            </div>
                          </div>
                          <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-[#E2E8F0] shadow-2xs flex sm:flex-col justify-between sm:justify-start items-center sm:items-start space-y-0 sm:space-y-1">
                            <div>
                              <div className="text-[10px] font-semibold text-[#64748B] uppercase">
                                Resolved SLA
                              </div>
                              <div className="text-base sm:text-lg font-extrabold text-[#111827]">
                                94.2%
                              </div>
                            </div>
                            <div className="text-[10px] font-semibold text-blue-600">
                              Avg 1.8 Days
                            </div>
                          </div>
                        </div>

                        {/* Mini Analytics Visualization Card */}
                        <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs space-y-2.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#111827]">
                              Department Satisfaction Indices
                            </span>
                            <span className="text-[10px] font-semibold text-[#64748B]">
                              Spring 2026
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between text-[11px] font-medium text-slate-700 mb-1">
                                <span>Information Technology (IT)</span>
                                <span className="font-bold text-blue-600">4.8 / 5.0 (96%)</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-1.5">
                                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 rounded-full w-[96%]"></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-[11px] font-medium text-slate-700 mb-1">
                                <span>Media & Journalism (MJ)</span>
                                <span className="font-bold text-violet-600">4.6 / 5.0 (92%)</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-1.5">
                                <div className="bg-gradient-to-r from-indigo-500 to-violet-600 h-1.5 rounded-full w-[92%]"></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-[11px] font-medium text-slate-700 mb-1">
                                <span>Vocational Studies (B-voc)</span>
                                <span className="font-bold text-emerald-600">4.7 / 5.0 (94%)</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-1.5">
                                <div className="bg-gradient-to-r from-teal-500 to-emerald-600 h-1.5 rounded-full w-[94%]"></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Live Grievance Redressal Feed Snippet */}
                        <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-2xs space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#111827]">
                              Active Grievance Redressal
                            </span>
                            <span className="text-[10px] text-blue-600 font-semibold cursor-pointer">
                              View All 14
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px] min-w-0">
                              <div className="flex items-center space-x-2 truncate pr-2 min-w-0">
                                <span className="font-mono text-slate-400 shrink-0">#GR-1042</span>
                                <span className="font-medium text-slate-800 truncate">
                                  Lab 3 Network Access Bandwidth
                                </span>
                              </div>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold shrink-0">
                                Resolved
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px] min-w-0">
                              <div className="flex items-center space-x-2 truncate pr-2 min-w-0">
                                <span className="font-mono text-slate-400 shrink-0">#GR-1048</span>
                                <span className="font-medium text-slate-800 truncate">
                                  B-voc Tool Kits Workshop Allocation
                                </span>
                              </div>
                              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold shrink-0">
                                In Review
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. TRUSTED INSTITUTIONAL FEATURES SECTION (#features) */}
        <section id="features" className="py-20 bg-white border-y border-[#E2E8F0] scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold border border-blue-100">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Comprehensive Capabilities</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
                Everything Your Institution Needs to Listen Better.
              </h2>
              <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
                A unified platform to collect feedback, manage grievances, and drive campus
                improvements with strict academic governance.
              </p>
            </div>

            {/* 6 Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white hover:border-slate-300 hover:shadow-lg hover:shadow-indigo-500/5 transition-all space-y-3 group">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] border border-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#111827]">Dynamic Feedback Forms</h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  Create customizable feedback forms for faculty, events, infrastructure, and
                  student experience with 11 question types, target department filters, and instant
                  Excel/CSV export.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white hover:border-slate-300 hover:shadow-lg hover:shadow-indigo-500/5 transition-all space-y-3 group">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#D97706] border border-amber-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <MessageSquareWarning className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#111827]">Grievance Management</h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  Manage complaints through a transparent and structured resolution workflow. Assign
                  issues to departments, configure SLA alerts, and track status until resolution.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white hover:border-slate-300 hover:shadow-lg hover:shadow-indigo-500/5 transition-all space-y-3 group">
                <div className="w-12 h-12 rounded-xl bg-violet-50 text-[#7C3AED] border border-violet-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#111827]">Institutional Analytics</h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  Turn raw submissions into actionable insights. Real-time visual metrics,
                  departmental comparisons, and printable executive summaries for accreditation
                  reviews.
                </p>
              </div>

              {/* Card 4 */}
              <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white hover:border-slate-300 hover:shadow-lg hover:shadow-indigo-500/5 transition-all space-y-3 group">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#16A34A] border border-emerald-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <EyeOff className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#111827]">Anonymous Feedback</h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  Allow eligible anonymous feedback with cryptographic privacy-aware submission
                  handling. Student receipt tokens mathematically decouple identity from survey answers.
                </p>
              </div>

              {/* Card 5 */}
              <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white hover:border-slate-300 hover:shadow-lg hover:shadow-indigo-500/5 transition-all space-y-3 group">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#4F46E5] border border-indigo-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#111827]">Role-Based Access</h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  Dedicated permissions for Students, HR Officers, and Super Admins. Students cannot
                  author forms, and HR cannot access Super Admin governance logs or system SLA rules.
                </p>
              </div>

              {/* Card 6 */}
              <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white hover:border-slate-300 hover:shadow-lg hover:shadow-indigo-500/5 transition-all space-y-3 group">
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#0284C7] border border-sky-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#111827]">Resolution Tracking</h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  Monitor grievance status, department assignments, and resolution notes. Includes
                  interactive multi-party dialogue and private HR internal notes invisible to students.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. HOW IT WORKS SECTION (#how-it-works) */}
        <section id="how-it-works" className="py-20 bg-[#F8FAFC] scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 text-[#4F46E5] text-xs font-bold border border-indigo-100">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>The Feedback Loop</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
                How CampusVoice Works
              </h2>
              <p className="text-sm sm:text-base text-[#64748B]">
                A transparent three-step cycle connecting students, department administrators, and
                institutional leadership.
              </p>
            </div>

            {/* 3 Connected Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <div className="bg-white p-7 rounded-2xl border border-[#E2E8F0] shadow-sm relative space-y-4 hover:border-slate-300 transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-blue-500/20">
                  01
                </div>
                <h3 className="text-xl font-bold text-[#111827]">Students Share Feedback</h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  Students log into their authenticated portal to complete active department surveys
                  or independently lodge grievances anytime with attachments and privacy toggles.
                </p>
                <div className="pt-2 text-xs font-semibold text-blue-600 flex items-center space-x-1">
                  <span>Student Submission Portal</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-7 rounded-2xl border border-[#E2E8F0] shadow-sm relative space-y-4 hover:border-slate-300 transition-all">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-indigo-500/20">
                  02
                </div>
                <h3 className="text-xl font-bold text-[#111827]">HR Reviews & Acts</h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  HR Officers analyze survey cohorts, assign grievances to respective department HoDs
                  (IT, MJ, B-voc), add internal investigation notes, and communicate updates.
                </p>
                <div className="pt-2 text-xs font-semibold text-indigo-600 flex items-center space-x-1">
                  <span>Structured Triage Desk</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-7 rounded-2xl border border-[#E2E8F0] shadow-sm relative space-y-4 hover:border-slate-300 transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-emerald-500/20">
                  03
                </div>
                <h3 className="text-xl font-bold text-[#111827]">Institutions Improve</h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  College leadership accesses unified department analytics, monitors SLA resolution
                  compliance, and uses quantitative survey data for accreditation and campus policy.
                </p>
                <div className="pt-2 text-xs font-semibold text-emerald-600 flex items-center space-x-1">
                  <span>Measurable Campus Impact</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. DEDICATED SOLUTIONS SECTION (#solutions) */}
        <section id="solutions" className="py-20 bg-white border-y border-[#E2E8F0] scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-violet-50 text-[#7C3AED] text-xs font-bold border border-violet-100">
                <Users className="w-3.5 h-3.5" />
                <span>Tailored For Every Stakeholder</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
                Dedicated Solutions Across Campus
              </h2>
              <p className="text-sm sm:text-base text-[#64748B]">
                Engineered with purpose-built workflows for students, administrative officers, and
                executive college leadership.
              </p>
            </div>

            {/* 3 Solution Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Solution 1: Students */}
              <div className="p-8 rounded-2xl border border-[#E2E8F0] bg-gradient-to-b from-blue-50/50 via-white to-white space-y-5 shadow-xs hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#111827]">For Students</h3>
                  <p className="text-xs text-[#64748B] mt-1">
                    An honest, transparent channel to voice feedback and follow grievance redressal.
                  </p>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Mobile-first survey completion anytime</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Independent grievance filing without waiting for surveys</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Live status tracking with unique ticket identifiers</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Privacy-protected anonymous participation receipts</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <Link
                    href="/register"
                    className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-800"
                  >
                    <span>Register student account</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>

              {/* Solution 2: HR Officers */}
              <div className="p-8 rounded-2xl border border-[#E2E8F0] bg-gradient-to-b from-indigo-50/50 via-white to-white space-y-5 shadow-xs hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-[#4F46E5] flex items-center justify-center font-bold">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#111827]">For HR Officers</h3>
                  <p className="text-xs text-[#64748B] mt-1">
                    Dynamic survey authoring, grievance lifecycle assignment, and participation telemetry.
                  </p>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Intuitive Form Builder with 11 custom question types</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Centralized grievance triage & department assignment</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Student participation tracker with exportable CSV</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Private internal investigation notes isolated from students</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <Link
                    href="/login"
                    className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    <span>Sign in to HR Desk</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>

              {/* Solution 3: College Management */}
              <div className="p-8 rounded-2xl border border-[#E2E8F0] bg-gradient-to-b from-violet-50/50 via-white to-white space-y-5 shadow-xs hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-violet-100 text-[#7C3AED] flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#111827]">For College Management</h3>
                  <p className="text-xs text-[#64748B] mt-1">
                    Department-wide oversight, accreditation compliance metrics, and SLA governance.
                  </p>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Real-time satisfaction telemetry across IT, MJ, and B-voc</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Institutional SLA enforcement & resolution timeline audits</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Accreditation-ready reporting for NAAC and NIRF audits</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Super Admin panel permissions & complete audit trail</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <Link
                    href="/login"
                    className="inline-flex items-center text-xs font-bold text-violet-600 hover:text-violet-800"
                  >
                    <span>Sign in to Super Admin</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. SECURITY & TRUST SECTION (#security) */}
        <section id="security" className="py-20 bg-[#F8FAFC] scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#16A34A] text-xs font-bold border border-emerald-100">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Enterprise Governance & Privacy</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
                Built Around Trust, Privacy & Accountability.
              </h2>
              <p className="text-sm sm:text-base text-[#64748B]">
                Security controls and cryptographic privacy practices engineered to safeguard student
                confidentiality and institutional integrity.
              </p>
            </div>

            {/* 2-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: 5 Structured Security Cards */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-[#4F46E5] flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#111827]">
                      Role-Based Access Control (RBAC)
                    </h4>
                    <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
                      Strict boundaries between Students, HR Officers, and Super Admins. Students
                      never have form authoring permissions; HR cannot access system-level audit logs.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#111827]">Secure Authentication</h4>
                    <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
                      Token-based session management, bcrypt salted password hashing, and
                      route-level middleware guarantees that unauthorized requests are immediately rejected.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#16A34A] flex items-center justify-center shrink-0 mt-0.5">
                    <EyeOff className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#111827]">
                      Privacy-Aware Anonymous Feedback
                    </h4>
                    <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
                      Receipt tokens decouple student identities from submitted responses, allowing
                      faculty evaluations without fear of academic retaliation.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-[#D97706] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#111827]">
                      Auditable Grievance Workflows
                    </h4>
                    <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
                      Timestamped change history for every ticket status transition, department
                      re-assignment, and resolution action, preventing unresolved complaints from vanishing.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-lg bg-rose-50 text-[#DC2626] flex items-center justify-center shrink-0 mt-0.5">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#111827]">
                      Controlled Access to Sensitive Complaints
                    </h4>
                    <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
                      Sensitive student grievances are restricted strictly to authorized HR officers
                      and assigned department coordinators.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Security Architecture Diagram */}
              <div className="lg:col-span-5">
                <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-md space-y-5">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-800">
                      Security & Privacy Architecture
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Zero PII Leakage
                    </span>
                  </div>

                  {/* Flow Steps */}
                  <div className="space-y-3">
                    {/* Architecture Step 1 */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[11px]">
                          1
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">Student Submission</div>
                          <div className="text-[10px] text-slate-500">
                            Authenticated session verified
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        TLS 1.3
                      </span>
                    </div>

                    <div className="flex justify-center text-slate-400">
                      <ChevronDown className="w-4 h-4" />
                    </div>

                    {/* Architecture Step 2 */}
                    <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-200/80 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px]">
                          2
                        </div>
                        <div>
                          <div className="font-bold text-indigo-950">Decoupling Gateway</div>
                          <div className="text-[10px] text-indigo-700">
                            Identity separated from answers
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-indigo-700 bg-white px-2 py-0.5 rounded shadow-2xs">
                        Receipt Hash
                      </span>
                    </div>

                    <div className="flex justify-center text-slate-400">
                      <ChevronDown className="w-4 h-4" />
                    </div>

                    {/* Architecture Step 3 */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-6 h-6 rounded-md bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-[11px]">
                          3
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">HR Triage Desk</div>
                          <div className="text-[10px] text-slate-500">
                            Actionable feedback without student PII
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Protected
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>FERPA & Institutional Compliance</span>
                    <span className="font-semibold text-slate-700">Active Audit Mode</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. PRODUCT SHOWCASE SECTION (INTERACTIVE TABS) */}
        <section className="py-20 bg-white border-b border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold border border-blue-100">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Live Showcase</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
                Experience the Enterprise Workflow.
              </h2>
              <p className="text-sm sm:text-base text-[#64748B]">
                Explore the exact tools empowering modern college administration across IT, MJ, and
                B-voc departments.
              </p>
            </div>

            {/* Interactive Showcase Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
              {[
                { id: 'analytics', label: 'Feedback Analytics' },
                { id: 'grievance', label: 'Grievance Workflow' },
                { id: 'departments', label: 'Department Performance' },
                { id: 'participation', label: 'Student Participation' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveShowcaseTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeShowcaseTab === tab.id
                      ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Display Card */}
            <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-md">
              {activeShowcaseTab === 'analytics' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#111827]">
                        Executive Feedback Analytics & Satisfaction Scores
                      </h3>
                      <p className="text-xs text-[#64748B]">
                        Aggregated metrics computed from validated student survey submissions
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-[#E2E8F0] text-slate-700">
                        Cohort: Spring 2026
                      </span>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Overall: 4.7 / 5.0
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs">
                      <div className="text-xs font-semibold text-slate-500">Curriculum Quality</div>
                      <div className="text-2xl font-extrabold text-blue-600 mt-1">4.8 / 5</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">96% Positive</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs">
                      <div className="text-xs font-semibold text-slate-500">Faculty Mentorship</div>
                      <div className="text-2xl font-extrabold text-indigo-600 mt-1">4.6 / 5</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">92% Positive</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs">
                      <div className="text-xs font-semibold text-slate-500">Lab Infrastructure</div>
                      <div className="text-2xl font-extrabold text-emerald-600 mt-1">4.7 / 5</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">94% Positive</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs">
                      <div className="text-xs font-semibold text-slate-500">Net Promoter (NPS)</div>
                      <div className="text-2xl font-extrabold text-purple-600 mt-1">+78</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">World Class Score</div>
                    </div>
                  </div>
                </div>
              )}

              {activeShowcaseTab === 'grievance' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#111827]">
                        Structured 5-Stage Grievance Redressal Pipeline
                      </h3>
                      <p className="text-xs text-[#64748B]">
                        Transparent student tracking coupled with department triage and resolution notes
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                        Default SLA: 5 Days
                      </span>
                    </div>
                  </div>

                  {/* Grievance Lifecycle Progression Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="bg-white p-3 rounded-xl border border-blue-200 text-center">
                      <div className="text-[10px] font-bold text-blue-600 uppercase">Stage 1</div>
                      <div className="text-xs font-bold text-slate-800">Submitted</div>
                      <div className="text-[10px] text-slate-500">Ticket Generated</div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-indigo-200 text-center">
                      <div className="text-[10px] font-bold text-indigo-600 uppercase">Stage 2</div>
                      <div className="text-xs font-bold text-slate-800">Under Review</div>
                      <div className="text-[10px] text-slate-500">HR Assessment</div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-violet-200 text-center">
                      <div className="text-[10px] font-bold text-violet-600 uppercase">Stage 3</div>
                      <div className="text-xs font-bold text-slate-800">Investigating</div>
                      <div className="text-[10px] text-slate-500">Internal Dialogue</div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-amber-200 text-center">
                      <div className="text-[10px] font-bold text-amber-600 uppercase">Stage 4</div>
                      <div className="text-xs font-bold text-slate-800">Dept Assigned</div>
                      <div className="text-[10px] text-slate-500">Action Plan Set</div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-emerald-200 text-center">
                      <div className="text-[10px] font-bold text-emerald-600 uppercase">Stage 5</div>
                      <div className="text-xs font-bold text-slate-800">Resolved</div>
                      <div className="text-[10px] text-slate-500">Feedback Closed</div>
                    </div>
                  </div>
                </div>
              )}

              {activeShowcaseTab === 'departments' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#111827]">
                        Active Department Comparison: IT, MJ, and B-voc
                      </h3>
                      <p className="text-xs text-[#64748B]">
                        Real-time telemetry isolated by institutional academic discipline
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          CODE: IT
                        </span>
                        <span className="text-xs text-emerald-600 font-semibold">98% SLA</span>
                      </div>
                      <div className="text-base font-bold text-slate-900">
                        Information Technology
                      </div>
                      <div className="text-xs text-slate-600">
                        482 active students • 5 active surveys • 1 pending ticket
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          CODE: MJ
                        </span>
                        <span className="text-xs text-emerald-600 font-semibold">95% SLA</span>
                      </div>
                      <div className="text-base font-bold text-slate-900">Media & Journalism</div>
                      <div className="text-xs text-slate-600">
                        310 active students • 4 active surveys • 2 pending tickets
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          CODE: BVOC
                        </span>
                        <span className="text-xs text-emerald-600 font-semibold">100% SLA</span>
                      </div>
                      <div className="text-base font-bold text-slate-900">
                        Vocational Studies (B-voc)
                      </div>
                      <div className="text-xs text-slate-600">
                        240 active students • 3 active surveys • 0 pending tickets
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeShowcaseTab === 'participation' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#111827]">
                        Cohort Participation & Non-Response Tracker
                      </h3>
                      <p className="text-xs text-[#64748B]">
                        Track which students have responded and identify remaining cohorts without
                        compromising anonymity
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-semibold text-slate-700 flex items-center space-x-1.5 shadow-2xs">
                        <Download className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] text-center">
                      <div className="text-xs font-semibold text-slate-500">Total Enrolled</div>
                      <div className="text-2xl font-extrabold text-slate-900 mt-1">1,032</div>
                      <div className="text-[11px] text-slate-500">IT, MJ, B-voc</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] text-center">
                      <div className="text-xs font-semibold text-slate-500">
                        Feedback Completed
                      </div>
                      <div className="text-2xl font-extrabold text-emerald-600 mt-1">894 (86.6%)</div>
                      <div className="text-[11px] text-emerald-600 font-medium">Receipts Issued</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] text-center">
                      <div className="text-xs font-semibold text-slate-500">Remaining Cohort</div>
                      <div className="text-2xl font-extrabold text-amber-600 mt-1">138 (13.4%)</div>
                      <div className="text-[11px] text-amber-600 font-medium">Reminders Sent</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 8. FINAL CALL TO ACTION SECTION */}
        <section className="py-20 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#0F172A] text-white p-6 sm:p-12 lg:p-16 overflow-hidden shadow-2xl border border-slate-800">
              {/* Subtle background glow */}
              <div className="hidden md:block pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 blur-3xl rounded-full" />
              <div className="hidden md:block pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full" />

              <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-blue-200 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Enterprise Institutional Governance</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  Build a Campus That Listens.
                </h2>

                <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  Bring feedback, accountability, and institutional improvement together with
                  CampusVoice. Get started with your institutional portal today.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Access Institutional Portal</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                  <Link
                    href="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs sm:text-sm font-semibold backdrop-blur-sm transition-all"
                  >
                    <span>Register as Student</span>
                  </Link>
                </div>

                {/* Bottom mini guarantees */}
                <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
                  <div className="flex items-center justify-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>99.8% Platform Uptime</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>&lt; 48 hrs Avg Grievance Triage</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>100% Decoupled Anonymous Privacy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 9. FOOTER */}
      <footer className="bg-white border-t border-[#E2E8F0] pt-14 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Brand column */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                  <Shield className="w-4 h-4" />
                </div>
                <span className="text-lg font-bold tracking-tight text-[#111827]">
                  Campus<span className="text-[#2563EB]">Voice</span>
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                  Institutional Edition
                </span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed max-w-sm">
                CampusVoice is an enterprise-grade feedback evaluation and grievance redressal
                platform engineered for modern colleges and universities.
              </p>
              <div className="text-xs text-slate-500">
                Institutional Support: <span className="text-slate-800">support@campusvoice.edu</span>
              </div>
            </div>

            {/* Platform Links */}
            <div className="md:col-span-2 space-y-3">
              <div className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                Platform
              </div>
              <ul className="space-y-2 text-xs text-[#64748B]">
                <li>
                  <a href="#features" className="hover:text-[#2563EB] transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-[#2563EB] transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#solutions" className="hover:text-[#2563EB] transition-colors">
                    Solutions
                  </a>
                </li>
                <li>
                  <a href="#security" className="hover:text-[#2563EB] transition-colors">
                    Security & Trust
                  </a>
                </li>
              </ul>
            </div>

            {/* Portals */}
            <div className="md:col-span-2 space-y-3">
              <div className="text-xs font-bold text-[#111827] uppercase tracking-wider">Portals</div>
              <ul className="space-y-2 text-xs text-[#64748B]">
                <li>
                  <Link href="/login" className="hover:text-[#2563EB] transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-[#2563EB] transition-colors">
                    Student Registration
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-[#2563EB] transition-colors">
                    HR Officer Desk
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-[#2563EB] transition-colors">
                    Super Admin Console
                  </Link>
                </li>
              </ul>
            </div>

            {/* Compliance & Standards */}
            <div className="md:col-span-3 space-y-3">
              <div className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                Compliance & Standards
              </div>
              <ul className="space-y-2 text-xs text-[#64748B]">
                <li>FERPA-Compliant Data Handling</li>
                <li>NAAC / NIRF Accreditation Ready</li>
                <li>Cryptographic Decoupled Anonymity</li>
                <li>Configurable Institutional SLA Rules</li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright and Legal Notice */}
          <div className="pt-8 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-4">
            <p>© 2026 CampusVoice. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <span className="hover:text-slate-900 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-900 cursor-pointer">Terms of Service</span>
              <span className="hover:text-slate-900 cursor-pointer">Security Whitepaper</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
