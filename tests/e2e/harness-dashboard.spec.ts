import { expect, test } from "@playwright/test";

test("harness route exposes scenario deck and repository checks", async ({ page }) => {
  await page.goto("/harness");

  await expect(
    page.getByRole("heading", {
      name: "문서 기반 제품 규칙을 구현 전용 하네스로 바꿨다.",
    })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "저장소 레벨 검증 기준" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "UI에서 바로 확인하는 검증 포인트" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "MVP 구현을 고정하는 대표 시나리오" })
  ).toBeVisible();
  await expect(page.getByText("경기 생성 입력 검증")).toBeVisible();
});
