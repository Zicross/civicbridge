import { describe, it, expect } from "vitest";
import { mapGeocodioResponse } from "../../../src/providers/geocodio/mapper";
import type { RepresentativeLookupResult, LookupStatus, LookupConfidence, JurisdictionLevel } from "../../../src/core/representatives/types";
import type { NormalizedAddress } from "../../../src/core/address/types";

// Sample Geocodio API response structure (sanitized - no real addresses)
const mockGeocodioResponse = {
  results: [
    {
      address: {
        street: "123 Main St",
        city: "Washington",
        state: "DC",
        zip: "20001"
      },
      location: {
        lat: 38.9072,
        lng: -77.0369
      },
      fields: {
        congressional_district: { district: "DC-AL", name: "Delegate" },
        state_legislative_districts: {
          upper: { district: "DC-Upper", name: "DC Upper" },
          lower: { district: "DC-Lower", name: "DC Lower" }
        },
        county: { name: "District of Columbia", fips: "11001" }
      },
      meta: {
        license: "internal",
        timestamp: "2024-01-15T10:00:00Z"
      }
    }
  ]
};

const mockLowConfidenceResponse = {
  results: [
    {
      address: {
        street: "999 Unknown Ave",
        city: "Nowhere",
        state: "XX",
        zip: "99999"
      },
      location: { lat: 0, lng: 0 },
      fields: {},
      meta: { license: "internal", timestamp: "2024-01-15T10:00:00Z" }
    }
  ]
};

const mockNoMatchResponse = {
  results: []
};

const testNormalizedAddress: NormalizedAddress = {
  normalizedLine1: "123 Main St",
  city: "Washington",
  state: "DC",
  postalCode: "20001",
  country: "US",
  latitude: 38.9072,
  longitude: -77.0369,
  confidence: "high",
  provider: "geocodio"
};

describe("geocodioMapper", () => {
  describe("mapGeocodioResponse", () => {
    it("should map a valid federal+state response to RepresentativeLookupResult", () => {
      const result = mapGeocodioResponse(mockGeocodioResponse, testNormalizedAddress);

      expect(result.status).toBe("supported");
      expect(result.confidence).toBe("high");
      expect(result.source.provider).toBe("geocodio");
      expect(result.source.asOf).toBeInstanceOf(Date);
      expect(result.districts.length).toBeGreaterThan(0);
      expect(result.representatives.length).toBeGreaterThan(0);
      expect(result.unsupportedLevels).toContain("local");
      expect(result.warnings).toHaveLength(0);
    });

    it("should include source/as-of/confidence metadata", () => {
      const result = mapGeocodioResponse(mockGeocodioResponse, testNormalizedAddress);

      expect(result.source.provider).toBe("geocodio");
      expect(result.source.asOf).toBeInstanceOf(Date);
      // Confidence is "medium" because we have district data but placeholder representative info
      expect(result.representatives[0].confidence).toBe("medium");
    });

    it("should flag unsupported local levels explicitly", () => {
      const result = mapGeocodioResponse(mockGeocodioResponse, testNormalizedAddress);

      expect(result.unsupportedLevels).toContain("local");
    });

    it("should handle low-confidence results gracefully", () => {
      const lowConfidenceAddress: NormalizedAddress = {
        normalizedLine1: "999 Unknown Ave",
        city: "Nowhere",
        state: "XX",
        postalCode: "99999",
        country: "US",
        confidence: "low",
        provider: "geocodio"
      };

      const result = mapGeocodioResponse(mockLowConfidenceResponse, lowConfidenceAddress);

      expect(result.status).toBe("low-confidence");
      expect(result.confidence).toBe("low");
    });

    it("should handle no-match results", () => {
      const result = mapGeocodioResponse(mockNoMatchResponse, testNormalizedAddress);

      expect(result.status).toBe("no-match");
      expect(result.confidence).toBe("none");
    });

    it("should separate contact metadata from person/office identity", () => {
      const result = mapGeocodioResponse(mockGeocodioResponse, testNormalizedAddress);

      if (result.representatives.length > 0) {
        const rep = result.representatives[0];
        expect(rep.person).toBeDefined();
        expect(rep.office).toBeDefined();
        expect(rep.contact).toBeDefined();
      }
    });

    it("should never fall back from ZIP alone", () => {
      // If only a ZIP is provided without valid district data, should return low-confidence
      const zipOnlyResponse = {
        results: [
          {
            address: { street: "", city: "", state: "", zip: "20001" },
            location: { lat: 38.9, lng: -77.0 },
            fields: {}, // No districts
            meta: { license: "internal", timestamp: "2024-01-15T10:00:00Z" }
          }
        ]
      };

      const result = mapGeocodioResponse(zipOnlyResponse, testNormalizedAddress);

      // Should NOT return supported with fallback - must be low-confidence or no-match
      expect(result.status).toMatch(/(low-confidence|no-match)/);
    });
  });
});
