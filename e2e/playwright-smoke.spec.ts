import { expect, test } from "@playwright/test";

test("Playwright can render a browser page", async ({ page }) => {
  await page.setContent("<main><h1>Playwright ready</h1></main>");

  await expect(page.getByRole("heading", { name: "Playwright ready" })).toBeVisible();
});
