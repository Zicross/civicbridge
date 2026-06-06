import { describe, expect, it } from "vitest";
import { evaluateLookupSupport } from "@/core/representatives/supportScope";

import type { RepresentativeLookupResult } from "@/core/representatives/types";

describe("representative support scope", () => {
  it("marks federal and state legislative results as supported with explicit local unsupported levels", () => {
    const result: RepresentativeLookupResult = {
      status: "supported",
      confidence: "high",
      source: { provider: "fixture", asOf: new Date("2026-06-06T00:00:00.000Z") },
      districts: [
        { level: "federal", kind: "congressional", identifier: "US-HOUSE-DC-AL" },
        { level: "state", kind: "state-legislative-upper", identifier: "DC-COUNCIL-AT-LARGE" },
      ],
      representatives: [],
      unsupportedLevels: ["local"],
      warnings: [],
    };

    expect(evaluateLookupSupport(result)).toEqual({
      status: "supported",
      supportedLevels: ["federal", "state"],
      unsupportedLevels: ["local"],
      requiresUserCaution: false,
    });
  });

  it("does not treat low-confidence lookup results as authoritative", () => {
    const result: RepresentativeLookupResult = {
      status: "low-confidence",
      confidence: "low",
      source: { provider: "fixture", asOf: new Date("2026-06-06T00:00:00.000Z") },
      districts: [],
      representatives: [],
      unsupportedLevels: ["local"],
      warnings: ["Address confidence was below MVP support threshold."],
    };

    expect(evaluateLookupSupport(result)).toMatchObject({
      status: "low-confidence",
      supportedLevels: [],
      requiresUserCaution: true,
    });
  });
});
