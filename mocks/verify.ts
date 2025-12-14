import { vault } from "./vault";

export function verifyRequest(request: {
  type: "age_over_18" | "has_certification";
  value?: string;
}) {
  if (request.type === "age_over_18") {
    return {
      valid: vault.attributes.age_over_18?.value === true,
      disclosed: "proof_only"
    };
  }

  if (request.type === "has_certification") {
    return {
      valid:
        vault.attributes.certification?.value === request.value,
      disclosed: "proof_only"
    };
  }

  return { valid: false };
}
