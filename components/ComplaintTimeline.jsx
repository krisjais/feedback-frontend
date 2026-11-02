'use client';

import React from 'react';
import {
  CheckCircle2,
  Clock,
  UserCheck,
  AlertTriangle,
  RotateCcw,
  XCircle,
  FileCheck,
} from 'lucide-react';

export default function ComplaintTimeline({ status, history = [] }) {
  const steps = [
    { key: 'new', label: 'Registered' },
    { key: 'under_review', label: 'Under Review' },
    { key: 'assigned', label: 'Assigned' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'resolved', label: 'Resolved' },
  ];

  const statusOrder = {
    new: 0,
    under_review: 1,
    assigned: 2,
    in_progress: 3,
    resolved: 4,
    closed: 4,
  };

  const currentStepIndex = statusOrder[status] !== undefined ? statusOrder[status] : 1;
  const isRejected = status === 'rejected';
  const isReopened = status === 'reopened';

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
        <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>Grievance Lifecycle Progression</span>
        </h3>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
            status === 'resolved'
              ? 'bg-emerald-100 text-emerald-800'
              : status === 'in_progress'
              ? 'bg-blue-100 text-blue-800'
              : status === 'rejected'
              ? 'bg-rose-100 text-rose-800'
              : status === 'reopened'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-slate-100 text-slate-800'
          }`}
        >
          {status.replace('_', ' ')}
        </span>
      </div>

      {/* Stepper bar */}
      {!isRejected && (
        <div className="relative flex items-center justify-between max-w-2xl mx-auto px-4 mb-8">
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-0" />
          <div
            className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-blue-600 transition-all duration-500 -z-0"
            style={{
              width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
            }}
          />

          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={step.key} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  } ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span
                  className={`text-[11px] font-semibold mt-2 ${
                    isCompleted ? 'text-blue-900' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {isRejected && (
        <div className="p-3 mb-6 bg-rose-50 border border-rose-200 rounded-lg flex items-center space-x-3 text-rose-800 text-xs font-medium">
          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>This complaint was rejected after administrative evaluation.</span>
        </div>
      )}

      {isReopened && (
        <div className="p-3 mb-6 bg-amber-50 border border-amber-200 rounded-lg flex items-center space-x-3 text-amber-800 text-xs font-medium">
          <RotateCcw className="w-5 h-5 text-amber-600 shrink-0" />
          <span>This complaint has been reopened for secondary investigation.</span>
        </div>
      )}

      {/* History log entries */}
      <div className="space-y-3 mt-4 border-t border-slate-100 pt-4">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Timestamped Audit History
        </h4>
        <div className="space-y-2.5">
          {history.length === 0 ? (
            <p className="text-xs text-slate-400">No status transitions logged yet.</p>
          ) : (
            history.map((item, i) => (
              <div
                key={i}
                className="flex items-start justify-between text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-200/60"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-900">{item.changedByName}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-blue-100 text-blue-700 font-semibold uppercase">
                      {item.newStatus}
                    </span>
                  </div>
                  {item.reasonOrNote && (
                    <p className="text-slate-600 mt-1 text-[11px] italic">
                      "{item.reasonOrNote}"
                    </p>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 ml-4">
                  {new Date(item.timestamp).toLocaleString([], {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
