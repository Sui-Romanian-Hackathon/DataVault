'use client';

import React from 'react';

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        backgroundColor: '#0b0f1a',
        backgroundImage:
          'radial-gradient(700px 350px at 10% 10%, rgba(79,124,255,0.16), transparent 60%), radial-gradient(600px 350px at 90% 20%, rgba(15,44,69,0.30), transparent 60%)',
        color: 'white',
        fontFamily:
          'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: 520,
          borderRadius: 18,
          border: '1px solid rgba(79,124,255,0.25)',
          background:
            'linear-gradient(180deg, rgba(15,44,69,0.55), rgba(15,44,69,0.15))',
          boxShadow:
            'inset 0 0 0 1px rgba(255,255,255,0.05), 0 20px 60px rgba(0,0,0,0.45)',
          padding: 18,
        }}
      >
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div
            style={{
              padding: 10,
              borderRadius: 14,
              border: '1px solid rgba(79,124,255,0.35)',
              background:
                'linear-gradient(180deg, rgba(15,44,69,0.6), rgba(15,44,69,0.2))',
            }}
          >
            <img
              src="/datavault.png"
              alt="Data Vault"
              style={{ height: 48, width: 'auto' }}
            />
          </div>

          <div>
            <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: 0.4 }}>
              {title}
            </div>
            {subtitle ? (
              <div style={{ marginTop: 4, color: '#aeb4dd', fontSize: 13 }}>
                {subtitle}
              </div>
            ) : null}
          </div>
        </div>

        <div style={{ height: 14 }} />

        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            margin: '10px 0 14px 0',
          }}
        />

        {children}
        <div style={{ marginTop: 14, fontSize: 12, color: '#aeb4dd' }}>
          GDPR-first • Zero-tracking • User-owned keys
        </div>
      </section>
    </main>
  );
}