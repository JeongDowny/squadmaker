import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

const screenshotDir = path.join(process.cwd(), "harness/reports/latest/screenshots");

test("capture landing screenshots for current viewport", async ({ page }, testInfo) => {
  fs.mkdirSync(screenshotDir, { recursive: true });

  await page.goto("/");

  await expect(page.getByText("경기 준비 화면")).toBeVisible();
  await expect(page.getByRole("heading", { name: "실제 이용 흐름" })).toBeVisible();

  const fileName =
    testInfo.project.name === "chromium-mobile" ? "landing-mobile.png" : "landing-desktop.png";

  await page.screenshot({
    path: path.join(screenshotDir, fileName),
    fullPage: true,
  });
});
