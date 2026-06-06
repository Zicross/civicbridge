import type { MessageStateTransition, MessageStatus } from "./types";

const allowedTransitions: Readonly<Record<MessageStatus, readonly MessageStatus[]>> = {
  new: ["needs_review", "rejected"],
  needs_review: ["approved_for_manual_handling", "rejected"],
  approved_for_manual_handling: ["archived"],
  rejected: ["archived"],
  archived: [],
};

export class InvalidMessageStateTransitionError extends Error {
  constructor(from: MessageStatus, to: MessageStatus) {
    super(`Invalid message state transition: ${from} → ${to}`);
    this.name = "InvalidMessageStateTransitionError";
  }
}

export function canTransitionMessage(from: MessageStatus, to: MessageStatus): boolean {
  return allowedTransitions[from].includes(to);
}

export function transitionMessageState(from: MessageStatus, to: MessageStatus): MessageStateTransition {
  if (!canTransitionMessage(from, to)) {
    throw new InvalidMessageStateTransitionError(from, to);
  }

  return {
    previousState: from,
    newState: to,
  };
}

export function nextMessageStates(from: MessageStatus): readonly MessageStatus[] {
  return allowedTransitions[from];
}
