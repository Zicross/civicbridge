import { describe, expect, it } from "vitest";
import { isConsentCurrent, recordConsent } from "@/core/messages/consent";
import { canTransitionMessage, transitionMessageState } from "@/core/messages/stateMachine";
import type { MessageStatus } from "@/core/messages/types";

describe("message consent and lifecycle", () => {
  it("records the current consent version and timestamp", () => {
    const consentedAt = new Date("2026-06-06T00:00:00.000Z");

    const consent = recordConsent({ accepted: true, consentedAt });

    expect(consent.version).toBe("constiuint-mvp-2026-06-06");
    expect(consent.consentedAt).toEqual(consentedAt);
    expect(isConsentCurrent(consent)).toBe(true);
  });

  it("rejects missing consent", () => {
    expect(() => recordConsent({ accepted: false, consentedAt: new Date() })).toThrow(/consent/i);
  });

  it.each<[MessageStatus, MessageStatus]>([
    ["new", "needs_review"],
    ["new", "rejected"],
    ["needs_review", "approved_for_manual_handling"],
    ["needs_review", "rejected"],
    ["approved_for_manual_handling", "archived"],
    ["rejected", "archived"],
  ])("allows %s → %s", (from, to) => {
    expect(canTransitionMessage(from, to)).toBe(true);
    expect(transitionMessageState(from, to)).toEqual({ previousState: from, newState: to });
  });

  it.each<[MessageStatus, MessageStatus]>([
    ["new", "archived"],
    ["needs_review", "new"],
    ["approved_for_manual_handling", "rejected"],
    ["archived", "needs_review"],
  ])("rejects %s → %s", (from, to) => {
    expect(canTransitionMessage(from, to)).toBe(false);
    expect(() => transitionMessageState(from, to)).toThrow(/invalid message state transition/i);
  });
});
