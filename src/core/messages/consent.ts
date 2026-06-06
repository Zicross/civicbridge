import { CURRENT_CONSENT_VERSION } from "./types";

import type { MessageConsent } from "./types";

type RecordConsentInput = {
  accepted: boolean;
  consentedAt: Date;
};

export function recordConsent(input: RecordConsentInput): MessageConsent {
  if (!input.accepted) {
    throw new Error("Current consent is required before submitting structured feedback.");
  }

  return {
    version: CURRENT_CONSENT_VERSION,
    consentedAt: input.consentedAt,
  };
}

export function isConsentCurrent(consent: MessageConsent | null | undefined): consent is MessageConsent {
  return Boolean(consent && consent.version === CURRENT_CONSENT_VERSION && consent.consentedAt instanceof Date);
}
