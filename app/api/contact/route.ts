import { NextResponse } from "next/server";
import type {
  ContactRequestDto,
  ContactResponseDto,
} from "@/dto/contact.dto";
import { Resend } from "resend";

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

const isValidPhone = (phone: string) => {
  const cleaned = phone.replace(/\s/g, "");
  return /^[0-9]{10}$/.test(cleaned);
};

// Type cho form mới
type ContactFormData = {
  fullName: string;
  phone: string;
  address?: string;
  content?: string;
};

const ensurePayload = (payload: Partial<ContactFormData>) => {
  if (!payload?.fullName?.trim()) return "Vui lòng nhập họ và tên.";
  if (!payload?.phone?.trim()) return "Vui lòng nhập số điện thoại.";
  if (!isValidPhone(payload.phone)) return "Số điện thoại không hợp lệ.";
  return null;
};

const createEmailTemplate = (data: ContactFormData) => {
  const { fullName, phone, address, content } = data;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thông tin liên hệ mới từ F Production</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px;">
    <h1 style="color: #05302C; font-size: 24px; margin-bottom: 20px; border-bottom: 2px solid #05302C; padding-bottom: 10px;">
      Thông tin liên hệ mới từ F Production
    </h1>
    
    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
      Bạn có một thông tin liên hệ mới từ khách hàng quan tâm đến dịch vụ của F Production.
    </p>
    
    <div style="background-color: #f9f9f9; border-left: 4px solid #05302C; padding: 20px; margin-bottom: 20px;">
      <h2 style="color: #05302C; font-size: 18px; margin-top: 0; margin-bottom: 15px;">
        Thông tin khách hàng
      </h2>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #333333; width: 150px;">Họ và tên:</td>
          <td style="padding: 8px 0; color: #666666;">${fullName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #333333;">Số điện thoại:</td>
          <td style="padding: 8px 0; color: #666666;">
            <a href="tel:${phone}" style="color: #05302C; text-decoration: none;">${phone}</a>
          </td>
        </tr>
        ${address ? `
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #333333;">Địa chỉ:</td>
          <td style="padding: 8px 0; color: #666666;">${address}</td>
        </tr>
        ` : ''}
      </table>
    </div>
    
    ${content ? `
    <div style="background-color: #f9f9f9; border-left: 4px solid #05302C; padding: 20px; margin-bottom: 20px;">
      <h2 style="color: #05302C; font-size: 18px; margin-top: 0; margin-bottom: 15px;">
        Nội dung tin nhắn
      </h2>
      <p style="color: #666666; font-size: 16px; line-height: 1.6; white-space: pre-wrap; margin: 0;">
        ${content}
      </p>
    </div>
    ` : ''}
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
      <p style="color: #999999; font-size: 14px; margin: 0;">
        Email này được gửi tự động từ hệ thống F Production
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
};

export async function GET() {
  return NextResponse.json({
    services: studioServices,
    notice:
      "Các gói dịch vụ linh hoạt theo bối cảnh thực tế. Liên hệ đội ngũ F.Production để nhận proposal chi tiết.",
  });
}

export async function POST(request: Request) {
  let payload: Partial<ContactFormData>;

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

  // Gửi email cho admin bằng Resend
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL || "admin@fproduction.com";
    const fromEmail = process.env.FROM_EMAIL || "noreply@resend.dev";

    if (!resendApiKey) {
      console.error("RESEND_API_KEY không được cấu hình");
      // Vẫn trả về success nhưng log lỗi
      console.info("New contact request", { referenceId, payload });
    } else {
      const resend = new Resend(resendApiKey);

      await resend.emails.send({
        from: fromEmail,
        to: [adminEmail],
        subject: `Thông tin liên hệ mới từ ${payload.fullName} - F Production`,
        html: createEmailTemplate(payload as ContactFormData),
      });

      console.info("Email đã được gửi thành công", { referenceId, payload });
    }
  } catch (emailError) {
    console.error("Lỗi khi gửi email:", emailError);
    // Vẫn trả về success để không làm gián đoạn trải nghiệm người dùng
  }

  const response: ContactResponseDto = {
    success: true,
    message:
      "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.",
    referenceId,
  };

  return NextResponse.json(response, { status: 201 });
}

