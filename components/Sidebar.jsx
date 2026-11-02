'use client';

import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  FileSpreadsheet,
  MessageSquareWarning,
  BarChart3,
  Users2,
  Building2,
  Megaphone,
  History,
  Sliders,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';

export default function Sidebar({ activeTab, setActiveTab, counts = {}, visiblePanels = null, role = null }) {
  const { user } = useAuth();
  const currentRole = role || user?.role;
  const isSuperAdmin = currentRole === 'super_admin' || currentRole === 'superadmin';
  const isHR = currentRole === 'hr_officer' || currentRole === 'hr';

  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'form-builder', label: 'Form Builder', icon: PlusCircle, badge: 'New' },
    { id: 'all-forms', label: 'All Feedback Forms', icon: FileSpreadsheet, count: counts.forms },
    { id: 'responses', label: 'Feedback Responses', icon: CheckCircle2, count: counts.responses },
    { id: 'participation', label: 'Student Participation', icon: GraduationCap },
    {
      id: 'complaints',
      label: 'Complaint Management',
      icon: MessageSquareWarning,
      count: counts.openComplaints,
      countColor: 'bg-amber-100 text-amber-700',
    },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'users', label: 'User Directory', icon: Users2 },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'audit-logs', label: 'Activity Logs', icon: History },
    { id: 'settings', label: 'Portal Settings', icon: Sliders },
  ];

  // Default allowed panels for HR when not explicitly configured
  const defaultHRPanels = [
    'dashboard',
    'form-builder',
    'all-forms',
    'responses',
    'participation',
    'complaints',
    'analytics',
    'announcements',
    'departments',
  ];

  let filteredItems = allMenuItems;

  if (isHR) {
    const allowed = Array.isArray(visiblePanels) && visiblePanels.length > 0 ? visiblePanels : defaultHRPanels;
    // HR is NEVER allowed to access Activity Logs, Users, or Portal Settings
    filteredItems = allMenuItems.filter(
      (item) => item.id !== 'audit-logs' && item.id !== 'users' && item.id !== 'settings' && allowed.includes(item.id)
    );
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-200 md:sticky md:top-16 h-auto md:h-[calc(100vh-4rem)] md:self-start overflow-y-auto flex flex-col justify-between p-3 shrink-0 z-30">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {isSuperAdmin ? 'Super Admin Portal' : 'HR Administration'}
        </div>
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    item.countColor || 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.count}
                </span>
              )}
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 mt-6 text-center">
        <p className="text-[11px] font-semibold text-slate-700">CampusVoice Core v2.4</p>
        <p className="text-[10px] text-slate-400 mt-0.5">Automated SLA Monitoring Active</p>
      </div>
    </aside>
  );
}
