import type { AddressNormalizationInput, PersistableAddressSnapshot } from "./types";

export function minimizeAddressForPersistence(input: AddressNormalizationInput): PersistableAddressSnapshot {
  return {
    normalizedLine1: input.normalizedLine1,
    normalizedLine2: input.normalizedLine2,
    city: input.city,
    state: input.state,
    postalCode: input.postalCode,
    country: input.country,
    latitude: input.latitude,
    longitude: input.longitude,
    confidence: input.confidence,
    provider: input.provider,
  };
}
