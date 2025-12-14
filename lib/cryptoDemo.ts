// lib/cryptoDemo.ts

let cachedKey: string | null = null;

// DEMO ONLY — nu crypto real
export function unlockVault(masterPassword: string): boolean {
  if (!masterPassword.trim()) return false; // verific daca parola nu e goala
  cachedKey = btoa(masterPassword);         // "deriv" cheia
  return true;
}

export function lockVault(): void {
  cachedKey = null;
}

export function isVaultUnlocked(): boolean {
  return cachedKey !== null;
}

export function encrypt(plaintext: string): string {
  if (!cachedKey) {
    throw new Error('Vault locked');
  }
  return btoa(cachedKey + '::' + plaintext);
}

export function decrypt(ciphertext: string): string {
  if (!cachedKey) {
    throw new Error('Vault locked');
  }
  const decoded = atob(ciphertext);
  return decoded.split('::')[1];
}
