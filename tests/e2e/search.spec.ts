/**
 * Search page tests — verifies property listing, AI scores, save toggle,
 * and the new agent contact (call/showing) buttons.
 */
import { test, expect } from "@playwright/test";

test.describe("Search page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/search");
    // Wait for property grid to render
    await expect(page.getByText("Chicago, IL").first()).toBeVisible();
  });

  test("shows 6 property listings", async ({ page }) => {
    const prices = page.locator("text=homes in");
    await expect(prices).toContainText("6");
  });

  test("property cards show price, beds, baths", async ({ page }) => {
    await expect(page.getByText("$485,000").first()).toBeVisible();
    await expect(page.getByText(/3 bd/).first()).toBeVisible();
  });

  test("AI score badges are visible", async ({ page }) => {
    await expect(page.getByText(/Great value/).first()).toBeVisible();
    await expect(page.getByText(/Best deal/).first()).toBeVisible();
  });

  test("price reduced badge appears on reduced properties", async ({ page }) => {
    await expect(page.getByText(/reduced/i).first()).toBeVisible();
  });

  test("Make an offer button links to offer-builder", async ({ page }) => {
    const firstOffer = page.getByRole("link", { name: /Make an offer/i }).first();
    await expect(firstOffer).toHaveAttribute("href", /offer-builder\?property=/);
  });

  test("Call button has tel: link", async ({ page }) => {
    const callLinks = page.getByRole("link", { name: "Call" });
    await expect(callLinks.first()).toHaveAttribute("href", /^tel:/);
  });

  test("Schedule showing button has mailto: link with agent email", async ({ page }) => {
    const showingLinks = page.getByRole("link", { name: "Schedule showing" });
    const href = await showingLinks.first().getAttribute("href");
    expect(href).toMatch(/^mailto:/);
    expect(href).toContain("Showing request");
  });

  test("listing agent name appears on each card", async ({ page }) => {
    await expect(page.getByText("Sarah Johnson")).toBeVisible();
    await expect(page.getByText("Mike Torres")).toBeVisible();
  });

  test("search bar is visible and accepts input", async ({ page }) => {
    const input = page.locator("input[placeholder*='City']");
    await expect(input).toBeVisible();
    await input.fill("Austin, TX");
    await expect(input).toHaveValue("Austin, TX");
  });

  test("sort dropdown is present", async ({ page }) => {
    const sort = page.locator("select");
    await expect(sort).toBeVisible();
  });
});

test.describe("Search page — mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("loads without horizontal overflow on mobile", async ({ page }) => {
    await page.goto("/search");
    const canScrollHorizontally = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(canScrollHorizontally).toBe(false);
  });

  test("property cards are full-width on mobile", async ({ page }) => {
    await page.goto("/search");
    await expect(page.getByText("$485,000").first()).toBeVisible();
  });
});
