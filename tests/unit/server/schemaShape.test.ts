

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";

describe("schema privacy constraints", () => {
  it("audit_events must not store raw address, message body, or provider payload", () => {
    const schemaPath = join(process.cwd(), "src", "server", "db", "schema.ts");
    const source = readFileSync(schemaPath, "utf8");
    const prohibited = ["messageBody", "rawAddress", "rawProviderPayload"];
    for (const term of prohibited) {
      expect(source).not.toMatch(new RegExp(`\\b${term}\\b`));
    }
  });
});
