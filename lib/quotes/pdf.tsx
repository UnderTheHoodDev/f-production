import fs from "fs";
import path from "path";

import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";

import { formatVND } from "./format";
import type { QuoteDoc } from "./view-model";

// --- Fonts (Vietnamese-complete, static weights — required by react-pdf) ---
let fontsReady = false;
function ensureFonts() {
  if (fontsReady) return;
  const dir = path.join(process.cwd(), "assets", "fonts");
  Font.register({
    family: "BeVietnamPro",
    fonts: [
      { src: path.join(dir, "BeVietnamPro-Regular.ttf"), fontWeight: 400 },
      { src: path.join(dir, "BeVietnamPro-Medium.ttf"), fontWeight: 500 },
      { src: path.join(dir, "BeVietnamPro-SemiBold.ttf"), fontWeight: 600 },
      { src: path.join(dir, "BeVietnamPro-Bold.ttf"), fontWeight: 700 },
    ],
  });
  // Vietnamese words must not be hyphenated.
  Font.registerHyphenationCallback((word) => [word]);
  fontsReady = true;
}

const TEAL = "#09403b";
const GOLD = "#8a6d3b";
const INK = "#1f2937";
const MUTED = "#6b7280";
const LINE = "#e5e7eb";
const HEADER_BG = "#f1f5f9";
const ROW_BG = "#f9fafb";

const s = StyleSheet.create({
  page: {
    fontFamily: "BeVietnamPro",
    fontSize: 9,
    color: INK,
    paddingTop: 28,
    paddingBottom: 36,
    paddingHorizontal: 32,
    lineHeight: 1.4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: HEADER_BG,
    borderRadius: 6,
    padding: 16,
  },
  headerLeft: { flexDirection: "column", width: "45%" },
  logo: { width: 76, height: 76, objectFit: "contain", marginBottom: 6 },
  title: { fontSize: 18, fontWeight: 700, color: INK },
  headerRight: { width: "52%", textAlign: "right" },
  companyName: { fontSize: 10, fontWeight: 700, color: INK },
  companyLine: { fontSize: 8, color: MUTED, marginTop: 2 },
  quoteNo: { fontSize: 10, fontWeight: 700, color: INK, marginTop: 6 },

  recipient: { marginTop: 18 },
  recipientName: { fontSize: 11, fontWeight: 700, color: INK },
  intro: { marginTop: 6, color: INK },

  table: { marginTop: 14, borderTopWidth: 1, borderColor: LINE },
  th: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: LINE,
    paddingVertical: 7,
  },
  thText: { fontSize: 8, fontWeight: 700, color: MUTED, textTransform: "uppercase" },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ROW_BG,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  sectionTitle: { fontSize: 9, fontWeight: 700, color: INK, textTransform: "uppercase" },
  pill: {
    marginLeft: 8,
    backgroundColor: "#fef3c7",
    color: GOLD,
    fontSize: 7,
    fontWeight: 700,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  itemRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: LINE,
    paddingVertical: 7,
  },

  // columns
  cName: { width: "32%", paddingRight: 4, paddingLeft: 4 },
  cUnit: { width: "11%", textAlign: "center" },
  cQty: { width: "11%", textAlign: "center" },
  cSessions: { width: "11%", textAlign: "center" },
  cPrice: { width: "16%", textAlign: "right" },
  cAmount: { width: "19%", textAlign: "right", paddingRight: 4 },

  summary: { marginTop: 12, flexDirection: "row", justifyContent: "flex-end" },
  summaryBox: { width: "55%" },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  summaryLabel: { color: INK },
  summaryValue: { color: INK, textAlign: "right" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderColor: LINE,
  },
  totalLabel: { fontSize: 11, fontWeight: 700, color: INK },
  totalValue: { fontSize: 12, fontWeight: 700, color: TEAL, textAlign: "right" },

  blocks: {
    marginTop: 16,
    backgroundColor: ROW_BG,
    borderRadius: 6,
    padding: 12,
  },
  blockTitle: {
    fontSize: 8.5,
    fontWeight: 700,
    color: INK,
    textTransform: "uppercase",
    marginTop: 8,
  },
  blockTitleFirst: { marginTop: 0 },
  bullet: { flexDirection: "row", marginTop: 3, paddingRight: 6 },
  bulletDot: { width: 10, color: MUTED },
  bulletText: { flex: 1, fontSize: 8.5, color: INK },
  bold: { fontWeight: 700 },
  link: { color: "#ea580c" },

  footer: { marginTop: 24, alignItems: "flex-end" },
  issueDate: { color: INK },
  signature: { width: 120, height: 56, objectFit: "contain", marginTop: 6 },
  repName: { fontWeight: 700, color: INK, marginTop: 4 },
  repTitle: { fontSize: 8, color: MUTED },
});

const URL_RE = /(https?:\/\/[^\s]+)/g;

/** Render a line that may contain **bold** segments and URLs. */
function RichLine({ line }: { line: string }) {
  // split on **bold** markers, keeping alternating normal/bold segments
  const parts = line.split(/\*\*(.+?)\*\*/g);
  return (
    <Text style={s.bulletText}>
      {parts.map((part, i) => {
        const bold = i % 2 === 1;
        // further split each part on URLs to color them
        const segs = part.split(URL_RE);
        return segs.map((seg, j) => {
          const isUrl = URL_RE.test(seg);
          URL_RE.lastIndex = 0;
          return (
            <Text
              key={`${i}-${j}`}
              style={[bold ? s.bold : {}, isUrl ? s.link : {}]}
            >
              {seg}
            </Text>
          );
        });
      })}
    </Text>
  );
}

type LogoSrc = string | { data: Buffer; format: "png" | "jpg" };

// react-pdf can't reliably load a Windows file path, so embed the image as a
// buffer. Small files embed directly; very large PNGs are downscaled with sharp
// if it's available (it ships with Next but its native binary may be missing).
const logoCache = new Map<string, LogoSrc | null>();

async function loadLogo(logoUrl?: string): Promise<LogoSrc | undefined> {
  if (!logoUrl) return undefined;
  if (logoUrl.startsWith("http")) return logoUrl; // react-pdf fetches remote URLs
  if (logoCache.has(logoUrl)) return logoCache.get(logoUrl) ?? undefined;

  const file = path.join(process.cwd(), "public", logoUrl.replace(/^\//, ""));
  if (!fs.existsSync(file)) {
    logoCache.set(logoUrl, null);
    return undefined;
  }
  const format: "png" | "jpg" = /\.jpe?g$/i.test(file) ? "jpg" : "png";
  try {
    if (fs.statSync(file).size <= 800_000) {
      const result: LogoSrc = { data: fs.readFileSync(file), format };
      logoCache.set(logoUrl, result);
      return result;
    }
    const sharp = (await import("sharp")).default;
    const data = await sharp(file)
      .resize({ width: 320, height: 320, fit: "inside" })
      .png({ compressionLevel: 9 })
      .toBuffer();
    const result: LogoSrc = { data, format: "png" };
    logoCache.set(logoUrl, result);
    return result;
  } catch (error) {
    console.error("[pdf] logo load failed", error);
    logoCache.set(logoUrl, null);
    return undefined;
  }
}

function QuoteDocument({ doc, logo }: { doc: QuoteDoc; logo?: LogoSrc }) {
  const { company, recipient, sections, blocks, totals, representative } = doc;
  const taxLabel = `Thuế GTGT ${Number(totals.taxRate)}%`;

  return (
    <Document title={`Báo giá ${doc.quoteNumber}`}>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            {logo ? <Image src={logo} style={s.logo} /> : null}
            <Text style={s.title}>Báo giá dịch vụ</Text>
          </View>
          <View style={s.headerRight}>
            <Text style={s.companyName}>{company.name}</Text>
            {company.taxCode ? (
              <Text style={s.companyLine}>MST: {company.taxCode}</Text>
            ) : null}
            {company.address ? (
              <Text style={s.companyLine}>Địa chỉ: {company.address}</Text>
            ) : null}
            <Text style={s.companyLine}>
              {[company.email && `Email: ${company.email}`, company.hotline && `Hotline: ${company.hotline}`]
                .filter(Boolean)
                .join(" | ")}
            </Text>
            <Text style={s.quoteNo}>#{doc.quoteNumber}</Text>
          </View>
        </View>

        {/* Recipient */}
        <View style={s.recipient}>
          <Text style={s.recipientName}>
            {recipient.salutation}: {recipient.name}
          </Text>
          {recipient.intro ? <Text style={s.intro}>{recipient.intro}</Text> : null}
        </View>

        {/* Table */}
        <View style={s.table}>
          <View style={s.th}>
            <Text style={[s.thText, s.cName]}>Hạng mục</Text>
            <Text style={[s.thText, s.cUnit]}>ĐVT</Text>
            <Text style={[s.thText, s.cQty]}>Số lượng</Text>
            <Text style={[s.thText, s.cSessions]}>Số buổi</Text>
            <Text style={[s.thText, s.cPrice]}>Đơn giá</Text>
            <Text style={[s.thText, s.cAmount]}>Thành tiền</Text>
          </View>

          {sections.map((section, si) => (
            <View key={si} wrap={false}>
              <View style={s.sectionRow}>
                <Text style={s.sectionTitle}>{section.title}</Text>
                <Text style={s.pill}>{formatVND(section.subtotal)}</Text>
              </View>
              {section.items.map((item) => (
                <View key={item.id} style={s.itemRow}>
                  <Text style={s.cName}>{item.name}</Text>
                  <Text style={s.cUnit}>{item.unit}</Text>
                  <Text style={s.cQty}>{item.qty}</Text>
                  <Text style={s.cSessions}>{item.sessions ?? ""}</Text>
                  <Text style={s.cPrice}>{formatVND(item.unitPrice)}</Text>
                  <Text style={s.cAmount}>{formatVND(item.amount)}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={s.summary}>
          <View style={s.summaryBox}>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Cộng tiền dịch vụ</Text>
              <Text style={s.summaryValue}>{formatVND(totals.subtotal)}</Text>
            </View>
            {totals.discount > 0 ? (
              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>Giảm giá</Text>
                <Text style={s.summaryValue}>-{formatVND(totals.discount)}</Text>
              </View>
            ) : null}
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>{taxLabel}</Text>
              <Text style={s.summaryValue}>{formatVND(totals.taxAmount)}</Text>
            </View>
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Tổng thanh toán</Text>
              <Text style={s.totalValue}>{formatVND(totals.total)}</Text>
            </View>
          </View>
        </View>

        {/* Blocks */}
        {blocks.length > 0 ? (
          <View style={s.blocks}>
            {blocks.map((block, bi) => (
              <View key={block.id} wrap={false}>
                <Text style={[s.blockTitle, bi === 0 ? s.blockTitleFirst : {}]}>
                  {block.title}
                </Text>
                {block.lines.map((line, li) => (
                  <View key={li} style={s.bullet}>
                    <Text style={s.bulletDot}>•</Text>
                    <RichLine line={line} />
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        {/* Signature footer */}
        <View style={s.footer}>
          {doc.issueDate ? (
            <Text style={s.issueDate}>
              Ngày lập: {doc.issueDate.split("-").reverse().join("/")}
            </Text>
          ) : null}
          {doc.representativeUrl ? (
            <Image src={doc.representativeUrl} style={s.signature} />
          ) : null}
          {representative.name ? <Text style={s.repName}>{representative.name}</Text> : null}
          {representative.title ? (
            <Text style={s.repTitle}>{representative.title}</Text>
          ) : null}
        </View>
      </Page>
    </Document>
  );
}

/** Render a quote to a PDF Buffer (Node runtime only). */
export async function renderQuotePdf(doc: QuoteDoc): Promise<Buffer> {
  ensureFonts();
  const logo = await loadLogo(doc.company.logoUrl);
  return renderToBuffer(<QuoteDocument doc={doc} logo={logo} />);
}
