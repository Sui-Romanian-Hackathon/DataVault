export type VaultAttribute = {
  value: any;
  issuer: string;
  privacy: "public" | "zk" | "private";
};

export type IdentityVault = {
  subjectId: string;
  version: number;
  attributes: Record<string, VaultAttribute>;
};

export const vault: IdentityVault = {
  subjectId: "user_123",
  version: 1,
  attributes: {}
};

export function storeCredential(credential: any) {
  vault.version += 1;

  Object.entries(credential.claims).forEach(([key, value]) => {
    vault.attributes[key] = {
      value,
      issuer: credential.issuer.id,
      privacy: "zk"
    };
  });

  return vault;
}
