import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type ContactEmailProps = {
    fullName: string;
    phone: string;
    address?: string;
    content?: string;
    referenceId: string;
    submittedAt: string;
};

export async function sendContactNotification(data: ContactEmailProps) {
    const { fullName, phone, address, content, referenceId, submittedAt } = data;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Yêu cầu liên hệ mới</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #09403b 0%, #05302c 100%); padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #d9b588; font-size: 24px; font-weight: 600;">
                F Production
              </h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">
                Yêu cầu liên hệ mới
              </p>
            </td>
          </tr>
          
          <!-- Reference Badge -->
          <tr>
            <td style="padding: 24px 40px 0;">
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td style="background-color: #fef3c7; border-radius: 8px; padding: 12px 16px;">
                    <span style="color: #92400e; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                      Mã tham chiếu: ${referenceId}
                    </span>
                  </td>
                  <td style="text-align: right;">
                    <span style="color: #6b7280; font-size: 13px;">
                      ${submittedAt}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 24px 40px;">
              <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 18px; font-weight: 600;">
                Thông tin khách hàng
              </h2>
              
              <!-- Info Cards -->
              <table role="presentation" style="width: 100%; border-collapse: separate; border-spacing: 0 12px;">
                <!-- Full Name -->
                <tr>
                  <td style="background-color: #f9fafb; border-radius: 12px; padding: 16px 20px;">
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="width: 40px; vertical-align: top;">
                          <div style="width: 36px; height: 36px; background-color: #dbeafe; border-radius: 8px; text-align: center; line-height: 36px;">
                            <span style="font-size: 16px;">👤</span>
                          </div>
                        </td>
                        <td style="padding-left: 12px;">
                          <p style="margin: 0 0 4px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                            Họ và tên
                          </p>
                          <p style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 500;">
                            ${fullName}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Phone -->
                <tr>
                  <td style="background-color: #f9fafb; border-radius: 12px; padding: 16px 20px;">
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="width: 40px; vertical-align: top;">
                          <div style="width: 36px; height: 36px; background-color: #dcfce7; border-radius: 8px; text-align: center; line-height: 36px;">
                            <span style="font-size: 16px;">📞</span>
                          </div>
                        </td>
                        <td style="padding-left: 12px;">
                          <p style="margin: 0 0 4px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                            Số điện thoại
                          </p>
                          <p style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 500;">
                            <a href="tel:${phone}" style="color: #059669; text-decoration: none;">${phone}</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                ${address ? `
                <!-- Address -->
                <tr>
                  <td style="background-color: #f9fafb; border-radius: 12px; padding: 16px 20px;">
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="width: 40px; vertical-align: top;">
                          <div style="width: 36px; height: 36px; background-color: #fce7f3; border-radius: 8px; text-align: center; line-height: 36px;">
                            <span style="font-size: 16px;">📍</span>
                          </div>
                        </td>
                        <td style="padding-left: 12px;">
                          <p style="margin: 0 0 4px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                            Địa chỉ
                          </p>
                          <p style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 500;">
                            ${address}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : ''}
                
                ${content ? `
                <!-- Content/Message -->
                <tr>
                  <td style="background-color: #f9fafb; border-radius: 12px; padding: 16px 20px;">
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="width: 40px; vertical-align: top;">
                          <div style="width: 36px; height: 36px; background-color: #e0e7ff; border-radius: 8px; text-align: center; line-height: 36px;">
                            <span style="font-size: 16px;">💬</span>
                          </div>
                        </td>
                        <td style="padding-left: 12px;">
                          <p style="margin: 0 0 4px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                            Nội dung quan tâm
                          </p>
                          <p style="margin: 0; color: #1f2937; font-size: 15px; line-height: 1.6;">
                            ${content.replace(/\n/g, '<br>')}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>
          
          <!-- CTA -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td style="text-align: center;">
                    <a href="tel:${phone}" style="display: inline-block; background-color: #09403b; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 14px;">
                      📞 Gọi ngay cho khách
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                Email này được gửi tự động từ hệ thống F Production
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

    const result = await resend.emails.send({
        from: process.env.FROM_EMAIL || "F Production <noreply@fproduction.vn>",
        to: process.env.ADMIN_EMAIL || "",
        subject: `[Liên hệ mới] ${fullName} - ${phone}`,
        html: htmlContent,
    });

    return result;
}
