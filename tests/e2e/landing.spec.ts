import { expect, test } from "@playwright/test";

test("landing shows the primary service preview and quarter controls", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "여러 쿼터의 선발 배치를 한 번에 보고 더 빠르게 정리하세요",
    })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "서비스 예시 보기" }).first()).toBeVisible();
  await expect(page.getByText("Service Example")).toBeVisible();
  await expect(page.getByRole("button", { name: /1Q/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /4Q/ })).toBeVisible();
  await expect(page.getByText("Tactical Board")).toBeVisible();
  await expect(page.getByText("Quarter Summary")).toBeVisible();
});
