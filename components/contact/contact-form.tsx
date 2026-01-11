'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useForm } from '@tanstack/react-form';
import { clsx } from 'clsx';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Phone,
  MapPin,
  MessageSquare,
  Send,
  CheckCircle2,
  Mail,
  Clock,
} from 'lucide-react';

const FORM_FIELDS = [
  {
    name: 'fullName' as const,
    label: 'Họ và tên',
    placeholder: 'Điền họ và tên của bạn',
    type: 'input',
    icon: User,
    validator: (value: string) =>
      !value ? 'Họ và tên là bắt buộc' : undefined,
  },
  {
    name: 'phone' as const,
    label: 'Số điện thoại',
    placeholder: 'Điền số điện thoại của bạn',
    type: 'input',
    icon: Phone,
    validator: (value: string) => {
      if (!value) return 'Số điện thoại là bắt buộc';
      if (!/^[0-9]{10}$/.test(value.replace(/\s/g, ''))) {
        return 'Số điện thoại không hợp lệ';
      }
      return undefined;
    },
  },
  {
    name: 'address' as const,
    label: 'Địa chỉ',
    placeholder: 'Điền địa chỉ của bạn',
    type: 'input',
    icon: MapPin,
    required: false,
    validator: () => undefined,
  },
  {
    name: 'content' as const,
    label: 'Nội dung',
    placeholder: 'Mô tả nhu cầu của bạn...',
    type: 'textarea',
    rows: 4,
    icon: MessageSquare,
    required: false,
    validator: () => undefined,
  },
];

const INPUT_CLASSES = clsx(
  'text-sm md:text-base',
  'border-none bg-transparent shadow-none p-0',
  'focus:border-none focus:ring-0 focus:outline-none',
  'focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0',
  'placeholder:text-gray-400'
);

const contactInfo = [
  {
    icon: Phone,
    label: 'Hotline',
    value: '0123 456 789',
    href: 'tel:0123456789',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'contact@fproduction.vn',
    href: 'mailto:contact@fproduction.vn',
  },
  {
    icon: Clock,
    label: 'Giờ làm việc',
    value: '8:00 - 18:00 (T2 - T7)',
    href: null,
  },
];

export default function ContactForm() {
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      fullName: '',
      phone: '',
      address: '',
      content: '',
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(value),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || 'Không thể gửi thông tin, hãy thử lại.'
          );
        }

        setIsSuccessDialogOpen(true);
        form.reset();
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : 'Có lỗi xảy ra, vui lòng thử lại.'
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
    <div className="layout-padding py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-10 text-center md:mb-14"
        >
          <h1 className="text-background-secondary mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
            Liên hệ với chúng tôi
          </h1>
          <p className="mx-auto max-w-2xl text-gray-500 md:text-lg">
            Để lại thông tin và chúng tôi sẽ liên hệ tư vấn miễn phí cho bạn
            trong thời gian sớm nhất
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
          {/* Contact Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-2"
          >
            <div className="bg-background-secondary h-full rounded-3xl p-6 md:p-8">
              <h2 className="mb-6 text-xl font-semibold text-white md:text-2xl">
                Thông tin liên hệ
              </h2>

              <div className="mb-8 flex flex-col gap-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="bg-primary/20 flex h-12 w-12 items-center justify-center rounded-xl">
                      <info.icon className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-white/60">{info.label}</p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-white transition-colors hover:text-white/80"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-white">{info.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Decorative Element */}
              <div className="relative mt-8 overflow-hidden rounded-2xl bg-linear-to-br from-white/10 to-white/5 p-6">
                <div className="bg-primary/30 absolute -top-10 -right-10 h-32 w-32 rounded-full blur-3xl"></div>
                <p className="relative z-10 text-sm leading-relaxed text-white/80">
                  Đội ngũ F Production luôn sẵn sàng hỗ trợ bạn. Hãy để lại
                  thông tin và chúng tôi sẽ phản hồi trong vòng{' '}
                  <span className="text-primary font-semibold">
                    1 giờ làm việc
                  </span>
                  .
                </p>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="lg:col-span-3"
          >
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-100/50 md:p-8">
              <div className="flex flex-col gap-5">
                {FORM_FIELDS.map((fieldConfig, index) => (
                  <motion.div
                    key={fieldConfig.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  >
                    <form.Field
                      name={fieldConfig.name}
                      validators={{
                        onChange: ({ value }) => fieldConfig.validator(value),
                      }}
                    >
                      {(field) => (
                        <div className="flex flex-col gap-2">
                          <div
                            className={clsx(
                              'group flex gap-3 rounded-2xl border-2 bg-gray-50/50 p-4 transition-all duration-300',
                              field.state.meta.errors.length > 0
                                ? 'border-red-300 bg-red-50/30'
                                : 'border-transparent hover:border-gray-200 focus-within:border-background-secondary focus-within:bg-white'
                            )}
                          >
                            <div className="mt-0.5">
                              <fieldConfig.icon
                                className={clsx(
                                  'h-5 w-5 transition-colors duration-300',
                                  field.state.meta.errors.length > 0
                                    ? 'text-red-400'
                                    : 'text-gray-400 group-focus-within:text-background-secondary'
                                )}
                              />
                            </div>
                            <div className="flex-1">
                              <Label
                                htmlFor={field.name}
                                className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700"
                              >
                                {fieldConfig.label}
                                {fieldConfig.required !== false && (
                                  <span className="text-red-500">*</span>
                                )}
                              </Label>

                              {fieldConfig.type === 'textarea' ? (
                                <Textarea
                                  id={field.name}
                                  name={field.name}
                                  value={field.state.value}
                                  onBlur={field.handleBlur}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
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
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
                                  placeholder={fieldConfig.placeholder}
                                  className={INPUT_CLASSES}
                                />
                              )}
                            </div>
                          </div>

                          {field.state.meta.errors.length > 0 && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="ml-12 text-xs text-red-500"
                            >
                              {field.state.meta.errors[0]}
                            </motion.p>
                          )}
                        </div>
                      )}
                    </form.Field>
                  </motion.div>
                ))}

                <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-gray-400">
                    <span className="text-red-500">*</span> Thông tin bắt buộc
                  </p>

                  <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                  >
                    {([canSubmit, isSubmitting]) => (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="button"
                          onClick={handleSubmit}
                          disabled={!canSubmit}
                          className="bg-background-secondary hover:bg-background-secondary/90 flex w-full items-center gap-2 px-8 py-6 text-base font-semibold text-white shadow-lg transition-all duration-300 sm:w-auto"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                              Đang gửi...
                            </>
                          ) : (
                            <>
                              <Send className="h-5 w-5" />
                              Gửi liên hệ
                            </>
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </form.Subscribe>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex flex-col items-center space-y-4 py-4 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="rounded-full bg-green-100 p-4"
              >
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </motion.div>
              <DialogTitle className="text-background-secondary text-2xl font-semibold">
                Gửi thành công!
              </DialogTitle>
              <DialogDescription className="pt-2 text-base text-gray-500">
                Cảm ơn bạn đã liên hệ! Đội ngũ F Production sẽ phản hồi trong
                vòng 1 giờ làm việc.
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="flex justify-center pb-2">
            <Button
              onClick={() => setIsSuccessDialogOpen(false)}
              className="bg-background-secondary hover:bg-background-secondary/90 px-8 py-2 text-white"
            >
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
