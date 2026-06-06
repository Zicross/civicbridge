export const CURRENT_CONSENT_VERSION = "constiuint-mvp-2026-06-06" as const;

export type ConsentVersion = typeof CURRENT_CONSENT_VERSION;

export type MessageConsent = {
  version: ConsentVersion;
  consentedAt: Date;
};

export type IssueCategory =
  | "housing"
  | "healthcare"
  | "transportation"
  | "education"
  | "public-safety"
  | "environment"
  | "other";

export type MessageStatus = "new" | "needs_review" | "approved_for_manual_handling" | "rejected" | "archived";

export type MessageStateTransition = {
  previousState: MessageStatus;
  newState: MessageStatus;
};

export type StructuredFeedbackMessage = {
  id: string;
  userId: string;
  issueCategory: IssueCategory;
  issueTags: string[];
  body: string;
  status: MessageStatus;
  consent: MessageConsent;
  createdAt: Date;
  updatedAt: Date;
};
