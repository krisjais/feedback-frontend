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

export default function AdminPortalPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Core Data Stores
  const [stats, setStats] = useState({});
  const [forms, setForms] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [settings, setSettings] = useState({});
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

  // User Directory State
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');

  // Participation Filter State
  const [participationFilter, setParticipationFilter] = useState('all');
  const [participationSearch, setParticipationSearch] = useState('');

  // HR Visible Panels & Portal Settings State
  const [hrVisiblePanelsState, setHrVisiblePanelsState] = useState([
    'dashboard',
    'form-builder',
    'all-forms',
    'responses',
    'participation',
    'complaints',
    'analytics',
    'announcements',
    'departments',
  ]);
  const [collegeNameInput, setCollegeNameInput] = useState('');
  const [supportEmailInput, setSupportEmailInput] = useState('');
  const [complaintSlaInput, setComplaintSlaInput] = useState(5);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    setNewFormDeadline(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    if (!authLoading) {
      if (user && (user.role === 'super_admin' || user.role === 'superadmin')) {
        loadAllAdminData();
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  const loadAllAdminData = async () => {
    try {
      setLoading(true);
      const [
        statsRes,
        formsRes,
        complaintsRes,
        deptRes,
        usersRes,
        annRes,
        auditRes,
        settingsRes,
      ] = await Promise.all([
        api.get('/analytics/overview'),
        api.get('/forms'),
        api.get('/complaints/all'),
        api.get('/departments'),
        api.get('/users'),
        api.get('/announcements'),
        api.get('/audit-logs'),
        api.get('/settings'),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats || {});
        setAnalyticsData(statsRes.data);
      }
      if (formsRes.data.success) setForms(formsRes.data.forms || []);
      if (complaintsRes.data.success) setComplaints(complaintsRes.data.complaints || []);
      if (deptRes.data.success) setDepartments(deptRes.data.departments || []);
      if (usersRes.data.success) setUsersList(usersRes.data.users || []);
      if (annRes.data.success) setAnnouncements(annRes.data.announcements || []);
      if (auditRes.data.success) setAuditLogs(auditRes.data.logs || []);
      if (settingsRes.data.success) {
        const s = settingsRes.data.settings || {};
        setSettings(s);
        if (Array.isArray(s.hrVisiblePanels)) setHrVisiblePanelsState(s.hrVisiblePanels);
        setCollegeNameInput(s.collegeName || '');
        setSupportEmailInput(s.supportEmail || '');
        setComplaintSlaInput(s.complaintSlaDays || 5);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    try {
      setSavingSettings(true);
      const res = await api.put('/settings', {
        collegeName: collegeNameInput,
        supportEmail: supportEmailInput,
        complaintSlaDays: Number(complaintSlaInput),
        hrVisiblePanels: hrVisiblePanelsState,
      });
      if (res.data.success) {
        alert('Institutional settings & HR portal panel permissions saved successfully!');
        const refreshed = await api.get('/settings');
        if (refreshed.data.success) setSettings(refreshed.data.settings);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const toggleHRPanel = (panelId) => {
    setHrVisiblePanelsState((prev) =>
      prev.includes(panelId) ? prev.filter((id) => id !== panelId) : [...prev, panelId]
    );
  };

  // Complaint Drilldown & Lifecycle Operations
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
        // Refresh list
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
        notes: `Assigned for resolution by ${user?.name}`,
      });
      if (res.data.success) {
        handleOpenComplaint(selectedComplaint);
        const refreshed = await api.get('/complaints/all');
        if (refreshed.data.success) setComplaints(refreshed.data.complaints);
      }
    } catch (err) {
      alert('Error assigning department');
    }
  };

  // Form Operations
  const handlePublishForm = async (formId) => {
    try {
      const res = await api.patch(`/forms/${formId}/status`, { status: 'published' });
      if (res.data.success) {
        setForms((prev) =>
          prev.map((f) => (f._id === formId ? { ...f, status: 'published' } : f))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to publish form');
    }
  };

  const handleCloseForm = async (formId) => {
    try {
      const res = await api.patch(`/forms/${formId}/status`, { status: 'closed' });
      if (res.data.success) {
        setForms((prev) =>
          prev.map((f) => (f._id === formId ? { ...f, status: 'closed' } : f))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to close form');
    }
  };

  const handleDuplicateForm = async (formId) => {
    try {
      const res = await api.post(`/forms/${formId}/duplicate`);
      if (res.data.success) {
        setForms((prev) => [res.data.form, ...prev]);
        alert('Form duplicated successfully!');
      }
    } catch (err) {
      alert('Failed to duplicate form');
    }
  };

  const handleDeleteForm = async (formId) => {
    if (!confirm('Are you sure you want to delete this draft form?')) return;
    try {
      const res = await api.delete(`/forms/${formId}`);
      if (res.data.success) {
        setForms((prev) => prev.filter((f) => f._id !== formId));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete form');
    }
  };

  // View Responses for a Form
  const handleViewResponses = async (form) => {
    try {
      setSelectedFormForResponses(form);
      const [respRes, partRes] = await Promise.all([
        api.get(`/submissions/forms/${form._id}/responses`),
        api.get(`/submissions/forms/${form._id}/participation`),
      ]);
      if (respRes.data.success) setFormResponses(respRes.data.submissions || []);
      if (partRes.data.success) setParticipationData(partRes.data);
      setActiveTab('responses');
    } catch (err) {
      console.error(err);
    }
  };

  // Form Builder Actions
  const handleAddBuilderQuestion = () => {
    setBuilderQuestions((prev) => [
      ...prev,
      {
        label: `New Question ${prev.length + 1}`,
        questionType: 'rating_5',
        isRequired: true,
        options: ['Option 1', 'Option 2'],
        scaleConfig: { min: 1, max: 5, minLabel: 'Poor', maxLabel: 'Excellent' },
      },
    ]);
  };

  const handleRemoveBuilderQuestion = (index) => {
    setBuilderQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveForm = async (publishImmediate = false) => {
    if (!newFormTitle.trim()) {
      alert('Please enter a form title.');
      return;
    }
    if (builderQuestions.length === 0) {
      alert('Please add at least one question.');
      return;
    }

    try {
      const res = await api.post('/forms', {
        title: newFormTitle.trim(),
        description: newFormDesc.trim(),
        category: newFormCategory,
        targetAudience: newFormTarget,
        endDate: newFormDeadline,
        estimatedTimeMinutes: Number(newFormEstTime) || 5,
        isAnonymous: newFormAnonymous,
        status: publishImmediate ? 'published' : 'draft',
        questions: builderQuestions,
      });

      if (res.data.success) {
        alert(
          publishImmediate
            ? 'Feedback form created & published successfully!'
            : 'Feedback form draft saved!'
        );
        setForms((prev) => [res.data.form, ...prev]);
        setNewFormTitle('');
        setNewFormDesc('');
        setActiveTab('all-forms');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create form');
    }
  };

  // Filtered Complaints
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.ticketId?.toLowerCase().includes(complaintSearch.toLowerCase()) ||
      c.title?.toLowerCase().includes(complaintSearch.toLowerCase()) ||
      c.description?.toLowerCase().includes(complaintSearch.toLowerCase());
    const matchesStatus = complaintFilterStatus === 'all' || c.status === complaintFilterStatus;
    const matchesCat = complaintFilterCategory === 'all' || c.category === complaintFilterCategory;
    const matchesPriority =
      complaintFilterPriority === 'all' || c.priority === complaintFilterPriority;
    return matchesSearch && matchesStatus && matchesCat && matchesPriority;
  });

  const COLORS = ['#2563eb', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <ProtectedRoute allowedRoles={['super_admin', 'superadmin']}>
      {loading ? (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-500">Loading Super Admin Portal...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <Navbar />

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSelectedComplaint(null);
          }}
          counts={{
            forms: forms.length,
            responses: stats.totalResponses,
            openComplaints: stats.openComplaints,
          }}
          role="super_admin"
        />

        {/* Main Administrative Work Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* ======================================================== */}
          {/* TAB 1: EXECUTIVE DASHBOARD OVERVIEW */}
          {/* ======================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    HR & Grievance Executive Dashboard
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Real-time oversight of college feedback collections, student participation, and grievance resolution SLAs.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveTab('form-builder')}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Feedback Form</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Executive Reports</span>
                  </button>
                </div>
              </div>

              {/* 8 Metric Overview Cards (Section 6) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Students"
                  value={stats.totalStudents || 0}
                  subtitle="Active institutional users"
                  icon={Users}
                  color="blue"
                />
                <StatCard
                  title="Feedback Forms"
                  value={stats.totalForms || 0}
                  subtitle={`${stats.activeForms || 0} Currently Active`}
                  icon={FileSpreadsheet}
                  color="indigo"
                />
                <StatCard
                  title="Total Responses"
                  value={stats.totalResponses || 0}
                  subtitle="Across all surveys"
                  icon={CheckCircle2}
                  color="green"
                />
                <StatCard
                  title="Avg Satisfaction"
                  value={`${stats.overallAverageRating || 4.2} / 5`}
                  subtitle="Composite institutional score"
                  icon={Star}
                  color="purple"
                />
                <StatCard
                  title="Total Complaints"
                  value={stats.totalComplaints || 0}
                  subtitle="All historical grievances"
                  icon={Clock}
                  color="purple"
                />
                <StatCard
                  title="Open Complaints"
                  value={stats.openComplaints || 0}
                  subtitle="Under review & in progress"
                  icon={AlertTriangle}
                  color="amber"
                />
                <StatCard
                  title="Resolved Complaints"
                  value={stats.resolvedComplaints || 0}
                  subtitle="Rectified & closed"
                  icon={CheckCircle2}
                  color="green"
                />
                <StatCard
                  title="Resolution Rate"
                  value={`${stats.resolutionRate || 0}%`}
                  subtitle="Target SLA: 95%"
                  icon={TrendingUp}
                  color="blue"
                />
              </div>

              {/* Visual Analytics Charts Summary */}
              {analyticsData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Monthly Grievance & Feedback Trends */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">
                      Monthly Feedback & Grievance Volume
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.monthlyFeedbackTrends}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <Legend wrapperStyle={{ fontSize: 11 }} />
                          <Bar dataKey="responses" fill="#2563eb" name="Survey Responses" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="complaints" fill="#f59e0b" name="Complaints Filed" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="resolved" fill="#10b981" name="Resolved" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Grievance Category Breakdown */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">
                      Complaints by Category Distribution
                    </h3>
                    <div className="h-64 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analyticsData.complaintsByCategory}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={4}
                            dataKey="count"
                            nameKey="name"
                          >
                            {analyticsData.complaintsByCategory?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* Urgent Action Needed - High Priority Tickets */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Active Grievance Queue (Requires Action)</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('complaints')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    View All Tickets ({complaints.length})
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {complaints.slice(0, 4).map((c) => (
                    <div
                      key={c._id}
                      onClick={() => {
                        handleOpenComplaint(c);
                        setActiveTab('complaints');
                      }}
                      className="p-4 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-blue-600 text-xs">
                            {c.ticketId}
                          </span>
                          <span
                            className={`px-2 py-0.2 rounded-full text-[10px] font-bold uppercase ${
                              c.priority === 'critical'
                                ? 'bg-rose-100 text-rose-800'
                                : c.priority === 'high'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {c.priority}
                          </span>
                          <span className="text-xs font-medium text-slate-500">• {c.category}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{c.title}</h4>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: DYNAMIC FEEDBACK FORM BUILDER (Section 5) */}
          {/* ======================================================== */}
          {activeTab === 'form-builder' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Feedback Form Designer</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    HR form builder with 11 dynamic question types, anonymous mode isolation, and eligibility controls.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSaveForm(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    Save Draft
                  </button>
                  <button
                    onClick={() => handleSaveForm(true)}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs"
                  >
                    Publish to Students
                  </button>
                </div>
              </div>

              {/* Form Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Form Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., End-Semester Course Evaluation - Fall 2026"
                    value={newFormTitle}
                    onChange={(e) => setNewFormTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Description & Student Instructions
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide context regarding the purpose and guidelines of this evaluation..."
                    value={newFormDesc}
                    onChange={(e) => setNewFormDesc(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Feedback Category
                  </label>
                  <select
                    value={newFormCategory}
                    onChange={(e) => setNewFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="Faculty Evaluation">Faculty Evaluation</option>
                    <option value="Course & Curriculum">Course & Curriculum</option>
                    <option value="Campus Facilities">Campus Facilities</option>
                    <option value="Hostel & Canteen">Hostel & Canteen</option>
                    <option value="Library & Resources">Library & Resources</option>
                    <option value="Laboratory & Equipment">Laboratory & Equipment</option>
                    <option value="Student Support Services">Student Support Services</option>
                    <option value="General Feedback">General Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Eligibility
                  </label>
                  <select
                    value={newFormTarget}
                    onChange={(e) => setNewFormTarget(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="all">All Departments & All Years</option>
                    <option value="department_specific">Department Specific</option>
                    <option value="year_specific">Year Specific</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Submission Deadline
                  </label>
                  <input
                    type="date"
                    value={newFormDeadline}
                    onChange={(e) => setNewFormDeadline(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Estimated Time (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={newFormEstTime}
                    onChange={(e) => setNewFormEstTime(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Anonymity Protocol Switch */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-900 flex items-center space-x-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Enable Anonymous Feedback Mode</span>
                  </span>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Decouples student identity receipts from survey answers for complete confidentiality.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={newFormAnonymous}
                  onChange={(e) => setNewFormAnonymous(e.target.checked)}
                  className="w-5 h-5 text-emerald-600 rounded border-emerald-300 focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              {/* Questions Builder Section */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Form Questions ({builderQuestions.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddBuilderQuestion}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {builderQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600">Question #{idx + 1}</span>
                        <div className="flex items-center space-x-2">
                          <label className="flex items-center space-x-1 text-xs text-slate-600">
                            <input
                              type="checkbox"
                              checked={q.isRequired}
                              onChange={(e) => {
                                const copy = [...builderQuestions];
                                copy[idx].isRequired = e.target.checked;
                                setBuilderQuestions(copy);
                              }}
                              className="w-3.5 h-3.5 text-blue-600 rounded"
                            />
                            <span>Required</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => handleRemoveBuilderQuestion(idx)}
                            className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            placeholder="Type question prompt..."
                            value={q.label}
                            onChange={(e) => {
                              const copy = [...builderQuestions];
                              copy[idx].label = e.target.value;
                              setBuilderQuestions(copy);
                            }}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <select
                            value={q.questionType}
                            onChange={(e) => {
                              const copy = [...builderQuestions];
                              copy[idx].questionType = e.target.value;
                              setBuilderQuestions(copy);
                            }}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                          >
                            <option value="short_text">Short Text</option>
                            <option value="long_text">Long Text</option>
                            <option value="multiple_choice">Multiple Choice</option>
                            <option value="checkbox">Checkbox (Multiple Select)</option>
                            <option value="dropdown">Dropdown</option>
                            <option value="yes_no">Yes / No</option>
                            <option value="rating_5">1-5 Star Rating</option>
                            <option value="rating_10">1-10 Scale</option>
                            <option value="linear_scale">Linear Scale</option>
                            <option value="date">Date</option>
                            <option value="file_upload">File Upload</option>
                          </select>
                        </div>
                      </div>

                      {/* Options input for choice/dropdown types */}
                      {['multiple_choice', 'checkbox', 'dropdown'].includes(q.questionType) && (
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                            Answer Choices (Comma-separated)
                          </label>
                          <input
                            type="text"
                            placeholder="Choice 1, Choice 2, Choice 3"
                            value={(q.options || []).join(', ')}
                            onChange={(e) => {
                              const copy = [...builderQuestions];
                              copy[idx].options = e.target.value
                                .split(',')
                                .map((s) => s.trim())
                                .filter(Boolean);
                              setBuilderQuestions(copy);
                            }}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: ALL FEEDBACK FORMS MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === 'all-forms' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Institutional Feedback Forms</h2>
                  <p className="text-xs text-slate-500">
                    Control publishing lifecycles, version audits, duplicate surveys, and inspect student response datasets.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('form-builder')}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Form</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                    <tr>
                      <th className="px-5 py-3">Form Title</th>
                      <th className="px-5 py-3">Category</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Mode</th>
                      <th className="px-5 py-3">Responses</th>
                      <th className="px-5 py-3">Deadline</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {forms.map((form) => (
                      <tr key={form._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="font-bold text-slate-900">{form.title}</div>
                          <div className="text-[11px] text-slate-400">
                            Version {form.currentVersion || 1} • by {form.createdBy?.name || 'HR'}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                            {form.category}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              form.status === 'published'
                                ? 'bg-emerald-100 text-emerald-800'
                                : form.status === 'draft'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {form.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {form.isAnonymous ? (
                            <span className="text-emerald-700 text-[11px] font-semibold flex items-center space-x-1">
                              <Lock className="w-3 h-3" />
                              <span>Anonymous</span>
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[11px]">Identified</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 font-bold text-slate-900">
                          {form.responseCount || 0}
                        </td>
                        <td className="px-5 py-3.5 text-slate-500">
                          {new Date(form.endDate).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3.5 text-right space-x-1">
                          <button
                            onClick={() => handleViewResponses(form)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"
                            title="View Responses"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {form.status === 'draft' && (
                            <button
                              onClick={() => handlePublishForm(form._id)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md"
                              title="Publish Form"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          {form.status === 'published' && (
                            <button
                              onClick={() => handleCloseForm(form._id)}
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md"
                              title="Close Form"
                            >
                              <Lock className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDuplicateForm(form._id)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md"
                            title="Duplicate Form"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          {form.status === 'draft' && (
                            <button
                              onClick={() => handleDeleteForm(form._id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md"
                              title="Delete Draft"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: RESPONSES & EXPORT MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === 'responses' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Feedback Responses: {selectedFormForResponses?.title || 'All Surveys'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {selectedFormForResponses?.isAnonymous
                      ? '🔒 Protected Anonymous Survey: Student identities are permanently unlinked.'
                      : 'Identified Survey: Student details associated with responses.'}
                  </p>
                </div>
                {selectedFormForResponses && (
                  <div className="flex items-center space-x-2">
                    <a
                      href={`http://localhost:5000/api/submissions/forms/${selectedFormForResponses._id}/export/csv`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </a>
                    <a
                      href={`http://localhost:5000/api/submissions/forms/${selectedFormForResponses._id}/export/excel`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Excel</span>
                    </a>
                  </div>
                )}
              </div>

              {!selectedFormForResponses ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Select a form from "All Feedback Forms" tab to inspect responses.
                </div>
              ) : formResponses.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No responses recorded yet for this feedback form.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                      <tr>
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Submitted At</th>
                        <th className="px-4 py-3">Student Identity</th>
                        <th className="px-4 py-3">Key Answer Snippets</th>
                        <th className="px-4 py-3 text-right">Full Response</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {formResponses.map((sub, index) => (
                        <tr key={sub._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-semibold text-slate-400">{index + 1}</td>
                          <td className="px-4 py-3 text-slate-500">
                            {new Date(sub.submittedAt).toLocaleString([], {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </td>
                          <td className="px-4 py-3">
                            {sub.isAnonymous ? (
                              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px]">
                                Anonymous
                              </span>
                            ) : (
                              <div>
                                <div className="font-bold text-slate-900">{sub.student?.name || 'N/A'}</div>
                                <div className="text-[10px] text-slate-400">{sub.student?.studentId}</div>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 max-w-md truncate text-slate-700">
                            {sub.answers?.slice(0, 2).map((a, i) => (
                              <span key={i} className="mr-2 text-[11px]">
                                <strong>{a.questionLabel.substring(0, 20)}:</strong> {String(a.value)}
                              </span>
                            ))}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => setViewingSubmissionModal(sub)}
                              className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Submission Answers Inspection Modal */}
          {viewingSubmissionModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
              <div className="bg-white rounded-2xl p-6 max-w-xl w-full max-h-[85vh] flex flex-col shadow-xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900">Submission Answer Details</h3>
                  <button
                    onClick={() => setViewingSubmissionModal(null)}
                    className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    Close
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-3.5 my-2">
                  {viewingSubmissionModal.answers?.map((ans, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                      <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                        {ans.questionLabel}
                      </span>
                      <div className="text-xs font-semibold text-slate-900">
                        {Array.isArray(ans.value) ? ans.value.join(', ') : String(ans.value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: STUDENT PARTICIPATION (Section 6) */}
          {/* ======================================================== */}
          {activeTab === 'participation' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Student Participation Tracker</h2>
                <p className="text-xs text-slate-500">
                  Verify individual student survey completion for administrative accreditation. Tracks students only (HR staff are excluded).
                </p>
              </div>

              {/* Form selector */}
              <div className="max-w-md">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Select Form to Monitor:
                </label>
                <select
                  value={selectedFormForResponses?._id || ''}
                  onChange={(e) => {
                    const found = forms.find((f) => f._id === e.target.value);
                    if (found) handleViewResponses(found);
                  }}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                >
                  <option value="">-- Choose a Form --</option>
                  {forms.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.title} ({f.category})
                    </option>
                  ))}
                </select>
              </div>

              {participationData && (
                <div className="space-y-4 pt-2">
                  {/* Summary Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                      <span className="text-xs text-blue-700 font-semibold">Total Target Cohort</span>
                      <p className="text-2xl font-bold text-blue-950 mt-1">
                        {(participationData?.participationList || []).filter(
                          (s) => s.role !== 'hr_officer' && s.role !== 'hr' && s.role !== 'super_admin' && s.role !== 'superadmin'
                        ).length}
                      </p>
                    </div>
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <span className="text-xs text-emerald-700 font-semibold">Responded / Completed</span>
                      <p className="text-2xl font-bold text-emerald-950 mt-1">
                        {(participationData?.participationList || []).filter(
                          (s) => s.role !== 'hr_officer' && s.role !== 'hr' && s.role !== 'super_admin' && s.role !== 'superadmin' && s.hasSubmitted
                        ).length}
                      </p>
                    </div>
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                      <span className="text-xs text-amber-700 font-semibold">Remaining / Pending</span>
                      <p className="text-2xl font-bold text-amber-950 mt-1">
                        {(participationData?.participationList || []).filter(
                          (s) => s.role !== 'hr_officer' && s.role !== 'hr' && s.role !== 'super_admin' && s.role !== 'superadmin' && !s.hasSubmitted
                        ).length}
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
                      <span className="text-xs text-purple-700 font-semibold">Participation Rate</span>
                      <p className="text-2xl font-bold text-purple-950 mt-1">{participationData.participationRate}%</p>
                    </div>
                  </div>

                  {/* Filter Tabs & Search */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
                      <button
                        onClick={() => setParticipationFilter('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          participationFilter === 'all'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        All Students (
                        {(participationData?.participationList || []).filter(
                          (s) => s.role !== 'hr_officer' && s.role !== 'hr' && s.role !== 'super_admin' && s.role !== 'superadmin'
                        ).length}
                        )
                      </button>
                      <button
                        onClick={() => setParticipationFilter('completed')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          participationFilter === 'completed'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-emerald-700 hover:text-emerald-900'
                        }`}
                      >
                        Responded (
                        {(participationData?.participationList || []).filter(
                          (s) => s.role !== 'hr_officer' && s.role !== 'hr' && s.role !== 'super_admin' && s.role !== 'superadmin' && s.hasSubmitted
                        ).length}
                        )
                      </button>
                      <button
                        onClick={() => setParticipationFilter('pending')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          participationFilter === 'pending'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'text-amber-700 hover:text-amber-900'
                        }`}
                      >
                        Remaining (
                        {(participationData?.participationList || []).filter(
                          (s) => s.role !== 'hr_officer' && s.role !== 'hr' && s.role !== 'super_admin' && s.role !== 'superadmin' && !s.hasSubmitted
                        ).length}
                        )
                      </button>
                    </div>

                    <div className="relative max-w-xs w-full">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search student or department..."
                        value={participationSearch}
                        onChange={(e) => setParticipationSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>

                  {/* Student list */}
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                        <tr>
                          <th className="px-4 py-3">Student ID</th>
                          <th className="px-4 py-3">Student Name</th>
                          <th className="px-4 py-3">Department & Year</th>
                          <th className="px-4 py-3">Receipt Code</th>
                          <th className="px-4 py-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(participationData.participationList || [])
                          .filter(
                            (s) => s.role !== 'hr_officer' && s.role !== 'hr' && s.role !== 'super_admin' && s.role !== 'superadmin'
                          )
                          .filter((s) => {
                            if (participationFilter === 'completed') return s.hasSubmitted;
                            if (participationFilter === 'pending') return !s.hasSubmitted;
                            return true;
                          })
                          .filter((s) => {
                            if (!participationSearch.trim()) return true;
                            const term = participationSearch.toLowerCase();
                            return (
                              s.name?.toLowerCase().includes(term) ||
                              s.studentId?.toLowerCase().includes(term) ||
                              s.email?.toLowerCase().includes(term) ||
                              s.department?.toLowerCase().includes(term)
                            );
                          })
                          .map((s, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3 font-mono font-bold text-slate-700">{s.studentId || '—'}</td>
                              <td className="px-4 py-3 font-semibold text-slate-900">{s.name}</td>
                              <td className="px-4 py-3 text-slate-500">
                                {s.department} • {s.academicYear}
                              </td>
                              <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                                {s.receiptCode || '—'}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {s.hasSubmitted ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                    Completed
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                    Remaining (Pending)
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: COMPLAINT MANAGEMENT (Core Grievance Redressal) */}
          {/* ======================================================== */}
          {activeTab === 'complaints' && (
            <div className="space-y-6">
              {/* If a complaint is selected, display deep triage drilldown */}
              {selectedComplaint ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedComplaint(null)}
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-900"
                    >
                      <span>← Back to Grievance Queue</span>
                    </button>
                    <span className="font-mono text-xs font-bold px-3 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      {selectedComplaint.ticketId}
                    </span>
                  </div>

                  {/* Grievance Admin Action Panel */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">{selectedComplaint.title}</h2>
                        <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                          <span>Category: <strong>{selectedComplaint.category}</strong></span>
                          <span>•</span>
                          <span>Filed by: <strong>{selectedComplaint.student?.name || 'Anonymous'}</strong></span>
                          <span>•</span>
                          <span>Priority: <strong className="uppercase">{selectedComplaint.priority}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                        >
                          <option value="new">New</option>
                          <option value="under_review">Under Review</option>
                          <option value="assigned">Assigned</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="rejected">Rejected</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div>

                    {/* Quick status transition bar */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
                      <input
                        type="text"
                        placeholder="Add resolution details, investigation notes, or explanation..."
                        value={statusUpdateNote}
                        onChange={(e) => setStatusUpdateNote(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                      <button
                        onClick={handleUpdateComplaintStatus}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs shrink-0"
                      >
                        Apply Status Update
                      </button>
                    </div>

                    {/* Department Assignment control */}
                    <div className="flex items-center space-x-3 pt-2">
                      <span className="text-xs font-bold text-slate-600 uppercase">Delegate / Assign:</span>
                      <select
                        value={assignDeptId}
                        onChange={(e) => setAssignDeptId(e.target.value)}
                        className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="">-- Choose Responsible Department --</option>
                        {departments.map((d) => (
                          <option key={d._id} value={d._id}>
                            {d.name} ({d.code})
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleAssignDepartment}
                        disabled={!assignDeptId}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 disabled:opacity-50"
                      >
                        Assign Dept
                      </button>
                    </div>
                  </div>

                  {/* Grid: Timeline and Chat */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                      <ComplaintTimeline
                        status={selectedComplaint.status}
                        history={complaintHistory}
                      />
                      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                        <h4 className="text-xs font-bold text-slate-900 uppercase">Description</h4>
                        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                          {selectedComplaint.description}
                        </p>
                      </div>
                    </div>

                    <div className="lg:col-span-2">
                      <ComplaintChat
                        complaintId={selectedComplaint._id}
                        messages={complaintMessages}
                        currentUserRole={user?.role}
                        onMessageSent={(newMsg) => setComplaintMessages((prev) => [...prev, newMsg])}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Complaint Queue Table View */
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="p-5 border-b border-slate-100 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-bold text-slate-900">Grievance Redressal Desk</h2>
                        <p className="text-xs text-slate-500">
                          Search, triage, delegate, and resolve student complaints with timestamped accountability.
                        </p>
                      </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search ticket ID or keyword..."
                          value={complaintSearch}
                          onChange={(e) => setComplaintSearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                        />
                      </div>

                      <select
                        value={complaintFilterStatus}
                        onChange={(e) => setComplaintFilterStatus(e.target.value)}
                        className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                      >
                        <option value="all">All Statuses</option>
                        <option value="new">New</option>
                        <option value="under_review">Under Review</option>
                        <option value="assigned">Assigned</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                        <option value="reopened">Reopened</option>
                      </select>

                      <select
                        value={complaintFilterPriority}
                        onChange={(e) => setComplaintFilterPriority(e.target.value)}
                        className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                      >
                        <option value="all">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>

                      <select
                        value={complaintFilterCategory}
                        onChange={(e) => setComplaintFilterCategory(e.target.value)}
                        className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                      >
                        <option value="all">All Categories</option>
                        <option value="Faculty-related issue">Faculty-related</option>
                        <option value="Classroom issue">Classroom</option>
                        <option value="Laboratory issue">Laboratory</option>
                        <option value="Library issue">Library</option>
                        <option value="Canteen issue">Canteen</option>
                        <option value="Washroom and cleanliness">Washroom & Cleanliness</option>
                        <option value="Infrastructure issue">Infrastructure</option>
                        <option value="Administration issue">Administration</option>
                        <option value="Internet and technical issue">Internet & Tech</option>
                        <option value="Harassment or serious misconduct">Harassment / Sensitive</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                        <tr>
                          <th className="px-5 py-3">Ticket ID</th>
                          <th className="px-5 py-3">Subject & Category</th>
                          <th className="px-5 py-3">Complainant</th>
                          <th className="px-5 py-3">Priority</th>
                          <th className="px-5 py-3">Status</th>
                          <th className="px-5 py-3">Assigned Dept</th>
                          <th className="px-5 py-3 text-right">Triage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredComplaints.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="p-8 text-center text-slate-400">
                              No complaints found matching filters.
                            </td>
                          </tr>
                        ) : (
                          filteredComplaints.map((c) => (
                            <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-5 py-3.5 font-mono font-bold text-blue-600">
                                {c.ticketId}
                              </td>
                              <td className="px-5 py-3.5">
                                <div className="font-bold text-slate-900 line-clamp-1">{c.title}</div>
                                <div className="text-[11px] text-slate-500">{c.category}</div>
                              </td>
                              <td className="px-5 py-3.5">
                                {c.isAnonymous ? (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                                    Anonymous
                                  </span>
                                ) : (
                                  <div>
                                    <div className="font-semibold text-slate-900">{c.student?.name}</div>
                                    <div className="text-[10px] text-slate-400">{c.student?.studentId}</div>
                                  </div>
                                )}
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
                              <td className="px-5 py-3.5 text-slate-600 font-medium">
                                {c.assignedDepartment?.code || 'Unassigned'}
                              </td>
                              <td className="px-5 py-3.5 text-right">
                                <button
                                  onClick={() => handleOpenComplaint(c)}
                                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs"
                                >
                                  Investigate
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 7: ANALYTICS & REPORTS (Printable Executive Report) */}
          {/* ======================================================== */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Institutional Intelligence & Reports
                  </h2>
                  <p className="text-xs text-slate-500">
                    Accreditation-ready metrics on student participation, faculty satisfaction, and grievance resolution SLAs.
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print PDF Report</span>
                </button>
              </div>

              {/* Department-wise Grievance Resolution Table */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Departmental Grievance Resolution & SLA Metrics
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                      <tr>
                        <th className="px-4 py-3">Department</th>
                        <th className="px-4 py-3">Total Complaints</th>
                        <th className="px-4 py-3">Resolved</th>
                        <th className="px-4 py-3">Resolution Rate</th>
                        <th className="px-4 py-3 text-right">Performance Band</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {analyticsData?.complaintsByDepartment?.map((dept, i) => {
                        const rate = dept.total > 0 ? Math.round((dept.resolved / dept.total) * 100) : 100;
                        return (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="px-4 py-3 font-bold text-slate-900">{dept.department}</td>
                            <td className="px-4 py-3">{dept.total}</td>
                            <td className="px-4 py-3 text-emerald-600 font-semibold">{dept.resolved}</td>
                            <td className="px-4 py-3 font-bold">{rate}%</td>
                            <td className="px-4 py-3 text-right">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  rate >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {rate >= 80 ? 'Optimal SLA' : 'Monitoring'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 8: ANNOUNCEMENTS BROADCAST */}
          {/* ======================================================== */}
          {activeTab === 'announcements' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Campus Notices & Broadcasts</h2>
                  <p className="text-xs text-slate-500">
                    Publish alerts and announcements directly to student notification feeds.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {announcements.map((ann) => (
                  <div key={ann._id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-blue-100 text-blue-700 uppercase">
                        {ann.category}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(ann.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{ann.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 9: USER MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">User Directory</h2>
                  <p className="text-xs text-slate-500">
                    Comprehensive registry of Enrolled Students, HR Grievance Officers, and Super Administrators.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-slate-500">
                    Total Registered: <strong className="text-slate-900">{usersList.length}</strong>
                  </span>
                </div>
              </div>

              {/* Role Filter Tabs & Search Bar */}
              <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-1.5 bg-slate-200/80 p-1 rounded-xl">
                  <button
                    onClick={() => setUserRoleFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      userRoleFilter === 'all'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All Users ({usersList.length})
                  </button>
                  <button
                    onClick={() => setUserRoleFilter('student')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      userRoleFilter === 'student'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-emerald-700 hover:text-emerald-900'
                    }`}
                  >
                    Students ({usersList.filter((u) => u.role === 'student').length})
                  </button>
                  <button
                    onClick={() => setUserRoleFilter('hr')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      userRoleFilter === 'hr'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-blue-700 hover:text-blue-900'
                    }`}
                  >
                    HR Officers ({usersList.filter((u) => u.role === 'hr_officer' || u.role === 'hr').length})
                  </button>
                  <button
                    onClick={() => setUserRoleFilter('super_admin')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      userRoleFilter === 'super_admin'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-purple-700 hover:text-purple-900'
                    }`}
                  >
                    Super Admins ({usersList.filter((u) => u.role === 'super_admin' || u.role === 'superadmin').length})
                  </button>
                </div>

                <div className="relative max-w-xs w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search name, email, roll ID..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                    <tr>
                      <th className="px-5 py-3">User & Contact</th>
                      <th className="px-5 py-3">System Role</th>
                      <th className="px-5 py-3">Student Roll / ID</th>
                      <th className="px-5 py-3">Department & Year</th>
                      <th className="px-5 py-3">Account Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersList
                      .filter((u) => {
                        const roleMatches =
                          userRoleFilter === 'all'
                            ? true
                            : userRoleFilter === 'student'
                            ? u.role === 'student'
                            : userRoleFilter === 'hr'
                            ? u.role === 'hr_officer' || u.role === 'hr'
                            : userRoleFilter === 'super_admin'
                            ? u.role === 'super_admin' || u.role === 'superadmin'
                            : true;

                        if (!roleMatches) return false;
                        if (!userSearch.trim()) return true;
                        const term = userSearch.toLowerCase();
                        return (
                          u.name?.toLowerCase().includes(term) ||
                          u.email?.toLowerCase().includes(term) ||
                          u.studentId?.toLowerCase().includes(term) ||
                          u.department?.name?.toLowerCase().includes(term) ||
                          u.role?.toLowerCase().includes(term)
                        );
                      })
                      .map((u) => {
                        const isStudent = u.role === 'student';
                        const isHR = u.role === 'hr_officer' || u.role === 'hr';
                        const isSuperAdmin = u.role === 'super_admin' || u.role === 'superadmin';

                        return (
                          <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-5 py-3.5">
                              <div className="font-bold text-slate-900">{u.name}</div>
                              <div className="text-[11px] text-slate-400">{u.email}</div>
                            </td>
                            <td className="px-5 py-3.5">
                              {isSuperAdmin && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-800">
                                  Super Admin
                                </span>
                              )}
                              {isHR && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                                  HR Officer
                                </span>
                              )}
                              {isStudent && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                                  Student
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-3.5 font-mono text-slate-600 font-semibold">
                              {u.studentId || (isStudent ? 'Unassigned' : 'Staff / N/A')}
                            </td>
                            <td className="px-5 py-3.5 text-slate-600 font-medium">
                              {u.department?.name || 'General Campus'}
                              {u.academicYear && u.academicYear !== 'Staff/N/A' ? ` • ${u.academicYear}` : ''}
                            </td>
                            <td className="px-5 py-3.5">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  u.status === 'active' || u.accountStatus === 'active'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {u.status || u.accountStatus || 'active'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 10: DEPARTMENTS */}
          {/* ======================================================== */}
          {activeTab === 'departments' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Configured College Departments</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {departments.map((d) => (
                  <div key={d._id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {d.code}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-2">{d.name}</h3>
                    <p className="text-xs text-slate-500">HoD: {d.headOfDepartment || 'N/A'}</p>
                    <p className="text-[11px] text-slate-400">{d.contactEmail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 11: AUDIT LOGS */}
          {/* ======================================================== */}
          {activeTab === 'audit-logs' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">System Activity Audit Log</h2>
                <p className="text-xs text-slate-500">
                  Immutable record of administrative actions, form creations, status shifts, and policy changes.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                    <tr>
                      <th className="px-5 py-3">Timestamp</th>
                      <th className="px-5 py-3">User</th>
                      <th className="px-5 py-3">Action</th>
                      <th className="px-5 py-3">Module</th>
                      <th className="px-5 py-3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auditLogs.map((log) => (
                      <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3 text-slate-400 font-mono text-[11px]">
                          {new Date(log.timestamp).toLocaleString([], {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </td>
                        <td className="px-5 py-3 font-semibold text-slate-900">{log.userName}</td>
                        <td className="px-5 py-3">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-slate-500 uppercase text-[10px] font-bold">
                          {log.module}
                        </td>
                        <td className="px-5 py-3 text-slate-600">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 12: PORTAL SETTINGS */}
          {/* ======================================================== */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6 max-w-3xl">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Institutional Portal Configuration</h2>
                <p className="text-xs text-slate-500">
                  Configure college parameters, grievance SLA targets, and manage HR Portal panel visibility.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
                {/* College General Settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Institution Identity & SLA</h3>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      College / University Name
                    </label>
                    <input
                      type="text"
                      value={collegeNameInput}
                      onChange={(e) => setCollegeNameInput(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Grievance Cell Contact Email
                    </label>
                    <input
                      type="email"
                      value={supportEmailInput}
                      onChange={(e) => setSupportEmailInput(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Resolution Target SLA (Days)
                    </label>
                    <input
                      type="number"
                      value={complaintSlaInput}
                      onChange={(e) => setComplaintSlaInput(e.target.value)}
                      className="w-full max-w-xs px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Section: HR Portal Panel Access Control */}
                <div className="pt-4 border-t border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">HR Portal Panel Permissions</h3>
                      <p className="text-xs text-slate-500">
                        Choose which dashboard panels and modules are visible to HR Officers.
                      </p>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {hrVisiblePanelsState.length} Active Panels
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {[
                      { id: 'dashboard', label: 'Dashboard Overview', desc: 'Summary KPIs, statistics cards, and urgent alerts' },
                      { id: 'form-builder', label: 'Form Builder', desc: 'Design, configure, and publish new surveys' },
                      { id: 'all-forms', label: 'All Feedback Forms', desc: 'Browse and inspect institutional surveys' },
                      { id: 'responses', label: 'Feedback Responses', desc: 'Inspect survey answers and export CSV/Excel' },
                      { id: 'participation', label: 'Student Participation Tracker', desc: 'Track students who completed vs remaining pending' },
                      { id: 'complaints', label: 'Complaint Management', desc: 'Investigate, assign departments, and resolve grievances' },
                      { id: 'analytics', label: 'Analytics & Reports', desc: 'Departmental SLA analytics and printable PDF reports' },
                      { id: 'announcements', label: 'Announcements', desc: 'Broadcast notices to the student body' },
                      { id: 'departments', label: 'Departments Directory', desc: 'Directory of college academic departments' },
                    ].map((panel) => {
                      const isChecked = hrVisiblePanelsState.includes(panel.id);
                      return (
                        <label
                          key={panel.id}
                          className={`p-3.5 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-blue-50/60 border-blue-200 shadow-2xs'
                              : 'bg-slate-50 border-slate-200 opacity-60'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleHRPanel(panel.id)}
                            className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="space-y-0.5">
                            <span className="font-bold text-xs text-slate-900 block">{panel.label}</span>
                            <span className="text-[11px] text-slate-500 block leading-tight">{panel.desc}</span>
                          </div>
                        </label>
                      );
                    })}

                    {/* Restricted Panels (Super Admin Only) */}
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-100 flex items-start space-x-3 opacity-75">
                      <Lock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-xs text-slate-700">Activity Audit Logs</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-600 uppercase">
                            Super Admin Only
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 block leading-tight">
                          Immutable security audit logs are restricted from HR officers.
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-100 flex items-start space-x-3 opacity-75">
                      <Lock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-xs text-slate-700">User Directory & Admin Controls</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-600 uppercase">
                            Super Admin Only
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 block leading-tight">
                          User provisioning and system role management are restricted from HR officers.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Changes take effect immediately for all active HR officer sessions.
                  </span>
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition-all disabled:opacity-50"
                  >
                    {savingSettings ? 'Saving...' : 'Save Settings & HR Permissions'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
    )}
  </ProtectedRoute>
);
}
