'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import ComplaintTimeline from '@/components/ComplaintTimeline';
import ComplaintChat from '@/components/ComplaintChat';
import { useAuth } from '@/lib/authContext';
import api from '@/lib/api';
import {
  ArrowLeft,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Calendar,
  MapPin,
  Building2,
  Shield,
  FileText,
  Lock,
} from 'lucide-react';

import { Suspense } from 'react';

function StudentComplaintDetailContent() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [complaint, setComplaint] = useState(null);
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Reopen modal state
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [reopening, setReopening] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'student') {
        router.push('/admin');
      } else {
        loadComplaintData();
      }
    }
  }, [id, user, authLoading]);

  const loadComplaintData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/complaints/${id}`);
      if (res.data.success) {
        setComplaint(res.data.complaint);
        setMessages(res.data.messages || []);
        setHistory(res.data.history || []);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to load complaint details.');
    } finally {
      setLoading(false);
    }
  };

  const handleReopen = async (e) => {
    e.preventDefault();
    if (!reopenReason.trim()) return;

    try {
      setReopening(true);
      const res = await api.post(`/complaints/${id}/reopen`, {
        reopenReason: reopenReason.trim(),
      });
      if (res.data.success) {
        setShowReopenModal(false);
        setReopenReason('');
        loadComplaintData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reopen complaint.');
    } finally {
      setReopening(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-xl mx-auto p-8 text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Complaint Not Found</h2>
          <p className="text-xs text-slate-500">{errorMessage || 'The requested ticket could not be loaded.'}</p>
          <Link
            href="/student"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-blue-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  const canReopen = ['resolved', 'rejected', 'closed'].includes(complaint.status);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <Link
            href="/student"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Complaints List</span>
          </Link>
        </div>

        {/* Ticket Header Banner */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className="font-mono text-base font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                {complaint.ticketId}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {complaint.category}
              </span>
              {complaint.isAnonymous && (
                <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <Lock className="w-3 h-3" />
                  <span>Anonymous</span>
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  complaint.priority === 'critical'
                    ? 'bg-rose-100 text-rose-800'
                    : complaint.priority === 'high'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                Priority: {complaint.priority}
              </span>

              {canReopen && (
                <button
                  onClick={() => setShowReopenModal(true)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reopen Ticket</span>
                </button>
              )}
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
            {complaint.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Filed: {new Date(complaint.createdAt).toLocaleDateString()}</span>
            </span>

            {complaint.department && (
              <span className="flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Dept: {complaint.department.name}</span>
              </span>
            )}

            {complaint.location && (
              <span className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Location: {complaint.location}</span>
              </span>
            )}
          </div>
        </div>

        {/* Resolution Banner if resolved */}
        {complaint.status === 'resolved' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-emerald-950 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Official Resolution Notes</span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed pl-7">
              {complaint.resolutionSummary || 'The reported issue has been addressed and rectified by the administration.'}
            </p>
            {complaint.resolvedAt && (
              <p className="text-[10px] text-emerald-700 pl-7">
                Resolved on: {new Date(complaint.resolvedAt).toLocaleString()}
              </p>
            )}
          </div>
        )}

        {/* Rejection Banner if rejected */}
        {complaint.status === 'rejected' && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-rose-950 space-y-2">
            <div className="flex items-center space-x-2 text-rose-800 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>Grievance Discontinued / Rejected</span>
            </div>
            <p className="text-xs text-rose-900 leading-relaxed pl-7">
              {complaint.rejectionReason || 'Complaint dismissed after preliminary evaluation.'}
            </p>
          </div>
        )}

        {/* Main Grid: Timeline on left/top, Details & Dialogue on right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Lifecycle Progression */}
          <div className="lg:col-span-1 space-y-6">
            <ComplaintTimeline status={complaint.status} history={history} />

            {/* Description Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Original Incident Report
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                {complaint.description}
              </p>

              {complaint.attachments?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Attachments
                  </h4>
                  <div className="space-y-1.5">
                    {complaint.attachments.map((att, i) => (
                      <a
                        key={i}
                        href={att.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center space-x-1.5 truncate"
                      >
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{att.fileName || 'View Attachment'}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Chat with HR */}
          <div className="lg:col-span-2">
            <ComplaintChat
              complaintId={id}
              messages={messages}
              currentUserRole="student"
              onMessageSent={(newMsg) => setMessages((prev) => [...prev, newMsg])}
            />
          </div>
        </div>

        {/* Reopen Modal */}
        {showReopenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-200 space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <RotateCcw className="w-5 h-5 text-amber-600" />
                <span>Reopen Grievance Ticket</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                If the problem was not adequately solved, or has recurred, please explain the reasons
                for reopening below.
              </p>
              <form onSubmit={handleReopen} className="space-y-3">
                <textarea
                  rows={4}
                  required
                  placeholder="Explain why this issue is not fully resolved..."
                  value={reopenReason}
                  onChange={(e) => setReopenReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReopenModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reopening || !reopenReason.trim()}
                    className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-2xs disabled:opacity-50"
                  >
                    {reopening ? 'Reopening...' : 'Confirm Reopen'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function StudentComplaintDetailPage() {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      <Suspense
        fallback={
          <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <StudentComplaintDetailContent />
      </Suspense>
    </ProtectedRoute>
  );
}
