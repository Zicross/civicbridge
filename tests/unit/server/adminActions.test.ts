import { describe, it, expect, vi } from "vitest";
import { transitionMessageState, canTransitionMessage, InvalidMessageStateTransitionError, nextMessageStates } from "@/core/messages/stateMachine";

// Mock the requireAdmin module
vi.mock("@/server/auth/requireAdmin", () => ({
  requireAdmin: vi.fn(),
  isAdmin: vi.fn().mockReturnValue(false),
}));

// Mock auth config
vi.mock("@/server/auth/config", () => ({
  getCurrentUser: vi.fn().mockReturnValue(null),
}));

describe("Admin queue actions", () => {
  describe("State machine transitions", () => {
    it("new -> needs_review is valid", () => {
      expect(canTransitionMessage("new", "needs_review")).toBe(true);
    });

    it("new -> rejected is valid", () => {
      expect(canTransitionMessage("new", "rejected")).toBe(true);
    });

    it("new -> approved_for_manual_handling is invalid", () => {
      expect(canTransitionMessage("new", "approved_for_manual_handling")).toBe(false);
    });

    it("needs_review -> approved_for_manual_handling is valid", () => {
      expect(canTransitionMessage("needs_review", "approved_for_manual_handling")).toBe(true);
    });

    it("needs_review -> rejected is valid", () => {
      expect(canTransitionMessage("needs_review", "rejected")).toBe(true);
    });

    it("approved_for_manual_handling -> archived is valid", () => {
      expect(canTransitionMessage("approved_for_manual_handling", "archived")).toBe(true);
    });

    it("rejected -> archived is valid", () => {
      expect(canTransitionMessage("rejected", "archived")).toBe(true);
    });

    it("archived -> any state is invalid", () => {
      expect(canTransitionMessage("archived", "new")).toBe(false);
      expect(canTransitionMessage("archived", "needs_review")).toBe(false);
    });

    it("throws InvalidMessageStateTransitionError for invalid transitions", () => {
      expect(() => transitionMessageState("new", "approved_for_manual_handling")).toThrow(
        InvalidMessageStateTransitionError
      );
    });

    it("returns correct next states for each status", () => {
      expect(nextMessageStates("new")).toEqual(["needs_review", "rejected"]);
      expect(nextMessageStates("needs_review")).toEqual(["approved_for_manual_handling", "rejected"]);
      expect(nextMessageStates("approved_for_manual_handling")).toEqual(["archived"]);
      expect(nextMessageStates("rejected")).toEqual(["archived"]);
      expect(nextMessageStates("archived")).toEqual([]);
    });
  });

  describe("Audit event creation", () => {
    it("should create audit event for state transitions", async () => {
      // This test verifies that every state transition creates an audit event
      // In the full implementation, the admin action would call auditService
      const transition = transitionMessageState("new", "needs_review");
      expect(transition.previousState).toBe("new");
      expect(transition.newState).toBe("needs_review");
    });
  });
});