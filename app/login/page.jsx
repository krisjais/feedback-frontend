'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import {
  Shield,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
  Star,
  Send,
  Check,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Please fill in both institutional email and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email.trim(), password);

      // Server-verified role determines redirection destination
      if (user.role === 'student') {
        router.push('/student');
      } else if (user.role === 'hr_officer' || user.role === 'hr') {
        router.push('/hr/dashboard');
      } else if (user.role === 'super_admin' || user.role === 'superadmin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/student');
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || err.message || 'Invalid email or password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F8FAFC] text-[#111827] overflow-x-hidden selection:bg-indigo-600 selection:text-white">
      {/* ========================================================
          LEFT PANEL (DESKTOP: 55% SPLIT-SCREEN)
          TOP SECTION (MOBILE: BRAND + CAMPUS ARTWORK HERO)
          ======================================================== */}
      <div className="relative w-full lg:w-[55%] min-h-[440px] lg:min-h-screen bg-gradient-to-br from-[#2E1065] via-[#4C1D95] to-[#312E81] text-white pt-8 pb-14 px-5 sm:px-8 lg:p-14 flex flex-col justify-between overflow-hidden shadow-2xl z-10">
        {/* Subtle Ambient Decorative Glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-purple-500/20 blur-3xl rounded-full" />
        <div className="pointer-events-none absolute top-1/2 right-12 w-80 h-80 bg-indigo-500/25 blur-3xl rounded-full" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 w-96 h-96 bg-blue-500/15 blur-3xl rounded-full" />

        {/* Decorative Floating Sparkles / Stars */}
        <div className="pointer-events-none absolute top-16 right-24 text-purple-300/40 text-xl animate-pulse">
          ✦
        </div>
        <div className="pointer-events-none absolute top-1/3 left-12 text-indigo-300/30 text-lg">
          ⋆
        </div>
        <div className="pointer-events-none absolute bottom-32 right-16 text-blue-200/30 text-2xl">
          ✦
        </div>
        <div className="pointer-events-none absolute bottom-1/2 left-20 text-purple-200/25 text-sm">
          ⋆
        </div>

        {/* Top Header: Brand Identity & Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-md shadow-purple-950/30 group-hover:scale-105 transition-transform">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-200" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Campus<span className="text-purple-300">Voice</span>
              </span>
            </div>
          </Link>

          <div className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-purple-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-300 shrink-0" />
            <span className="hidden sm:inline tracking-wide uppercase text-[10px]">
              Institutional Feedback Platform
            </span>
            <span className="sm:hidden text-[10px] font-semibold">Portal</span>
          </div>
        </div>

        {/* Middle Body: Headline & Custom College Vector Illustration */}
        <div className="relative z-10 my-auto py-5 sm:py-6 lg:py-4 space-y-4 sm:space-y-6 max-w-xl mx-auto lg:mx-0">
          <div className="space-y-2 sm:space-y-3 text-center lg:text-left">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Your Campus. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-indigo-200 to-blue-200">
                Your Voice.
              </span>
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-purple-100/80 leading-relaxed max-w-md mx-auto lg:mx-0">
              A connected institution begins with listening. Share feedback, raise concerns, and
              help shape a better campus experience across faculty, facilities, and academic departments.
            </p>
          </div>

          {/* CUSTOM VECTOR-STYLE COLLEGE CAMPUS ILLUSTRATION */}
          <div className="relative w-full max-w-sm sm:max-w-md mx-auto pt-2 pb-2 sm:pb-4">
            {/* Background Glow Frame for Artwork */}
            <div className="relative rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-3 sm:p-5 shadow-inner">
              {/* College Campus Architecture SVG */}
              <div className="relative flex items-center justify-center py-1 sm:py-2">
                <svg
                  className="w-full max-w-[340px] h-auto drop-shadow-xl"
                  viewBox="0 0 400 240"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Sky gradient background */}
                  <rect width="400" height="240" rx="16" fill="url(#canvas_sky)" />

                  {/* Distant campus hills / clouds */}
                  <path
                    d="M-20 220 Q 80 170 180 200 T 380 185 T 440 220 L 440 240 L -20 240 Z"
                    fill="url(#hill_grad)"
                    opacity="0.35"
                  />

                  {/* Campus Plaza Ground */}
                  <rect x="0" y="210" width="400" height="30" fill="#1E1B4B" opacity="0.6" />
                  <path d="M50 210 L120 240 L280 240 L350 210 Z" fill="#312E81" opacity="0.4" />

                  {/* College Main Building - Base Steps */}
                  <rect x="90" y="200" width="220" height="6" rx="2" fill="#E0E7FF" opacity="0.9" />
                  <rect x="98" y="194" width="204" height="6" rx="2" fill="#C7D2FE" opacity="0.95" />
                  <rect x="106" y="188" width="188" height="6" rx="2" fill="#E0E7FF" />

                  {/* Left Wing Building */}
                  <rect x="70" y="125" width="65" height="65" rx="3" fill="#EEF2FF" />
                  <rect x="70" y="120" width="65" height="5" fill="#4F46E5" />
                  {/* Left Wing Arched Windows */}
                  <rect x="78" y="135" width="12" height="20" rx="6" fill="#312E81" />
                  <rect x="96" y="135" width="12" height="20" rx="6" fill="#312E81" />
                  <rect x="114" y="135" width="12" height="20" rx="6" fill="#312E81" />
                  <rect x="78" y="162" width="12" height="20" rx="6" fill="#312E81" />
                  <rect x="96" y="162" width="12" height="20" rx="6" fill="#312E81" />
                  <rect x="114" y="162" width="12" height="20" rx="6" fill="#312E81" />

                  {/* Right Wing Building */}
                  <rect x="265" y="125" width="65" height="65" rx="3" fill="#EEF2FF" />
                  <rect x="265" y="120" width="65" height="5" fill="#4F46E5" />
                  {/* Right Wing Arched Windows */}
                  <rect x="274" y="135" width="12" height="20" rx="6" fill="#312E81" />
                  <rect x="292" y="135" width="12" height="20" rx="6" fill="#312E81" />
                  <rect x="310" y="135" width="12" height="20" rx="6" fill="#312E81" />
                  <rect x="274" y="162" width="12" height="20" rx="6" fill="#312E81" />
                  <rect x="292" y="162" width="12" height="20" rx="6" fill="#312E81" />
                  <rect x="310" y="162" width="12" height="20" rx="6" fill="#312E81" />

                  {/* Central Academic Hall */}
                  <rect x="125" y="105" width="150" height="85" fill="#FFFFFF" />

                  {/* Neoclassical Pillars (4 Columns) */}
                  <rect x="140" y="125" width="10" height="63" rx="1.5" fill="#C7D2FE" />
                  <rect x="175" y="125" width="10" height="63" rx="1.5" fill="#C7D2FE" />
                  <rect x="215" y="125" width="10" height="63" rx="1.5" fill="#C7D2FE" />
                  <rect x="250" y="125" width="10" height="63" rx="1.5" fill="#C7D2FE" />

                  {/* Portico Architrave & Frieze */}
                  <rect x="130" y="118" width="140" height="7" fill="#4F46E5" />

                  {/* Central Main Entrance Arch Door */}
                  <path
                    d="M185 188 L185 150 C185 142 215 142 215 150 L215 188 Z"
                    fill="url(#door_grad)"
                  />
                  <line x1="200" y1="147" x2="200" y2="188" stroke="#818CF8" strokeWidth="1.5" />

                  {/* Pediment (Triangle Roof) */}
                  <polygon points="120,118 200,68 280,118" fill="#4338CA" />
                  <polygon points="132,115 200,75 268,115" fill="#6366F1" />

                  {/* Academic Clock / Crest Emblem in Pediment */}
                  <circle cx="200" cy="98" r="9" fill="#FFFFFF" />
                  <circle cx="200" cy="98" r="7.5" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="1" />
                  <line x1="200" y1="94" x2="200" y2="98" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="200" y1="98" x2="203" y2="98" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" />

                  {/* Institutional Dome on Top */}
                  <rect x="188" y="55" width="24" height="15" fill="#C7D2FE" />
                  <path d="M184 55 Q 200 32 216 55 Z" fill="#4F46E5" />
                  {/* Flagpole & Campus Flag */}
                  <line x1="200" y1="34" x2="200" y2="18" stroke="#CBD5E1" strokeWidth="1.5" />
                  <path d="M200 18 L218 23 L200 28 Z" fill="#F43F5E" />

                  {/* Campus Trees */}
                  <circle cx="50" cy="180" r="16" fill="#10B981" opacity="0.85" />
                  <rect x="47" y="190" width="6" height="20" fill="#065F46" />
                  <circle cx="350" cy="180" r="16" fill="#10B981" opacity="0.85" />
                  <rect x="347" y="190" width="6" height="20" fill="#065F46" />

                  {/* Communication Flight Trail */}
                  <path
                    d="M60 90 Q 150 20 280 60 T 360 40"
                    fill="none"
                    stroke="#A5B4FC"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity="0.8"
                  />

                  {/* Gradients Definition */}
                  <defs>
                    <linearGradient id="canvas_sky" x1="0" y1="0" x2="0" y2="240" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#312E81" stopOpacity="0.8" />
                      <stop offset="1" stopColor="#1E1B4B" stopOpacity="0.95" />
                    </linearGradient>
                    <linearGradient id="hill_grad" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#6366F1" />
                      <stop offset="1" stopColor="#818CF8" />
                    </linearGradient>
                    <linearGradient id="door_grad" x1="0" y1="150" x2="0" y2="188" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#1E1B4B" />
                      <stop offset="1" stopColor="#0F172A" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Floating Badge 1: Faculty Evaluation */}
                <div className="absolute -top-3 -left-2 sm:-left-3 bg-white/95 backdrop-blur-md rounded-xl p-2 sm:p-2.5 shadow-xl border border-indigo-100 flex items-center space-x-2 animate-bounce [animation-duration:4s]">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-[9px] sm:text-[10px] font-bold text-slate-800">
                      Faculty Evaluation
                    </div>
                    <div className="text-[8px] sm:text-[9px] font-semibold text-emerald-600">
                      4.9 / 5.0 (98%)
                    </div>
                  </div>
                </div>

                {/* Floating Badge 2: Paper Plane Vector */}
                <div className="absolute top-3 -right-2 sm:-right-4 bg-indigo-600 text-white rounded-xl p-1.5 sm:p-2 shadow-xl border border-indigo-400 flex items-center space-x-1.5 animate-pulse">
                  <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="text-[9px] sm:text-[10px] font-bold">Voice Delivered</span>
                </div>

                {/* Floating Badge 3: Resolved Grievance Pill */}
                <div className="absolute -bottom-2 right-2 sm:right-6 bg-white/95 backdrop-blur-md rounded-xl p-1.5 sm:p-2 shadow-xl border border-slate-200 flex items-center space-x-1.5 sm:space-x-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-800">
                    SLA Resolution <span className="text-emerald-600 font-extrabold">&lt; 48 hrs</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Panel Note (Visible on Desktop) */}
        <div className="hidden lg:flex relative z-10 pt-4 border-t border-white/10 items-center justify-between text-xs text-purple-200/70">
          <span>Designed for better campus experiences.</span>
          <div className="flex items-center space-x-1 text-purple-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-medium">Decoupled Privacy</span>
          </div>
        </div>

        {/* ELEGANT ORGANIC CURVED SVG BOUNDARY SEPARATING LEFT AND RIGHT (Desktop Only) */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-12 pointer-events-none fill-[#F8FAFC]">
          <svg
            className="h-full w-full"
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,0 Q100,250 30,500 T0,1000 L100,1000 L100,0 Z" />
          </svg>
        </div>
      </div>

      {/* ========================================================
          RIGHT PANEL (DESKTOP: 45% SPLIT-SCREEN ON #F8FAFC)
          BOTTOM SECTION (MOBILE: -mt-8 OVERLAPPING WHITE SHEET)
          ======================================================== */}
      <div className="w-full lg:w-[45%] -mt-8 lg:mt-0 relative z-20 bg-white lg:bg-[#F8FAFC] rounded-t-[32px] lg:rounded-none shadow-2xl lg:shadow-none px-6 sm:px-10 lg:px-14 py-8 sm:py-10 lg:py-12 flex flex-col justify-center items-center">
        <div className="w-full max-w-md mx-auto space-y-6 sm:space-y-7">
          {/* Top Institutional Header */}
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EEF2FF] border border-indigo-200/80 text-[#4F46E5] text-xs font-semibold shadow-xs">
              <Shield className="w-3.5 h-3.5 text-[#4F46E5]" />
              <span>CampusVoice Institutional Edition</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              Welcome Back
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Sign in with your enrollment credentials to access your institutional portal.
            </p>
          </div>

          {/* Form Container (Card style on Desktop, clean flat flow on Mobile) */}
          <div className="bg-transparent lg:bg-white lg:p-8 lg:rounded-2xl lg:border lg:border-[#E2E8F0] lg:shadow-sm space-y-5">
            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleStandardLogin} className="space-y-4">
              {/* Email / ID Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider">
                  Email / Institutional ID <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="student@campusvoice.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#111827] placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all"
                  />
                </div>
              </div>

              {/* Password Field with Show/Hide Toggle */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider">
                    Password <span className="text-rose-500">*</span>
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your account password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 sm:py-3 text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#111827] placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Option */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[#CBD5E1] text-[#4F46E5] focus:ring-[#4F46E5]/20"
                  />
                  <span className="text-xs text-[#64748B]">Remember this device</span>
                </label>
                <span className="text-xs text-indigo-600 hover:underline cursor-pointer">
                  Need access help?
                </span>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#4338CA] hover:from-[#4338CA] hover:to-[#3730A3] text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 group cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authenticating Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to CampusVoice</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Registration Link for Students */}
            <div className="pt-4 border-t border-[#E2E8F0] text-center">
              <p className="text-xs text-[#64748B]">
                New college student?{' '}
                <Link
                  href="/register"
                  className="font-bold text-[#4F46E5] hover:text-[#4338CA] hover:underline"
                >
                  Create Student Account
                </Link>
              </p>
            </div>
          </div>

          {/* Secure Institutional Access Footer */}
          <div className="text-center space-y-1 pt-2">
            <div className="text-[11px] text-[#64748B] flex items-center justify-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Secure Institutional Access • CampusVoice</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Role-based segregation enforces student, HR Officer, and Super Admin access boundaries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
