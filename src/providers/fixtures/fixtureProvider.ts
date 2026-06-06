import type { RepresentativeProvider } from "../representativeProvider";
import type { NormalizedAddress } from "../../core/address/types";
import type { RepresentativeLookupResult, RepresentativeSnapshot, District, JurisdictionLevel, RepresentativeSource, LookupStatus, LookupConfidence } from "../../core/representatives/types";
import { goldenAddresses } from "./goldenAddresses";

export class FixtureProvider implements RepresentativeProvider {
  async lookup(address: NormalizedAddress): Promise<RepresentativeLookupResult> {
    // Simple deterministic response for any address; if address matches first golden, return supported, else no-match
    const isKnown = goldenAddresses.some((a) => a.normalizedLine1 === address.normalizedLine1 && a.postalCode === address.postalCode);

    if (!isKnown) {
      return {
        status: "no-match" as LookupStatus,
        confidence: "none" as LookupConfidence,
        source: { provider: "fixture", asOf: new Date() },
        districts: [],
        representatives: [],
        unsupportedLevels: [],
        warnings: [],
      };
    }

    const source: RepresentativeSource = { provider: "fixture", asOf: new Date() };
    const district: District = { level: "federal" as JurisdictionLevel, kind: "congressional", identifier: "DC-0" };
    const rep: RepresentativeSnapshot = {
      person: { id: "rep-1", displayName: "John Doe" },
      office: { id: "office-1", title: "Congressional Representative", level: "federal" as JurisdictionLevel, district },
      source,
      confidence: "high" as LookupConfidence,
    };

    return {
      status: "supported" as LookupStatus,
      confidence: "high" as LookupConfidence,
      source,
      districts: [district],
      representatives: [rep],
      unsupportedLevels: [],
      warnings: [],
    };
  }
}
