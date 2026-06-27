import Link from "next/link";

export default function QuoteNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-slate-800">Không tìm thấy báo giá</h1>
      <p className="mt-2 max-w-md text-slate-600">
        Báo giá bạn đang tìm không tồn tại hoặc đã bị gỡ. Vui lòng kiểm tra lại
        đường dẫn hoặc liên hệ với chúng tôi.
      </p>
      <Link
        href="https://fproduction.vn"
        className="mt-6 inline-flex items-center rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
      >
        Về trang chủ
      </Link>
    </main>
  );
}
