'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/authContext';
import api from '@/lib/api';
import {
  ArrowLeft,
  AlertTriangle,
  ShieldCheck,
  Send,
  UploadCloud,
  CheckCircle2,
  Lock,
  Info,
} from 'lucide-react';

export default function NewComplaintPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [departments, setDepartments] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Internet and technical issue');
  const [departmentId, setDepartmentId] = useState('');
  const [location, setLocation] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [description, setDescription] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [declaration, setDeclaration] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successTicketId, setSuccessTicketId] = useState('');
  const [createdComplaintId, setCreatedComplaintId] = useState('');

  const categories = [
    'Faculty-related issue',
    'Classroom issue',
    'Laboratory issue',
    'Library issue',
    'Canteen issue',
    'Washroom and cleanliness',
    'Infrastructure issue',
    'Administration issue',
    'Internet and technical issue',
    'Harassment or serious misconduct',
    'Other',
  ];

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'student') {
        router.push('/admin');
      } else {
        loadDepartments();
      }
    }
  }, [user, authLoading]);

  const loadDepartments = async () => {
    try {
      const res = await api.get('/departments');
      if (res.data.success) {
        setDepartments(res.data.departments || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Please enter a complaint title.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Please provide a detailed description of the grievance.');
      return;
    }
    if (!declaration) {
      setErrorMessage('You must confirm the truthfulness declaration before submitting.');
      return;
    }

    try {
      setLoading(true);
      const attachments = attachmentUrl.trim()
        ? [
            {
              fileName: 'Supporting Evidence / Document',
              fileUrl: attachmentUrl.trim(),
              fileType: 'link',
              fileSize: 0,
            },
          ]
        : [];

      const res = await api.post('/complaints', {
        title: title.trim(),
        category,
        department: departmentId || undefined,
        location: location.trim(),
        incidentDate: incidentDate || undefined,
        priority,
        isAnonymous,
        description: description.trim(),
        attachments,
      });

      if (res.data.success) {
        setSuccessTicketId(res.data.ticketId);
        setCreatedComplaintId(res.data.complaint?._id);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to submit grievance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <Link
            href="/student"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Success Modal Confirmation Card */}
        {successTicketId ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-5 animate-in fade-in">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900">Grievance Successfully Registered</h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Your complaint has been logged in the college grievance cell. An authorized officer will
                review and initiate investigation.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl inline-block text-left">
              <span className="text-xs text-slate-500 block">Unique Ticket Tracking ID:</span>
              <span className="text-xl font-extrabold font-mono text-blue-600 tracking-wider">
                {successTicketId}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Link
                href={`/student/complaints/${createdComplaintId}`}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Track Ticket Live
              </Link>
              <Link
                href="/student"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
            {/* Header */}
            <div className="border-b border-slate-100 pb-4">
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                <span>Independent Grievance Redressal</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Register a College Complaint
              </h1>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Report issues regarding classrooms, laboratories, faculties, sanitation, harassment, or
                campus facilities.
              </p>
            </div>

            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Complaint Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Complaint Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Broken water dispenser in Block B, 2nd Floor"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Category & Priority Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Priority Indication
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="low">Low (General suggestion/routine)</option>
                    <option value="medium">Medium (Standard campus issue)</option>
                    <option value="high">High (Urgent academic/facility impact)</option>
                    <option value="critical">Critical (Safety/Severe Misconduct)</option>
                  </select>
                </div>
              </div>

              {/* Department & Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Department Involved
                  </label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="">-- General / Unsure --</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name} ({dept.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Specific Location / Room
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Room 304, Block B, East Wing"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Incident Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Date of Incident (Optional)
                </label>
                <input
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="w-full max-w-xs px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Describe clearly what happened, who was involved, time of occurrence, and how this impacts your studies or campus experience..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Supporting Attachment Link */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Supporting Attachment Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... or cloud document link"
                  value={attachmentUrl}
                  onChange={(e) => setAttachmentUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  You can paste a link to photos, screenshot evidence, or written statements.
                </p>
              </div>

              {/* Anonymous Submission Mode Toggle */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Submit Grievance in Anonymous Mode</span>
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Your name and student ID will not be visible to investigating departments.
                    </p>
                  </div>
                </label>
                {isAnonymous && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200/80 rounded-lg text-[11px] text-amber-900 flex items-start space-x-2">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Notice: Complete anonymity cannot be guaranteed if uploaded files or text
                      descriptions contain personal details. For sensitive harassment issues, access is
                      restricted exclusively to the Head of Grievance Redressal.
                    </span>
                  </div>
                )}
              </div>

              {/* Consent and Truthfulness Declaration */}
              <div className="pt-2">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={declaration}
                    onChange={(e) => setDeclaration(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-600 leading-normal">
                    I declare that the details provided in this complaint are authentic to the best of my
                    knowledge. I understand that submitting knowingly false or defamatory grievances is
                    subject to institutional code of conduct policies.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/student"
                  className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span>Registering Ticket...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Complaint</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  </ProtectedRoute>
);
}
