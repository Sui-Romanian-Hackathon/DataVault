'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRequireAuth } from '../lib/useRequireAuth';
import { loadVault } from '../lib/api';


type TabKey = 'overview' | 'attributes' | 'privacy'|'about'| 'settings';
type Skill = {
  name: string;
  isPublic: boolean;
  isVerified: boolean;
};
type Certification={
  name:string;
  issuer?:string;
  isPublic: boolean;
  isVerified:boolean;
};

export default function Home() {
useRequireAuth();
const [tab, setTab] = useState<TabKey>('overview');
const [skills, setSkills] = useState<Skill[]>([
  { name: 'Frontend Development', isPublic: true, isVerified: true },
  { name: 'Smart Contracts', isPublic: false, isVerified: false },
  { name: 'UI/UX', isPublic: true, isVerified: false },
]);
const[certifications,setCertifications]=useState<Certification[]>([
  {
    name:'GDPR Awareness',
    issuer:'Eu Data Protection Board',
    isPublic:true,
    isVerified:true,
  },
  {
    name:'Cybersecurity Basics',
    issuer:'OWASP',
    isPublic:false,
    isVerified:false,
  },
  
]);
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  async function run() {
    try {
      const privateKey =
        'PASTE_TESTNET_PRIVATE_KEY_HERE';

      const vault = await loadVault(privateKey);
      console.log('Loaded from testnet:', vault);
      setClient(vault);
    } catch (e) {
      console.error('Failed to load vault', e);
    } finally {
      setLoading(false);
    }
  }

  run();
}, []);
//const [isSubscribed,setIsSubscribed]=useState(false);

  // Mock identity
  const identity = useMemo(
    () => ({
      status: 'Active',
      did: 'sui:idv:0x82...f884',
      lastUpdated: 'Just now',
      riskPosture: 'Zero-Tracking Mode',
      ageVerified: true,
      skills,
      certifications,
      //certifications: ['GDPR Awareness', 'Cybersecurity Basics'],
      privacy: {
        shareAgeProof: true,
        shareSkills: false,
        shareCerts: true,
        revocableLinks: true,
        dataMinimization: true,
      },
    }),
    [skills,certifications],
  );
 if (loading) {
  return (
    <main style={styles.page}>
      <div style={{ color: 'white', padding: 40 }}>
        Loading vault from Sui testnet…
      </div>
    </main>
  );
}
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <Header setTab={setTab}/>
        <div style={styles.shell}>
          <TopBar tab={tab} setTab={setTab} />

          <div style={styles.content}>
            {tab === 'overview' && <OverviewTab identity={identity} />}
            {tab === 'attributes' && <AttributesTab identity={identity} setSkills={setSkills} setCertifications={setCertifications}/>}
            {tab === 'privacy' && <PrivacyTab identity={identity} />}
            {tab ==='settings'&&<SettingsTab/>}
            {tab === 'about' && <AboutTab />}
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
/* ----- UI Components ---- */
function Header({setTab}:{setTab:(t:TabKey)=>void}) {
  return (
    <div style={styles.header}>
      <div>
        <div style={styles.brandRow}>
          {/*LOGO CONTAINER*/}
          <div
          style={{
            padding: 14,
            borderRadius: 16,
            border: '1px solid rgba(79,124,255,0.35)',
            background:
              'linear-gradient(180deg, rgba(15,44,69,0.6), rgba(15,44,69,0.2))',
            boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
          }}>
            <img
            src="/datavault.png"
            alt="Data Vault"
            style={{ height: 80, width: 'auto' }}
          />
          </div>
          <div>
            <div style={styles.brandTitle}>Data Vault</div>
            <div style={styles.brandSubtitle}>Prove attributes, not identity.</div>
          </div>
        </div>
      </div>

      <div style={styles.headerRight}>
        <span style={styles.pill}>GDPR-ready</span>
        <span style={styles.pill}>ZK-ready</span>
        <button style={styles.ghostBtn} onClick={() => setTab('settings')}>
          Settings
        </button>
      </div>
    </div>
  );
}

function TopBar({
  tab, setTab, }:
  {
    tab: TabKey;
    setTab:(t:TabKey)=> void;
    //isSubscribed: boolean;
    //setIsSubscribed: React.Dispatch<React.SetStateAction<boolean>>;
  }){
  return (
    <div style={styles.topBar}>
      <nav style={styles.tabs}>
        <TabButton active={tab === 'overview'} onClick={() => setTab('overview')}>
          Overview
        </TabButton>
        <TabButton active={tab === 'attributes'} onClick={() => setTab('attributes')}>
          Attributes
        </TabButton>
        <TabButton active={tab === 'privacy'} onClick={() => setTab('privacy')}>
          Privacy
        </TabButton>
      </nav>

      <div style={styles.actions}>
        <button style={styles.primaryBtn} onClick={() => alert('Manage subscription (mock)')} >
          Manage Subscription
        </button>
        <button style={styles.secondaryBtn} onClick={() => alert('Share Proof Link (mock)')}>
          Share Proof
        </button>
        <TabButton active={tab==='about'} onClick={()=>setTab('about')}>
          About Us
        </TabButton>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.tabBtn,
        ...(active ? styles.tabBtnActive : {}),
      }}
    >
      {children}
    </button>
  );
}

function OverviewTab({
  identity,
}: {
  identity: {
    status: string;
    did: string;
    lastUpdated: string;
    riskPosture: string;
    ageVerified: boolean;
    skills: Skill[];
    certifications: Certification[];
    privacy: Record<string, boolean>;
  };
}) {
  return (
    <div style={styles.grid2}>
      <Card title="Identity Status" subtitle="Your vault is an on-chain object (demo mock).">
        <div style={styles.rowBetween}>
          <div>
            <div style={styles.kpiLabel}>Status</div>
            <div style={styles.kpiValue}>
              <StatusDot ok /> {identity.status}
            </div>
          </div>
          <div style={styles.kpiRight}>
            <div style={styles.kpiLabel}>Last updated</div>
            <div style={styles.kpiValueSmall}>{identity.lastUpdated}</div>
          </div>
        </div>

        <div style={styles.divider} />

        <div style={styles.kvList}>
          <KV label="Vault DID" value={identity.did} mono />
          <KV label="Mode" value={identity.riskPosture} />
          <KV
            label="Age proof"
            value={identity.ageVerified ? 'Verified: 18+' : 'Not verified'}
            badge={identity.ageVerified ? 'Verified' : 'Pending'}
          />
        </div>
      </Card>

      <Card title="Quick Actions" subtitle="Show the product value in 10 seconds.">
        <div style={styles.quickGrid}>
          <QuickAction
            title="Verify Age (ZK)"
            desc="Prove 18+ without revealing DOB."
            onClick={() => alert('Age verification (mock)')}
          />
          <QuickAction
            title="Add Skill"
            desc="User-controlled, granular claims."
            onClick={() => alert('Add skill (mock)')}
          />
          <QuickAction
            title="Add Certification"
            desc="Attach attestations & evidence."
            onClick={() => alert('Add certification (mock)')}
          />
          <QuickAction
            title="Revoke Access"
            desc="GDPR-friendly revocation."
            onClick={() => alert('Revoke (mock)')}
          />
        </div>
      </Card>
    </div>
  );
}

function AttributesTab({
  identity,
  setSkills,
  setCertifications,
}: {
  identity: {
    ageVerified: boolean;
    skills: Skill[];
    certifications: Certification[];
  };
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
  setCertifications: React.Dispatch<React.SetStateAction<Certification[]>>;
}) {
  return (
    <div style={styles.grid2}>
      <Card title="Age Verification" subtitle="Prove 18+ with zero-knowledge (mock).">
        <div style={styles.rowBetween}>
          <div style={styles.kpiValue}>
            {identity.ageVerified ? (
              <>
                <StatusDot ok /> Verified: 18+
              </>
            ) : (
              <>
                <StatusDot /> Not verified
              </>
            )}
          </div>
          <button
            style={identity.ageVerified ? styles.secondaryBtn : styles.primaryBtn}
            onClick={() => alert('Age verification flow (mock)')}
          >
            {identity.ageVerified ? 'Re-verify' : 'Verify now'}
          </button>
        </div>

        <div style={styles.divider} />

        <div style={styles.miniNote}>
          <b>GDPR:</b> You never store DOB; you store only a proof that “age ≥ 18”.
        </div>
      </Card>

      <Card title="Skills" subtitle="User-controlled attributes (mock).">
  <div style={{ display: 'grid', gap: 10 }}>
    {identity.skills.map((skill) => (
      <div
        key={skill.name}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 12px',
          backgroundColor: '#0f1424',
          borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <span>{skill.name}</span>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
          onClick={()=>
            setSkills((prev)=>
            prev.map((s)=>
            s.name===skill.name?{...s, isPublic: !s.isPublic}:s
        )
      )
    }
    style={{...(skill.isPublic?styles.badge:styles.privateBadge),
      cursor:'pointer',border:'none',background:'transparent',
    }}>
      {skill.isPublic?'Public':'Private'}
    </button>

          <button
             onClick={()=>
              setSkills((prev)=>
                prev.map((s)=>
                s.name===skill.name?{...s,isVerified: !s.isVerified}:s))
             }
             style={{...(skill.isVerified?styles.verifiedBadge:styles.unverifiedBadge),
              cursor:'pointer',
              border:'none',
              background:'transparent',
             }}>
              {skill.isVerified?'Verified':'Unverified'}
             </button>
        </div>
      </div>
    ))}
  </div>

  <div style={{ height: 14 }} />

  <AddSkillForm
  onAdd={(name) =>
    setSkills((prev) => [
      ...prev,
      { name, isPublic: false, isVerified: false },
    ])
  }
/>
</Card>
  <Card title="Certifications" subtitle="Attested capabilities (mock).">
  <div style={{ display: 'grid', gap: 10 }}>
    {identity.certifications.map((cert) => (
      <div
        key={cert.name}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 12px',
          backgroundColor: '#0f1424',
          borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div>
          <div style={{ fontWeight: 600 }}>{cert.name}</div>
          {cert.issuer && (
            <div style={{ fontSize: 12, color: '#aeb4dd' }}>
              Issuer: {cert.issuer}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {/* Public / Private */}
          <button
            onClick={() =>
              setCertifications((prev) =>
                prev.map((c) =>
                  c.name === cert.name
                    ? { ...c, isPublic: !c.isPublic }
                    : c
                )
              )
            }
            style={{
              ...(cert.isPublic ? styles.badge : styles.privateBadge),
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            {cert.isPublic ? 'Public' : 'Private'}
          </button>

          {/* Verified / Unverified */}
          <button
            onClick={() =>
              setCertifications((prev) =>
                prev.map((c) =>
                  c.name === cert.name
                    ? { ...c, isVerified: !c.isVerified }
                    : c
                )
              )
            }
            style={{
              ...(cert.isVerified
                ? styles.verifiedBadge
                : styles.unverifiedBadge),
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            {cert.isVerified ? 'Verified' : 'Unverified'}
          </button>
        </div>
      </div>
    ))}
  </div>

  <div style={{ height: 14 }} />

  <AddCertificationForm onAdd={(name) =>
    setCertifications((prev) => [
      ...prev,
      { name, isPublic: false, isVerified: false },
    ])
  } />
</Card>      
    </div>
  );
}
function SettingsTab() {
  return (
    <div style={styles.grid2}>
      <Card
        title="Account settings"
        subtitle="Security & lifecycle controls (mock)"
      >
        <div style={styles.miniNote}>
          These actions affect your identity vault and access permissions.
        </div>

        <div style={{ height: 16 }} />

        <button
          style={{
            ...styles.secondaryBtn,
            borderColor: 'rgba(255, 80, 80, 0.6)',
            color: '#ffb3b3',
          }}
          onClick={() => alert('Delete account (mock)')}
        >
          Delete account
        </button>

        <div style={{ height: 12 }} />

        <div style={{ fontSize: 12, color: '#aeb4dd' }}>
          This action is irreversible. In a real implementation, this would
          revoke access, destroy keys, and mark the on-chain object as deleted.
        </div>
      </Card>
    </div>
  );
}
function AboutTab() {
  return (
    <div style={styles.grid2}>
      <Card
        title="What’s stored"
        subtitle="Minimal data, maximum verifiability."
      >
        <ul style={styles.bullets}>
          <li>
            <b>On-chain:</b> attribute commitments + permissions (Sui objects)
          </li>
          <li>
            <b>Off-chain:</b> optional encrypted evidence, user-controlled
          </li>
          <li>
            <b>Shared:</b> only ZK proofs + scoped access links
          </li>
        </ul>
      </Card>

      <Card
        title="Why this beats Big Tech"
        subtitle="Privacy by design — not by policy."
      >
        <ul style={styles.bullets}>
          <li>No central account → no tracking graph</li>
          <li>Selective disclosure → GDPR data minimization</li>
          <li>User-owned identity → portability + revocation</li>
          <li>No ads, no profiling, no shadow data</li>
        </ul>
      </Card>
    </div>
  );
}
function AddSkillForm({ onAdd }: { onAdd: (name: string) => void }) {
  const [value, setValue] = useState('');

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="New skill"
        style={{
          flex: 1,
          padding: '10px 12px',
          borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.18)',
          backgroundColor: '#0f1424',
          color: 'white',
        }}
      />

      <button
        style={styles.primaryBtn}
        onClick={() => {
          if (!value.trim()) return;
          onAdd(value.trim());
          setValue('');
        }}
      >
        Add
      </button>
    </div>
  );
}
function AddCertificationForm({
  onAdd,
}: {
  onAdd: (name: string) => void;
}) {
  const [value, setValue] = useState('');

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="New certification"
        style={{
          flex: 1,
          padding: '10px 12px',
          borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.18)',
          backgroundColor: '#0f1424',
          color: 'white',
        }}
      />

      <button
        style={styles.primaryBtn}
        onClick={() => {
          if (!value.trim()) return;
          onAdd(value.trim());
          setValue('');
        }}
      >
        Add
      </button>
    </div>
  );
}
function PrivacyTab({
  identity,
}: {
  identity: {
    privacy: {
      shareAgeProof: boolean;
      shareSkills: boolean;
      shareCerts: boolean;
      revocableLinks: boolean;
      dataMinimization: boolean;
    };
  };
}) {
  const [privacy, setPrivacy] = useState(identity.privacy);

  return (
    <div style={styles.grid2}>
      <Card title="Privacy Controls" subtitle="Default-deny. Explicit opt-in. (mock)">
        <ToggleRow
          label="Allow age verification"
          desc="Share only a ZK proof that you’re over 18."
          checked={privacy.shareAgeProof}
          onChange={() => setPrivacy((p) => ({ ...p, shareAgeProof: !p.shareAgeProof }))}
        />
        <div style={styles.divider} />
        <ToggleRow
          label="Allow skills sharing"
          desc="Let verifiers see selected skills."
          checked={privacy.shareSkills}
          onChange={() => setPrivacy((p) => ({ ...p, shareSkills: !p.shareSkills }))}
        />
        <div style={styles.divider} />
        <ToggleRow
          label="Allow certification sharing"
          desc="Share selected certificates with scoped access."
          checked={privacy.shareCerts}
          onChange={() => setPrivacy((p) => ({ ...p, shareCerts: !p.shareCerts }))}
        />
      </Card>

      <Card title="GDPR & Security" subtitle="Built for compliance and zero trust.">
        <ToggleRow
          label="Revocable links"
          desc="Issue time-bound, revocable proof links."
          checked={privacy.revocableLinks}
          onChange={() => setPrivacy((p) => ({ ...p, revocableLinks: !p.revocableLinks }))}
        />
        <div style={styles.divider} />
        <ToggleRow
          label="Data minimization mode"
          desc="Store only what's needed. Prove the rest."
          checked={privacy.dataMinimization}
          onChange={() => setPrivacy((p) => ({ ...p, dataMinimization: !p.dataMinimization }))}
        />

        <div style={styles.divider} />

        <div style={styles.rowBetween}>
          <button style={styles.secondaryBtn} onClick={() => alert('Export GDPR report (mock)')}>
            Export GDPR report
          </button>
          <button style={styles.primaryBtn} onClick={() => alert('Save privacy settings (mock)')}>
            Save settings
          </button>
        </div>

        <div style={styles.miniNote}>
          <b>Cybersecurity note:</b> Permissions are scoped, auditable, and revocable — reducing blast
          radius.
        </div>
      </Card>
    </div>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <div style={styles.cardTitle}>{title}</div>
          {subtitle ? <div style={styles.cardSubtitle}>{subtitle}</div> : null}
        </div>
      </div>
      <div style={styles.cardBody}>{children}</div>
    </section>
  );
}

function KV({ label, value, mono, badge }: { label: string; value: string; mono?: boolean; badge?: string }) {
  return (
    <div style={styles.kvRow}>
      <div style={styles.kvLabel}>{label}</div>
      <div style={styles.kvValue}>
        {badge ? <span style={styles.badge}>{badge}</span> : null}
        <span style={mono ? styles.mono : undefined}>{value}</span>
      </div>
    </div>
  );
}

function QuickAction({
  title,
  desc,
  onClick,
}: {
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={styles.quickCard}>
      <div style={styles.quickTitle}>{title}</div>
      <div style={styles.quickDesc}>{desc}</div>
    </button>
  );
}

function TagList({ items, emptyText }: { items: string[]; emptyText: string }) {
  if (!items.length) return <div style={styles.miniNote}>{emptyText}</div>;
  return (
    <div style={styles.tags}>
      {items.map((t) => (
        <span key={t} style={styles.tag}>
          {t}
        </span>
      ))}
    </div>
  );
}

function ToggleRow({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div style={styles.toggleRow}>
      <div>
        <div style={styles.toggleLabel}>{label}</div>
        <div style={styles.toggleDesc}>{desc}</div>
      </div>

      <button
        onClick={onChange}
        aria-pressed={checked}
        style={{
          ...styles.toggle,
          ...(checked ? styles.toggleOn : styles.toggleOff),
        }}
      >
        <span
          style={{
            ...styles.toggleKnob,
            transform: checked ? 'translateX(20px)' : 'translateX(0px)',
          }}
        />
      </button>
    </div>
  );
}

function StatusDot({ ok }: { ok?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 10,
        height: 10,
        borderRadius: 999,
        marginRight: 10,
        backgroundColor: ok ? '#2be4a7' : '#ffcc66',
        boxShadow: ok ? '0 0 0 3px rgba(43,228,167,0.15)' : '0 0 0 3px rgba(255,204,102,0.15)',
        verticalAlign: 'middle',
      }}
    />
  );
}

function Footer() {
  return (
    <div style={styles.footer}>
      <span>Demo UI (mock data) • Built for SUI hackathon</span>
      <span style={{ opacity: 0.7 }}>Next: connect Suiet + write on-chain object</span>
    </div>
  );
}

/* ---- Styles ----- */
const theme={
  bg: '#0b0f1a',
  surface: '#0f1424',
  card: '#12172a',
  stroke: 'rgba(255,255,255,0.10)',
  text: '#ffffff',
  muted: '#aeb4dd',

  brandNavy: '#0f2c45',  // inspirat din logo
  accent: '#4f7cff',
  ok: '#2be4a7',
  warn: '#ffcc66',
}
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
  backgroundColor: theme.bg,
  backgroundImage:
    `radial-gradient(700px 350px at 10% 10%, rgba(79,124,255,0.16), transparent 60%),
     radial-gradient(600px 350px at 90% 20%, rgba(15,44,69,0.30), transparent 60%)`,
  color: theme.text,
  fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
  padding: '28px 18px',
  },
  container: {
    maxWidth: 1100,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    padding: '12px 6px 18px 6px',
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 26,
  },
  logoDot: {
    width: 14,
    height: 14,
    borderRadius: 999,
    backgroundColor: '#4f7cff',
    boxShadow: '0 0 0 4px rgba(79,124,255,0.15)',
  },
  brandTitle: {
    fontSize: 38,
    fontWeight: 1700,
    letterSpacing: 1.3,
  },
  brandSubtitle: {
    marginTop: 6,
    fontSize: 18,
    color: '#b3b8d4',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  pill: {
    fontSize: 12,
    padding: '6px 10px',
    borderRadius: 999,
    backgroundColor: '#12172a',
    color: '#cfd3ff',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  ghostBtn: {
    backgroundColor: 'transparent',
    color: '#cfd3ff',
    border: '1px solid rgba(255,255,255,0.14)',
    padding: '8px 10px',
    borderRadius: 10,
    cursor: 'pointer',
  },
  shell: {
    backgroundColor: theme.surface,
  border: `1px solid ${theme.stroke}`,
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: '14px 14px',
    backgroundColor: '#0f1424',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  tabs: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  tabBtn: {
    backgroundColor: 'rgba(15,44,69,0.15)', // navy subtil
  color: '#dfe7ff',
  border: '1px solid rgba(79,124,255,0.25)',
  padding: '10px 14px',
  borderRadius: 14,
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 600,
  transition: 'all 150ms ease',
  },
  tabBtnActive: {
    backgroundColor: 'rgba(15,44,69,0.45)',
  border: '1px solid rgba(79,124,255,0.65)',
  boxShadow: `
    0 0 0 4px rgba(79,124,255,0.12),
    inset 0 0 0 1px rgba(255,255,255,0.08)
  `,
  },
  actions: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
  },
  primaryBtn: {
    background: 'linear-gradient(135deg, #4f7cff, #355bff)',
  color: 'white',
  border: '1px solid rgba(255,255,255,0.18)',
  padding: '11px 16px',
  borderRadius: 14,
  cursor: 'pointer',
  fontWeight: 700,
  letterSpacing: 0.2,
  boxShadow: '0 8px 24px rgba(79,124,255,0.35)',
  },
  secondaryBtn: {
   backgroundColor: 'rgba(15,44,69,0.25)',
  color: '#e3ebff',
  border: '1px solid rgba(79,124,255,0.25)',
  padding: '11px 16px',
  borderRadius: 14,
  cursor: 'pointer',
  fontWeight: 600,
  },
  content: {
    padding: 16,
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 14,
  },
  card: {
    background:
    'linear-gradient(180deg, rgba(15,44,69,0.45), rgba(15,44,69,0.15))',
  border: '1px solid rgba(79,124,255,0.25)',
  borderRadius: 18,
  boxShadow:
    'inset 0 0 0 1px rgba(255,255,255,0.05), 0 20px 40px rgba(0,0,0,0.4)',
  },
  cardTitle: {
    fontSize: 16,
  fontWeight: 800,
  letterSpacing: 0.2,
  },
  cardSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#aeb4dd',
    lineHeight: 1.35,
  },
  cardBody: {
    padding: 14,
  },
  rowBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
  },
  kpiLabel: {
    fontSize: 12,
    color: '#aeb4dd',
    marginBottom: 6,
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
  },
  kpiRight: {
    textAlign: 'right',
  },
  kpiValueSmall: {
    fontSize: 14,
    fontWeight: 600,
    color: '#dfe3ff',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    margin: '14px 0',
  },
  kvList: {
    display: 'grid',
    gap: 10,
  },
  kvRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 14,
    alignItems: 'center',
  },
  kvLabel: {
    fontSize: 12,
    color: '#aeb4dd',
  },
  kvValue: {
    fontSize: 13,
    color: '#dfe3ff',
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'flex-end',
    maxWidth: 520,
    textAlign: 'right',
  },
  badge: {
    fontSize: 11,
  padding: '4px 8px',
  borderRadius: 999,
  backgroundColor: 'rgba(43,228,167,0.12)',
  border: '1px solid rgba(43,228,167,0.30)',
  color: '#bff7e6',
  },
  mono: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    opacity: 0.95,
  },
  quickGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 10,
  },
  quickCard: {
    textAlign: 'left',
  backgroundColor: 'rgba(15,20,36,0.95)',
  border: '1px solid rgba(79,124,255,0.25)',
  borderRadius: 16,
  padding: 16,
  cursor: 'pointer',
  transition: 'all 150ms ease',
  },
  quickTitle: {
    fontWeight: 700,
    marginBottom: 6,
  },
  quickDesc: {
    fontSize: 13,
    color: '#aeb4dd',
    lineHeight: 1.35,
  },
  bullets: {
    margin: 0,
    paddingLeft: 18,
    color: '#dfe3ff',
    lineHeight: 1.7,
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    fontSize: 12,
    padding: '6px 10px',
    borderRadius: 999,
    backgroundColor: '#0f1424',
    border: '1px solid rgba(255,255,255,0.10)',
    color: '#dfe3ff',
  },
  miniNote: {
    fontSize: 13,
    color: '#aeb4dd',
    lineHeight: 1.5,
  },
  toggleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  toggleLabel: {
    fontWeight: 700,
    marginBottom: 4,
  },
  toggleDesc: {
    fontSize: 13,
    color: '#aeb4dd',
    lineHeight: 1.35,
  },
  toggle: {
    width: 46,
    height: 26,
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.14)',
    padding: 3,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  toggleOn: {
    backgroundColor: 'rgba(79,124,255,0.35)',
  },
  toggleOff: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    transition: 'transform 120ms ease',
  },
  footer: {
    marginTop: 14,
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    color: '#aeb4dd',
    fontSize: 12,
    padding: '0 6px',
  },
  privateBadge: {
 fontSize: 11,
  padding: '4px 8px',
  borderRadius: 999,
  backgroundColor: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.18)',
  color: '#e2e6ff',
},

verifiedBadge: {
  fontSize: 11,
  padding: '4px 10px',
  borderRadius: 999,
  background:
    'linear-gradient(135deg, rgba(43,228,167,0.35), rgba(43,228,167,0.15))',
  border: '1px solid rgba(43,228,167,0.55)',
  color: '#d7fff2',
  fontWeight: 700,
  boxShadow: '0 0 0 3px rgba(43,228,167,0.15)',

},

unverifiedBadge: {
  fontSize: 11,
  padding: '4px 8px',
  borderRadius: 999,
  backgroundColor: 'rgba(255,204,102,0.15)',
  border: '1px solid rgba(255,204,102,0.35)',
  color: '#ffe7b3',
},

};
