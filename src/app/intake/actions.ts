"use server";

import { LookupService } from "../../server/services/lookupService";
import { submitMessage } from "../../server/services/messageService";
import type { NormalizedAddress } from "../../core/address/types";
import type { RepresentativeLookupResult } from "../../core/representatives/types";
import type { IssueCategory } from "../../core/messages/types";

/**
 * Normalize a raw address string into a NormalizedAddress.
 * 
 * For fixture mode, we do a simple parse. In production, this would call
 * Geocodio's geocoding API first.
 */
function normalizeAddress(rawAddress: string): NormalizedAddress {
  // Simple parsing for fixture mode - extract parts from common format
  // "1600 Pennsylvania Avenue NW, Washington, DC 20500"
  const parts = rawAddress.split(",").map(p => p.trim());
  
  const normalizedLine1 = parts[0] || "";
  const city = parts[1] || "";
  const stateZip = parts[2] || "";
  
  // Parse state and ZIP from last part
  const stateMatch = stateZip.match(/([A-Z]{2})\s*(\d{5})/);
  const state = stateMatch?.[1] || "";
  const postalCode = stateMatch?.[2] || "";
  
  // Check if this is our known golden address
  const isKnownAddress = normalizedLine1 === "1600 Pennsylvania Avenue NW" && 
                         postalCode === "20500";
  
  return {
    normalizedLine1,
    city,
    state,
    postalCode,
    country: "US" as const,
    confidence: isKnownAddress ? "high" : "low",
    provider: "fixture",
  };
}

/**
 * Server action: Look up representatives for an address
 */
export async function lookupRepresentatives(
  address: string
): Promise<{ success: boolean; result?: RepresentativeLookupResult; error?: string }> {
  try {
    const normalizedAddress = normalizeAddress(address);
    const lookupService = new LookupService();
    const result = await lookupService.lookup(normalizedAddress);
    
    return { success: true, result };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

/**
 * Server action: Submit a structured feedback message
 */
export async function submitFeedback(params: {
  issueCategory: IssueCategory;
  issueTags?: string[];
  body: string;
  consentAccepted: boolean;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const result = submitMessage({
      issueCategory: params.issueCategory,
      issueTags: params.issueTags,
      body: params.body,
      consentAccepted: params.consentAccepted,
    });
    
    return { success: true, messageId: result.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
