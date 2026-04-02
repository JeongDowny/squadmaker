import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

const screenshotDir = path.join(process.cwd(), "harness/reports/latest/screenshots");

test("capture landing screenshots for current viewport", async ({ page }, testInfo) => {
  fs.mkdirSync(screenshotDir, { recursive: true });

  await page.goto("/");

  await expect(page.getByText("Service Example")).toBeVisible();
  await expect(page.getByText("Tactical Board")).toBeVisible();

  const fileName =
    testInfo.project.name === "chromium-mobile" ? "landing-mobile.png" : "landing-desktop.png";

  await page.screenshot({
    path: path.join(screenshotDir, fileName),
    fullPage: true,
  });
});
