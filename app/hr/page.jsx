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
  GraduationCap,
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
  const [settings, setSettings] = useState({});

  // Modals & Selected items
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaintMessages, setComplaintMessages] = useState([]);
  const [complaintHistory, setComplaintHistory] = useState([]);
  const [statusUpdateNote, setStatusUpdateNote] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [assignDeptId, setAssignDeptId] = useState('');

  // Responses & Participation State
  const [selectedFormForResponses, setSelectedFormForResponses] = useState(null);
  const [formResponses, setFormResponses] = useState([]);
  const [participationData, setParticipationData] = useState(null);
  const [participationFilter, setParticipationFilter] = useState('all'); // 'all', 'completed', 'pending'
  const [participationSearch, setParticipationSearch] = useState('');
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
      const [statsRes, formsRes, complaintsRes, deptRes, annRes, settingsRes] = await Promise.all([
        api.get('/analytics/overview'),
        api.get('/forms'),
        api.get('/complaints/all'),
        api.get('/departments'),
        api.get('/announcements'),
        api.get('/settings'),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats || {});
        setAnalyticsData(statsRes.data);
      }
      if (formsRes.data.success) {
        const fetchedForms = formsRes.data.forms || [];
        setForms(fetchedForms);
        // Pre-select first form for responses / participation if available
        if (fetchedForms.length > 0 && !selectedFormForResponses) {
          fetchFormResponsesAndParticipation(fetchedForms[0]);
        }
      }
      if (complaintsRes.data.success) setComplaints(complaintsRes.data.complaints || []);
      if (deptRes.data.success) setDepartments(deptRes.data.departments || []);
      if (annRes.data.success) setAnnouncements(annRes.data.announcements || []);
      if (settingsRes.data.success) setSettings(settingsRes.data.settings || {});
    } catch (err) {
      console.error('Failed to load HR data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFormResponsesAndParticipation = async (form) => {
    setSelectedFormForResponses(form);
    try {
      const [respRes, partRes] = await Promise.all([
        api.get(`/submissions/forms/${form._id}/responses`),
        api.get(`/submissions/forms/${form._id}/participation`),
      ]);
      if (respRes.data.success) setFormResponses(respRes.data.submissions || []);
      if (partRes.data.success) setParticipationData(partRes.data);
    } catch (err) {
      console.error('Failed to load form responses/participation:', err);
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
    await fetchFormResponsesAndParticipation(form);
    setActiveTab('responses');
  };

  const handleViewParticipation = async (form) => {
    await fetchFormResponsesAndParticipation(form);
    setActiveTab('participation');
  };

  const handlePublishForm = async (formId) => {
    try {
      const res = await api.patch(`/forms/${formId}/status`, { status: 'published' });
      if (res.data.success) {
        setForms((prev) => prev.map((f) => (f._id === formId ? { ...f, status: 'published' } : f)));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to publish form');
    }
  };

  const handleCloseForm = async (formId) => {
    try {
      const res = await api.patch(`/forms/${formId}/status`, { status: 'closed' });
      if (res.data.success) {
        setForms((prev) => prev.map((f) => (f._id === formId ? { ...f, status: 'closed' } : f)));
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

  const handleSaveForm = async (publishImmediately = false) => {
    if (!newFormTitle.trim()) {
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

  // Participation Filter (Students ONLY - HR completely excluded)
  const filteredParticipationList = (participationData?.participationList || [])
    .filter((s) => s.role !== 'hr_officer' && s.role !== 'hr' && s.role !== 'super_admin' && s.role !== 'superadmin')
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
    });

  const totalEligibleCount = (participationData?.participationList || []).filter(
    (s) => s.role !== 'hr_officer' && s.role !== 'hr' && s.role !== 'super_admin' && s.role !== 'superadmin'
  ).length;
  const completedCount = (participationData?.participationList || []).filter(
    (s) => s.role !== 'hr_officer' && s.role !== 'hr' && s.role !== 'super_admin' && s.role !== 'superadmin' && s.hasSubmitted
  ).length;
  const pendingCount = totalEligibleCount - completedCount;

  // Check if panel is permitted for HR
  const isPanelPermitted = (panelId) => {
    if (panelId === 'audit-logs' || panelId === 'users' || panelId === 'settings') return false;
    if (Array.isArray(settings?.hrVisiblePanels)) {
      return settings.hrVisiblePanels.includes(panelId);
    }
    return true;
  };

  return (
    <ProtectedRoute allowedRoles={['hr_officer', 'hr']}>
      {loading ? (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-500">Loading HR Administration Portal...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <Navbar />

          <div className="flex-1 flex flex-col md:flex-row items-start relative w-full">
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
              visiblePanels={settings?.hrVisiblePanels}
              role="hr"
            />

            {/* Main Content Pane */}
            <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
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
                    Institutional feedback forms, student cohort participation monitoring, and grievance triage.
                  </p>
                </div>

                <div className="flex items-center space-x-2.5">
                  {isPanelPermitted('form-builder') && (
                    <button
                      onClick={() => setActiveTab('form-builder')}
                      className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs flex items-center space-x-1.5 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Survey Form</span>
                    </button>
                  )}
                  {isPanelPermitted('participation') && (
                    <button
                      onClick={() => setActiveTab('participation')}
                      className="px-3.5 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl shadow-2xs flex items-center space-x-1.5 transition-all"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                      <span>Student Participation</span>
                    </button>
                  )}
                  {isPanelPermitted('complaints') && (
                    <button
                      onClick={() => setActiveTab('complaints')}
                      className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs flex items-center space-x-1.5 transition-all"
                    >
                      <MessageSquareWarning className="w-3.5 h-3.5 text-amber-500" />
                      <span>Triage Grievances</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Panel Permission Guard */}
              {!isPanelPermitted(activeTab) ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-10 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Panel Access Restricted</h2>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    The Super Administrator has configured HR portal permissions and currently restricted access to this panel.
                  </p>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                  >
                    Return to HR Dashboard
                  </button>
                </div>
              ) : (
                <>
                  {/* TAB 1: DASHBOARD */}
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
                                <div className="flex items-center space-x-2">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                      f.status === 'published'
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-slate-100 text-slate-600'
                                    }`}
                                  >
                                    {f.status}
                                  </span>
                                  <button
                                    onClick={() => handleViewParticipation(f)}
                                    className="text-xs text-blue-600 hover:underline font-semibold"
                                  >
                                    Track
                                  </button>
                                </div>
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
                              .filter((c) => c.status === 'new' || c.priority === 'urgent' || c.priority === 'critical')
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

                  {/* TAB 2: FORM BUILDER */}
                  {activeTab === 'form-builder' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
                      <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                        <div>
                          <h2 className="text-lg font-bold text-slate-900">Dynamic Feedback Survey Designer</h2>
                          <p className="text-xs text-slate-500">
                            Configure questions, rating scales, target student cohorts, and privacy modes.
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleSaveForm(false)}
                            className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                          >
                            Save Draft
                          </button>
                          <button
                            onClick={() => handleSaveForm(true)}
                            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs"
                          >
                            Publish Live to Students
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                            Survey Title *
                          </label>
                          <input
                            type="text"
                            value={newFormTitle}
                            onChange={(e) => setNewFormTitle(e.target.value)}
                            placeholder="e.g. End Semester Curriculum & Faculty Evaluation"
                            className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                            Category
                          </label>
                          <select
                            value={newFormCategory}
                            onChange={(e) => setNewFormCategory(e.target.value)}
                            className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                          >
                            <option value="Faculty Evaluation">Faculty Evaluation</option>
                            <option value="Curriculum & Labs">Curriculum & Labs</option>
                            <option value="Hostel & Canteen">Hostel & Canteen</option>
                            <option value="Campus Facilities">Campus Facilities</option>
                            <option value="Extracurricular">Extracurricular</option>
                            <option value="General Institution">General Institution</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Description & Instructions
                        </label>
                        <textarea
                          rows={2}
                          value={newFormDesc}
                          onChange={(e) => setNewFormDesc(e.target.value)}
                          placeholder="Explain the purpose of this survey to students..."
                          className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                            Target Audience
                          </label>
                          <select
                            value={newFormTarget}
                            onChange={(e) => setNewFormTarget(e.target.value)}
                            className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                          >
                            <option value="all">All Enrolled Students</option>
                            <option value="department_specific">Department Specific</option>
                            <option value="year_specific">Year Specific</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                            Submission Deadline
                          </label>
                          <input
                            type="date"
                            value={newFormDeadline}
                            onChange={(e) => setNewFormDeadline(e.target.value)}
                            className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                            Privacy Mode
                          </label>
                          <select
                            value={newFormAnonymous ? 'true' : 'false'}
                            onChange={(e) => setNewFormAnonymous(e.target.value === 'true')}
                            className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                          >
                            <option value="true">Anonymous (Decoupled Identity)</option>
                            <option value="false">Identified (Visible to HR)</option>
                          </select>
                        </div>
                      </div>

                      {/* Questions Builder */}
                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-slate-900">Survey Questions ({builderQuestions.length})</h3>
                          <button
                            type="button"
                            onClick={handleAddBuilderQuestion}
                            className="text-xs text-blue-600 font-bold hover:underline inline-flex items-center space-x-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Question</span>
                          </button>
                        </div>

                        <div className="space-y-3">
                          {builderQuestions.map((q, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-slate-700">Question #{idx + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveBuilderQuestion(idx)}
                                  className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
                                >
                                  Remove
                                </button>
                              </div>
                              <input
                                type="text"
                                value={q.label}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setBuilderQuestions((prev) =>
                                    prev.map((item, i) => (i === idx ? { ...item, label: val } : item))
                                  );
                                }}
                                className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white"
                                placeholder="Enter question label..."
                              />
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                                    Response Type
                                  </label>
                                  <select
                                    value={q.questionType}
                                    onChange={(e) => {
                                      const t = e.target.value;
                                      setBuilderQuestions((prev) =>
                                        prev.map((item, i) => (i === idx ? { ...item, questionType: t } : item))
                                      );
                                    }}
                                    className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white"
                                  >
                                    <option value="rating_5">5-Point Likert Scale (Rating)</option>
                                    <option value="rating_10">10-Point Numerical Scale</option>
                                    <option value="single_choice">Single Choice (Radio)</option>
                                    <option value="multi_choice">Multiple Choice (Checkboxes)</option>
                                    <option value="short_text">Short Text</option>
                                    <option value="long_text">Detailed Narrative (Textarea)</option>
                                  </select>
                                </div>
                                <div className="flex items-center space-x-3 pt-4">
                                  <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                                    <input
                                      type="checkbox"
                                      checked={q.isRequired}
                                      onChange={(e) => {
                                        const req = e.target.checked;
                                        setBuilderQuestions((prev) =>
                                          prev.map((item, i) => (i === idx ? { ...item, isRequired: req } : item))
                                        );
                                      }}
                                      className="rounded border-slate-300 text-blue-600"
                                    />
                                    <span>Mandatory Field</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: ALL FEEDBACK FORMS */}
                  {activeTab === 'all-forms' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                          <h2 className="text-base font-bold text-slate-900">Institutional Feedback Forms</h2>
                          <p className="text-xs text-slate-500">Manage surveys, review responses, and monitor student participation cohorts.</p>
                        </div>
                        {isPanelPermitted('form-builder') && (
                          <button
                            onClick={() => setActiveTab('form-builder')}
                            className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs"
                          >
                            + Create Form
                          </button>
                        )}
                      </div>
                      <div className="divide-y divide-slate-100">
                        {forms.map((f) => (
                          <div key={f._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-bold text-slate-900">{f.title}</span>
                                <span
                                  className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                                    f.status === 'published'
                                      ? 'bg-emerald-50 text-emerald-700'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  {f.status}
                                </span>
                                {f.isAnonymous && (
                                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center space-x-1">
                                    <Lock className="w-2.5 h-2.5" />
                                    <span>Anonymous</span>
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500">
                                {f.category} • Target: {f.targetAudience} • {f.questions?.length || 0} questions • Responses: {f.responseCount || 0}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleViewResponses(f)}
                                className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center space-x-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Inspect Responses</span>
                              </button>
                              <button
                                onClick={() => handleViewParticipation(f)}
                                className="px-3 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg flex items-center space-x-1"
                              >
                                <GraduationCap className="w-3.5 h-3.5" />
                                <span>Track Participation</span>
                              </button>
                              {f.status === 'draft' && (
                                <button
                                  onClick={() => handlePublishForm(f._id)}
                                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md"
                                  title="Publish Form"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              {f.status === 'published' && (
                                <button
                                  onClick={() => handleCloseForm(f._id)}
                                  className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md"
                                  title="Close Form"
                                >
                                  <Lock className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDuplicateForm(f._id)}
                                className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md"
                                title="Duplicate Form"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              {f.status === 'draft' && (
                                <button
                                  onClick={() => handleDeleteForm(f._id)}
                                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md"
                                  title="Delete Draft"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: RESPONSES & EXPORTS */}
                  {activeTab === 'responses' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                        <div>
                          <h2 className="text-lg font-bold text-slate-900">
                            Feedback Responses: {selectedFormForResponses?.title || 'All Surveys'}
                          </h2>
                          <p className="text-xs text-slate-500">
                            {selectedFormForResponses?.isAnonymous
                              ? '🔒 Protected Anonymous Survey: Student identities are decoupled from responses.'
                              : 'Identified Survey: Student details associated with responses.'}
                          </p>
                        </div>
                        {selectedFormForResponses && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewParticipation(selectedFormForResponses)}
                              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold border border-purple-200"
                            >
                              <GraduationCap className="w-3.5 h-3.5" />
                              <span>Participation Tracker</span>
                            </button>
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

                  {/* TAB 5: STUDENT PARTICIPATION TRACKER (COMPLETED VS REMAINING - STUDENTS ONLY) */}
                  {activeTab === 'participation' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
                      <div className="border-b border-slate-100 pb-4">
                        <h2 className="text-lg font-bold text-slate-900">Student Participation Tracker</h2>
                        <p className="text-xs text-slate-500">
                          Verify individual student survey completion for institutional accreditation. Tracks students only (HR staff are completely excluded).
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
                            if (found) fetchFormResponsesAndParticipation(found);
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
                          {/* Summary KPI Cards */}
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                              <span className="text-xs text-blue-700 font-semibold">Total Eligible Students</span>
                              <p className="text-2xl font-bold text-blue-950 mt-1">{totalEligibleCount}</p>
                            </div>
                            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                              <span className="text-xs text-emerald-700 font-semibold">Responded / Completed</span>
                              <p className="text-2xl font-bold text-emerald-950 mt-1">{completedCount}</p>
                            </div>
                            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                              <span className="text-xs text-amber-700 font-semibold">Remaining / Pending</span>
                              <p className="text-2xl font-bold text-amber-950 mt-1">{pendingCount}</p>
                            </div>
                            <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
                              <span className="text-xs text-purple-700 font-semibold">Participation Rate</span>
                              <p className="text-2xl font-bold text-purple-950 mt-1">
                                {totalEligibleCount > 0 ? Math.round((completedCount / totalEligibleCount) * 100) : 0}%
                              </p>
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
                                All Students ({totalEligibleCount})
                              </button>
                              <button
                                onClick={() => setParticipationFilter('completed')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                  participationFilter === 'completed'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'text-emerald-700 hover:text-emerald-900'
                                }`}
                              >
                                Responded ({completedCount})
                              </button>
                              <button
                                onClick={() => setParticipationFilter('pending')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                  participationFilter === 'pending'
                                    ? 'bg-amber-600 text-white shadow-xs'
                                    : 'text-amber-700 hover:text-amber-900'
                                }`}
                              >
                                Remaining ({pendingCount})
                              </button>
                            </div>

                            <div className="relative max-w-xs w-full">
                              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                              <input
                                type="text"
                                placeholder="Search by name, roll no, department..."
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
                                  <th className="px-4 py-3">Student Roll / ID</th>
                                  <th className="px-4 py-3">Student Name</th>
                                  <th className="px-4 py-3">Department & Year</th>
                                  <th className="px-4 py-3">Email Address</th>
                                  <th className="px-4 py-3">Receipt Code</th>
                                  <th className="px-4 py-3 text-right">Response Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {filteredParticipationList.length === 0 ? (
                                  <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-400">
                                      No students found matching current filter.
                                    </td>
                                  </tr>
                                ) : (
                                  filteredParticipationList.map((s, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                      <td className="px-4 py-3 font-mono font-bold text-slate-700">{s.studentId || '—'}</td>
                                      <td className="px-4 py-3 font-semibold text-slate-900">{s.name}</td>
                                      <td className="px-4 py-3 text-slate-500">
                                        {s.department} • {s.academicYear}
                                      </td>
                                      <td className="px-4 py-3 text-slate-500">{s.email}</td>
                                      <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                                        {s.receiptCode || '—'}
                                      </td>
                                      <td className="px-4 py-3 text-right">
                                        {s.hasSubmitted ? (
                                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                            Completed
                                          </span>
                                        ) : (
                                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                            Remaining (Pending)
                                          </span>
                                        )}
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

                  {/* TAB 6: COMPLAINT MANAGEMENT */}
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

                  {/* TAB 7: ANALYTICS & REPORTS */}
                  {activeTab === 'analytics' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                        <div>
                          <h2 className="text-xl font-bold text-slate-900">Institutional Analytics & SLA Metrics</h2>
                          <p className="text-xs text-slate-500">
                            Grievance resolution tracking, department efficiency, and student participation rates.
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
                        <h3 className="text-sm font-bold text-slate-900">Departmental Grievance Resolution</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                              <tr>
                                <th className="px-4 py-3">Department</th>
                                <th className="px-4 py-3">Total Complaints</th>
                                <th className="px-4 py-3">Resolved</th>
                                <th className="px-4 py-3">Resolution Rate</th>
                                <th className="px-4 py-3 text-right">Status Band</th>
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

                  {/* TAB 8: ANNOUNCEMENTS */}
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

                  {/* TAB 9: DEPARTMENTS */}
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
                </>
              )}
            </main>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
