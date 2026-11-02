'use client';

import React, { useState } from 'react';
import { Send, Lock, User, ShieldAlert, Paperclip, Check } from 'lucide-react';
import api from '@/lib/api';

export default function ComplaintChat({
  complaintId,
  messages = [],
  onMessageSent,
  currentUserRole,
}) {
  const [newMessage, setNewMessage] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const isHrOrAdmin =
    currentUserRole === 'hr_officer' ||
    currentUserRole === 'hr' ||
    currentUserRole === 'super_admin' ||
    currentUserRole === 'superadmin';

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      setError('');
      const res = await api.post(`/complaints/${complaintId}/messages`, {
        message: newMessage.trim(),
        isInternalNote: isHrOrAdmin ? isInternalNote : false,
      });

      if (res.data.success) {
        setNewMessage('');
        setIsInternalNote(false);
        if (onMessageSent) onMessageSent(res.data.comment);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col h-full max-h-[600px]">
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">
          Resolution Dialogue & Updates
        </h3>
        {isHrOrAdmin && (
          <span className="text-[11px] text-slate-500 font-medium">
            Internal note toggle available
          </span>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No dialogue or investigation notes recorded yet.
          </div>
        ) : (
          messages.map((msg, i) => {
            const isInternal = msg.isInternalNote;
            const isHr =
              msg.senderRole === 'hr_officer' ||
              msg.senderRole === 'hr' ||
              msg.senderRole === 'super_admin' ||
              msg.senderRole === 'superadmin';

            return (
              <div
                key={msg._id || i}
                className={`p-3.5 rounded-xl text-xs max-w-xl transition-all ${
                  isInternal
                    ? 'bg-amber-50 border border-amber-200 text-amber-950 ml-auto'
                    : isHr
                    ? 'bg-blue-50 border border-blue-200 text-blue-950 ml-auto'
                    : 'bg-white border border-slate-200 text-slate-800 mr-auto'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-black/5">
                  <div className="flex items-center space-x-1.5">
                    {isInternal ? (
                      <Lock className="w-3.5 h-3.5 text-amber-700" />
                    ) : isHr ? (
                      <ShieldAlert className="w-3.5 h-3.5 text-blue-700" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    <span className="font-bold text-[11px]">
                      {msg.senderName}
                    </span>
                    {isInternal && (
                      <span className="px-1.5 py-0.2 bg-amber-200/80 text-amber-900 rounded-sm font-bold text-[9px] uppercase tracking-wider">
                        Private HR Note
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(msg.createdAt).toLocaleString([], {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>

                <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
              </div>
            );
          })
        )}
      </div>

      {/* Input Composer */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 space-y-2">
        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

        {isHrOrAdmin && (
          <label className="flex items-center space-x-2 text-xs text-amber-800 font-semibold cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isInternalNote}
              onChange={(e) => setIsInternalNote(e.target.checked)}
              className="w-3.5 h-3.5 text-amber-600 rounded border-amber-300 focus:ring-amber-500"
            />
            <span className="flex items-center space-x-1">
              <Lock className="w-3 h-3 text-amber-600" />
              <span>Make this a private internal HR note (never shown to student)</span>
            </span>
          </label>
        )}

        <div className="flex items-center space-x-2">
          <textarea
            rows={2}
            placeholder={
              isInternalNote
                ? 'Type confidential internal note for HR team...'
                : 'Type message or request clarification...'
            }
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className={`flex-1 px-3 py-2 text-xs rounded-lg border focus:outline-hidden transition-all ${
              isInternalNote
                ? 'bg-amber-50/50 border-amber-300 focus:ring-2 focus:ring-amber-500/20'
                : 'bg-white border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
            }`}
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className={`p-2.5 rounded-lg text-white font-semibold transition-all shrink-0 ${
              isInternalNote
                ? 'bg-amber-600 hover:bg-amber-700 shadow-2xs'
                : 'bg-blue-600 hover:bg-blue-700 shadow-2xs'
            } disabled:opacity-50`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
