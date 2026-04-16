import { expect, test } from "@playwright/test";

test("match management supports local create, edit, and delete", async ({ page }) => {
  await page.goto("/matches");

  await expect(page.getByRole("heading", { name: "경기 관리" })).toBeVisible();
  await expect(page.getByText("아직 생성된 경기가 없습니다")).toBeVisible();

  await page.getByRole("button", { name: "경기 생성" }).click();
  await expect(page.getByLabel("경기 제목")).toBeVisible();

  await page.getByLabel("경기 제목").fill("일요일 풋살");
  await expect(page.getByLabel("경기 제목")).toHaveValue("일요일 풋살");

  await page.reload();
  await expect(page.getByLabel("경기 제목")).toHaveValue("일요일 풋살");

  await page.getByText("카드 눌러 수정").click();
  await expect(page).toHaveURL(/\/matches\/match-/);

  await page.goto("/matches");
  await page.getByRole("button", { name: "삭제", exact: true }).click();
  await expect(page.getByText("아직 생성된 경기가 없습니다")).toBeVisible();
});

test("team management supports local player create, edit, and delete", async ({ page }) => {
  await page.goto("/players");

  await expect(page.getByRole("heading", { name: "팀 관리" })).toBeVisible();
  await expect(page.getByText("아직 등록된 선수가 없습니다")).toBeVisible();

  await page.getByRole("button", { name: "선수 생성" }).click();
  await expect(page.getByLabel("선수 이름")).toBeVisible();

  await page.getByLabel("선수 이름").fill("민준");
  await page.getByLabel("주포지션").selectOption("GK");
  await expect(page.getByLabel("선수 이름")).toHaveValue("민준");
  await expect(page.getByLabel("주포지션")).toHaveValue("GK");

  await page.reload();
  await expect(page.getByLabel("선수 이름")).toHaveValue("민준");
  await expect(page.getByLabel("주포지션")).toHaveValue("GK");

  await page.goto("/matches/new");
  await expect(page.getByText("민준")).toBeVisible();
  await expect(page.getByText("GK · 0쿼터 출전")).toBeVisible();

  await page.goto("/players");
  await page.getByRole("button", { name: "삭제" }).click();
  await expect(page.getByText("아직 등록된 선수가 없습니다")).toBeVisible();
});
