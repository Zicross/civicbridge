import type { AuditEventInput, AuditEventPayload } from "./types";

const disallowedMetadataKeys = new Set([
  "rawAddress",
  "fullRawAddress",
  "messageBody",
  "body",
  "rawProviderPayload",
  "providerPayload",
]);

function isAuditScalar(value: unknown): value is string | number | boolean | null {
  return value === null || ["string", "number", "boolean"].includes(typeof value);
}

export function redactAuditMetadata(unsafeMetadata: Record<string, unknown> = {}): Record<string, string | number | boolean | null> {
  const metadata: Record<string, string | number | boolean | null> = {};

  for (const [key, value] of Object.entries(unsafeMetadata)) {
    if (!disallowedMetadataKeys.has(key) && isAuditScalar(value)) {
      metadata[key] = value;
    }
  }

  return metadata;
}

export function createAuditEventPayload(input: AuditEventInput): AuditEventPayload {
  return {
    entityType: input.entityType,
    entityId: input.entityId,
    actorType: input.actorType,
    actorId: input.actorId,
    eventType: input.eventType,
    previousState: input.previousState,
    newState: input.newState,
    reasonCode: input.reasonCode,
    reasonSummary: input.reasonSummary,
    metadata: redactAuditMetadata(input.unsafeMetadata),
  };
}
