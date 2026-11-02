'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import api from '@/lib/api';
import {
  Bell,
  CheckCircle,
  AlertCircle,
  FileText,
  MessageSquare,
  LogOut,
  User,
  Shield,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, demoLogin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [roleSwitching, setRoleSwitching] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      // Silently catch
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read');
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickSwitch = async (targetRole) => {
    try {
      setRoleSwitching(true);
      const newUser = await demoLogin(targetRole);
      setRoleSwitching(false);
      setShowProfileMenu(false);
      if (newUser.role === 'student') {
        router.push('/student');
      } else {
        router.push('/admin');
      }
    } catch (err) {
      setRoleSwitching(false);
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <Link
              href={
                user?.role === 'student'
                  ? '/student'
                  : user?.role === 'hr_officer' || user?.role === 'hr'
                  ? '/hr/dashboard'
                  : '/admin/dashboard'
              }
              className="flex items-center space-x-2.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  Campus<span className="text-blue-600">Voice</span>
                </span>
                <span className="hidden sm:block text-[11px] font-medium text-slate-500 leading-none">
                  Feedback & Grievance Portal
                </span>
              </div>
            </Link>

            {/* Current Portal Indicator */}
            {user && (
              <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider text-[10px]">
                {user.role === 'student'
                  ? 'Student Portal'
                  : user.role === 'hr_officer' || user.role === 'hr'
                  ? 'HR Admin Desk'
                  : 'Super Admin'}
              </span>
            )}
          </div>

          {/* Nav Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">

            {user ? (
              <>
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowProfileMenu(false);
                    }}
                    className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    aria-label="View notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <div className="font-semibold text-sm text-slate-900">
                          Notifications ({unreadCount} new)
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="py-6 text-center text-sm text-slate-500">
                            No notifications yet.
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif._id}
                              className={`p-3.5 hover:bg-slate-50 transition-colors ${
                                !notif.isRead ? 'bg-blue-50/40' : ''
                              }`}
                            >
                              <div className="flex items-start space-x-2.5">
                                <div className="mt-0.5">
                                  {notif.type === 'complaint' ? (
                                    <AlertCircle className="w-4 h-4 text-amber-500" />
                                  ) : notif.type === 'form' ? (
                                    <FileText className="w-4 h-4 text-blue-500" />
                                  ) : (
                                    <Bell className="w-4 h-4 text-slate-500" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-slate-900 truncate">
                                    {notif.title}
                                  </p>
                                  <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                                    {notif.message}
                                  </p>
                                  <span className="text-[10px] text-slate-400 mt-1 block">
                                    {new Date(notif.createdAt).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Pill & Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowProfileMenu(!showProfileMenu);
                      setShowNotifications(false);
                    }}
                    className="flex items-center space-x-2 p-1.5 sm:px-3 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors border border-transparent hover:border-slate-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-xs font-semibold text-slate-900 leading-tight">
                        {user.name}
                      </div>
                      <div className="text-[10px] text-slate-500 capitalize">
                        {user.role} {user.studentId ? `(${user.studentId})` : ''}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Profile Menu Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-medium text-slate-500">Signed in as</p>
                        <p className="text-xs font-bold text-slate-900 truncate">{user.email}</p>
                        <p className="text-[11px] text-blue-600 font-semibold uppercase mt-0.5">
                          {user.role}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          href={
                            user.role === 'student'
                              ? '/student'
                              : user.role === 'hr_officer' || user.role === 'hr'
                              ? '/hr/dashboard'
                              : '/admin/dashboard'
                          }
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                        >
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>Dashboard Home</span>
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left font-medium"
                        >
                          <LogOut className="w-3.5 h-3.5 text-red-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
