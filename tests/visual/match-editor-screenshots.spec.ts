import fs from "node:fs";
import path from "node:path";
import { expect, type Page, test } from "@playwright/test";

const screenshotDir = path.join(process.cwd(), "harness/reports/latest/screenshots");
const SAMPLE_PLAYERS = [
  ["민준", "GK"],
  ["지훈", "LB"],
  ["도윤", "CB"],
  ["태민", "CB"],
  ["현우", "RB"],
  ["예준", "CDM"],
  ["시우", "CM"],
  ["건우", "CM"],
  ["준서", "CAM"],
  ["하준", "LW"],
  ["유찬", "RW"],
  ["이안", "ST"],
] as const;

test("capture match editor screenshots for current viewport", async ({ page }, testInfo) => {
  fs.mkdirSync(screenshotDir, { recursive: true });

  await page.goto("/");
  await page.getByRole("link", { name: "새 경기 만들기" }).click();

  await page.getByRole("button", { name: "쿼터 추가" }).click();
  await page.getByLabel("1Q 포메이션").selectOption("4-3-3");

  for (const [name, position] of SAMPLE_PLAYERS) {
    await addPlayer(page, name, position);
  }

  await page.getByRole("button", { name: "출전 균등 추천" }).click();
  await expect(page.getByText("출전 균등 추천 기준")).toBeVisible();
  await expect(page.getByTestId("formation-slot-gk")).toContainText("민준");

  const fileName =
    testInfo.project.name === "chromium-mobile"
      ? "match-editor-mobile.png"
      : "match-editor-desktop.png";

  await page.screenshot({
    path: path.join(screenshotDir, fileName),
    fullPage: true,
  });
});

async function addPlayer(page: Page, name: string, position: string) {
  await page.getByRole("button", { name: "선수 추가" }).click();

  const card = page.locator('[data-testid="player-card"]').last();

  await card.getByLabel("선수 이름").fill(name);
  await card.getByLabel("주포지션").selectOption(position);
}
