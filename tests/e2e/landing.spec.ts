import { expect, test } from "@playwright/test";

test("landing shows concise service flow and management navigation", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "축구 동호회 라인업을 쿼터별로 빠르게 맞춥니다",
    })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "경기 관리", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "팀 관리", exact: true })).toBeVisible();
  await expect(page.getByText("경기 준비 화면")).toBeVisible();
  await expect(page.getByText("4-3-3 출전 균등 추천")).toBeVisible();
  await expect(page.getByRole("heading", { name: "실제 이용 흐름" })).toBeVisible();
  await expect(page.getByText("팀 관리").last()).toBeVisible();
  await expect(page.getByText("포메이션 설정")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "경기 목록에서 오늘 경기 준비를 시작하세요",
    })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "경기 관리로 이동" })).toBeVisible();
});
