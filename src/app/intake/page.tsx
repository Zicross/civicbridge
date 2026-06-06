"use client";

import { useState } from "react";
import AddressLookupForm from "@/components/AddressLookupForm";
import RepresentativeList from "@/components/RepresentativeList";
import ConsentCheckbox from "@/components/ConsentCheckbox";
import MessageForm from "@/components/MessageForm";
import type { RepresentativeLookupResult } from "../../core/representatives/types";

export default function IntakePage() {
  const [lookupResult, setLookupResult] = useState<RepresentativeLookupResult | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);

  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ marginBottom: "0.5rem" }}>ConstiuINT</h1>
        <p style={{ fontSize: "1.125rem", color: "#666" }}>
          Constituent Intelligence — Structured Civic Feedback
        </p>
      </header>

      <section style={{ marginBottom: "2rem" }}>
        <p style={{ marginBottom: "1.5rem" }}>
          ConstiuINT helps you provide structured feedback to your representatives. 
          Enter your address to see who represents you at the federal and state levels, 
          then submit your feedback for ConstiuINT review.
        </p>
        
        <AddressLookupForm onLookupComplete={setLookupResult} />
        
        <RepresentativeList result={lookupResult} />
        
        {lookupResult && lookupResult.status === "supported" && (
          <>
            <ConsentCheckbox onChange={setConsentChecked} />
            <MessageForm consentChecked={consentChecked} />
          </>
        )}
      </section>
    </main>
  );
}
