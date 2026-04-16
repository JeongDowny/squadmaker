import { expect, type Page, test } from "@playwright/test";

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

test("match flow begins empty and creates a single appearance recommendation after setup", async ({
  page,
}) => {
  await page.goto("/matches/new");

  await expect(page).toHaveURL(/\/matches\/match-/);
  await expect(page.getByRole("heading", { name: "쿼터와 포메이션 설정" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "포메이션 배치" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "선수 관리" })).toBeVisible();
  await expect(page.getByText("Match Editor")).toHaveCount(0);
  await expect(page.getByText(/match-\d/)).toHaveCount(0);

  await expect(page.locator('[data-testid="player-card"]')).toHaveCount(0);
  await expect(page.locator('[data-testid="quarter-row"]')).toHaveCount(0);
  await expect(page.getByText("아직 쿼터가 없습니다")).toBeVisible();
  await expect(page.getByText("아직 선수가 없습니다")).toBeVisible();
  await expect(page.getByRole("button", { name: "출전 균등 추천" })).toBeDisabled();

  await page.getByRole("button", { name: "쿼터 추가" }).click();
  await expect(page.locator('[data-testid="quarter-row"]')).toHaveCount(1);
  await page.getByLabel("1Q 포메이션").selectOption("4-3-3");
  await expect(page.getByLabel("1Q 포메이션")).toHaveValue("4-3-3");

  for (const [name, position] of SAMPLE_PLAYERS) {
    await addPlayer(page, name, position);
  }

  const playerCards = page.locator('[data-testid="player-card"]');
  await expect(playerCards).toHaveCount(12);
  await playerCards.filter({ hasText: "민준" }).first().getByRole("button").first().click();
  await expect(playerCards.filter({ hasText: "민준" }).first().getByLabel("주포지션")).toBeVisible();
  await expect(playerCards.filter({ hasText: "민준" }).first().getByLabel("실력 점수")).toHaveCount(0);
  await expect(page.getByTestId("formation-slot-gk")).toContainText("빈 슬롯");

  await playerCards.filter({ hasText: "유찬" }).first().getByLabel("참가").uncheck();
  await page.getByRole("button", { name: "출전 균등 추천" }).click();
  await expect(page.getByText("출전 균등 추천 기준")).toBeVisible();
  await expect(page.getByRole("button", { name: /추천안 [ABC]/ })).toHaveCount(0);
  await expect(page.getByTestId("formation-slot-gk")).toContainText("민준");
  await expect(page.getByTestId("formation-slot-gk")).not.toContainText("빈 슬롯");
  await expect(page.locator('[data-testid^="formation-slot-"]').filter({ hasText: "유찬" })).toHaveCount(0);
  await expect(playerCards.filter({ hasText: "민준" })).toContainText("1쿼터 출전");
  await expect(playerCards.filter({ hasText: "유찬" })).toContainText("0쿼터 출전");

  await page.getByTestId("formation-slot-gk").dragTo(page.getByTestId("formation-slot-st"));
  await expect(page.getByTestId("formation-slot-st")).toContainText("민준");
  await expect(page.getByTestId("formation-slot-gk")).toContainText("이안");
  await expect(playerCards.filter({ hasText: "민준" })).toContainText("1쿼터 출전");

  await page.getByLabel("1Q 포메이션").selectOption("4-4-2");
  await expect(page.getByTestId("formation-slot-lst")).toBeVisible();
  await expect(page.getByTestId("formation-slot-lw")).toHaveCount(0);
});

async function addPlayer(page: Page, name: string, position: string) {
  await page.getByRole("button", { name: "선수 추가" }).click();

  const card = page.locator('[data-testid="player-card"]').last();

  await card.getByLabel("선수 이름").fill(name);
  await card.getByLabel("주포지션").selectOption(position);
}
