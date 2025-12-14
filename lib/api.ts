const API_BASE = 'http://localhost:3001';

export async function loadVault(privateKey: string) {
  const res = await fetch(`${API_BASE}/vault/load`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ privateKey }),
  });

  if (!res.ok) {
    throw new Error('Failed to load vault');
  }

  return res.json();
}
