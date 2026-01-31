import { NextResponse } from "next/server";
import type {
  ContactRequestDto,
  ContactResponseDto,
} from "@/dto/contact.dto";
import { sendContactNotification } from "@/lib/email";
import { prisma } from "@/lib/prisma";

const ensurePayload = (payload: Partial<ContactRequestDto>) => {
  if (!payload?.fullName?.trim()) return "Vui lòng nhập họ tên.";
  if (!payload?.phone?.trim()) return "Vui lòng nhập số điện thoại.";
  const phoneDigits = payload.phone.replace(/\s/g, "");
  if (!/^[0-9]{10}$/.test(phoneDigits)) {
    return "Số điện thoại không hợp lệ (cần 10 số).";
  }
  return null;
};

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
  const submittedAt = new Date().toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    dateStyle: "medium",
    timeStyle: "short",
  });

  // Save to database
  let emailSent = false;
  try {
    await prisma.contact.create({
      data: {
        referenceId,
        fullName: payload.fullName!,
        phone: payload.phone!,
        address: payload.address || null,
        content: payload.content || null,
        status: "NEW",
      },
    });
    console.info("Contact saved to database", { referenceId });
  } catch (dbError) {
    console.error("Failed to save contact to database:", dbError);
    return NextResponse.json(
      { success: false, message: "Không thể lưu thông tin, vui lòng thử lại." },
      { status: 500 }
    );
  }

  // Send email notification to admin
  try {
    await sendContactNotification({
      fullName: payload.fullName!,
      phone: payload.phone!,
      address: payload.address,
      content: payload.content,
      referenceId,
      submittedAt,
    });
    emailSent = true;
    console.info("Email sent successfully", { referenceId });

    // Update emailSent flag
    await prisma.contact.update({
      where: { referenceId },
      data: { emailSent: true },
    });
  } catch (emailError) {
    console.error("Failed to send email notification:", emailError);
    // Don't fail the request if email fails, contact is already saved
  }

  const response: ContactResponseDto = {
    success: true,
    message:
      "Cảm ơn bạn đã liên hệ. Đội ngũ F.Production sẽ phản hồi trong vòng 1 giờ làm việc.",
    referenceId,
  };

  return NextResponse.json(response, { status: 201 });
}
