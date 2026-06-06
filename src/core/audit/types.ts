import type { MessageStatus } from "../messages/types";

export type AuditEntityType = "message" | "addressLookup" | "representativeSnapshot" | "user";

export type AuditActorType = "system" | "admin" | "constituent";

export type AuditEventInput = {
  entityType: AuditEntityType;
  entityId: string;
  actorType: AuditActorType;
  actorId?: string;
  eventType: string;
  previousState?: MessageStatus | null;
  newState?: MessageStatus | null;
  reasonCode?: string;
  reasonSummary?: string;
  unsafeMetadata?: Record<string, unknown>;
};

export type AuditEventPayload = Omit<AuditEventInput, "unsafeMetadata"> & {
  metadata: Record<string, string | number | boolean | null>;
};
