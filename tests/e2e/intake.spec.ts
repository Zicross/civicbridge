import { test, expect } from "@playwright/test";

test.describe("Public Intake Flow", () => {
  const FIXTURE_ADDRESS = "1600 Pennsylvania Avenue NW, Washington, DC 20500";

  test.beforeEach(async ({ page }) => {
    await page.goto("/intake");
  });

  test("page uses ConstiuINT name", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /constiuint/i })).toBeVisible();
  });

  test('copy says "submit for review/triage," not "send to representative"', async ({ page }) => {
    const pageContent = await page.content();
    expect(pageContent.toLowerCase()).not.toMatch(/send to your representative/i);
    expect(pageContent.toLowerCase()).toMatch(/submit.*review|submit.*triage|for constiuint review/i);
  });

  test("address lookup returns representatives", async ({ page }) => {
    // Fill address and press Enter to submit - more reliable for React forms
    await page.locator("#address-input").fill(FIXTURE_ADDRESS);
    await page.locator("#address-input").press("Enter");

    // Should show representative list
    await expect(page.getByRole("heading", { name: /representatives/i })).toBeVisible();
  });

  test("representative list shows source/as-of/confidence", async ({ page }) => {
    await page.locator("#address-input").fill(FIXTURE_ADDRESS);
    await page.locator("#address-input").press("Enter");

    // Should show at least one representative with metadata
    await expect(page.getByText(/source:/i)).toBeVisible();
    await expect(page.getByText(/as of:/i)).toBeVisible();
  });

  test("unsupported local levels shown honestly", async ({ page }) => {
    await page.locator("#address-input").fill(FIXTURE_ADDRESS);
    await page.locator("#address-input").press("Enter");

    // Should mention local levels are not supported
    await expect(page.getByText(/local|county|city/i)).toBeVisible();
  });

  test("user must choose issue/topic category before submission", async ({ page }) => {
    await page.locator("#address-input").fill(FIXTURE_ADDRESS);
    await page.locator("#address-input").press("Enter");

    // Try to submit without issue category
    await page.getByLabel(/message/i, { exact: false }).fill("Test message");
    await page.getByRole("button", { name: /submit/i }).click();

    // Should show error about category
    await expect(page.getByText(/select.*topic|choose.*issue/i)).toBeVisible();
  });

  test("submission blocked until consent checked", async ({ page }) => {
    await page.locator("#address-input").fill(FIXTURE_ADDRESS);
    await page.locator("#address-input").press("Enter");

    // Fill in category and message
    await page.getByLabel(/topic|issue/i).selectOption("education");
    await page.getByLabel(/message/i, { exact: false }).fill("Test message for consent test");

    // Try to submit without consent
    await page.getByRole("button", { name: /submit/i }).click();

    // Should require consent
    await expect(page.getByText(/consent/i)).toBeVisible();
  });

  test("successful submission displays internal-review status", async ({ page }) => {
    // This test requires authenticated session - mark as TODO with fixture auth
    test.skip(true, "Requires email magic-link session - implement with test auth");
  });
});
