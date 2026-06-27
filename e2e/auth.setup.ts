import { test as setup } from "@playwright/test";

const authFile = "e2e/.auth/admin.json";

setup("authenticate as admin", async ({ page }) => {
  await page.goto("/admin/login");
  await page.locator("#username").fill(
    process.env.E2E_ADMIN_USER ?? "admin@fproduction.vn"
  );
  await page.locator("#password").fill(
    process.env.E2E_ADMIN_PASS ?? "fproduction123456"
  );
  await page.getByRole("button", { name: "Đăng nhập" }).click();
  await page.waitForURL("**/admin/dashboard");
  await page.context().storageState({ path: authFile });
});
