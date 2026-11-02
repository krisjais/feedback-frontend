'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import api from '@/lib/api';
import { Shield, Lock, Mail, User, Building2, GraduationCap, Phone, ArrowRight, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [academicYear, setAcademicYear] = useState('1st Year');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    api
      .get('/departments')
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.departments)) {
          // Strictly show IT, MJ, and B-voc in the department dropdown in requested order
          const targetOrder = ['IT', 'MJ', 'B-voc'];
          const matched = [];

          targetOrder.forEach((targetName) => {
            const found = res.data.departments.find(
              (d) =>
                d.name?.toLowerCase() === targetName.toLowerCase() ||
                d.code?.toLowerCase() === targetName.toLowerCase() ||
                (targetName === 'B-voc' &&
                  (d.code?.toLowerCase() === 'bvoc' ||
                    d.name?.toLowerCase().replace(/[\s.-]/g, '') === 'bvoc'))
            );
            if (found) {
              matched.push({
                ...found,
                displayName: targetName,
              });
            }
          });

          if (matched.length > 0) {
            setDepartments(matched);
            setDepartmentId(matched[0]._id);
          } else {
            setDepartments(res.data.departments || []);
            if (res.data.departments?.length > 0) {
              setDepartmentId(res.data.departments[0]._id);
            }
          }
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Determine if selected department is B-voc
  const selectedDept = departments.find((d) => d._id === departmentId);
  const isBVoc = Boolean(
    selectedDept &&
      (selectedDept.name?.toLowerCase().includes('b-voc') ||
        selectedDept.displayName?.toLowerCase().includes('b-voc') ||
        selectedDept.code?.toLowerCase().includes('bvoc'))
  );

  // In B-voc show 1st Year, 2nd Year, 3rd Year only ("thats it")
  const academicYearOptions = isBVoc
    ? ['1st Year', '2nd Year', '3rd Year']
    : ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'];

  // Handle department change & enforce B-voc year constraint
  const handleDepartmentChange = (newDeptId) => {
    setDepartmentId(newDeptId);
    const chosenDept = departments.find((d) => d._id === newDeptId);
    const chosenIsBVoc = Boolean(
      chosenDept &&
        (chosenDept.name?.toLowerCase().includes('b-voc') ||
          chosenDept.displayName?.toLowerCase().includes('b-voc') ||
          chosenDept.code?.toLowerCase().includes('bvoc'))
    );
    if (chosenIsBVoc && !['1st Year', '2nd Year', '3rd Year'].includes(academicYear)) {
      setAcademicYear('1st Year');
    }
  };

  // Automatically reset academicYear if currently selected year is not valid for B-voc
  useEffect(() => {
    if (isBVoc && !['1st Year', '2nd Year', '3rd Year'].includes(academicYear)) {
      setAcademicYear('1st Year');
    }
  }, [isBVoc, academicYear]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }

    try {
      setLoading(true);
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        studentId: studentId.trim(),
        department: departmentId,
        academicYear,
        phone: phone.trim(),
      });
      router.push('/student');
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Student Portal Registration
        </h1>
        <p className="text-xs text-slate-500">
          Register with your college enrollment credentials to access feedback forms and lodge grievances.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="student@campusvoice.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Student Roll / ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="STU-2026-001"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Academic Year
                </label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  {academicYearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={departmentId}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.displayName || dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                placeholder="+91-98765-43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-type password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all disabled:opacity-50 flex items-center justify-center space-x-1.5"
            >
              <span>{loading ? 'Creating Student Profile...' : 'Complete Registration'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-blue-600 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
