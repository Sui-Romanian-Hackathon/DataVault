import { Issuers } from "./issuers";

export function issueAgeCredential(subjectId: string) {
  return {
    credId: "cred_age_001",
    issuer: Issuers.GOVERNMENT,
    subjectId,
    claims: {
      age_over_18: true
    },
    issuedAt: Date.now(),
    zkCapable: true
  };
}

export function issueCertificationCredential(
  subjectId: string,
  certification: string
) {
  return {
    credId: "cred_cert_001",
    issuer: Issuers.CERT_AUTH,
    subjectId,
    claims: {
      certification
    },
    issuedAt: Date.now(),
    zkCapable: true
  };
}
