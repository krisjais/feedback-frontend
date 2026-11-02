'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { ShieldAlert, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

/**
 * Robust Frontend Route Guard
 * @param {Array<string>} allowedRoles - Roles permitted to view this route ('student', 'hr_officer', 'super_admin')
 * @param {ReactNode} children - Protected component view
 */
export default function ProtectedRoute({ allowedRoles = [], children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const userRole = user?.role;
  const isAuthorized = user && allowedRoles.includes(userRole);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  // Loading state: prevent flashing any sensitive administrative content
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
            Verifying Institutional Security Credentials...
          </p>
        </div>
      </div>
    );
  }

  // Unauthenticated user
  if (!user) {
    return null; // Will redirect via useEffect
  }

  // Unauthorized role: Render Access Denied
  if (!isAuthorized) {
    const fallbackPath =
      userRole === 'student'
        ? '/student'
        : userRole === 'hr_officer' || userRole === 'hr'
        ? '/hr/dashboard'
        : userRole === 'super_admin' || userRole === 'superadmin'
        ? '/admin/dashboard'
        : '/login';

    const fallbackLabel =
      userRole === 'student'
        ? 'Return to Student Portal'
        : userRole === 'hr_officer' || userRole === 'hr'
        ? 'Return to HR Desk'
        : userRole === 'super_admin' || userRole === 'superadmin'
        ? 'Return to Super Admin Portal'
        : 'Sign In';

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-red-200/80 shadow-lg p-6 sm:p-8 text-center space-y-5">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-100 text-red-800">
              HTTP 403 Forbidden
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Access Denied
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your account is registered as <strong className="text-slate-900 uppercase">'{userRole}'</strong>,
              which does not have authorized permissions to view this administrative dashboard.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-1">
            <p className="text-[11px] font-bold text-slate-700">Policy Violation Prevention:</p>
            <p className="text-[11px] text-slate-500">
              Institutional security policies strictly enforce separation of Student, HR Officer, and Super Administrator functions.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href={fallbackPath}
              className="w-full inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{fallbackLabel}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render authorized view
  return <>{children}</>;
}
