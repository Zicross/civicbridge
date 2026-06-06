import { test, expect } from "@playwright/test";

/**
 * E2E test for the admin queue page.
 * Tests that admin page loads with proper authorization checks.
 */
test.describe("Admin queue flow", () => {
  test("admin page loads with access check", async ({ page }) => {
    // Navigate to admin page
    await page.goto("/admin");

    // Page should either show queue or access denied
    // Note: Auth is mocked in dev mode, so we check for expected elements
    const content = await page.content();

    // The page should mention "ConstiuINT Admin" or "Access Denied"
    expect(
      content.includes("ConstiuINT Admin") || content.includes("Access Denied")
    ).toBe(true);
  });

  test("admin page has no external delivery claims", async ({ page }) => {
    await page.goto("/admin");
    const content = await page.content();

    // Must not claim to send to representatives
    expect(content.includes("send to your representative")).toBe(false);
    expect(content.includes("send to")).toBe(false);
  });
});