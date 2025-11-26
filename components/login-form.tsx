"use client"

import { type ChangeEvent, type FormEvent, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type LoginFormProps = React.ComponentProps<"div"> & {
  redirectTo?: string
}

export function LoginForm({
  className,
  redirectTo = "/admin/dashboard",
  ...props
}: LoginFormProps) {
  const router = useRouter()
  const [formState, setFormState] = useState({ username: "", password: "" })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange =
    (field: "username" | "password") => (event: ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formState.username,
          password: formState.password,
          redirectTo,
        }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        setError(result?.message ?? "Đăng nhập không thành công.")
        return
      }

      router.replace(result?.redirectTo ?? redirectTo)
      router.refresh()
    } catch {
      setError("Không thể kết nối đến máy chủ. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border border-black/5 bg-white text-foreground-secondary shadow-2xl p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="space-y-6 bg-white/95 p-6 md:p-10" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col gap-3 text-center md:text-left">
                <span className="text-xs font-semibold uppercase tracking-[0.5em] text-brand-dark">
                  F.Production
                </span>
                <h1 className="text-3xl font-semibold text-foreground-secondary">
                  Đăng nhập quản trị
                </h1>
                <p className="text-sm text-foreground-secondary/75">
                  Nhập tài khoản nội bộ để truy cập bảng điều khiển studio.
                </p>
              </div>
              <Field>
                <FieldLabel
                  htmlFor="username"
                  className="text-sm font-semibold text-foreground-secondary"
                >
                  Tên đăng nhập
                </FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="studio@fproduction.vn"
                  value={formState.username}
                  onChange={handleChange("username")}
                  className="border border-black/5 bg-[#eef3ff] text-foreground-secondary ring-offset-transparent focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-0 placeholder:text-foreground-secondary/60"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel
                    htmlFor="password"
                    className="text-sm font-semibold text-foreground-secondary"
                  >
                    Mật khẩu
                  </FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm text-brand underline-offset-4 hover:text-brand-dark hover:underline"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={formState.password}
                  onChange={handleChange("password")}
                  className="border border-black/5 bg-[#eef3ff] text-foreground-secondary ring-offset-transparent focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-0 placeholder:text-foreground-secondary/60"
                  required
                />
              </Field>
              <Field>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand text-[#1f1f1f] transition hover:bg-brand-dark disabled:opacity-70"
                >
                  {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
              </Field>
              {error && (
                <p className="text-sm font-medium text-red-600" role="alert">
                  {error}
                </p>
              )}
              <FieldDescription className="text-center text-xs text-foreground-secondary/70 md:text-left">
                Cần hỗ trợ? Liên hệ producer trực 0971 123 456 hoặc email
                support@fproduction.vn
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden items-center justify-center bg-background-secondary md:flex">
            <div
              className="absolute inset-0 bg-linear-to-br from-background-secondary/70 via-background-secondary/40 to-background/70"
              aria-hidden="true"
            />
            <Image
              src="/logo-name-slogan.png"
              alt="F.Production logo"
              width={420}
              height={320}
              priority
              className="relative z-10 h-auto w-3/4 max-w-md object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.45)]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
