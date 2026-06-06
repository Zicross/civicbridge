/**
 * Maps Geocodio API responses to ConstiuINT core types.
 * 
 * This mapper is pure and independently testable - it does not make network calls.
 * It transforms raw Geocodio responses into the RepresentativeLookupResult type
 * used throughout the application.
 */

import type {
  RepresentativeLookupResult,
  RepresentativeSnapshot,
  District,
  JurisdictionLevel,
  LookupConfidence,
  RepresentativeSource,
  RepresentativePerson,
  RepresentativeOffice,
  RepresentativeContact,
} from "../../core/representatives/types";
import type { NormalizedAddress } from "../../core/address/types";

// Geocodio API response structure (field names from their API)
interface GeocodioResult {
  address: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  location?: {
    lat: number;
    lng: number;
  };
  fields?: {
    congressional_district?: { district?: string; name?: string };
    state_legislative_districts?: {
      upper?: { district?: string; name?: string };
      lower?: { district?: string; name?: string };
    };
    county?: { name?: string; fips?: string };
  };
  meta?: {
    license?: string;
    timestamp?: string;
  };
}

interface GeocodioResponse {
  results: GeocodioResult[];
}

/**
 * Maps a Geocodio API response to a RepresentativeLookupResult.
 * 
 * @param geocodioResponse - Raw response from Geocodio API
 * @param normalizedAddress - The normalized address that was queried
 * @returns RepresentativeLookupResult with source/as-of/confidence metadata
 */
export function mapGeocodioResponse(
  geocodioResponse: GeocodioResponse,
  normalizedAddress: NormalizedAddress
): RepresentativeLookupResult {
  const results = geocodioResponse.results;
  
  // Handle no results
  if (!results || results.length === 0) {
    return createNoMatchResult();
  }

  const result = results[0];
  
  // Determine if this is a low-confidence result (no district data)
  const hasDistrictData = hasValidDistrictData(result);
  
  if (!hasDistrictData) {
    return createLowConfidenceResult(normalizedAddress);
  }

  // Extract districts and representatives from valid result
  const districts = extractDistricts(result);
  const representatives = extractRepresentatives(result);
  
  // Determine confidence based on data completeness
  const confidence = determineConfidence(result);
  
  // Determine unsupported levels (local is not supported in MVP)
  const unsupportedLevels: JurisdictionLevel[] = ["local"];
  
  return {
    status: confidence === "high" ? "supported" : "low-confidence",
    confidence,
    source: {
      provider: "geocodio",
      asOf: result.meta?.timestamp ? new Date(result.meta.timestamp) : new Date(),
    },
    districts,
    representatives,
    unsupportedLevels,
    warnings: extractWarnings(result),
  };
}

/**
 * Creates a no-match result when no address data is found
 */
function createNoMatchResult(): RepresentativeLookupResult {
  return {
    status: "no-match",
    confidence: "none",
    source: { provider: "geocodio", asOf: new Date() },
    districts: [],
    representatives: [],
    unsupportedLevels: ["local"],
    warnings: ["No matching address found in Geocodio database"],
  };
}

/**
 * Creates a low-confidence result when address exists but lacks district data
 */
function createLowConfidenceResult(_address: NormalizedAddress): RepresentativeLookupResult {
  return {
    status: "low-confidence",
    confidence: "low",
    source: { provider: "geocodio", asOf: new Date() },
    districts: [],
    representatives: [],
    unsupportedLevels: ["local"],
    warnings: ["Address found but no district data available"],
  };
}

/**
 * Checks if the Geocodio result has valid district data
 */
function hasValidDistrictData(result: GeocodioResult): boolean {
  const fields = result.fields;
  if (!fields) return false;
  
  return !!(
    fields.congressional_district?.district ||
    fields.state_legislative_districts?.upper?.district ||
    fields.state_legislative_districts?.lower?.district
  );
}

/**
 * Extracts district information from Geocodio result
 */
function extractDistricts(result: GeocodioResult): District[] {
  const districts: District[] = [];
  const fields = result.fields;
  
  if (!fields) return districts;
  
  // Congressional district (federal level)
  if (fields.congressional_district?.district) {
    districts.push({
      level: "federal",
      kind: "congressional",
      identifier: fields.congressional_district.district,
      name: fields.congressional_district.name,
    });
  }
  
  // State legislative upper chamber
  if (fields.state_legislative_districts?.upper?.district) {
    districts.push({
      level: "state",
      kind: "state-legislative-upper",
      identifier: fields.state_legislative_districts.upper.district,
      name: fields.state_legislative_districts.upper.name,
    });
  }
  
  // State legislative lower chamber
  if (fields.state_legislative_districts?.lower?.district) {
    districts.push({
      level: "state",
      kind: "state-legislative-lower",
      identifier: fields.state_legislative_districts.lower.district,
      name: fields.state_legislative_districts.lower.name,
    });
  }
  
  return districts;
}

/**
 * Extracts representative snapshots from Geocodio result.
 * 
 * NOTE: This creates placeholder representatives based on district data.
 * In a real implementation, this would need to cross-reference with
 * a representative data source (e.g., OpenStates API).
 */
function extractRepresentatives(result: GeocodioResult): RepresentativeSnapshot[] {
  const snapshots: RepresentativeSnapshot[] = [];
  const fields = result.fields;
  const source: RepresentativeSource = {
    provider: "geocodio",
    asOf: result.meta?.timestamp ? new Date(result.meta.timestamp) : new Date(),
  };
  
  if (!fields) return snapshots;
  
  // Create congressional representative placeholder
  if (fields.congressional_district?.district) {
    const district: District = {
      level: "federal",
      kind: "congressional",
      identifier: fields.congressional_district.district,
      name: fields.congressional_district.name,
    };
    
    snapshots.push(createRepresentativeSnapshot(
      `rep-${fields.congressional_district.district}`,
      "Congressional Representative",
      "federal",
      district,
      source,
      "medium" // Geocodio provides district, but we still need to lookup representative
    ));
  }
  
  // Create state senate placeholder
  if (fields.state_legislative_districts?.upper?.district) {
    const district: District = {
      level: "state",
      kind: "state-legislative-upper",
      identifier: fields.state_legislative_districts.upper.district,
      name: fields.state_legislative_districts.upper.name,
    };
    
    snapshots.push(createRepresentativeSnapshot(
      `sen-${fields.state_legislative_districts.upper.district}`,
      "State Senator",
      "state",
      district,
      source,
      "medium"
    ));
  }
  
  // Create state house placeholder
  if (fields.state_legislative_districts?.lower?.district) {
    const district: District = {
      level: "state",
      kind: "state-legislative-lower",
      identifier: fields.state_legislative_districts.lower.district,
      name: fields.state_legislative_districts.lower.name,
    };
    
    snapshots.push(createRepresentativeSnapshot(
      `rep-state-${fields.state_legislative_districts.lower.district}`,
      "State Representative",
      "state",
      district,
      source,
      "medium"
    ));
  }
  
  return snapshots;
}

/**
 * Helper to create a representative snapshot with placeholder data
 */
function createRepresentativeSnapshot(
  id: string,
  title: string,
  level: JurisdictionLevel,
  district: District,
  source: RepresentativeSource,
  confidence: LookupConfidence
): RepresentativeSnapshot {
  const person: RepresentativePerson = {
    id,
    displayName: `[${title} - ${district.identifier}]`,
  };
  
  const office: RepresentativeOffice = {
    id: `office-${id}`,
    title,
    level,
    district,
  };
  
  // Contact data is separated from person/office identity
  const contact: RepresentativeContact = {
    websiteUrl: undefined,
    phone: undefined,
    email: undefined,
  };
  
  return {
    person,
    office,
    contact,
    source,
    confidence,
  };
}

/**
 * Determines the confidence level based on data completeness
 */
function determineConfidence(result: GeocodioResult): LookupConfidence {
  const fields = result.fields;
  
  if (!fields) return "low";
  
  // High confidence: has at least congressional district
  if (fields.congressional_district?.district) {
    return "high";
  }
  
  // Medium confidence: has state legislative districts
  if (fields.state_legislative_districts?.upper?.district || 
      fields.state_legislative_districts?.lower?.district) {
    return "medium";
  }
  
  return "low";
}

/**
 * Extracts any warnings from the Geocodio result
 */
function extractWarnings(result: GeocodioResult): string[] {
  const warnings: string[] = [];
  
  // Check if address has street number (may be a centroid result)
  if (!result.address?.street) {
    warnings.push("Address may be a centroid/geocode without street-level precision");
  }
  
  return warnings;
}
