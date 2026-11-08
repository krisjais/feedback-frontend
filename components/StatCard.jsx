'use client';

import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  subtext,
  icon: Icon,
  color = 'indigo',
  trend,
  className = '',
}) {
  const displaySub = subtitle || subtext;

  const colorMap = {
    indigo: {
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100/80',
      badge: 'text-indigo-700 bg-indigo-50',
    },
    blue: {
      iconBg: 'bg-blue-50 text-blue-600 border-blue-100/80',
      badge: 'text-blue-700 bg-blue-50',
    },
    violet: {
      iconBg: 'bg-purple-50 text-purple-600 border-purple-100/80',
      badge: 'text-purple-700 bg-purple-50',
    },
    purple: {
      iconBg: 'bg-purple-50 text-purple-600 border-purple-100/80',
      badge: 'text-purple-700 bg-purple-50',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100/80',
      badge: 'text-emerald-700 bg-emerald-50',
    },
    green: {
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100/80',
      badge: 'text-emerald-700 bg-emerald-50',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100/80',
      badge: 'text-amber-700 bg-amber-50',
    },
    rose: {
      iconBg: 'bg-rose-50 text-rose-600 border-rose-100/80',
      badge: 'text-rose-700 bg-rose-50',
    },
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div
      className={`bg-white rounded-xl p-5 border border-gray-200/90 shadow-xs hover:border-gray-300 hover:shadow-sm transition-all duration-200 ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center border ${scheme.iconBg} shrink-0`}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline space-x-2">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
          {value !== undefined && value !== null ? value : 0}
        </span>
        {trend && (
          <span className="text-xs font-semibold text-emerald-600 inline-flex items-center">
            {trend}
          </span>
        )}
      </div>

      {displaySub && (
        <p className="text-[12px] text-gray-500 mt-1.5 font-normal truncate">
          {displaySub}
        </p>
      )}
    </div>
  );
}
