// lib/verificationApi.ts

export type Visibility = 'private' | 'selective' | 'public';
export type AttributeType = 'age' | 'skill' | 'certification' | 'custom';

export type Attribute = {
  id: string;
  type: AttributeType;
  encryptedValue: string;
  visibility: Visibility;
  // verification state
  verification: {
    status: 'unverified' | 'pending' | 'verified' | 'rejected';
    issuer?: string;
    reason?: string;
    updatedAt?: number;
  };
};

// what the app sends to the verifier (demo version)
export type VerificationRequest = {
  attributeId: string;
  attributeType: AttributeType;
  // IMPORTANT: for demo, we "send" plaintext. In production, this would be a ZK proof or a scoped disclosure.
  plaintextValue: string;
  oneTimeSessionToken: string;
};

// what the verifier returns
export type VerificationResult =
  | {
      ok: true;
      verified: true;
      issuer: string;
      signature: string; // demo placeholder
      timestamp: number;
    }
  | {
      ok: true;
      verified: false;
      issuer: string;
      reason: string;
      timestamp: number;
    };

// create a one-time verification session token (demo)
export async function createVerificationSession(params: {
  attributeId: string;
  verifierName: string;
  ttlMs?: number;
}): Promise<{ token: string; expiresAt: number; verifierName: string }> {
  const ttlMs = params.ttlMs ?? 2 * 60 * 1000; // 2 min demo TTL
  const expiresAt = Date.now() + ttlMs;

  // demo token (in production you'd generate it server-side or via secure channel)
  const token = `sess_${params.attributeId}_${Math.random().toString(16).slice(2)}`;

  // simulate network delay
  await new Promise((r) => setTimeout(r, 400));

  return { token, expiresAt, verifierName: params.verifierName };
}

// request verification (mock)
// In demo: we "verify" based on simple rules to look realistic.
export async function requestVerification(
  req: VerificationRequest
): Promise<VerificationResult> {
  await new Promise((r) => setTimeout(r, 1000)); // simulate verifier latency

  const now = Date.now();

  // Demo rules (so you can show success/fail cases):
  // - age: "Over 18" -> verified
  // - certification: contains "AWS" or "University" -> verified
  // - skill: contains at least 5 chars -> verified (but could be unverified)
  // - custom: rejected unless contains "proof"
  const v = req.plaintextValue.toLowerCase();

  if (req.attributeType === 'age') {
    if (v.includes('over 18') || v.includes('18+')) {
      return {
        ok: true,
        verified: true,
        issuer: 'ZK Verifier (demo)',
        signature: 'sig_demo_age',
        timestamp: now,
      };
    }
    return {
      ok: true,
      verified: false,
      issuer: 'ZK Verifier (demo)',
      reason: 'Could not prove age threshold',
      timestamp: now,
    };
  }

  if (req.attributeType === 'certification') {
    if (v.includes('aws') || v.includes('university')) {
      return {
        ok: true,
        verified: true,
        issuer: 'Issuer Registry (demo)',
        signature: 'sig_demo_cert',
        timestamp: now,
      };
    }
    return {
      ok: true,
      verified: false,
      issuer: 'Issuer Registry (demo)',
      reason: 'Unknown issuer / certificate not recognized',
      timestamp: now,
    };
  }

  if (req.attributeType === 'skill') {
    if (req.plaintextValue.trim().length >= 5) {
      return {
        ok: true,
        verified: true,
        issuer: 'Skills Attester (demo)',
        signature: 'sig_demo_skill',
        timestamp: now,
      };
    }
    return {
      ok: true,
      verified: false,
      issuer: 'Skills Attester (demo)',
      reason: 'Insufficient evidence for skill claim',
      timestamp: now,
    };
  }

  // custom
  if (v.includes('proof')) {
    return {
      ok: true,
      verified: true,
      issuer: 'Custom Attester (demo)',
      signature: 'sig_demo_custom',
      timestamp: now,
    };
  }

  return {
    ok: true,
    verified: false,
    issuer: 'Custom Attester (demo)',
    reason: 'Custom claims require proof',
    timestamp: now,
  };
}
