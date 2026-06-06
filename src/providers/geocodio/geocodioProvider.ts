/**
 * Geocodio Provider Adapter
 * 
 * Implements the RepresentativeProvider interface for Geocodio API.
 * Falls back to fixture provider if API key is not configured.
 * 
 * API Documentation: https://www.geocod.io/docs/
 */

import type { RepresentativeProvider } from "../representativeProvider";
import type { NormalizedAddress } from "../../core/address/types";
import type { RepresentativeLookupResult } from "../../core/representatives/types";
import { mapGeocodioResponse } from "./mapper";
import { getEnv, isGeocodioConfigured } from "../../server/env";
import { FixtureProvider } from "../fixtures/fixtureProvider";

const GEOCODIO_API_BASE = "https://api.geocod.io/v1";

export class GeocodioProvider implements RepresentativeProvider {
  private apiKey: string;
  private fallbackProvider: RepresentativeProvider | null = null;
  
  constructor() {
    const env = getEnv();
    this.apiKey = env.GEOCODIO_API_KEY || "";
    
    if (!this.apiKey) {
      console.warn("GEOCODIO_API_KEY not configured - using fixture provider");
      this.fallbackProvider = new FixtureProvider();
    }
  }
  
  /**
   * Look up representatives for a normalized address
   */
  async lookup(address: NormalizedAddress): Promise<RepresentativeLookupResult> {
    // If no API key, fall back to fixture provider
    if (!this.apiKey) {
      return this.fallbackProvider!.lookup(address);
    }
    
    try {
      // Build the geocoding request
      const query = this.buildAddressQuery(address);
      const url = `${GEOCODIO_API_BASE}/geocode?api_key=${this.apiKey}&${query}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Geocodio API error: ${response.status} ${error}`);
      }
      
      const data = await response.json();
      
      // Map the response to our domain types
      return mapGeocodioResponse(data, address);
    } catch (error) {
      // Fail closed: on any error, return no-match rather than exposing internal errors
      console.error("Geocodio lookup failed:", error);
      
      return {
        status: "no-match",
        confidence: "none",
        source: { provider: "geocodio", asOf: new Date() },
        districts: [],
        representatives: [],
        unsupportedLevels: ["local"],
        warnings: ["Provider lookup failed - using fallback"],
      };
    }
  }
  
  /**
   * Build address query string for Geocodio API
   */
  private buildAddressQuery(address: NormalizedAddress): string {
    const parts: string[] = [];
    
    if (address.normalizedLine1) {
      parts.push(`street=${encodeURIComponent(address.normalizedLine1)}`);
    }
    if (address.city) {
      parts.push(`city=${encodeURIComponent(address.city)}`);
    }
    if (address.state) {
      parts.push(`state=${encodeURIComponent(address.state)}`);
    }
    if (address.postalCode) {
      parts.push(`zip=${encodeURIComponent(address.postalCode)}`);
    }
    
    // Request additional fields for representative lookup
    parts.push("fields=congressional_district,state_legislative_districts,county");
    
    return parts.join("&");
  }
}

/**
 * Factory function to get the configured provider
 */
export function createRepresentativeProvider(): RepresentativeProvider {
  if (isGeocodioConfigured()) {
    return new GeocodioProvider();
  }
  
  console.warn("Using fixture provider - set GEOCODIO_API_KEY for live data");
  return new FixtureProvider();
}
