'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import StatCard from '@/components/StatCard';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/authContext';
import api from '@/lib/api';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  PlusCircle,
  ExternalLink,
  Search,
  Filter,
  ShieldAlert,
  Calendar,
  Lock,
  ArrowRight,
  Megaphone,
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [forms, setForms] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (user && user.role === 'student') {
        loadData();
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [formsRes, complaintsRes, annRes] = await Promise.all([
        api.get('/forms'),
        api.get('/complaints/my'),
        api.get('/announcements'),
      ]);

      if (formsRes?.data?.success) setForms(formsRes.data.forms || []);
      if (complaintsRes?.data?.success) setComplaints(complaintsRes.data.complaints || []);
      if (annRes?.data?.success) setAnnouncements(annRes.data.announcements || []);
    } catch (err) {
      if (err.response?.status === 401) {
        router.push('/login');
        return;
      }
      console.warn('Failed to load student dashboard:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredForms = forms.filter((f) => {
    const matchesSearch =
      f.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category?.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'available') return matchesSearch && f.displayStatus === 'Available';
    if (filterStatus === 'submitted') return matchesSearch && f.displayStatus === 'Submitted';
    if (filterStatus === 'expired') return matchesSearch && f.displayStatus === 'Expired';
    return matchesSearch;
  });

  const availableCount = forms.filter((f) => f.displayStatus === 'Available').length;
  const submittedCount = forms.filter((f) => f.displayStatus === 'Submitted').length;
  const activeComplaintsCount = complaints.filter(
    (c) => !['resolved', 'closed', 'rejected'].includes(c.status)
  ).length;

  return (
    <ProtectedRoute allowedRoles={['student']}>
      {loading ? (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-500">Loading student workspace...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-xs mb-3">
              Academic Year: {user?.academicYear || '2026'} • Student ID: {user?.studentId || 'N/A'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Student'}
            </h1>
            <p className="mt-2 text-blue-100 text-sm sm:text-base leading-relaxed">
              Your centralized hub to participate in institutional feedback evaluations and report
              grievances directly to college administration.
            </p>
          </div>
          {/* Subtle background decoration */}
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10">
            <ShieldAlert className="w-80 h-80 text-white" />
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Available Forms"
            value={availableCount}
            subtitle="Surveys pending your input"
            icon={FileText}
            color="blue"
          />
          <StatCard
            title="Completed Forms"
            value={submittedCount}
            subtitle="Receipts securely saved"
            icon={CheckCircle2}
            color="green"
          />
          <StatCard
            title="Active Grievances"
            value={activeComplaintsCount}
            subtitle="Under investigation"
            icon={AlertTriangle}
            color="amber"
          />
          <StatCard
            title="Total Tickets"
            value={complaints.length}
            subtitle="Historical complaints filed"
            icon={Clock}
            color="purple"
          />
        </div>

        {/* SECTION 2: Prominent Call-to-Action to Report an Issue */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <span>Section 2</span>
              <span>•</span>
              <span>Grievance Redressal</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">Facing a College Problem?</h2>
            <p className="text-xs text-slate-500 max-w-xl">
              You do not need to wait for HR to publish a survey. Report infrastructure, academic,
              canteen, or laboratory problems anytime with a unique tracking ticket.
            </p>
          </div>
          <Link
            href="/student/complaints/new"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-xs hover:shadow-sm transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report an Issue Now</span>
          </Link>
        </div>

        {/* SECTION 1: Feedback Forms */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
                <span>Section 1</span>
                <span>•</span>
                <span>Academic & Campus Surveys</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Published Feedback Forms</h2>
            </div>

            {/* Search & Filter Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search forms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-xs">
                {['all', 'available', 'submitted', 'expired'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1 rounded-md font-medium capitalize transition-colors ${
                      filterStatus === status
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Cards Grid */}
          {filteredForms.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-slate-200 text-slate-500 text-sm">
              No feedback forms found matching your filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredForms.map((form) => {
                const isAvailable = form.displayStatus === 'Available';
                const isSubmitted = form.displayStatus === 'Submitted';

                return (
                  <div
                    key={form._id}
                    className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Status & Category */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                          {form.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isSubmitted
                              ? 'bg-emerald-100 text-emerald-800'
                              : isAvailable
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {form.displayStatus}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                        {form.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                        {form.description}
                      </p>

                      {/* Details row */}
                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center space-x-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>Estimated Time:</span>
                          </span>
                          <span className="font-semibold text-slate-700">
                            ~{form.estimatedTimeMinutes || 5} mins
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="flex items-center space-x-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>Deadline:</span>
                          </span>
                          <span className="font-semibold text-slate-700">
                            {new Date(form.endDate).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>

                        {form.isAnonymous && (
                          <div className="flex items-center space-x-1.5 text-emerald-600 text-[11px] font-medium pt-1">
                            <Lock className="w-3 h-3" />
                            <span>Anonymous Response Mode Enabled</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="mt-5 pt-3 border-t border-slate-100">
                      {isAvailable ? (
                        <Link
                          href={`/student/feedback/${form._id}`}
                          className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors"
                        >
                          <span>Start Feedback</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : isSubmitted ? (
                        <div className="flex items-center justify-center space-x-2 py-2 px-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Response Submitted</span>
                        </div>
                      ) : (
                        <button
                          disabled
                          className="w-full py-2 px-3 rounded-lg bg-slate-100 text-slate-400 text-xs font-medium cursor-not-allowed text-center"
                        >
                          Form Expired / Closed
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* My Registered Complaints Overview Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">My Registered Grievance Tickets</h3>
              <p className="text-xs text-slate-500">
                Track status updates, investigator replies, and resolutions in real-time.
              </p>
            </div>
            <Link
              href="/student/complaints/new"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>+ New Complaint</span>
            </Link>
          </div>

          {complaints.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              You haven't submitted any complaints yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                  <tr>
                    <th className="px-5 py-3">Ticket ID</th>
                    <th className="px-5 py-3">Title & Category</th>
                    <th className="px-5 py-3">Filed Date</th>
                    <th className="px-5 py-3">Priority</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {complaints.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5 font-bold font-mono text-blue-600">{c.ticketId}</td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-900 line-clamp-1">{c.title}</div>
                        <div className="text-[11px] text-slate-500">{c.category}</div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        {new Date(c.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            c.priority === 'critical'
                              ? 'bg-rose-100 text-rose-800'
                              : c.priority === 'high'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {c.priority}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            c.status === 'resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : c.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : c.status === 'reopened'
                              ? 'bg-amber-100 text-amber-800'
                              : c.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {c.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/student/complaints/${c._id}`}
                          className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                        >
                          <span>Track</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Campus Announcements */}
        {announcements.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-900">
              <Megaphone className="w-4 h-4 text-blue-600" />
              <span>Campus Notices & Administrative Broadcasts</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {announcements.map((ann) => (
                <div
                  key={ann._id}
                  className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/60"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm bg-blue-100 text-blue-800">
                      {ann.category}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(ann.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-2">{ann.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
    )}
  </ProtectedRoute>
);
}
