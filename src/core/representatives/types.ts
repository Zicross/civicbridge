export type JurisdictionLevel = "federal" | "state" | "local";

export type DistrictKind =
  | "congressional"
  | "senate"
  | "state-legislative-upper"
  | "state-legislative-lower"
  | "local";

export type LookupStatus = "supported" | "unsupported-local" | "low-confidence" | "no-match";

export type LookupConfidence = "high" | "medium" | "low" | "none";

export type RepresentativeSource = {
  provider: "fixture" | "geocodio" | "openstates" | "manual";
  asOf: Date;
  lastVerifiedAt?: Date;
};

export type District = {
  level: JurisdictionLevel;
  kind: DistrictKind;
  identifier: string;
  name?: string;
};

export type RepresentativePerson = {
  id: string;
  displayName: string;
  party?: string;
};

export type RepresentativeOffice = {
  id: string;
  title: string;
  level: JurisdictionLevel;
  district: District;
};

export type RepresentativeContact = {
  websiteUrl?: string;
  phone?: string;
  email?: string;
};

export type RepresentativeSnapshot = {
  person: RepresentativePerson;
  office: RepresentativeOffice;
  contact?: RepresentativeContact;
  source: RepresentativeSource;
  confidence: LookupConfidence;
};

export type RepresentativeLookupResult = {
  status: LookupStatus;
  confidence: LookupConfidence;
  source: RepresentativeSource;
  districts: District[];
  representatives: RepresentativeSnapshot[];
  unsupportedLevels: JurisdictionLevel[];
  warnings: string[];
};

export type SupportScopeEvaluation = {
  status: LookupStatus;
  supportedLevels: JurisdictionLevel[];
  unsupportedLevels: JurisdictionLevel[];
  requiresUserCaution: boolean;
};
