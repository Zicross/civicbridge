import type { RepresentativeLookupResult, JurisdictionLevel, RepresentativeSnapshot } from "@/core/representatives/types";

interface RepresentativeListProps {
  result: RepresentativeLookupResult | null;
}

function getLevelLabel(level: JurisdictionLevel): string {
  switch (level) {
    case "federal":
      return "Federal";
    case "state":
      return "State";
    case "local":
      return "Local";
    default:
      return level;
  }
}

export default function RepresentativeList({ result }: RepresentativeListProps) {
  if (!result) {
    return null;
  }

  // Handle no-match or low-confidence
  if (result.status === "no-match") {
    return (
      <div style={{ padding: "1rem", backgroundColor: "#fef3c7", borderRadius: "4px", marginBottom: "1.5rem" }}>
        <p style={{ margin: 0, color: "#92400e" }}>
          <strong>Address not found.</strong> We couldn&apos;t find representatives for this address.
          Please check your address and try again.
        </p>
      </div>
    );
  }

  if (result.status === "low-confidence" || result.confidence === "low") {
    return (
      <div style={{ padding: "1rem", backgroundColor: "#fef3c7", borderRadius: "4px", marginBottom: "1.5rem" }}>
        <p style={{ margin: 0, color: "#92400e" }}>
          <strong>Low confidence match.</strong> The address you entered may not be accurate.
          Results below may not be your actual representatives.
        </p>
      </div>
    );
  }

  // Group representatives by level
  const federalReps = result.representatives.filter((r: RepresentativeSnapshot) => r.office.level === "federal");
  const stateReps = result.representatives.filter((r: RepresentativeSnapshot) => r.office.level === "state");

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <h3 style={{ marginBottom: "1rem" }}>Your Representatives</h3>

      {/* Metadata */}
      <div style={{ fontSize: "0.875rem", color: "#666", marginBottom: "1rem" }}>
        <p style={{ margin: "0.25rem 0" }}>
          <strong>Source:</strong> {result.source.provider}
          <span style={{ marginLeft: "1rem" }}>
            <strong>As of:</strong> {result.source.asOf.toLocaleDateString()}
          </span>
          <span style={{ marginLeft: "1rem" }}>
            <strong>Confidence:</strong> {result.confidence}
          </span>
        </p>
        {result.warnings.length > 0 && (
          <p style={{ margin: "0.25rem 0", color: "#92400e" }}>
            <strong>Note:</strong> {result.warnings.join("; ")}
          </p>
        )}
      </div>

      {/* Unsupported levels notice */}
      {result.unsupportedLevels.length > 0 && (
        <div style={{ padding: "0.75rem", backgroundColor: "#f3f4f6", borderRadius: "4px", marginBottom: "1rem" }}>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "#666" }}>
            <strong>Note:</strong> ConstiuINT currently supports federal and state representatives only.
            The following levels are not supported: {result.unsupportedLevels.map(getLevelLabel).join(", ")}.
          </p>
        </div>
      )}

      {/* Federal Representatives */}
      {federalReps.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <h4 style={{ marginBottom: "0.5rem", color: "#374151" }}>Federal</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {federalReps.map((rep, idx) => (
              <li
                key={rep.person.id || idx}
                style={{
                  padding: "0.75rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "4px",
                  marginBottom: "0.5rem",
                }}
              >
                <div style={{ fontWeight: 500 }}>{rep.person.displayName}</div>
                <div style={{ fontSize: "0.875rem", color: "#666" }}>
                  {rep.office.title}
                  {rep.office.district.identifier && ` — ${rep.office.district.identifier}`}
                  {rep.person.party && ` (${rep.person.party})`}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* State Representatives */}
      {stateReps.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <h4 style={{ marginBottom: "0.5rem", color: "#374151" }}>State</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {stateReps.map((rep, idx) => (
              <li
                key={rep.person.id || idx}
                style={{
                  padding: "0.75rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "4px",
                  marginBottom: "0.5rem",
                }}
              >
                <div style={{ fontWeight: 500 }}>{rep.person.displayName}</div>
                <div style={{ fontSize: "0.875rem", color: "#666" }}>
                  {rep.office.title}
                  {rep.office.district.identifier && ` — ${rep.office.district.identifier}`}
                  {rep.person.party && ` (${rep.person.party})`}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Empty state */}
      {result.representatives.length === 0 && (
        <p style={{ color: "#666" }}>No representatives found for this address.</p>
      )}
    </div>
  );
}
