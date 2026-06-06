/**
 * Admin queue server actions for ConstiuINT.
 * Handles authenticated admin transitions of messages through lifecycle states.
 */
"use server";

import { canTransitionMessage, transitionMessageState, nextMessageStates } from "@/core/messages/stateMachine";
import type { MessageStatus } from "@/core/messages/types";
import { getCurrentUser } from "@/server/auth/config";
import { isAdmin } from "@/server/auth/requireAdmin";
import { createAuditEventPayload } from "@/server/services/auditService";
// Placeholder for DB persistence - in real impl, import message store

/**
 * Transition a message to a new state.
 * Requires admin authentication and creates an audit event.
 */
export async function transitionMessage(
  messageId: string,
  newStatus: MessageStatus
): Promise<{ success: boolean; error?: string }> {
  // Verify admin authentication
  const user = getCurrentUser();
  if (!user) {
    return { success: false, error: "Authentication required" };
  }

  if (!isAdmin(user)) {
    return { success: false, error: "Admin access required" };
  }

  // Get current message state (placeholder - in real impl, fetch from DB)
  const currentStatus: MessageStatus = "new"; // This would come from the message store

  // Validate transition
  if (!canTransitionMessage(currentStatus, newStatus)) {
    const validNext = nextMessageStates(currentStatus);
    return {
      success: false,
      error: `Invalid transition from ${currentStatus} to ${newStatus}. Valid transitions: ${validNext.join(", ")}`,
    };
  }

  // Perform transition
  const transition = transitionMessageState(currentStatus, newStatus);

  // Create audit event
  createAuditEventPayload({
    entityType: "message",
    entityId: messageId,
    actorType: "admin",
    actorId: user.id,
    eventType: "message_state_changed",
    previousState: transition.previousState,
    newState: transition.newState,
    unsafeMetadata: { reason: "admin_review" },
  });

  // In real implementation, persist the state change to DB
  // messageStore.updateMessageStatus(messageId, newStatus);

  return { success: true };
}

/**
 * Get available transitions for a message based on its current state.
 */
export async function getAvailableTransitions(currentStatus: MessageStatus): Promise<readonly MessageStatus[]> {
  return nextMessageStates(currentStatus);
}

/**
 * Approve a message for manual handling (move to approved_for_manual_handling).
 */
export async function approveMessage(messageId: string): Promise<{ success: boolean; error?: string }> {
  return transitionMessage(messageId, "approved_for_manual_handling");
}

/**
 * Reject a message.
 */
export async function rejectMessage(messageId: string): Promise<{ success: boolean; error?: string }> {
  return transitionMessage(messageId, "rejected");
}

/**
 * Mark a message as needing review.
 */
export async function markForReview(messageId: string): Promise<{ success: boolean; error?: string }> {
  return transitionMessage(messageId, "needs_review");
}

/**
 * Archive a message.
 */
export async function archiveMessage(messageId: string): Promise<{ success: boolean; error?: string }> {
  return transitionMessage(messageId, "archived");
}