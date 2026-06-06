"use client";

import { useState } from "react";
import { submitFeedback } from "@/app/intake/actions";
import type { IssueCategory } from "@/core/messages/types";

interface MessageFormProps {
  consentChecked: boolean;
}

const ISSUE_CATEGORIES: { value: IssueCategory; label: string }[] = [
  { value: "housing", label: "Housing" },
  { value: "healthcare", label: "Healthcare" },
  { value: "transportation", label: "Transportation" },
  { value: "education", label: "Education" },
  { value: "public-safety", label: "Public Safety" },
  { value: "environment", label: "Environment" },
  { value: "other", label: "Other" },
];

export default function MessageForm({ consentChecked }: MessageFormProps) {
  const [issueCategory, setIssueCategory] = useState<IssueCategory | "">("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!issueCategory) {
      setError("Please select a topic/category for your feedback.");
      return;
    }
    if (!message.trim()) {
      setError("Please enter your message.");
      return;
    }
    if (!consentChecked) {
      setError("Please check the consent box to submit your feedback.");
      return;
    }

    setLoading(true);
    setError(null);

    const response = await submitFeedback({
      issueCategory,
      body: message,
      consentAccepted: true,
    });

    if (response.success) {
      setSuccess(true);
    } else {
      setError(response.error || "Failed to submit feedback");
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div style={{ padding: "1.5rem", backgroundColor: "#d1fae5", borderRadius: "4px", marginTop: "1.5rem" }}>
        <h3 style={{ marginTop: 0, color: "#065f46" }}>Feedback Submitted</h3>
        <p style={{ marginBottom: 0, color: "#065f46" }}>
          Your message has been submitted for ConstiuINT review. 
          Thank you for providing structured civic feedback.
        </p>
        <p style={{ marginTop: "1rem", marginBottom: 0, fontSize: "0.875rem", color: "#065f46" }}>
          You will not receive a direct response from representatives through ConstiuINT at this time.
          Messages are reviewed internally and may be manually forwarded at staff discretion.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "1.5rem", padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "4px" }}>
      <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>Submit Your Feedback</h3>
      
      <div style={{ marginBottom: "1rem" }}>
        <label
          htmlFor="issue-category"
          style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}
        >
          Topic / Issue Category <span style={{ color: "#dc2626" }}>*</span>
        </label>
        <select
          id="issue-category"
          value={issueCategory}
          onChange={(e) => setIssueCategory(e.target.value as IssueCategory)}
          required
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "1rem",
            backgroundColor: "white",
          }}
        >
          <option value="">Select a topic...</option>
          {ISSUE_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        <p style={{ fontSize: "0.875rem", color: "#666", marginTop: "0.25rem" }}>
          Select the topic that best describes your feedback. This helps create structured constituency intelligence.
        </p>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label
          htmlFor="message-body"
          style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}
        >
          Your Message <span style={{ color: "#dc2626" }}>*</span>
        </label>
        <textarea
          id="message-body"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder="Share your thoughts, concerns, or feedback for your representatives..."
          required
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "1rem",
            fontFamily: "inherit",
            resize: "vertical",
          }}
        />
      </div>

      {error && (
        <div style={{ color: "#dc2626", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: loading ? "#93c5fd" : "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "4px",
          fontSize: "1rem",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Submitting..." : "Submit for ConstiuINT Review"}
      </button>
      
      <p style={{ fontSize: "0.75rem", color: "#666", marginTop: "0.75rem", marginBottom: 0 }}>
        Your message will be reviewed by ConstiuINT staff. It will not be automatically sent to representatives.
      </p>
    </form>
  );
}
