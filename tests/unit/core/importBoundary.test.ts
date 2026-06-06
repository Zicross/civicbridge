import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const forbiddenImportPatterns = [
  /from\s+["']next(?:\/|["'])/,
  /from\s+["']react["']/,
  /from\s+["']drizzle-orm(?:\/|["'])/,
  /from\s+["']@\/server(?:\/|["'])/,
  /from\s+["']@\/providers(?:\/|["'])/,
  /from\s+["']\.\.\/\.\.\/server(?:\/|["'])/,
  /from\s+["']\.\.\/\.\.\/providers(?:\/|["'])/,
];

function collectTypeScriptFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) {
      return collectTypeScriptFiles(path);
    }
    return path.endsWith(".ts") || path.endsWith(".tsx") ? [path] : [];
  });
}

describe("trust-core import boundaries", () => {
  it("keeps src/core framework, provider, and server independent", () => {
    const files = collectTypeScriptFiles("src/core");

    expect(files).toEqual(
      expect.arrayContaining([
        expect.stringContaining("src/core/address/types.ts"),
        expect.stringContaining("src/core/representatives/types.ts"),
        expect.stringContaining("src/core/messages/stateMachine.ts"),
        expect.stringContaining("src/core/audit/redaction.ts"),
      ]),
    );

    for (const file of files) {
      const source = readFileSync(file, "utf8");
      for (const pattern of forbiddenImportPatterns) {
        expect(source, `${file} must not match ${pattern}`).not.toMatch(pattern);
      }
    }
  });
});
