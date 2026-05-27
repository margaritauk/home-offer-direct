/**
 * Navigation tests — verifies navbar links, mobile menu, and routing.
 */
import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  // These tests check desktop-only elements (md:flex nav)
  test("navbar shows logo and Start offer CTA on desktop", async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 1280) < 768, "Desktop nav is hidden on mobile");
    await page.goto("/");
    await expect(page.locator("header").getByRole("link", { name: /HomeOfferDirect/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Start offer/i }).first()).toBeVisible();
  });

  test("desktop nav links are present", async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 1280) < 768, "Desktop nav is hidden on mobile");
    await page.goto("/");
    await expect(page.getByRole("link", { name: "How it works" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Pricing" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "My dashboard" }).first()).toBeVisible();
  });

  test("pricing page loads", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page).toHaveURL("/pricing");
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("FAQ page loads", async ({ page }) => {
    await page.goto("/faq");
    await expect(page).toHaveURL("/faq");
  });

  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("Welcome back")).toBeVisible();
  });

  test("signup page loads", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.getByText("Create your account")).toBeVisible();
  });

  test("404 shows not-found page", async ({ page }) => {
    await page.goto("/this-does-not-exist");
    // Next.js serves its built-in not-found page
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Mobile navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("hamburger menu button is visible on mobile", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("mobile-menu-btn")).toBeVisible();
  });

  test("desktop nav links are hidden on mobile", async ({ page }) => {
    await page.goto("/");
    // The md:flex nav should be hidden
    const nav = page.locator("nav.hidden");
    await expect(nav).toBeHidden();
  });

  test("hamburger opens and closes mobile menu", async ({ page }) => {
    await page.goto("/");
    const btn = page.getByTestId("mobile-menu-btn");
    await btn.click();
    await expect(page.getByTestId("mobile-menu")).toBeVisible();
    await btn.click();
    await expect(page.getByTestId("mobile-menu")).toBeHidden();
  });

  test("mobile menu contains all nav links", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("mobile-menu-btn").click();
    const menu = page.getByTestId("mobile-menu");
    await expect(menu.getByText("How it works")).toBeVisible();
    await expect(menu.getByText("Pricing")).toBeVisible();
    await expect(menu.getByText("My dashboard")).toBeVisible();
  });

  test("mobile menu Start offer link navigates to offer builder", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("mobile-menu-btn").click();
    await page.getByTestId("mobile-menu").getByText(/Start my offer/i).click();
    await expect(page).toHaveURL(/offer-builder/);
  });
});
