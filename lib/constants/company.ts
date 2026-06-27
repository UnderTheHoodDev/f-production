import type {
  QuoteBlock,
  QuoteContent,
  QuoteFeedbackConfig,
} from "@/lib/quotes/types";

// Default company block shown on every quote. Snapshotted into each quote's
// `content` on creation so historical quotes stay correct if these change.
export const DEFAULT_COMPANY = {
  name: "CÔNG TY CỔ PHẦN TRUYỀN THÔNG HÌNH ẢNH F PRODUCTION",
  taxCode: "", // MST chưa công bố trên website — admin tự điền
  address: "Hà Nội",
  email: "fproduction.work@gmail.com",
  hotline: "078.6969.888",
  logoUrl: "/logo-name-optimized.png",
};

export const DEFAULT_RECIPIENT_SALUTATION = "Kính gửi";
export const DEFAULT_RECIPIENT_INTRO =
  "Dựa trên thông tin trao đổi, chúng tôi xin gửi báo giá chi tiết dịch vụ như sau:";

export const DEFAULT_FEEDBACK: QuoteFeedbackConfig = {
  prompt: "Báo giá này có đang vừa vặn với ngân sách dự kiến của bạn không?",
  options: [
    "Khá hợp lý, tôi cần tư vấn thêm",
    "Giá hơi cao, tôi muốn tối ưu chi phí",
    "Thấp hơn dự kiến, tôi cần gói cao cấp hơn",
  ],
};

const uid = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

function defaultBlocks(): QuoteBlock[] {
  return [
    { id: uid(), title: "THIẾT BỊ SỬ DỤNG", lines: [""] },
    {
      id: uid(),
      title: "ĐIỀU KHOẢN & ĐIỀU KIỆN",
      lines: ["Báo giá có hiệu lực trong 15 ngày."],
    },
    {
      id: uid(),
      title: "ĐIỀU KHOẢN THANH TOÁN",
      lines: [
        "**Đợt 1 (Tạm ứng):** Quý khách vui lòng thanh toán 50% tổng giá trị báo giá sau khi xác nhận báo giá.",
        "**Đợt 2 (Tất toán):** Thanh toán 50% giá trị còn lại trong vòng 03 ngày làm việc sau khi bàn giao đầy đủ sản phẩm cuối cùng.",
      ],
    },
  ];
}

/** Build the default editable document for a brand-new quote. */
export function createDefaultContent(): QuoteContent {
  return {
    company: { ...DEFAULT_COMPANY },
    recipient: {
      salutation: DEFAULT_RECIPIENT_SALUTATION,
      name: "",
      intro: DEFAULT_RECIPIENT_INTRO,
    },
    sections: [
      {
        id: uid(),
        title: "",
        items: [
          {
            id: uid(),
            name: "",
            unit: "",
            qty: 1,
            sessions: 1,
            unitPrice: 0,
            amount: 0,
          },
        ],
      },
    ],
    blocks: defaultBlocks(),
    representative: { name: "", title: "" },
    feedback: { ...DEFAULT_FEEDBACK, options: [...DEFAULT_FEEDBACK.options] },
  };
}

export { uid as makeId };
