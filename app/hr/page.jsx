'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import StatCard from '@/components/StatCard';
import ComplaintTimeline from '@/components/ComplaintTimeline';
import ComplaintChat from '@/components/ComplaintChat';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/authContext';
import api from '@/lib/api';
import {
  Users,
  FileText,
  FileSpreadsheet,
  MessageSquareWarning,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  Download,
  Plus,
  Trash2,
  Copy,
  Edit,
  Eye,
  Search,
  Filter,
  Lock,
  Building2,
  Megaphone,
  History,
  Sliders,
  Send,
  Star,
  Check,
  ChevronRight,
  Printer,
  Shield,
  Layers,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

export default function HRPortalPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Core Data Stores
  const [stats, setStats] = useState({});
  const [forms, setForms] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);

  // Modals & Selected items
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaintMessages, setComplaintMessages] = useState([]);
  const [complaintHistory, setComplaintHistory] = useState([]);
  const [statusUpdateNote, setStatusUpdateNote] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [assignDeptId, setAssignDeptId] = useState('');

  // Responses viewer state
  const [selectedFormForResponses, setSelectedFormForResponses] = useState(null);
  const [formResponses, setFormResponses] = useState([]);
  const [participationData, setParticipationData] = useState(null);
  const [viewingSubmissionModal, setViewingSubmissionModal] = useState(null);

  // Form Builder State
  const [newFormTitle, setNewFormTitle] = useState('');
  const [newFormDesc, setNewFormDesc] = useState('');
  const [newFormCategory, setNewFormCategory] = useState('Faculty Evaluation');
  const [newFormTarget, setNewFormTarget] = useState('all');
  const [newFormDeadline, setNewFormDeadline] = useState('');
  const [newFormAnonymous, setNewFormAnonymous] = useState(true);
  const [newFormEstTime, setNewFormEstTime] = useState(5);
  const [builderQuestions, setBuilderQuestions] = useState([
    {
      label: 'Instructor clarity and subject mastery',
      questionType: 'rating_5',
      isRequired: true,
      options: [],
      scaleConfig: { min: 1, max: 5, minLabel: 'Poor', maxLabel: 'Exceptional' },
    },
    {
      label: 'Constructive suggestions for syllabus pacing or practical labs',
      questionType: 'long_text',
      isRequired: false,
      options: [],
    },
  ]);

  // Filters
  const [complaintSearch, setComplaintSearch] = useState('');
  const [complaintFilterStatus, setComplaintFilterStatus] = useState('all');
  const [complaintFilterCategory, setComplaintFilterCategory] = useState('all');
  const [complaintFilterPriority, setComplaintFilterPriority] = useState('all');

  // Announcements State
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnPriority, setNewAnnPriority] = useState('info');

  useEffect(() => {
    setNewFormDeadline(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    if (!authLoading) {
      if (user && (user.role === 'hr_officer' || user.role === 'hr')) {
        loadHRData();
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  const loadHRData = async () => {
    try {
      setLoading(true);
      const [statsRes, formsRes, complaintsRes, deptRes, annRes] = await Promise.all([
        api.get('/analytics/overview'),
        api.get('/forms'),
        api.get('/complaints/all'),
        api.get('/departments'),
        api.get('/announcements'),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats || {});
        setAnalyticsData(statsRes.data);
      }
      if (formsRes.data.success) setForms(formsRes.data.forms || []);
      if (complaintsRes.data.success) setComplaints(complaintsRes.data.complaints || []);
      if (deptRes.data.success) setDepartments(deptRes.data.departments || []);
      if (annRes.data.success) setAnnouncements(annRes.data.announcements || []);
    } catch (err) {
      console.error('Failed to load HR data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenComplaint = async (complaint) => {
    try {
      const res = await api.get(`/complaints/${complaint._id}`);
      if (res.data.success) {
        setSelectedComplaint(res.data.complaint);
        setComplaintMessages(res.data.messages || []);
        setComplaintHistory(res.data.history || []);
        setNewStatus(res.data.complaint.status);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateComplaintStatus = async () => {
    if (!selectedComplaint) return;
    try {
      const payload = {
        status: newStatus,
        note: statusUpdateNote,
      };
      if (newStatus === 'resolved') {
        payload.resolutionSummary = statusUpdateNote || 'Issue investigated and resolved by HR team.';
      } else if (newStatus === 'rejected') {
        payload.rejectionReason = statusUpdateNote || 'Rejected after review.';
      }

      const res = await api.patch(`/complaints/${selectedComplaint._id}/status`, payload);
      if (res.data.success) {
        setStatusUpdateNote('');
        handleOpenComplaint(selectedComplaint);
        const refreshed = await api.get('/complaints/all');
        if (refreshed.data.success) setComplaints(refreshed.data.complaints);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const handleAssignDepartment = async () => {
    if (!selectedComplaint || !assignDeptId) return;
    try {
      const res = await api.post(`/complaints/${selectedComplaint._id}/assign`, {
        departmentId: assignDeptId,
        assignmentNote: `Assigned to department by HR officer ${user?.name}`,
      });
      if (res.data.success) {
        setAssignDeptId('');
        handleOpenComplaint(selectedComplaint);
        const refreshed = await api.get('/complaints/all');
        if (refreshed.data.success) setComplaints(refreshed.data.complaints);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error assigning department');
    }
  };

  const handleViewResponses = async (form) => {
    setSelectedFormForResponses(form);
    try {
      const [respRes, partRes] = await Promise.all([
        api.get(`/submissions/forms/${form._id}/responses`),
        api.get(`/submissions/forms/${form._id}/participation`),
      ]);
      if (respRes.data.success) setFormResponses(respRes.data.submissions || []);
      if (partRes.data.success) setParticipationData(partRes.data.participation || null);
      setActiveTab('responses');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnContent) return;
    try {
      const res = await api.post('/announcements', {
        title: newAnnTitle,
        content: newAnnContent,
        priority: newAnnPriority,
        targetAudience: 'all',
      });
      if (res.data.success) {
        setNewAnnTitle('');
        setNewAnnContent('');
        const refreshed = await api.get('/announcements');
        if (refreshed.data.success) setAnnouncements(refreshed.data.announcements);
        alert('Campus announcement broadcasted successfully!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating announcement');
    }
  };

  const handleSaveForm = async (publishImmediately = false) => {
    if (!newFormTitle) {
      alert('Please enter a form title.');
      return;
    }
    try {
      const res = await api.post('/forms', {
        title: newFormTitle,
        description: newFormDesc,
        category: newFormCategory,
        targetAudience: newFormTarget,
        deadline: newFormDeadline,
        isAnonymous: newFormAnonymous,
        estimatedTimeMinutes: Number(newFormEstTime) || 5,
        questions: builderQuestions,
        status: publishImmediately ? 'published' : 'draft',
      });
      if (res.data.success) {
        alert(publishImmediately ? 'Feedback form published live to students!' : 'Draft form saved.');
        const refreshed = await api.get('/forms');
        if (refreshed.data.success) setForms(refreshed.data.forms);
        setActiveTab('all-forms');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving form');
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.ticketId?.toLowerCase().includes(complaintSearch.toLowerCase()) ||
      c.title?.toLowerCase().includes(complaintSearch.toLowerCase()) ||
      c.complainantName?.toLowerCase().includes(complaintSearch.toLowerCase());
    const matchesStatus = complaintFilterStatus === 'all' || c.status === complaintFilterStatus;
    const matchesCat = complaintFilterCategory === 'all' || c.category === complaintFilterCategory;
    const matchesPriority = complaintFilterPriority === 'all' || c.priority === complaintFilterPriority;
    return matchesSearch && matchesStatus && matchesCat && matchesPriority;
  });

  return (
    <ProtectedRoute allowedRoles={['hr_officer', 'hr']}>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />

        <div className="flex-1 flex overflow-hidden">
          {/* HR Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              if (tab !== 'complaints') setSelectedComplaint(null);
            }}
            counts={{
              forms: forms.length,
              openComplaints: complaints.filter(
                (c) => !['resolved', 'closed', 'rejected'].includes(c.status)
              ).length,
              responses: formResponses.length,
            }}
          />

          {/* Main Content Pane */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Top Bar Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/80 mb-1">
                  <span>HR Grievance & Feedback Desk</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Welcome back, {user?.name}
                </h1>
                <p className="text-xs text-slate-500">
                  Dynamic institutional feedback designer, cohort participation monitoring, and student grievance triage.
                </p>
              </div>

              <div className="flex items-center space-x-2.5">
                <button
                  onClick={() => setActiveTab('form-builder')}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs flex items-center space-x-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Survey Form</span>
                </button>
                <button
                  onClick={() => setActiveTab('complaints')}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs flex items-center space-x-1.5 transition-all"
                >
                  <MessageSquareWarning className="w-3.5 h-3.5 text-amber-500" />
                  <span>Triage Grievances</span>
                </button>
              </div>
            </div>

            {/* TAB: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    title="Active Feedback Forms"
                    value={forms.filter((f) => f.status === 'published').length}
                    icon={FileText}
                    color="blue"
                    subtext={`${forms.length} total surveys created`}
                  />
                  <StatCard
                    title="Pending Grievances"
                    value={
                      complaints.filter((c) => !['resolved', 'closed', 'rejected'].includes(c.status))
                        .length
                    }
                    icon={MessageSquareWarning}
                    color="amber"
                    subtext="Requires HR review or assignment"
                  />
                  <StatCard
                    title="Resolved Grievances"
                    value={complaints.filter((c) => c.status === 'resolved').length}
                    icon={CheckCircle2}
                    color="emerald"
                    subtext="Successfully concluded"
                  />
                  <StatCard
                    title="Survey Submissions"
                    value={stats.totalSubmissions || 0}
                    icon={FileSpreadsheet}
                    color="purple"
                    subtext="Participation verified"
                  />
                </div>

                {/* Quick Shortcuts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                      <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                      <span>Recent Feedback Surveys</span>
                    </h3>
                    <div className="divide-y divide-slate-100">
                      {forms.slice(0, 4).map((f) => (
                        <div key={f._id} className="py-2.5 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-800">{f.title}</p>
                            <span className="text-[10px] text-slate-400 capitalize">{f.category}</span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              f.status === 'published'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {f.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                      <MessageSquareWarning className="w-4 h-4 text-amber-600" />
                      <span>Urgent Grievances Awaiting Action</span>
                    </h3>
                    <div className="divide-y divide-slate-100">
                      {complaints
                        .filter((c) => c.status === 'new' || c.priority === 'urgent')
                        .slice(0, 4)
                        .map((c) => (
                          <div
                            key={c._id}
                            onClick={() => {
                              setSelectedComplaint(c);
                              setActiveTab('complaints');
                              handleOpenComplaint(c);
                            }}
                            className="py-2.5 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 rounded-lg px-1 transition-colors"
                          >
                            <div>
                              <p className="font-bold text-slate-800 truncate max-w-xs">{c.title}</p>
                              <span className="text-[10px] text-slate-400">
                                {c.ticketId} • {c.category}
                              </span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-700">
                              {c.status}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ALL FORMS */}
            {activeTab === 'all-forms' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900">Institutional Feedback Forms</h2>
                  <button
                    onClick={() => setActiveTab('form-builder')}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    + Create Form
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {forms.map((f) => (
                    <div key={f._id} className="py-3.5 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-900">{f.title}</span>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                              f.status === 'published'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {f.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {f.category} • Target: {f.targetAudience} • {f.questions?.length || 0} questions
                        </p>
                      </div>
                      <button
                        onClick={() => handleViewResponses(f)}
                        className="px-3 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        Inspect Responses
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: COMPLAINTS */}
            {activeTab === 'complaints' && (
              <div className="space-y-4">
                {selectedComplaint ? (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <button
                          onClick={() => setSelectedComplaint(null)}
                          className="text-xs font-bold text-blue-600 hover:underline mb-1 inline-flex items-center space-x-1"
                        >
                          <span>← Back to Grievances</span>
                        </button>
                        <h2 className="text-lg font-extrabold text-slate-900">
                          {selectedComplaint.ticketId}: {selectedComplaint.title}
                        </h2>
                        <span className="text-xs text-slate-500">
                          Category: {selectedComplaint.category} • Priority: {selectedComplaint.priority}
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                        {selectedComplaint.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 space-y-4">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                          <p className="text-xs font-bold text-slate-700">Complainant Narrative:</p>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {selectedComplaint.description}
                          </p>
                        </div>

                        {/* Dialogue Thread */}
                        <ComplaintChat
                          complaintId={selectedComplaint._id}
                          messages={complaintMessages}
                          onMessageSent={() => handleOpenComplaint(selectedComplaint)}
                          currentUserRole={user?.role}
                        />
                      </div>

                      {/* HR Triage Controls */}
                      <div className="space-y-4">
                        <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Update Ticket Lifecycle
                          </h4>
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="w-full text-xs border border-slate-300 rounded-lg p-2"
                          >
                            <option value="new">New</option>
                            <option value="under_review">Under Review</option>
                            <option value="assigned">Assigned</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="rejected">Rejected</option>
                            <option value="closed">Closed</option>
                          </select>

                          <textarea
                            rows={3}
                            placeholder="Add status change milestone note..."
                            value={statusUpdateNote}
                            onChange={(e) => setStatusUpdateNote(e.target.value)}
                            className="w-full text-xs border border-slate-300 rounded-lg p-2"
                          />

                          <button
                            onClick={handleUpdateComplaintStatus}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg"
                          >
                            Apply Status Update
                          </button>
                        </div>

                        {/* Assign Department */}
                        <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Assign to Department
                          </h4>
                          <select
                            value={assignDeptId}
                            onChange={(e) => setAssignDeptId(e.target.value)}
                            className="w-full text-xs border border-slate-300 rounded-lg p-2"
                          >
                            <option value="">Select Department...</option>
                            {departments.map((d) => (
                              <option key={d._id} value={d._id}>
                                {d.name} ({d.code})
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={handleAssignDepartment}
                            disabled={!assignDeptId}
                            className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg disabled:opacity-50"
                          >
                            Assign Department
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h2 className="text-base font-bold text-slate-900">
                        Student Grievances Redressal Cell ({filteredComplaints.length})
                      </h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {filteredComplaints.map((c) => (
                        <div
                          key={c._id}
                          onClick={() => handleOpenComplaint(c)}
                          className="py-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer px-2 rounded-lg transition-colors"
                        >
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-slate-900">{c.ticketId}</span>
                              <span className="text-xs font-medium text-slate-800">• {c.title}</span>
                            </div>
                            <span className="text-[11px] text-slate-400">
                              {c.category} • Complainant: {c.isAnonymous ? 'Anonymous' : c.complainantName}
                            </span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-700">
                            {c.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: ANNOUNCEMENTS */}
            {activeTab === 'announcements' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Broadcast Campus Notice</h3>
                  <form onSubmit={handleCreateAnnouncement} className="space-y-3">
                    <input
                      type="text"
                      required
                      placeholder="Announcement Headline"
                      value={newAnnTitle}
                      onChange={(e) => setNewAnnTitle(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                    />
                    <textarea
                      rows={3}
                      required
                      placeholder="Content for student body broadcast..."
                      value={newAnnContent}
                      onChange={(e) => setNewAnnContent(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                    />
                    <div className="flex items-center space-x-3">
                      <select
                        value={newAnnPriority}
                        onChange={(e) => setNewAnnPriority(e.target.value)}
                        className="text-xs border border-slate-300 rounded-lg p-2"
                      >
                        <option value="info">Information (Blue)</option>
                        <option value="warning">Important Alert (Amber)</option>
                        <option value="urgent">Critical Notice (Red)</option>
                      </select>
                      <button
                        type="submit"
                        className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg"
                      >
                        Broadcast Notice
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-3">
                  <h3 className="text-sm font-bold text-slate-900">Active Notices</h3>
                  <div className="divide-y divide-slate-100">
                    {announcements.map((a) => (
                      <div key={a._id} className="py-2.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{a.title}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(a.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-0.5">{a.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
