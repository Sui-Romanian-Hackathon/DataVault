'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AuthShell from '../components/AuthShell';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleZkLogin = async () => {
    try {
      setLoading(true);

      // login local (NO Google)
      localStorage.setItem('auth', 'true');

      // IMPORTANT: la login NU setezi unlocked=true
      // doar te asiguri ca trebuie facut unlock
      sessionStorage.removeItem('unlocked');

      router.replace('/unlock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Login">
      <button
        onClick={handleZkLogin}
        disabled={loading}
        style={{
          width: '100%',
          borderRadius: 14,
          padding: '14px 16px',
          cursor: 'pointer',
          fontWeight: 900,
          fontSize: 15,
          border: '1px solid rgba(79,124,255,0.45)',
          background:
            'linear-gradient(135deg, rgba(79,124,255,0.95), rgba(53,91,255,0.95))',
          boxShadow: '0 12px 28px rgba(79,124,255,0.45)',
          color: 'white',
        }}
      >
        {loading ? 'Verifying proof…' : 'Login (ZK-ready)'}
      </button>
    </AuthShell>
  );
}
