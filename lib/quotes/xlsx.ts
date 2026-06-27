import ExcelJS from "exceljs";

import type { QuoteDoc } from "./view-model";

const MONEY_FMT = '#,##0" đ"';
const INK = "FF1F2937";
const MUTED = "FF6B7280";
const ROW_BG = "FFF1F5F9";
const TEAL = "FF09403B";

/** Render a quote to an .xlsx Buffer (Node runtime only). */
export async function renderQuoteXlsx(doc: QuoteDoc): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "F Production";
  const ws = wb.addWorksheet("Bao gia", {
    views: [{ showGridLines: false }],
  });

  ws.columns = [
    { width: 42 }, // A HẠNG MỤC
    { width: 12 }, // B ĐVT
    { width: 11 }, // C SỐ LƯỢNG
    { width: 11 }, // D SỐ BUỔI
    { width: 16 }, // E ĐƠN GIÁ
    { width: 18 }, // F THÀNH TIỀN
  ];

  const mergeFull = (rowNumber: number) =>
    ws.mergeCells(`A${rowNumber}:F${rowNumber}`);

  // --- Company header ---
  let r = ws.addRow([doc.company.name]).number;
  mergeFull(r);
  ws.getCell(`A${r}`).font = { bold: true, size: 13, color: { argb: INK } };

  if (doc.company.taxCode) {
    r = ws.addRow([`MST: ${doc.company.taxCode}`]).number;
    mergeFull(r);
    ws.getCell(`A${r}`).font = { size: 9, color: { argb: MUTED } };
  }
  if (doc.company.address) {
    r = ws.addRow([`Địa chỉ: ${doc.company.address}`]).number;
    mergeFull(r);
    ws.getCell(`A${r}`).font = { size: 9, color: { argb: MUTED } };
  }
  const contact = [
    doc.company.email && `Email: ${doc.company.email}`,
    doc.company.hotline && `Hotline: ${doc.company.hotline}`,
  ]
    .filter(Boolean)
    .join(" | ");
  if (contact) {
    r = ws.addRow([contact]).number;
    mergeFull(r);
    ws.getCell(`A${r}`).font = { size: 9, color: { argb: MUTED } };
  }

  r = ws.addRow([`#${doc.quoteNumber}`]).number;
  mergeFull(r);
  ws.getCell(`A${r}`).font = { bold: true, size: 10, color: { argb: INK } };

  ws.addRow([]);

  // --- Recipient + intro ---
  r = ws.addRow([`${doc.recipient.salutation}: ${doc.recipient.name}`]).number;
  mergeFull(r);
  ws.getCell(`A${r}`).font = { bold: true, size: 11, color: { argb: INK } };

  if (doc.recipient.intro) {
    r = ws.addRow([doc.recipient.intro]).number;
    mergeFull(r);
    ws.getCell(`A${r}`).font = { size: 10, color: { argb: INK } };
  }

  ws.addRow([]);

  // --- Table header ---
  const headRow = ws.addRow([
    "HẠNG MỤC",
    "ĐVT",
    "SỐ LƯỢNG",
    "SỐ BUỔI",
    "ĐƠN GIÁ",
    "THÀNH TIỀN",
  ]);
  headRow.eachCell((cell, col) => {
    cell.font = { bold: true, size: 9, color: { argb: MUTED } };
    cell.alignment = {
      horizontal: col >= 5 ? "right" : col === 1 ? "left" : "center",
      vertical: "middle",
    };
    cell.border = { bottom: { style: "thin", color: { argb: "FFE5E7EB" } } };
  });

  // --- Sections + items ---
  for (const section of doc.sections) {
    const secRow = ws.addRow([section.title, "", "", "", "", section.subtotal]);
    secRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: ROW_BG },
      };
      cell.font = { bold: true, size: 9, color: { argb: INK } };
    });
    ws.getCell(`A${secRow.number}`).alignment = { horizontal: "left" };
    const secAmount = ws.getCell(`F${secRow.number}`);
    secAmount.numFmt = MONEY_FMT;
    secAmount.alignment = { horizontal: "right" };

    for (const item of section.items) {
      const row = ws.addRow([
        item.name,
        item.unit,
        item.qty,
        item.sessions ?? "",
        item.unitPrice,
        item.amount,
      ]);
      row.getCell(1).alignment = { horizontal: "left", wrapText: true };
      row.getCell(2).alignment = { horizontal: "center" };
      row.getCell(3).alignment = { horizontal: "center" };
      row.getCell(4).alignment = { horizontal: "center" };
      row.getCell(5).numFmt = MONEY_FMT;
      row.getCell(5).alignment = { horizontal: "right" };
      row.getCell(6).numFmt = MONEY_FMT;
      row.getCell(6).alignment = { horizontal: "right" };
      row.eachCell((cell) => {
        cell.border = { bottom: { style: "hair", color: { argb: "FFE5E7EB" } } };
        cell.font = { size: 10, color: { argb: INK } };
      });
    }
  }

  ws.addRow([]);

  // --- Summary (labels in E, values in F) ---
  const addSummary = (label: string, value: number, bold = false) => {
    const row = ws.addRow(["", "", "", "", label, value]);
    const labelCell = row.getCell(5);
    const valueCell = row.getCell(6);
    labelCell.alignment = { horizontal: "right" };
    labelCell.font = { bold, size: bold ? 11 : 10, color: { argb: INK } };
    valueCell.numFmt = MONEY_FMT;
    valueCell.alignment = { horizontal: "right" };
    valueCell.font = {
      bold,
      size: bold ? 12 : 10,
      color: { argb: bold ? TEAL : INK },
    };
    return row;
  };

  addSummary("Cộng tiền dịch vụ", doc.totals.subtotal);
  if (doc.totals.discount > 0) addSummary("Giảm giá", -doc.totals.discount);
  addSummary(`Thuế GTGT ${Number(doc.totals.taxRate)}%`, doc.totals.taxAmount);
  addSummary("Tổng thanh toán", doc.totals.total, true);

  ws.addRow([]);

  // --- Blocks ---
  for (const block of doc.blocks) {
    const titleRow = ws.addRow([block.title]).number;
    mergeFull(titleRow);
    ws.getCell(`A${titleRow}`).font = { bold: true, size: 9, color: { argb: INK } };
    for (const line of block.lines) {
      const clean = line.replace(/\*\*/g, "");
      const lr = ws.addRow([`• ${clean}`]).number;
      mergeFull(lr);
      ws.getCell(`A${lr}`).alignment = { wrapText: true };
      ws.getCell(`A${lr}`).font = { size: 9, color: { argb: INK } };
    }
  }

  ws.addRow([]);

  // --- Signature footer ---
  if (doc.issueDate) {
    const dr = ws.addRow(["", "", "", "", "", `Ngày lập: ${doc.issueDate.split("-").reverse().join("/")}`]).number;
    ws.getCell(`F${dr}`).alignment = { horizontal: "right" };
    ws.getCell(`F${dr}`).font = { size: 9, color: { argb: INK } };
  }
  if (doc.representative.name) {
    const nr = ws.addRow(["", "", "", "", "", doc.representative.name]).number;
    ws.getCell(`F${nr}`).alignment = { horizontal: "right" };
    ws.getCell(`F${nr}`).font = { bold: true, size: 10, color: { argb: INK } };
  }
  if (doc.representative.title) {
    const tr = ws.addRow(["", "", "", "", "", doc.representative.title]).number;
    ws.getCell(`F${tr}`).alignment = { horizontal: "right" };
    ws.getCell(`F${tr}`).font = { size: 9, color: { argb: MUTED } };
  }

  const buffer = await wb.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
