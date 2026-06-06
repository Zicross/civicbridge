import { describe, expect, it } from "vitest";
import { minimizeAddressForPersistence } from "@/core/address/minimization";
import { createAuditEventPayload } from "@/core/audit/redaction";

describe("PII minimization helpers", () => {
  it("keeps normalized address components without retaining raw address or provider payload", () => {
    const minimized = minimizeAddressForPersistence({
      rawInput: "1600 Pennsylvania Ave NW, Washington, DC 20500",
      normalizedLine1: "1600 Pennsylvania Ave NW",
      city: "Washington",
      state: "DC",
      postalCode: "20500",
      country: "US",
      latitude: 38.8977,
      longitude: -77.0365,
      confidence: "high",
      provider: "fixture",
      providerPayload: { secretRawProviderShape: true },
    });

    expect(minimized).toMatchObject({
      normalizedLine1: "1600 Pennsylvania Ave NW",
      city: "Washington",
      state: "DC",
      postalCode: "20500",
      country: "US",
      confidence: "high",
      provider: "fixture",
    });
    expect(JSON.stringify(minimized)).not.toContain("secretRawProviderShape");
    expect(JSON.stringify(minimized)).not.toContain("1600 Pennsylvania Ave NW, Washington, DC 20500");
  });

  it("creates audit-safe event metadata without raw address, message body, or provider payload", () => {
    const payload = createAuditEventPayload({
      entityType: "message",
      entityId: "msg_123",
      actorType: "system",
      eventType: "message.created",
      previousState: null,
      newState: "new",
      reasonSummary: "Submitted with current consent",
      unsafeMetadata: {
        rawAddress: "1600 Pennsylvania Ave NW, Washington, DC 20500",
        messageBody: "Please support this bill.",
        rawProviderPayload: { provider: "raw" },
        issueCategory: "housing",
        consentVersion: "constiuint-mvp-2026-06-06",
      },
    });

    expect(payload.metadata).toEqual({
      issueCategory: "housing",
      consentVersion: "constiuint-mvp-2026-06-06",
    });
    expect(JSON.stringify(payload)).not.toContain("Please support this bill");
    expect(JSON.stringify(payload)).not.toContain("1600 Pennsylvania");
    expect(JSON.stringify(payload)).not.toContain("rawProviderPayload");
  });
});
