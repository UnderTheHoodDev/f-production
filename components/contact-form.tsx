'use client';

import { FormEvent, useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

const defaultPayload = {
  name: "",
  email: "",
  service: "Chụp chân dung doanh nghiệp",
  budget: "",
  message: "",
};

export function ContactForm() {
  const [payload, setPayload] = useState(defaultPayload);
  const [status, setStatus] = useState<FormState>("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Không thể gửi thông tin, hãy thử lại.");
      }

      const data = (await response.json()) as { message: string };
      setStatus("success");
      setFeedback(data.message);
      setPayload(defaultPayload);
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error ? error.message : "Có lỗi xảy ra, vui lòng thử lại."
      );
    }
  };

  const isSending = status === "loading";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-black/5 bg-white/90 p-6 shadow-lg shadow-black/5 backdrop-blur"
    >
      <div>
        <label className="text-sm font-semibold text-gray-700" htmlFor="name">
          Họ và tên *
        </label>
        <input
          id="name"
          required
          value={payload.name}
          onChange={(event) =>
            setPayload({ ...payload, name: event.target.value })
          }
          className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm outline-none focus:border-black/40"
          placeholder="Nguyễn Minh An"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label className="text-sm font-semibold text-gray-700" htmlFor="email">
            Email *
          </label>
          <input
            id="email"
            type="email"
            required
            value={payload.email}
            onChange={(event) =>
              setPayload({ ...payload, email: event.target.value })
            }
            placeholder="minhan@company.com"
            className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm outline-none focus:border-black/40"
          />
        </div>

        <div className="sm:col-span-1">
          <label className="text-sm font-semibold text-gray-700" htmlFor="budget">
            Ngân sách dự kiến
          </label>
          <input
            id="budget"
            value={payload.budget}
            onChange={(event) =>
              setPayload({ ...payload, budget: event.target.value })
            }
            placeholder="Ví dụ: 15.000.000đ"
            className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm outline-none focus:border-black/40"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700" htmlFor="service">
          Dịch vụ quan tâm
        </label>
        <select
          id="service"
          value={payload.service}
          onChange={(event) =>
            setPayload({ ...payload, service: event.target.value })
          }
          className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm outline-none focus:border-black/40"
        >
          <option>Chụp chân dung doanh nghiệp</option>
          <option>Chụp lookbook - sản phẩm</option>
          <option>Quay TVC studio</option>
          <option>Thuê studio theo giờ</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700" htmlFor="message">
          Ghi chú
        </label>
        <textarea
          id="message"
          rows={4}
          value={payload.message}
          onChange={(event) =>
            setPayload({ ...payload, message: event.target.value })
          }
          placeholder="Hãy cho chúng tôi biết bối cảnh, số lượng người và phong cách mong muốn."
          className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm outline-none focus:border-black/40"
        />
      </div>

      <button
        type="submit"
        disabled={isSending}
        className="flex w-full items-center justify-center rounded-xl bg-brand px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSending ? "Đang gửi..." : "Đặt lịch tư vấn"}
      </button>

      {status !== "idle" && (
        <p
          className={`text-sm ${
            status === "success" ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {feedback}
        </p>
      )}
      <p className="text-xs text-gray-500">
        Gửi form đồng nghĩa bạn đồng ý với việc F.Production liên hệ qua email/
        điện thoại để tư vấn chi tiết.
      </p>
    </form>
  );
}

