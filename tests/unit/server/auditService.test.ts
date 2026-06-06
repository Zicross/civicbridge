import { describe, it, expect } from "vitest";
import { createAuditEventPayload } from "../../../src/server/services/auditService";

describe("auditService.createAuditEventPayload", () => {
  it("does not include raw message body in audit metadata", () => {
    const payload = createAuditEventPayload({
      entityType: "message",
      entityId: "msg-1",
      actorType: "constituent",
      actorId: "user-1",
      eventType: "message_submitted",
      newState: "new",
      unsafeMetadata: {
        body: "This is the raw message body",
        issueCategory: "housing",
      },
    });
    expect(payload.metadata).not.toHaveProperty("body");
    expect(payload.metadata.issueCategory).toBe("housing");
  });

  it("does not include raw address in audit metadata", () => {
    const payload = createAuditEventPayload({
      entityType: "message",
      entityId: "msg-2",
      actorType: "admin",
      actorId: "admin-1",
      eventType: "message_reviewed",
      previousState: "new",
      newState: "needs_review",
      unsafeMetadata: {
        rawAddress: "123 Main St, Anytown, USA",
        fullRawAddress: "123 Main St, Anytown, USA 12345",
        districtId: "TX-07",
      },
    });
    expect(payload.metadata).not.toHaveProperty("rawAddress");
    expect(payload.metadata).not.toHaveProperty("fullRawAddress");
    expect(payload.metadata.districtId).toBe("TX-07");
  });

  it("does not include raw provider payload in audit metadata", () => {
    const payload = createAuditEventPayload({
      entityType: "addressLookup",
      entityId: "lookup-1",
      actorType: "system",
      eventType: "lookup_completed",
      unsafeMetadata: {
        rawProviderPayload: { geocodio: "full response" },
        providerPayload: { data: "sensitive" },
        confidence: "high",
      },
    });
    expect(payload.metadata).not.toHaveProperty("rawProviderPayload");
    expect(payload.metadata).not.toHaveProperty("providerPayload");
    expect(payload.metadata.confidence).toBe("high");
  });

  it("preserves entity and actor fields without exposing PII", () => {
    const payload = createAuditEventPayload({
      entityType: "message",
      entityId: "msg-3",
      actorType: "admin",
      actorId: "admin-2",
      eventType: "message_approved",
      previousState: "needs_review",
      newState: "approved_for_manual_handling",
    });
    expect(payload.entityType).toBe("message");
    expect(payload.entityId).toBe("msg-3");
    expect(payload.actorType).toBe("admin");
    expect(payload.actorId).toBe("admin-2");
    expect(payload.previousState).toBe("needs_review");
    expect(payload.newState).toBe("approved_for_manual_handling");
  });

  it("only allows scalar metadata values (string, number, boolean, null)", () => {
    const payload = createAuditEventPayload({
      entityType: "message",
      entityId: "msg-4",
      actorType: "system",
      eventType: "message_archived",
      unsafeMetadata: {
        reasonCode: "automated",
        score: 42,
        flagged: false,
        nestedObject: { should: "be dropped" },
        arrayValue: ["should", "be", "dropped"],
      },
    });
    expect(payload.metadata.reasonCode).toBe("automated");
    expect(payload.metadata.score).toBe(42);
    expect(payload.metadata.flagged).toBe(false);
    expect(payload.metadata).not.toHaveProperty("nestedObject");
    expect(payload.metadata).not.toHaveProperty("arrayValue");
  });
});
