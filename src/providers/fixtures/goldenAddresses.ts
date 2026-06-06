// Sample golden addresses for fixture provider
// In a real implementation this would contain many deterministic examples.

import type { NormalizedAddress } from "../../core/address/types";

export const goldenAddresses: NormalizedAddress[] = [
  {
    normalizedLine1: "1600 Pennsylvania Avenue NW",
    city: "Washington",
    state: "DC",
    postalCode: "20500",
    country: "US",
    confidence: "high",
    provider: "fixture",
  },
];
