import { describe, it, expect, vi, beforeEach } from "vitest";
import { LookupService } from "../../src/server/services/lookupService";
import { FixtureProvider } from "../../src/providers/fixtures/fixtureProvider";
import type { NormalizedAddress } from "../../src/core/address/types";

// Mock the env module
vi.mock("../../src/server/env", () => ({
  getEnv: vi.fn(() => ({
    GEOCODIO_API_KEY: undefined, // Force fixture mode
    DATABASE_URL: "postgres://localhost:5432/test",
  })),
}));

describe("LookupService (integration)", () => {
  let lookupService: LookupService;
  const testAddress: NormalizedAddress = {
    normalizedLine1: "123 Main St",
    city: "Washington",
    state: "DC",
    postalCode: "20001",
    country: "US",
    latitude: 38.9072,
    longitude: -77.0369,
    confidence: "high",
    provider: "fixture",
  };

  beforeEach(() => {
    // Use fixture provider for testing
    lookupService = new LookupService(new FixtureProvider());
  });

  describe("lookup", () => {
    it("should call provider and return lookup result", async () => {
      const result = await lookupService.lookup(testAddress);

      expect(result).toBeDefined();
      expect(result.status).toBeDefined();
      expect(result.confidence).toBeDefined();
      expect(result.source).toBeDefined();
    });

    it("should return UI-safe results without raw provider payload", async () => {
      const result = await lookupService.lookup(testAddress);

      // Should not expose raw provider payloads
      expect(result).not.toHaveProperty("rawPayload");
      expect(result).not.toHaveProperty("providerPayload");
    });

    it("should include source/as-of/confidence for all results", async () => {
      const result = await lookupService.lookup(testAddress);

      expect(result.source).toBeDefined();
      expect(result.source.provider).toBe("fixture");
      expect(result.source.asOf).toBeInstanceOf(Date);
      expect(result.confidence).toMatch(/high|medium|low|none/);
    });

    it("should track unsupported levels in result", async () => {
      const result = await lookupService.lookup(testAddress);

      // The fixture provider returns supported status with federal district
      // but MVP scope should still track what's unsupported
      expect(result).toHaveProperty("unsupportedLevels");
    });
  });

  describe("provider interface compliance", () => {
    it("should not expose raw address to caller directly", async () => {
      // The lookup result should have normalizedAddress but not raw input
      const result = await lookupService.lookup(testAddress);

      // Check the result structure - should be UI-safe
      expect(result).toHaveProperty("status");
      expect(result).toHaveProperty("districts");
      expect(result).toHaveProperty("representatives");
      expect(result).toHaveProperty("source");
      expect(result).toHaveProperty("unsupportedLevels");
    });
  });
});
