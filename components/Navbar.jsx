'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications');
      if (res.data?.success) {
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

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'student':
        return { label: 'Student Portal', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'hr_officer':
      case 'hr':
        return { label: 'HR Officer', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'super_admin':
      case 'superadmin':
        return { label: 'Super Admin', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      default:
        return { label: 'Portal User', bg: 'bg-gray-50 text-gray-700 border-gray-200' };
    }
  };

  const roleInfo = getRoleBadge(user?.role);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/90 shadow-2xs">
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
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
                <Shield className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-gray-900 group-hover:text-indigo-600 transition-colors leading-none">
                  Campus<span className="text-indigo-600">Voice</span>
                </span>
                <span className="hidden sm:block text-[10px] font-medium text-gray-500 tracking-wide mt-0.5">
                  Institutional SaaS
                </span>
              </div>
            </Link>

            {/* Current Portal Indicator */}
            {user && (
              <span
                className={`hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${roleInfo.bg}`}
              >
                {roleInfo.label}
              </span>
            )}
          </div>

          {/* Right Action Controls */}
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
                    className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    aria-label="View notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
                        <div className="font-semibold text-xs text-gray-900">
                          Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-[11px] text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center text-xs text-gray-400">
                            No notifications yet.
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif._id}
                              className={`p-3 hover:bg-gray-50 transition-colors ${
                                !notif.isRead ? 'bg-indigo-50/30' : ''
                              }`}
                            >
                              <div className="flex items-start space-x-2.5">
                                <div className="mt-0.5">
                                  {notif.type === 'complaint' ? (
                                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                                  ) : notif.type === 'form' ? (
                                    <FileText className="w-3.5 h-3.5 text-indigo-500" />
                                  ) : (
                                    <Bell className="w-3.5 h-3.5 text-gray-400" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-gray-900 truncate">
                                    {notif.title}
                                  </p>
                                  <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                                    {notif.message}
                                  </p>
                                  <span className="text-[10px] text-gray-400 mt-1 block">
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
                    className="flex items-center space-x-2 p-1 sm:px-2.5 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors border border-transparent hover:border-gray-200"
                  >
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-xs font-semibold text-gray-900 leading-tight">
                        {user.name}
                      </div>
                      <div className="text-[10px] text-gray-500 capitalize">
                        {user.role?.replace('_', ' ')}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  {/* Profile Menu Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-4 py-2.5 border-b border-gray-100">
                        <p className="text-[10px] uppercase font-bold text-gray-400">Signed in as</p>
                        <p className="text-xs font-bold text-gray-900 truncate mt-0.5">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full uppercase">
                          {user.role}
                        </span>
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
                          className="flex items-center space-x-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 font-medium"
                        >
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          <span>Dashboard Overview</span>
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 text-left font-medium transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5 text-rose-500" />
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
                  className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
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
