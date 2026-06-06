import type { JurisdictionLevel, RepresentativeLookupResult, SupportScopeEvaluation } from "./types";

const supportedMvpLevels: JurisdictionLevel[] = ["federal", "state"];

export function evaluateLookupSupport(result: RepresentativeLookupResult): SupportScopeEvaluation {
  const supportedLevels = supportedMvpLevels.filter((level) =>
    result.districts.some((district) => district.level === level),
  );

  return {
    status: result.status,
    supportedLevels: result.status === "supported" ? supportedLevels : [],
    unsupportedLevels: result.unsupportedLevels,
    requiresUserCaution: result.status !== "supported" || result.confidence === "low" || result.warnings.length > 0,
  };
}

export function isMvpSupportedLevel(level: JurisdictionLevel): boolean {
  return supportedMvpLevels.includes(level);
}
