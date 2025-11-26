import { NextResponse } from "next/server";
import type {
  ContactRequestDto,
  ContactResponseDto,
} from "@/dto/contact.dto";

const studioServices = [
  {
    id: "portrait",
    title: "Chụp chân dung doanh nghiệp",
    turnaround: "48 giờ",
    priceFrom: 3500000,
  },
  {
    id: "product",
    title: "Lookbook - Sản phẩm",
    turnaround: "3-5 ngày",
    priceFrom: 5500000,
  },
  {
    id: "studio-rental",
    title: "Thuê studio",
    turnaround: "Theo giờ",
    priceFrom: 900000,
  },
];

const isValidEmail = (email: string) =>
  /\S+@\S+\.\S+/.test(email.toLowerCase());

const ensurePayload = (payload: Partial<ContactRequestDto>) => {
  if (!payload?.name) return "Vui lòng nhập họ tên.";
  if (!payload?.email || !isValidEmail(payload.email))
    return "Email chưa hợp lệ.";
  if (!payload?.service) return "Vui lòng chọn dịch vụ quan tâm.";
  return null;
};

export async function GET() {
  return NextResponse.json({
    services: studioServices,
    notice:
      "Các gói dịch vụ linh hoạt theo bối cảnh thực tế. Liên hệ đội ngũ F Production để nhận proposal chi tiết.",
  });
}

export async function POST(request: Request) {
  let payload: Partial<ContactRequestDto>;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Payload không hợp lệ." },
      { status: 400 }
    );
  }

  const error = ensurePayload(payload);
  if (error) {
    return NextResponse.json({ success: false, message: error }, { status: 400 });
  }

  const referenceId = `FP-${Date.now().toString(36).toUpperCase()}`;

  // Giả lập thao tác lưu trữ/log gửi về hệ thống sản phẩm riêng.
  console.info("New contact request", { referenceId, payload });

  const response: ContactResponseDto = {
    success: true,
    message:
      "Cảm ơn bạn đã liên hệ. Đội ngũ F Production sẽ phản hồi trong vòng 1 giờ làm việc.",
    referenceId,
  };

  return NextResponse.json(response, { status: 201 });
}

