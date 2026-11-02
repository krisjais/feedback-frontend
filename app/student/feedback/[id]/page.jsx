'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import DynamicQuestionRenderer from '@/components/DynamicQuestionRenderer';
import { useAuth } from '@/lib/authContext';
import api from '@/lib/api';
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  Clock,
  Calendar,
  Send,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

import { Suspense } from 'react';

function StudentFeedbackSubmissionContent() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [form, setForm] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [studentSubmission, setStudentSubmission] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successReceipt, setSuccessReceipt] = useState(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'student') {
        router.push('/admin');
      } else {
        loadForm();
      }
    }
  }, [id, user, authLoading]);

  const loadForm = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/forms/${id}`);
      if (res.data.success) {
        setForm(res.data.form);
        setQuestions(res.data.questions || []);
        setStudentSubmission(res.data.studentSubmission);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to load form.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Client-side required check
    for (const q of questions) {
      if (q.isRequired) {
        const ans = answers[q._id];
        if (ans === undefined || ans === null || ans === '' || (Array.isArray(ans) && ans.length === 0)) {
          setErrorMessage(`Please answer the required question: "${q.label}"`);
          return;
        }
      }
    }

    try {
      setSubmitting(true);
      const formattedAnswers = Object.entries(answers).map(([qId, val]) => ({
        questionId: qId,
        value: val,
      }));

      const res = await api.post(`/submissions/forms/${id}/submit`, {
        answers: formattedAnswers,
      });

      if (res.data.success) {
        setSuccessReceipt(res.data.receiptCode);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Error submitting feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-500">Loading feedback form...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-xl mx-auto p-8 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Form Not Found</h2>
          <p className="text-xs text-slate-500">{errorMessage || 'The requested form is unavailable.'}</p>
          <Link
            href="/student"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-blue-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Student Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/student"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Already Submitted View */}
        {studentSubmission && !successReceipt && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-emerald-950 space-y-3">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
              <div>
                <h3 className="text-base font-bold text-emerald-900">
                  Feedback Already Completed
                </h3>
                <p className="text-xs text-emerald-700">
                  You have successfully submitted your response for this evaluation.
                </p>
              </div>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-emerald-200/60 text-xs font-mono">
              Receipt Token: <span className="font-bold text-emerald-800">{studentSubmission.receiptCode}</span>
            </div>
            <div className="text-[11px] text-emerald-700">
              Submitted on: {new Date(studentSubmission.submittedAt).toLocaleString()}
            </div>
          </div>
        )}

        {/* Submission Success Confirmation */}
        {successReceipt && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4 shadow-xs">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-emerald-950">Response Successfully Recorded!</h2>
            <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
              Thank you for providing your feedback. Your participation has been recorded in the portal,
              and your feedback has been securely registered.
            </p>
            <div className="bg-white p-4 rounded-xl border border-emerald-200 inline-block font-mono text-xs">
              <span className="text-slate-500">Submission Receipt: </span>
              <span className="font-bold text-emerald-800">{successReceipt}</span>
            </div>
            <div className="pt-2">
              <Link
                href="/student"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors"
              >
                <span>Return to Dashboard</span>
              </Link>
            </div>
          </div>
        )}

        {/* Form Header Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              {form.category}
            </span>
            {form.isAnonymous ? (
              <span className="inline-flex items-center space-x-1 text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Lock className="w-3.5 h-3.5" />
                <span>Confidential & Anonymous Mode</span>
              </span>
            ) : (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                Identified Response Mode
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{form.title}</h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{form.description}</p>

          <div className="flex flex-wrap gap-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>~{form.estimatedTimeMinutes || 5} min completion time</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Deadline: {new Date(form.endDate).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Privacy Notice Alert */}
          {form.isAnonymous && (
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 leading-relaxed">
              <strong>Campus Privacy Protocol:</strong> This feedback form uses isolated submission
              storage. While HR will receive a confirmation that you fulfilled your submission requirement,
              your answers cannot be linked to your identity.
            </div>
          )}
        </div>

        {/* Dynamic Questions Form */}
        {!studentSubmission && !successReceipt && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={question._id}>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
                    Question {index + 1} of {questions.length}
                  </div>
                  <DynamicQuestionRenderer
                    question={question}
                    value={answers[question._id]}
                    onChange={(val) => handleAnswerChange(question._id, val)}
                  />
                </div>
              ))}
            </div>

            {/* Submission Action Bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Please verify your responses before final submission.
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <span>Recording Response...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

export default function StudentFeedbackSubmissionPage() {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      <Suspense
        fallback={
          <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <StudentFeedbackSubmissionContent />
      </Suspense>
    </ProtectedRoute>
  );
}
