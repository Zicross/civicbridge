import { getCurrentUser } from "../auth/config";
import { checkRateLimit } from "../rateLimit";
import { createAuditEventPayload } from "./auditService";
import type { MessageConsent, StructuredFeedbackMessage, IssueCategory, MessageStatus } from "../../core/messages/types";
import { CURRENT_CONSENT_VERSION } from "../../core/messages/types";


/**
 * Minimal message service for ConstiuINT MVP.
 * Performs validation and returns a StructuredFeedbackMessage.
 * In a full implementation this would persist to the DB and emit an audit event.
 */
export function submitMessage(params: {
  issueCategory: IssueCategory;
  issueTags?: string[];
  body: string;
  consentAccepted: boolean;
}): StructuredFeedbackMessage {
  const user = getCurrentUser();
  if (!user) {
    throw new Error("Unauthenticated user");
  }
  if (!user.emailVerified) {
    throw new Error("Email not verified");
  }
  if (!params.consentAccepted) {
    throw new Error("User must accept consent");
  }
  if (!params.issueCategory) {
    throw new Error("Issue category required");
  }
  if (!checkRateLimit(user.id)) {
    throw new Error("Rate limit exceeded");
  }

  const consent: MessageConsent = {
    version: CURRENT_CONSENT_VERSION,
    consentedAt: new Date(),
  };

  const message: StructuredFeedbackMessage = {
    id: crypto.randomUUID(),
    userId: user.id,
    issueCategory: params.issueCategory,
    issueTags: params.issueTags ?? [],
    body: params.body,
    status: "new" as MessageStatus,
    consent,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Create an audit event (placeholder, not persisted here)
  const audit = createAuditEventPayload({
    entityType: "message",
    entityId: message.id,
    actorType: "constituent",
    actorId: user.id,
    eventType: "message_submitted",
    newState: message.status,
    unsafeMetadata: { issueCategory: params.issueCategory },
  });

  // In real code we would persist `message` and `audit`.
  // Here we simply return the message (audit can be inspected via side-effect if needed).
  // eslint-disable-next-line no-console
  console.debug("Audit event payload created", audit);

  return message;
}
