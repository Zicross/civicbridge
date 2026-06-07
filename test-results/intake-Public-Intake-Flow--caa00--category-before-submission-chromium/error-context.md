# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: intake.spec.ts >> Public Intake Flow >> user must choose issue/topic category before submission
- Location: tests/e2e/intake.spec.ts:46:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByLabel(/message/i)

```

# Page snapshot

```yaml
- main [ref=e2]:
  - generic [ref=e3]:
    - heading "ConstiuINT" [level=1] [ref=e4]
    - paragraph [ref=e5]: Constituent Intelligence — Structured Civic Feedback
  - generic [ref=e6]:
    - paragraph [ref=e7]: ConstiuINT helps you provide structured feedback to your representatives. Enter your address to see who represents you at the federal and state levels, then submit your feedback for ConstiuINT review.
    - generic [ref=e8]:
      - generic [ref=e9]:
        - generic [ref=e10]: Your Address
        - textbox "Your Address" [active] [ref=e11]:
          - /placeholder: 1600 Pennsylvania Avenue NW, Washington, DC 20500
          - text: 1600 Pennsylvania Avenue NW, Washington, DC 20500
        - paragraph [ref=e12]: Enter your address to find your representatives at the federal and state levels.
      - button "Find My Representatives" [disabled] [ref=e13] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Public Intake Flow", () => {
  4  |   const FIXTURE_ADDRESS = "1600 Pennsylvania Avenue NW, Washington, DC 20500";
  5  | 
  6  |   test.beforeEach(async ({ page }) => {
  7  |     await page.goto("/intake");
  8  |   });
  9  | 
  10 |   test("page uses ConstiuINT name", async ({ page }) => {
  11 |     await expect(page.getByRole("heading", { name: /constiuint/i })).toBeVisible();
  12 |   });
  13 | 
  14 |   test('copy says "submit for review/triage," not "send to representative"', async ({ page }) => {
  15 |     const pageContent = await page.content();
  16 |     expect(pageContent.toLowerCase()).not.toMatch(/send to your representative/i);
  17 |     expect(pageContent.toLowerCase()).toMatch(/submit.*review|submit.*triage|for constiuint review/i);
  18 |   });
  19 | 
  20 |   test("address lookup returns representatives", async ({ page }) => {
  21 |     // Fill address and press Enter to submit - more reliable for React forms
  22 |     await page.locator("#address-input").fill(FIXTURE_ADDRESS);
  23 |     await page.locator("#address-input").press("Enter");
  24 | 
  25 |     // Should show representative list
  26 |     await expect(page.getByRole("heading", { name: /representatives/i })).toBeVisible();
  27 |   });
  28 | 
  29 |   test("representative list shows source/as-of/confidence", async ({ page }) => {
  30 |     await page.locator("#address-input").fill(FIXTURE_ADDRESS);
  31 |     await page.locator("#address-input").press("Enter");
  32 | 
  33 |     // Should show at least one representative with metadata
  34 |     await expect(page.getByText(/source:/i)).toBeVisible();
  35 |     await expect(page.getByText(/as of:/i)).toBeVisible();
  36 |   });
  37 | 
  38 |   test("unsupported local levels shown honestly", async ({ page }) => {
  39 |     await page.locator("#address-input").fill(FIXTURE_ADDRESS);
  40 |     await page.locator("#address-input").press("Enter");
  41 | 
  42 |     // Should mention local levels are not supported
  43 |     await expect(page.getByText(/local|county|city/i)).toBeVisible();
  44 |   });
  45 | 
  46 |   test("user must choose issue/topic category before submission", async ({ page }) => {
  47 |     await page.locator("#address-input").fill(FIXTURE_ADDRESS);
  48 |     await page.locator("#address-input").press("Enter");
  49 | 
  50 |     // Try to submit without issue category
> 51 |     await page.getByLabel(/message/i, { exact: false }).fill("Test message");
     |                                                         ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  52 |     await page.getByRole("button", { name: /submit/i }).click();
  53 | 
  54 |     // Should show error about category
  55 |     await expect(page.getByText(/select.*topic|choose.*issue/i)).toBeVisible();
  56 |   });
  57 | 
  58 |   test("submission blocked until consent checked", async ({ page }) => {
  59 |     await page.locator("#address-input").fill(FIXTURE_ADDRESS);
  60 |     await page.locator("#address-input").press("Enter");
  61 | 
  62 |     // Fill in category and message
  63 |     await page.getByLabel(/topic|issue/i).selectOption("education");
  64 |     await page.getByLabel(/message/i, { exact: false }).fill("Test message for consent test");
  65 | 
  66 |     // Try to submit without consent
  67 |     await page.getByRole("button", { name: /submit/i }).click();
  68 | 
  69 |     // Should require consent
  70 |     await expect(page.getByText(/consent/i)).toBeVisible();
  71 |   });
  72 | 
  73 |   test("successful submission displays internal-review status", async ({ page }) => {
  74 |     // This test requires authenticated session - mark as TODO with fixture auth
  75 |     test.skip(true, "Requires email magic-link session - implement with test auth");
  76 |   });
  77 | });
  78 | 
```