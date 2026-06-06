/**
 * Lookup Service
 * 
 * Server-side service for address-to-representative lookups.
 * Coordinates between the provider abstraction and persistence layer.
 * Returns UI-safe lookup results without exposing raw provider payloads.
 */

import type { RepresentativeProvider } from "../../providers/representativeProvider";
import type { NormalizedAddress } from "../../core/address/types";
import type { RepresentativeLookupResult } from "../../core/representatives/types";
import { createRepresentativeProvider } from "../../providers/geocodio/geocodioProvider";
import { GeocodioProvider } from "../../providers/geocodio/geocodioProvider";

export class LookupService {
  private provider: RepresentativeProvider;
  
  constructor(provider?: RepresentativeProvider) {
    // Use provided provider or create the configured one
    this.provider = provider || createRepresentativeProvider();
  }
  
  /**
   * Look up representatives for an address.
   * 
   * @param address - Normalized address from geocoding
   * @returns UI-safe lookup result with source/as-of/confidence metadata
   */
  async lookup(address: NormalizedAddress): Promise<RepresentativeLookupResult> {
    // Delegate to the configured provider
    const result = await this.provider.lookup(address);
    
    // The provider already returns UI-safe results.
    // Additional sanitization happens at the mapper level.
    return result;
  }
  
  /**
   * Check if the current provider is in live mode or fixture mode
   */
  isLiveMode(): boolean {
    return this.provider instanceof GeocodioProvider;
  }
}
