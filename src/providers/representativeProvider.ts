// Provider interface for representative lookup
import type { NormalizedAddress } from "../core/address/types";
import type { RepresentativeLookupResult } from "../core/representatives/types";

export interface RepresentativeProvider {
  /**
   * Given a normalized address, return a lookup result containing representatives and metadata.
   */
  lookup(address: NormalizedAddress): Promise<RepresentativeLookupResult>;
}
