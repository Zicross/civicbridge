"use client";

import { useState } from "react";
import type { MessageStatus } from "@/core/messages/types";
import { nextMessageStates } from "@/core/messages/stateMachine";
import {
  approveMessage,
  rejectMessage,
  markForReview,
  archiveMessage,
} from "@/app/admin/actions";

// Placeholder message type for MVP - in real impl, this would come from DB
interface QueuedMessage {
  id: string;
  issueCategory: string;
  body: string;
  status: MessageStatus;
  createdAt: string;
  email: string;
  addressSummary: string;
}

const mockMessages: QueuedMessage[] = [
  {
    id: "msg-1",
    issueCategory: "housing",
    body: "I'm concerned about affordable housing in my district...",
    status: "new",
    createdAt: "2026-06-06T10:00:00Z",
    email: "constituent@example.com",
    addressSummary: "123 Main St, Washington, DC 20001",
  },
  {
    id: "msg-2",
    issueCategory: "infrastructure",
    body: "The local roads need maintenance attention...",
    status: "needs_review",
    createdAt: "2026-06-05T14:30:00Z",
    email: "voter@example.com",
    addressSummary: "456 Oak Ave, Arlington, VA 22201",
  },
  {
    id: "msg-3",
    issueCategory: "healthcare",
    body: "Healthcare costs are too high in our community...",
    status: "approved_for_manual_handling",
    createdAt: "2026-06-04T09:15:00Z",
    email: "resident@example.com",
    addressSummary: "789 Pine Rd, Alexandria, VA 22301",
  },
];

const statusLabels: Record<MessageStatus, string> = {
  new: "New",
  needs_review: "Needs Review",
  approved_for_manual_handling: "Approved",
  rejected: "Rejected",
  archived: "Archived",
};

const statusColors: Record<MessageStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  needs_review: "bg-yellow-100 text-yellow-800",
  approved_for_manual_handling: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  archived: "bg-gray-100 text-gray-800",
};

interface ActionButtonProps {
  onClick: () => Promise<{ success: boolean; error?: string }>;
  children: React.ReactNode;
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ActionButton({ onClick, children, className = "" }: ActionButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onClick();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-3 py-1 text-sm rounded ${className} ${loading ? "opacity-50 cursor-wait" : ""}`}
    >
      {loading ? "..." : children}
    </button>
  );
}

export function AdminQueueTable() {
  const [messages, setMessages] = useState<QueuedMessage[]>(mockMessages);
  // selectedId state reserved for future row selection feature
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleTransition = async (messageId: string, newStatus: MessageStatus) => {
    let actionResult: { success: boolean; error?: string };

    switch (newStatus) {
      case "needs_review":
        actionResult = await markForReview(messageId);
        break;
      case "approved_for_manual_handling":
        actionResult = await approveMessage(messageId);
        break;
      case "rejected":
        actionResult = await rejectMessage(messageId);
        break;
      case "archived":
        actionResult = await archiveMessage(messageId);
        break;
      default:
        actionResult = { success: false, error: "Unknown status" };
    }

    if (actionResult.success) {
      // Update local state to reflect the change
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, status: newStatus } : msg
        )
      );
    } else {
      // In a real app, show error toast
      console.error("Transition failed:", actionResult.error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Issue
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Address
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Submitted
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {messages.map((message) => {
            const availableTransitions = nextMessageStates(message.status);
            return (
              <tr key={message.id} className={selectedId === message.id ? "bg-blue-50" : ""}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[message.status]}`}
                  >
                    {statusLabels[message.status]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {message.issueCategory}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {message.addressSummary}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(message.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    {availableTransitions.map((status) => (
                      <button
                        key={status}
                        onClick={() => handleTransition(message.id, status)}
                        className="text-blue-600 hover:text-blue-800 text-xs"
                      >
                        {status === "needs_review" && "Review"}
                        {status === "approved_for_manual_handling" && "Approve"}
                        {status === "rejected" && "Reject"}
                        {status === "archived" && "Archive"}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {messages.length === 0 && (
        <div className="text-center py-8 text-gray-500">No messages in queue</div>
      )}
    </div>
  );
}