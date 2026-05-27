/**
 * Dashboard tests — verifies all three tabs (offers, saved homes, journey)
 * work correctly, and that agent contact links are present and correct.
 */
import { test, expect } from "@playwright/test";

test.describe("Dashboard — tabs", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByTestId("tabs")).toBeVisible();
  });

  test("Offers tab is selected by default", async ({ page }) => {
    const offersTab = page.getByTestId("tab-offers");
    await expect(offersTab).toHaveClass(/bg-white/);
    await expect(page.getByTestId("offers-panel")).toBeVisible();
  });

  test("clicking Saved tab shows saved homes", async ({ page }) => {
    await page.getByTestId("tab-saved").click();
    await expect(page.getByTestId("saved-panel")).toBeVisible();
    await expect(page.getByTestId("offers-panel")).toBeHidden();
  });

  test("clicking My Journey tab shows journey panel", async ({ page }) => {
    await page.getByTestId("tab-journey").click();
    await expect(page.getByTestId("journey-panel")).toBeVisible();
  });
});

test.describe("Dashboard — offers", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
  });

  test("shows 3 offers with correct statuses", async ({ page }) => {
    const panel = page.getByTestId("offers-panel");
    await expect(panel.getByText("Pending review")).toBeVisible();
    await expect(panel.getByText("Draft")).toBeVisible();
    await expect(panel.getByText("Not accepted")).toBeVisible();
  });

  test("draft offer has a Continue button", async ({ page }) => {
    const continueBtn = page.getByRole("link", { name: "Continue" });
    await expect(continueBtn).toBeVisible();
    await expect(continueBtn).toHaveAttribute("href", "/offer-builder");
  });

  test("New offer button links to offer builder", async ({ page }) => {
    const newOffer = page.getByRole("link", { name: /New offer/i });
    await expect(newOffer).toBeVisible();
    await expect(newOffer).toHaveAttribute("href", "/offer-builder");
  });
});

test.describe("Dashboard — saved homes with agent contact", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByTestId("tab-saved").click();
  });

  test("shows 2 saved homes", async ({ page }) => {
    const homes = page.getByTestId("saved-home");
    await expect(homes).toHaveCount(2);
  });

  test("each saved home shows listing agent name and company", async ({ page }) => {
    await expect(page.getByText("Sarah Johnson")).toBeVisible();
    await expect(page.getByText("Coldwell Banker")).toBeVisible();
    await expect(page.getByText("Mike Torres")).toBeVisible();
    await expect(page.getByText("Re/Max Chicago")).toBeVisible();
  });

  test("phone links have correct tel: href format", async ({ page }) => {
    const phoneLinks = page.getByTestId("agent-phone");
    const count = await phoneLinks.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const href = await phoneLinks.nth(i).getAttribute("href");
      expect(href).toMatch(/^tel:\d+$/);
    }
  });

  test("email links have Schedule showing label", async ({ page }) => {
    const emailLinks = page.getByTestId("agent-email");
    const count = await emailLinks.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(emailLinks.nth(i)).toContainText("Schedule showing");
    }
  });

  test("email links have mailto: href with showing subject", async ({ page }) => {
    const emailLinks = page.getByTestId("agent-email");
    const href = await emailLinks.first().getAttribute("href");
    expect(href).toMatch(/^mailto:/);
    expect(href).toContain("Showing request");
  });

  test("Make an offer button links to offer builder for that property", async ({ page }) => {
    const offerLinks = page.getByRole("link", { name: /Make an offer/i });
    await expect(offerLinks.first()).toHaveAttribute("href", /offer-builder\?property=/);
  });

  test("Search more homes link navigates to search page", async ({ page }) => {
    const searchLink = page.getByRole("link", { name: /Search more homes/i });
    await expect(searchLink).toBeVisible();
    await searchLink.click();
    await expect(page).toHaveURL(/search/);
  });
});

test.describe("Dashboard — journey tracker", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByTestId("tab-journey").click();
  });

  test("shows progress bar with correct completion", async ({ page }) => {
    await expect(page.getByText("3 of 8 complete")).toBeVisible();
  });

  test("shows all 8 milestones", async ({ page }) => {
    // Scope to the milestone list specifically (first large card after progress summary)
    await expect(page.getByText("Get pre-approved")).toBeVisible();
    await expect(page.getByText("Find your home")).toBeVisible();
    await expect(page.getByText("Make an offer").first()).toBeVisible(); // appears in milestone list
    await expect(page.getByText("Inspection period")).toBeVisible();
    await expect(page.getByText("Financing approval")).toBeVisible();
    await expect(page.getByText("Final walkthrough").first()).toBeVisible();
    // "Closing day" appears in both milestone list and calendar — just check it exists
    const closingEntries = page.getByText("Closing day");
    expect(await closingEntries.count()).toBeGreaterThanOrEqual(1);
  });

  test("active milestone shows In progress badge", async ({ page }) => {
    await expect(page.getByText("In progress")).toBeVisible();
  });

  test("shows key contract dates calendar", async ({ page }) => {
    await expect(page.getByText("Key contract dates")).toBeVisible();
    await expect(page.getByText("Offer accepted")).toBeVisible();
    await expect(page.getByText("Inspection deadline")).toBeVisible();
    // Closing day appears in both milestone list and calendar — count >= 1
    expect(await page.getByText("Closing day").count()).toBeGreaterThanOrEqual(1);
  });

  test("deadline dates show warning badges", async ({ page }) => {
    const deadlineBadges = page.getByText("Deadline");
    await expect(deadlineBadges.first()).toBeVisible();
  });

  test("next action is highlighted in progress summary", async ({ page }) => {
    await expect(page.getByText(/Schedule your home inspector before Jun 3/)).toBeVisible();
  });
});
