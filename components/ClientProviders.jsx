'use client';

import React from 'react';
import { AuthProvider } from '@/lib/authContext';

// Intercept browser extension attribute injections (Bitdefender, Password Managers, etc.)
if (typeof window !== 'undefined') {
  const origError = console.error;
  console.error = function (...args) {
    const errorStr = args
      .map((a) => (typeof a === 'string' ? a : a?.message || JSON.stringify(a) || ''))
      .join(' ');
    if (
      errorStr.includes('bis_skin_checked') ||
      errorStr.includes('bis_register') ||
      errorStr.includes('__processed_')
    ) {
      return;
    }
    origError.apply(console, args);
  };
}

export default function ClientProviders({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
