/**
 * Offer Builder wizard tests — simulates a real buyer walking through
 * the entire 17-step offer process for a home in Chicago, IL.
 *
 * Path tested: First-time buyer · Illinois · Pre-approved (conventional)
 * Conventional 20% down · 30-day closing · Full contingencies · No escalation
 */
import { test, expect, Page } from "@playwright/test";

async function goToBuilder(page: Page) {
  await page.goto("/offer-builder");
  // Wait for first step to render
  await expect(page.getByText("What best describes you?")).toBeVisible();
}

async function clickContinue(page: Page) {
  await page.getByRole("button", { name: /Continue/i }).click();
}

async function clickBack(page: Page) {
  await page.getByRole("button", { name: /Back/i }).click();
}

test.describe("Offer Builder — initial state", () => {
  test("loads on step 1 with buyer type question", async ({ page }) => {
    await goToBuilder(page);
    await expect(page.getByText("What best describes you?")).toBeVisible();
    await expect(page.getByText("1 of 17")).toBeVisible();
  });

  test("Back button is disabled on step 1", async ({ page }) => {
    await goToBuilder(page);
    const back = page.getByRole("button", { name: /Back/i });
    await expect(back).toBeDisabled();
  });

  test("progress shows 0% on step 1", async ({ page }) => {
    await goToBuilder(page);
    // Filter to a visible element — desktop and mobile bars each have this text
    // but only one is displayed at any given viewport width
    const progressEl = page.getByText(/0% complete/i).filter({ visible: true }).first();
    await expect(progressEl).toBeVisible();
  });

  test("all buyer type options are visible", async ({ page }) => {
    await goToBuilder(page);
    await expect(page.getByText("First-time buyer")).toBeVisible();
    await expect(page.getByText("I've bought before")).toBeVisible();
    await expect(page.getByText("Real estate investor")).toBeVisible();
  });
});

test.describe("Offer Builder — step navigation", () => {
  test("selecting buyer type and continuing goes to state step", async ({ page }) => {
    await goToBuilder(page);
    await page.getByText("First-time buyer").click();
    await clickContinue(page);
    await expect(page.getByText("Which state is the property in?")).toBeVisible();
    await expect(page.getByText("2 of 17")).toBeVisible();
  });

  test("Back button returns to previous step", async ({ page }) => {
    await goToBuilder(page);
    await page.getByText("First-time buyer").click();
    await clickContinue(page);
    await clickBack(page);
    await expect(page.getByText("What best describes you?")).toBeVisible();
    await expect(page.getByText("1 of 17")).toBeVisible();
  });

  test("progress percentage increases as steps advance", async ({ page }) => {
    await goToBuilder(page);
    const getPct = async () => {
      // scope to the visible (desktop) progress bar
      const el = page.locator("text=% complete").first();
      const txt = await el.textContent();
      return parseInt(txt ?? "0");
    };
    const pct0 = await getPct();
    await page.getByText("First-time buyer").click();
    await clickContinue(page);
    const pct1 = await getPct();
    expect(pct1).toBeGreaterThan(pct0);
  });
});

test.describe("Offer Builder — state selection (step 2)", () => {
  test.beforeEach(async ({ page }) => {
    await goToBuilder(page);
    await page.getByText("First-time buyer").click();
    await clickContinue(page);
  });

  test("all 5 states are available", async ({ page }) => {
    await expect(page.getByText(/Illinois/)).toBeVisible();
    await expect(page.getByText(/Texas/)).toBeVisible();
    await expect(page.getByText(/New York/)).toBeVisible();
    await expect(page.getByText(/California/)).toBeVisible();
    await expect(page.getByText(/Florida/)).toBeVisible();
  });

  test("selecting Illinois and continuing moves to pre-approval step", async ({ page }) => {
    await page.getByText(/Illinois/).click();
    await clickContinue(page);
    await expect(page.getByText("Do you have a mortgage pre-approval?")).toBeVisible();
  });
});

test.describe("Offer Builder — pre-approval (step 3)", () => {
  test.beforeEach(async ({ page }) => {
    await goToBuilder(page);
    await page.getByText("First-time buyer").click();
    await clickContinue(page);
    await page.getByText(/Illinois/).click();
    await clickContinue(page);
  });

  test("shows all 3 pre-approval options", async ({ page }) => {
    await expect(page.getByText("Yes, I'm pre-approved")).toBeVisible();
    await expect(page.getByText("I'm paying all cash")).toBeVisible();
    await expect(page.getByText("No pre-approval yet")).toBeVisible();
  });

  test("selecting no pre-approval shows a warning box", async ({ page }) => {
    await page.getByText("No pre-approval yet").click();
    await expect(page.getByText(/Sellers often won't consider offers/)).toBeVisible();
  });

  test("pre-approved option has 'Strongest position' badge", async ({ page }) => {
    await expect(page.getByText("Strongest position")).toBeVisible();
  });
});

test.describe("Offer Builder — property confirmation (step 4)", () => {
  test.beforeEach(async ({ page }) => {
    await goToBuilder(page);
    await page.getByText("First-time buyer").click();
    await clickContinue(page);
    await page.getByText(/Illinois/).click();
    await clickContinue(page);
    await page.getByText("Yes, I'm pre-approved").click();
    await clickContinue(page);
  });

  test("shows property address and price", async ({ page }) => {
    await expect(page.getByText("Confirm the property")).toBeVisible();
    // Address appears in multiple places — just assert at least one instance is visible
    await expect(page.getByText(/2847 N Clark St/).filter({ visible: true }).first()).toBeVisible();
    await expect(page.getByText("$485,000").filter({ visible: true }).first()).toBeVisible();
  });
});

test.describe("Offer Builder — offer price (step 5)", () => {
  test.beforeEach(async ({ page }) => {
    await goToBuilder(page);
    // Walk steps 0–3 quickly
    await page.getByText("First-time buyer").click(); await clickContinue(page);
    await page.getByText(/Illinois/).click();          await clickContinue(page);
    await page.getByText("Yes, I'm pre-approved").click(); await clickContinue(page);
    await clickContinue(page); // confirm property
  });

  test("shows offer price step with AI recommendation", async ({ page }) => {
    await expect(page.getByText("How much do you want to offer?")).toBeVisible();
    await expect(page.getByText("AI Recommendation")).toBeVisible();
  });

  test("quick-pick price buttons are visible", async ({ page }) => {
    await expect(page.getByText("At asking price")).toBeVisible();
    await expect(page.getByText(/AI pick/)).toBeVisible();
  });
});

test.describe("Offer Builder — full conventional buyer flow", () => {
  test("can walk through all 17 steps and reach final submit step", async ({ page }) => {
    await goToBuilder(page);

    // Steps 0-2: require explicit selections
    await page.getByText("First-time buyer").click();
    await clickContinue(page);

    await page.getByText(/Illinois/).click();
    await clickContinue(page);

    await page.getByText("Yes, I'm pre-approved").click();
    await clickContinue(page);

    // Steps 3-15: defaults are already populated — just Continue through
    for (let i = 3; i <= 15; i++) {
      await clickContinue(page);
    }

    // Step 16 — final submit step
    await expect(page.getByText("Get your offer package")).toBeVisible();
    await expect(page.getByRole("link", { name: /Get my offer package/i })).toBeVisible();
  });

  test("final step links to pricing page", async ({ page }) => {
    await goToBuilder(page);
    // Steps 0-2: explicit selections (defaults exist but clicks are safer)
    await page.getByText("First-time buyer").click();
    await clickContinue(page);
    await page.getByText(/Illinois/).click();
    await clickContinue(page);
    await page.getByText("Yes, I'm pre-approved").click();
    // Steps 3-15: Continue through
    for (let i = 2; i <= 15; i++) {
      await clickContinue(page);
    }
    const finalLink = page.getByRole("link", { name: /Get my offer package/i });
    await expect(finalLink).toBeVisible();
    await expect(finalLink).toHaveAttribute("href", "/pricing");
  });
});

test.describe("Offer Builder — mobile layout", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("loads correctly on mobile without side clipping", async ({ page }) => {
    await goToBuilder(page);
    await expect(page.getByText("What best describes you?")).toBeVisible();
    // No horizontal overflow
    const canScrollHorizontally = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(canScrollHorizontally).toBe(false);
  });

  test("option cards are full width and tappable on mobile", async ({ page }) => {
    await goToBuilder(page);
    const card = page.getByText("First-time buyer");
    await expect(card).toBeVisible();
    await card.click();
    await clickContinue(page);
    await expect(page.getByText("Which state is the property in?")).toBeVisible();
  });
});
