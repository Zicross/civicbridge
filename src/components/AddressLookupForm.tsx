"use client";

import { useState } from "react";
import { lookupRepresentatives } from "@/app/intake/actions";
import type { RepresentativeLookupResult } from "@/core/representatives/types";

interface AddressLookupFormProps {
  onLookupComplete: (result: RepresentativeLookupResult) => void;
}

export default function AddressLookupForm({ onLookupComplete }: AddressLookupFormProps) {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setLoading(true);
    setError(null);

    const response = await lookupRepresentatives(address);

    if (response.success && response.result) {
      onLookupComplete(response.result);
    } else {
      setError(response.error || "Failed to look up address");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <label
          htmlFor="address-input"
          style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}
        >
          Your Address
        </label>
        <input
          id="address-input"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="1600 Pennsylvania Avenue NW, Washington, DC 20500"
          required
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "1rem",
          }}
        />
        <p style={{ fontSize: "0.875rem", color: "#666", marginTop: "0.25rem" }}>
          Enter your address to find your representatives at the federal and state levels.
        </p>
      </div>

      {error && (
        <div style={{ color: "#dc2626", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !address.trim()}
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
        {loading ? "Looking up..." : "Find My Representatives"}
      </button>
    </form>
  );
}
