'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    
    if (pathname === '/login') return;

    const isAuthed = localStorage.getItem('auth') === 'true';
    const isUnlocked = sessionStorage.getItem('unlocked') === 'true';

    if (!isAuthed) {
      router.replace('/login');
      return;
    }

    if (!isUnlocked) {
      router.replace('/unlock');
      return;
    }
  }, [router, pathname]);
}
