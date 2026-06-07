import { test, expect } from "@playwright/test";

test.describe("Admin Page Structure", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin");
  });

  test("admin page loads without crash", async ({ page }) => {
    // Page should load without throwing
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).toContain("/admin");
  });

  test("no unhandled errors on admin page", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForTimeout(1000);
    
    const content = await page.content();
    // Should not expose raw errors
    expect(content).not.toMatch(/Error:.*stack/);
    expect(content).not.toMatch(/500.*Internal Server Error/);
  });
});

test.describe("Admin Navigation", () => {
  test("can navigate from admin to intake", async ({ page }) => {
    await page.goto("/admin");
    
    // Look for home or intake link
    const homeLink = page.getByRole("link", { name: /home|intake|back/i });
    
    if (await homeLink.count() > 0) {
      await homeLink.first().click();
      await expect(page).toHaveURL(/\/intake|\/$/);
    }
  });

  test("admin URL is correct", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin/);
  });
});