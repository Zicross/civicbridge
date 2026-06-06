export type AddressConfidence = "high" | "medium" | "low" | "no-match";

export type AddressProviderName = "fixture" | "geocodio" | "manual";

export type NormalizedAddress = {
  normalizedLine1: string;
  normalizedLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: "US";
  latitude?: number;
  longitude?: number;
  confidence: AddressConfidence;
  provider: AddressProviderName;
};

export type AddressNormalizationInput = NormalizedAddress & {
  rawInput: string;
  providerPayload?: unknown;
};

export type PersistableAddressSnapshot = NormalizedAddress;
