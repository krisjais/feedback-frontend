'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  ShieldAlert,
  FolderCheck,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';

export default function Sidebar({
  activeTab,
  setActiveTab,
  counts = {},
  visiblePanels = null,
  role = null,
  onCollapseChange = null,
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const currentRole = role || user?.role;
  const isSuperAdmin = currentRole === 'super_admin' || currentRole === 'superadmin';
  const isHR = currentRole === 'hr_officer' || currentRole === 'hr';
  const isStudent = currentRole === 'student';

  const toggleCollapse = () => {
    const nextState = !collapsed;
    setCollapsed(nextState);
    if (onCollapseChange) onCollapseChange(nextState);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Student Navigation Items
  const studentMenuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'forms', label: 'Feedback Forms', icon: FileSpreadsheet, count: counts.forms },
    { id: 'submissions', label: 'My Submissions', icon: FolderCheck, count: counts.submissions },
    {
      id: 'complaints',
      label: 'My Grievances',
      icon: MessageSquareWarning,
      count: counts.openComplaints,
      countColor: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    },
    { id: 'announcements', label: 'Announcements', icon: Megaphone, count: counts.announcements },
    { id: 'profile', label: 'Profile & Settings', icon: Sliders },
  ];

  // HR Navigation Items
  const hrMenuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'all-forms', label: 'Feedback Forms', icon: FileSpreadsheet, count: counts.forms },
    { id: 'form-builder', label: 'Form Builder', icon: PlusCircle, badge: 'New' },
    { id: 'responses', label: 'Feedback Responses', icon: CheckCircle2, count: counts.responses },
    { id: 'participation', label: 'Student Participation', icon: GraduationCap },
    {
      id: 'complaints',
      label: 'Grievance Management',
      icon: MessageSquareWarning,
      count: counts.openComplaints,
      countColor: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'departments', label: 'Department Insights', icon: Building2 },
  ];

  // Super Admin Navigation Items
  const superAdminMenuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'HR & User Management', icon: Users2, count: counts.users },
    { id: 'departments', label: 'Department Management', icon: Building2 },
    { id: 'all-forms', label: 'Institutional Forms', icon: FileSpreadsheet },
    { id: 'responses', label: 'Feedback Responses', icon: CheckCircle2 },
    { id: 'participation', label: 'Cohort Participation', icon: GraduationCap },
    { id: 'complaints', label: 'Grievance Desk', icon: MessageSquareWarning },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'settings', label: 'System & HR Settings', icon: Sliders },
    { id: 'audit-logs', label: 'Security Audit Logs', icon: History },
  ];

  let displayItems = [];
  if (isStudent) {
    displayItems = studentMenuItems;
  } else if (isHR) {
    const allowed = Array.isArray(visiblePanels) && visiblePanels.length > 0
      ? visiblePanels
      : ['dashboard', 'all-forms', 'form-builder', 'responses', 'participation', 'complaints', 'analytics', 'announcements', 'departments'];
    displayItems = hrMenuItems.filter(
      (item) => item.id !== 'audit-logs' && item.id !== 'users' && item.id !== 'settings' && allowed.includes(item.id)
    );
  } else {
    displayItems = superAdminMenuItems;
  }

  const roleTitle = isStudent ? 'Student Workspace' : isHR ? 'HR Administration' : 'Super Admin Console';

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-white border-r border-gray-200/90 sticky top-16 h-[calc(100vh-4rem)] self-start shrink-0 z-30 overflow-y-auto flex flex-col justify-between p-3 transition-all duration-300 ease-in-out`}
    >
      <div className="space-y-4">
        {/* Sidebar Header & Collapse Toggle */}
        <div className="flex items-center justify-between px-2 py-1.5 border-b border-gray-100">
          {!collapsed && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 truncate">
              {roleTitle}
            </span>
          )}
          <button
            onClick={toggleCollapse}
            className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors ml-auto"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {displayItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center ${
                    collapsed ? 'justify-center px-2' : 'justify-between px-3'
                  } py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'
                      }`}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!collapsed && (
                    <div className="flex items-center space-x-1">
                      {item.count !== undefined && item.count > 0 && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            item.countColor || 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                      {item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-700">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>

                {/* Floating tooltip when collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2.5 py-1 bg-gray-900 text-white text-[11px] font-medium rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-md">
                    {item.label}
                    {item.count !== undefined && item.count > 0 && ` (${item.count})`}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Profile Section & Logout */}
      <div className="pt-4 mt-6 border-t border-gray-100 space-y-2">
        <div
          className={`flex items-center ${
            collapsed ? 'justify-center' : 'justify-between'
          } p-2 rounded-xl bg-gray-50/70 border border-gray-100`}
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate leading-tight">
                  {user?.name || 'Authorized User'}
                </p>
                <p className="text-[10px] text-gray-500 truncate capitalize">
                  {user?.role?.replace('_', ' ')}
                </p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
