"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "@tanstack/react-form";
import { clsx } from "clsx";
import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const FORM_FIELDS = [
  {
    name: "fullName" as const,
    label: "Họ và tên",
    placeholder: "Điền họ và tên của bạn",
    type: "input",
    required: true,
    validator: (value: string) =>
      !value ? "Họ và tên là bắt buộc" : undefined,
  },
  {
    name: "phone" as const,
    label: "Số điện thoại",
    placeholder: "Điền số điện thoại của bạn",
    type: "input",
    required: true,
    validator: (value: string) => {
      if (!value) return "Số điện thoại là bắt buộc";
      if (!/^[0-9]{10}$/.test(value.replace(/\s/g, ""))) {
        return "Số điện thoại không hợp lệ";
      }
      return undefined;
    },
  },
  {
    name: "address" as const,
    label: "Địa chỉ",
    placeholder: "Điền địa chỉ của bạn",
    type: "input",
    required: false,
    validator: undefined,
  },
  {
    name: "content" as const,
    label: "Nội dung",
    placeholder: "Điền nội dung",
    type: "textarea",
    rows: 5,
    required: false,
    validator: undefined,
  },
];

const INPUT_CLASSES = clsx(
  "p-0 border-none bg-transparent shadow-none",
  "focus:border-none focus:ring-0 focus:outline-none",
  "focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0",
  "aria-invalid:border-none aria-invalid:ring-0 placeholder:text-[#AFAFAF]"
);

export default function ContactForm() {
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm({
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      content: "",
    },
    onSubmit: async ({ value }) => {
      setErrorMessage("");
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(value),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Không thể gửi thông tin, hãy thử lại.");
        }

        setSuccessMessage(
          data.message || "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất."
        );
        setIsSuccessDialogOpen(true);
        
        // Reset form sau khi gửi thành công
        form.reset();
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra, vui lòng thử lại."
        );
      }
    },
  });

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-2xl mx-auto rounded-lg p-8">
        <div className="mb-3">
          <h1 className="text-2xl font-semibold text-[#05302C] mb-2">
            Liên hệ với F Production
          </h1>
          <p className="text-[#9B9B9B]">
            Vui lòng để lại thông tin nếu bạn có nhu cầu quay chụp sự kiện cùng
            F Production
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {FORM_FIELDS.map((fieldConfig) => (
            <form.Field
              key={fieldConfig.name}
              name={fieldConfig.name}
              validators={
                fieldConfig.validator
                  ? {
                      onChange: ({ value }) => fieldConfig.validator!(value),
                    }
                  : undefined
              }
            >
              {(field) => (
                <div className="flex flex-col gap-2">
                  <div className="space-y-1 bg-gray-50 rounded-xl p-3 border border-[#E4E4E4]">
                    <Label
                      htmlFor={field.name}
                      className="text-base mb-1 gap-1"
                    >
                      {fieldConfig.label}
                      {fieldConfig.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </Label>

                    {fieldConfig.type === "textarea" ? (
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder={fieldConfig.placeholder}
                        rows={fieldConfig.rows}
                        className={INPUT_CLASSES}
                      />
                    ) : (
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder={fieldConfig.placeholder}
                        className={INPUT_CLASSES}
                      />
                    )}
                  </div>

                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          ))}

          <p className="text-sm text-red-500">* Thông tin bắt buộc</p>

          {errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          )}

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="w-min bg-background-secondary hover:bg-background-secondary/80 cursor-pointer text-foreground px-10 py-2 text-base"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi liên hệ"}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </div>

      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <div className="flex flex-col items-center text-center space-y-4 py-4">
              <div className="rounded-full bg-green-50 p-4">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
              <DialogTitle className="text-2xl font-semibold text-[#05302C]">
                Gửi thành công!
              </DialogTitle>
              <DialogDescription className="text-base text-[#666666] pt-2">
                {successMessage || "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất."}
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="flex justify-center pb-2">
            <Button
              onClick={() => setIsSuccessDialogOpen(false)}
              className="bg-background-secondary hover:bg-background-secondary/80 text-foreground px-8 py-2"
            >
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
