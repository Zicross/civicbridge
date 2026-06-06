const principles = [
  "Find supported representatives with visible source, confidence, and support limits.",
  "Submit structured civic feedback for ConstiuINT review and triage.",
  "Build toward better constituency intelligence without noisy political text-spam.",
];

export default function HomePage() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", margin: "0 auto", maxWidth: "64rem", padding: "4rem 1.5rem" }}>
      <p style={{ color: "#475569", fontSize: "0.875rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
        Structured civic feedback infrastructure
      </p>
      <h1 style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", lineHeight: 1, margin: "1rem 0" }}>
        ConstiuINT
      </h1>
      <p style={{ color: "#334155", fontSize: "1.25rem", lineHeight: 1.7, maxWidth: "48rem" }}>
        ConstiuINT helps constituents understand supported representation, organize issue-specific civic feedback,
        and submit messages for internal ConstiuINT review before any future representative delivery workflow exists.
      </p>

      <section aria-labelledby="mvp-actions" style={{ display: "grid", gap: "1rem", marginTop: "2.5rem" }}>
        <h2 id="mvp-actions">MVP foundation</h2>
        <ul style={{ display: "grid", gap: "0.75rem", paddingLeft: "1.25rem" }}>
          <li>Find supported representatives</li>
          <li>Submit a message for ConstiuINT review</li>
          <li>Track consent, issue category, and admin queue status before any external delivery claims</li>
        </ul>
      </section>

      <section aria-labelledby="trust-principles" style={{ marginTop: "2.5rem" }}>
        <h2 id="trust-principles">Trust principles</h2>
        <ul style={{ display: "grid", gap: "0.75rem", paddingLeft: "1.25rem" }}>
          {principles.map((principle) => (
            <li key={principle}>{principle}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
