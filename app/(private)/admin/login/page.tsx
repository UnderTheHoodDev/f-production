import type { Metadata } from "next"

import { LoginForm } from "@/components/login-form"
import { sanitizeAdminRedirect } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Admin Login | F.Production",
  description:
    "Đăng nhập khu vực quản trị F.Production để cập nhật lịch studio và dự án.",
}

type AdminLoginPageProps = {
  searchParams?: Promise<{
    redirectTo?: string
  }>
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams
  const redirectTo = sanitizeAdminRedirect(params?.redirectTo)

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fdf6ec,#eef4f1_55%,#e8efed)] text-foreground">
      <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-20">
        <LoginForm className="w-full" redirectTo={redirectTo} />
      </main>
    </div>
  )
}

