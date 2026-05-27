/**
 * Homepage tests — verifies the simplified landing page looks correct
 * and every entry point into the workflow is accessible.
 */
import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads and shows hero headline", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Make a home offer");
    await expect(page.locator("h1")).toContainText("without an agent");
  });

  test("primary CTA button is visible and links to offer-builder", async ({ page }) => {
    const cta = page.getByTestId("cta-start");
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/offer-builder");
  });

  test("dashboard link is visible", async ({ page }) => {
    const cta = page.getByTestId("cta-dashboard");
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/dashboard");
  });

  test("trust pills are visible", async ({ page }) => {
    await expect(page.getByText("No credit card required")).toBeVisible();
    await expect(page.getByText("Preview free before paying")).toBeVisible();
  });

  test("all 3 step icons are rendered", async ({ page }) => {
    for (const n of ["1", "2", "3"]) {
      const step = page.getByTestId(`step-${n}`);
      await expect(step).toBeVisible();
      // Icon wrapper has brand-gradient class — verifies icons are styled
      await expect(step.locator(".brand-gradient")).toBeVisible();
    }
  });

  test("step titles are correct", async ({ page }) => {
    await expect(page.getByText("Find your home")).toBeVisible();
    await expect(page.getByText("Build your offer")).toBeVisible();
    await expect(page.getByText("Submit with confidence")).toBeVisible();
  });

  test("clicking Start my offer navigates to offer builder", async ({ page }) => {
    await page.getByTestId("cta-start").click();
    await expect(page).toHaveURL(/offer-builder/);
  });

  test("clicking Go to my dashboard navigates to dashboard", async ({ page }) => {
    await page.getByTestId("cta-dashboard").click();
    await expect(page).toHaveURL(/dashboard/);
  });

  test("how-it-works section is present", async ({ page }) => {
    await expect(page.getByTestId("how-it-works")).toBeVisible();
  });

  test("page has no horizontal scroll", async ({ page }) => {
    // scrollX === 0 means the page hasn't scrolled horizontally
    // max-scroll-left === 0 means no horizontal scrollbar is available
    const canScrollHorizontally = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(canScrollHorizontally).toBe(false);
  });
});
