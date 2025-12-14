'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AuthShell from '../components/AuthShell';

export default function UnlockPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');

  useEffect(() => {
    const isAuthed = localStorage.getItem('auth') === 'true';
    if (!isAuthed) router.replace('/login');
  }, [router]);

  const handleUnlock = () => {
    if (password.length < 4) return;

    // UNLOCK = acces la date
    sessionStorage.setItem('unlocked', 'true');
    router.replace('/');
  };

  return (
    <AuthShell
      title="Unlock Vault"
      subtitle="Only you control the key. Nothing is sent to servers."
    >
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Vault password"
        style={{
          width: '100%',
          padding: 12,
          borderRadius: 14,
          background: '#0f1424',
          border: '1px solid rgba(255,255,255,0.18)',
          color: 'white',
        }}
      />

      <div style={{ height: 14 }} />

      <button
        onClick={handleUnlock}
        style={{
          width: '100%',
          padding: 12,
          borderRadius: 14,
          background: 'rgba(15,44,69,0.3)',
          border: '1px solid rgba(79,124,255,0.35)',
          color: '#e3ebff',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        Unlock
      </button>
    </AuthShell>
  );
}
