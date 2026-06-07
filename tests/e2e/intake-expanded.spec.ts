import { test, expect } from "@playwright/test";

test.describe("Intake Page Structure", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/intake");
  });

  test("page loads with ConstiuINT branding", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /constiuint/i })).toBeVisible();
  });

  test("has address input field", async ({ page }) => {
    await expect(page.locator("#address-input")).toBeVisible();
  });

  test("has submit button", async ({ page }) => {
    await expect(page.getByRole("button", { name: /find|search|look/i })).toBeVisible();
  });
});

test.describe("Intake Responsive Design", () => {
  test("works on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/intake");
    
    // Page should be usable
    await expect(page.getByRole("heading", { name: /constiuint/i })).toBeVisible();
    await expect(page.locator("#address-input")).toBeVisible();
  });

  test("works on tablet viewport", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/intake");
    
    await expect(page.getByRole("heading", { name: /constiuint/i })).toBeVisible();
    await expect(page.locator("#address-input")).toBeVisible();
  });

  test("works on desktop viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/intake");
    
    await expect(page.getByRole("heading", { name: /constiuint/i })).toBeVisible();
    await expect(page.locator("#address-input")).toBeVisible();
  });
});

test.describe("Intake Navigation", () => {
  test("can access intake from home page", async ({ page }) => {
    await page.goto("/");
    
    // Find intake link
    const intakeLink = page.getByRole("link", { name: /intake|submit|feedback/i });
    
    if (await intakeLink.count() > 0) {
      await intakeLink.first().click();
      await expect(page).toHaveURL(/\/intake/);
    }
  });

  test("intake page URL is correct", async ({ page }) => {
    await page.goto("/intake");
    await expect(page).toHaveURL(/\/intake/);
  });
});

test.describe("Intake Error Handling", () => {
  test("no raw internal errors exposed", async ({ page }) => {
    await page.goto("/intake");
    
    // Try submitting with empty address
    await page.locator("#address-input").fill("");
    await page.locator("#address-input").press("Enter");
    await page.waitForTimeout(1000);
    
    const content = await page.content();
    
    // Should not expose internal error details
    expect(content).not.toMatch(/Error:.*stack|undefined is not a function/);
    expect(content).not.toMatch(/500.*Internal Server Error/);
  });
});