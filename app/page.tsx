import { ContactForm } from "@/components/contact-form";

const stats = [
  { label: "dự án doanh nghiệp/năm", value: "250+" },
  { label: "kho props - ánh sáng", value: "120+" },
  { label: "diện tích studio", value: "450m²" },
];

const services = [
  {
    title: "Chân dung thương hiệu",
    description:
      "Phù hợp hồ sơ lãnh đạo, đội ngũ bán hàng và truyền thông nội bộ.",
    highlights: ["2 concept ánh sáng", "Make-up & stylist onsite", "Giao ảnh 48h"],
    badge: "Phổ biến",
  },
  {
    title: "Lookbook & sản phẩm",
    description: "Set thiết kế chuyên sâu cùng hệ thống đèn Aputure & Nanlite.",
    highlights: ["Set design modun", "Quay dọc & ngang đồng thời", "Digital asset 4K"],
    badge: "Studio team",
  },
  {
    title: "Thuê studio + thiết bị",
    description: "Không gian cyclo trắng, đen, scene lifestyle và phòng vật phẩm.",
    highlights: ["Booking theo giờ", "Kỹ thuật viên trực 24/7", "Gói combo camera"],
    badge: "Linh hoạt",
  },
];

const workflow = [
  {
    title: "Khám phá nhu cầu",
    detail:
      "30 phút tư vấn trực tuyến, xác định moodboard, số lượng nhân sự và mốc thời gian.",
  },
  {
    title: "Tiền kỳ & setup",
    detail:
      "Chuẩn bị cảnh quay, test ánh sáng, phối hợp make-up/ stylist và cập nhật checklist.",
  },
  {
    title: "Sản xuất & bàn giao",
    detail:
      "Làm việc với đạo diễn hình ảnh onsite, retouch/ grading nhanh chóng, bàn giao qua cloud.",
  },
];

const stack = [
  {
    title: "Frontend Next.js App Router",
    detail:
      "Trang giới thiệu, landing campaign và phần client component như form tư vấn sử dụng React Server Components.",
  },
  {
    title: "Backend Route Handlers",
    detail:
      "API nội bộ tại `app/api/contact` nhận booking, xác thực input và fan-out đến các dịch vụ (email, CRM).",
  },
  {
    title: "DTO tập trung",
    detail:
      "Định nghĩa request/response chuẩn hóa trong thư mục `dto/` giúp backend và frontend tái sử dụng cùng 1 nguồn sự thật.",
  },
  {
    title: "Triển khai đồng nhất",
    detail:
      "Deploy trên Vercel hoặc container riêng, một repo duy nhất quản lý cả web và API để tối ưu bảo trì.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex max-w-6xl flex-col gap-20 px-6 py-12 lg:px-0 lg:py-20">
        <section className="grid gap-12 rounded-[32px] border border-black/5 bg-white/60 p-10 shadow-lg shadow-black/5 backdrop-blur-lg lg:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-8">
            <p className="inline-flex items-center rounded-full bg-black text-white px-4 py-1 text-xs uppercase tracking-[0.3em]">
              F Production Studio
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-black lg:text-5xl">
              Dịch vụ chụp ảnh & studio cao cấp dành cho thương hiệu Việt.
            </h1>
            <p className="text-lg text-muted">
              Đội ngũ nhiếp ảnh gia, đạo diễn hình ảnh và kỹ thuật ánh sáng với hơn
              10 năm kinh nghiệm, mang đến hình ảnh nhất quán cho doanh nghiệp,
              sản phẩm và chiến dịch truyền thông.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#lien-he"
                className="rounded-full bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-dark"
              >
                Đặt lịch tư vấn
              </a>
              <a
                href="#stack"
                className="rounded-full border border-black/10 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-black"
              >
                Xem hạ tầng Next.js
              </a>
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-[28px] bg-black text-white"
            style={{
              backgroundImage:
                "linear-gradient(120deg, rgba(0,0,0,0.68), rgba(0,0,0,0.35)), url('https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=900&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="flex h-full flex-col justify-between p-8">
              <p className="text-sm uppercase tracking-[0.4em] text-white/80">
                Studio 450m²
              </p>
              <div className="space-y-6">
                <h2 className="text-3xl font-semibold">
                  Khuôn hình chuẩn điện ảnh, linh hoạt chuyển đổi set trong 15 phút.
                </h2>
                <p className="text-sm text-white/70">
                  Trang bị hệ thống đèn Aputure 600D Pro, Godox AD1200Pro, hơn 20 loại
                  phông/texture và khu vực lifestyle decor thay đổi hàng tháng.
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-full grid gap-4 rounded-2xl bg-white/90 p-6 shadow-inner shadow-black/5 sm:grid-cols-3">
            {stats.map((item) => (
              <div key={item.label} className="space-y-1">
                <p className="text-3xl font-semibold text-black">{item.value}</p>
                <p className="text-sm uppercase tracking-[0.3em] text-muted">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="dich-vu" className="space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm uppercase tracking-[0.4em] text-foreground/70">
              Dịch vụ
            </p>
            <h2 className="text-3xl font-semibold text-foreground">
              Các gói chụp chủ lực tại F Production.
            </h2>
            <p className="text-base text-foreground/80">
              Thiết kế để đáp ứng nhu cầu marketing, thương mại điện tử và truyền
              thông nội bộ với timeline rõ ràng.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.title}
                className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white/90 p-6 shadow-black/5 hover:-translate-y-1 hover:shadow-lg transition"
              >
                <span className="w-fit rounded-full bg-black px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
                  {service.badge}
                </span>
                <h3 className="text-2xl font-semibold text-black">{service.title}</h3>
                <p className="text-sm text-muted">{service.description}</p>
                <ul className="space-y-2 text-sm text-black/80">
                  {service.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-brand" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-10 rounded-[32px] border border-black/5 bg-white/70 p-10 shadow-black/5 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.4em] text-muted">
              Quy trình
            </p>
            <h2 className="text-3xl font-semibold text-black">
              Onset rõ ràng, update từng mốc cho khách hàng.
            </h2>
            <p className="text-base text-muted">
              Mỗi dự án được quản lý bằng Notion board, có producer phụ trách xuyên
              suốt và gửi preview ngay tại set.
            </p>
          </div>
          <div className="space-y-6">
            {workflow.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-black/5 bg-white/80 p-6 shadow-inner shadow-black/5"
              >
                <p className="text-xs uppercase tracking-[0.5em] text-brand">
                  Bước {index + 1}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-black">{step.title}</h3>
                <p className="text-sm text-muted">{step.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="stack" className="space-y-8">
          <div className="flex flex-col gap-2">
            <p className="text-sm uppercase tracking-[0.4em] text-foreground/70">
              Next.js Full-stack
            </p>
            <h2 className="text-3xl font-semibold text-foreground">
              Một dự án Next.js duy nhất cho cả frontend và backend.
            </h2>
            <p className="text-base text-foreground/80">
              Tận dụng App Router, Route Handlers và TypeScript DTO để team marketing
              và kỹ thuật cộng tác nhanh chóng.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {stack.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-black/5 bg-white/90 p-6 shadow-black/5"
              >
                <h3 className="text-xl font-semibold text-black">{item.title}</h3>
                <p className="mt-3 text-sm text-muted">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="lien-he"
          className="grid gap-10 rounded-[32px] border border-black/5 bg-white/90 p-10 shadow-lg shadow-black/5 lg:grid-cols-2"
        >
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.4em] text-muted">
              Liên hệ
            </p>
            <h2 className="text-3xl font-semibold text-black">
              Nhận proposal trong 01 giờ làm việc.
            </h2>
            <p className="text-base text-muted">
              Điền thông tin hoặc liên hệ hotline 0971 123 456 (Mr. Duy) để được tư
              vấn lịch trống studio và setup phù hợp.
            </p>
            <div className="rounded-2xl border border-dashed border-black/10 p-4 text-sm text-black/80">
              <p className="font-semibold text-black">Thời gian hoạt động</p>
              <p>Thứ 2 - Thứ 7, 8:00 - 21:00</p>
              <p>Địa chỉ: 128 Nguyễn Đình Chiểu, Q.3, TP.HCM</p>
            </div>
          </div>
          <ContactForm />
        </section>
      </main>
    </div>
  );
}
