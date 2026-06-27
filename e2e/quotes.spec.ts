import { readFileSync } from "fs";
import { expect, test } from "@playwright/test";

// Whole-file serial run so the create test can hand the token/id to later tests.
test.describe.configure({ mode: "serial" });

const RECIPIENT = "E2E Khách Hàng";
let token = "";
let quoteId = "";
let quoteNumber = "";

test.describe("Admin tạo báo giá", () => {
  test("tạo báo giá qua builder, kiểm tra tổng tiền và xuất bản", async ({ page }) => {
    await page.goto("/admin/quotes/new");
    await expect(page.getByRole("heading", { name: "Tạo báo giá mới" })).toBeVisible();

    // Recipient + section title
    await page.locator("#recipientName").fill(RECIPIENT);
    await page.getByLabel("Tên nhóm hạng mục").first().fill("Ngày 03.07 (09h00 - 21h00)");

    // Item 1: unit price auto-fills the amount (qty=sessions=1)
    await page.getByLabel("Hạng mục", { exact: true }).first().fill("Chụp ảnh sự kiện");
    await page.getByLabel("Đơn giá", { exact: true }).first().fill("10000000");
    await expect(page.getByTestId("summary-subtotal")).toHaveText("10.000.000đ");

    // Override THÀNH TIỀN to 0 (the complimentary-line case)
    await page.getByLabel("Thành tiền", { exact: true }).first().fill("0");
    await expect(page.getByTestId("summary-subtotal")).toHaveText("0đ");

    // Item 2
    await page.getByRole("button", { name: "Thêm dòng" }).first().click();
    await page.getByLabel("Hạng mục", { exact: true }).nth(1).fill("Quay phim recap");
    await page.getByLabel("Đơn giá", { exact: true }).nth(1).fill("5000000");

    // Totals: subtotal 5.000.000, tax 8% = 400.000, total 5.400.000
    await expect(page.getByTestId("summary-subtotal")).toHaveText("5.000.000đ");
    await expect(page.getByTestId("summary-tax")).toHaveText("400.000đ");
    await expect(page.getByTestId("summary-total")).toHaveText("5.400.000đ");

    await page.getByRole("button", { name: "Tạo & xuất bản" }).click();
    await page.waitForURL("**/admin/quotes");
    await expect(page.getByText(RECIPIENT)).toBeVisible();

    // Grab token/id/number via the (authenticated) admin API
    const res = await page.request.get("/api/admin/quotes");
    const data = await res.json();
    const created = data.quotes.find((q: { recipientName: string }) => q.recipientName === RECIPIENT);
    expect(created).toBeTruthy();
    token = created.token;
    quoteId = created.id;
    quoteNumber = created.quoteNumber;
    expect(quoteNumber).toMatch(/^BG-\d{4}$/);
    expect(created.total).toBe(5_400_000);
  });

  test("mở lại trang sửa, dữ liệu được giữ nguyên", async ({ page }) => {
    await page.goto(`/admin/quotes/${quoteId}/edit`);
    await expect(page.locator("#recipientName")).toHaveValue(RECIPIENT);
    await expect(page.getByLabel("Hạng mục", { exact: true }).first()).toHaveValue("Chụp ảnh sự kiện");
    await expect(page.getByTestId("summary-total")).toHaveText("5.400.000đ");
  });
});

test.describe("Trang public (không đăng nhập)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("xem báo giá: nội dung, dòng 0đ, tổng tiền, không có chrome admin", async ({ page }) => {
    await page.goto(`/q/${token}`);
    await expect(page.getByText(RECIPIENT)).toBeVisible();
    await expect(page.getByText("Ngày 03.07 (09h00 - 21h00)")).toBeVisible();
    await expect(page.getByText("0đ", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("5.400.000đ", { exact: true })).toBeVisible();
    // Public portal must not render the admin sidebar
    await expect(page.getByText("Quản lý báo giá")).toHaveCount(0);
    // Download buttons present
    await expect(page.getByRole("link", { name: "Tải báo giá PDF" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Tải báo giá Excel" })).toBeVisible();
  });

  test("gửi phản hồi mức giá", async ({ page }) => {
    await page.goto(`/q/${token}`);
    await page.getByRole("button", { name: /Khá hợp lý/ }).click();
    await expect(page.getByText("Cảm ơn phản hồi của bạn!")).toBeVisible();
  });

  test("tải PDF và Excel", async ({ page }) => {
    await page.goto(`/q/${token}`);

    const [pdf] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("link", { name: "Tải báo giá PDF" }).click(),
    ]);
    expect(pdf.suggestedFilename()).toBe(`${quoteNumber}.pdf`);
    const pdfPath = await pdf.path();
    const pdfBuf = readFileSync(pdfPath);
    expect(pdfBuf.length).toBeGreaterThan(1000);
    expect(pdfBuf.subarray(0, 4).toString()).toBe("%PDF");

    const [xlsx] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("link", { name: "Tải báo giá Excel" }).click(),
    ]);
    expect(xlsx.suggestedFilename()).toBe(`${quoteNumber}.xlsx`);
    const xlsxPath = await xlsx.path();
    const xlsxBuf = readFileSync(xlsxPath);
    expect(xlsxBuf.length).toBeGreaterThan(1000);
    // XLSX is a zip -> starts with "PK"
    expect(xlsxBuf.subarray(0, 2).toString()).toBe("PK");
  });

  test("token sai trả về trang không tìm thấy", async ({ page }) => {
    await page.goto("/q/INVALIDXX");
    await expect(page.getByText("Không tìm thấy báo giá")).toBeVisible();
  });

  test("API admin yêu cầu đăng nhập (401 khi không có cookie)", async ({ request }) => {
    // This block runs with empty storageState, so `request` carries no cookie.
    const r = await request.post("/api/admin/quotes", { data: {} });
    expect(r.status()).toBe(401);
  });
});

test.describe("Admin kiểm tra phản hồi", () => {
  test("báo giá chuyển sang đã phản hồi và lưu lựa chọn của khách", async ({ page }) => {
    const res = await page.request.get("/api/admin/quotes");
    const data = await res.json();
    const q = data.quotes.find((x: { id: string }) => x.id === quoteId);
    expect(q.status).toBe("RESPONDED");
    expect(q.customerFeedback).toContain("Khá hợp lý");
  });
});
