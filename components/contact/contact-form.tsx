'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@tanstack/react-form';
import { clsx } from 'clsx';
import React from 'react';

const FORM_FIELDS = [
  {
    name: 'fullName' as const,
    label: 'Họ và tên',
    placeholder: 'Điền họ và tên của bạn',
    type: 'input',
    validator: (value: string) =>
      !value ? 'Họ và tên là bắt buộc' : undefined,
  },
  {
    name: 'phone' as const,
    label: 'Số điện thoại',
    placeholder: 'Điền số điện thoại của bạn',
    type: 'input',
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
    validator: (value: string) => (!value ? 'Địa chỉ là bắt buộc' : undefined),
  },
  {
    name: 'content' as const,
    label: 'Nội dung',
    placeholder: 'Điền nội dung',
    type: 'textarea',
    rows: 5,
    validator: (value: string) => (!value ? 'Nội dung là bắt buộc' : undefined),
  },
];

const INPUT_CLASSES = clsx(
  'md:text-base text-sm',
  'p-0 border-none bg-transparent shadow-none',
  'focus:border-none focus:ring-0 focus:outline-none',
  'focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0',
  'aria-invalid:border-none aria-invalid:ring-0 placeholder:text-[#AFAFAF]'
);

export default function ContactForm() {
  const form = useForm({
    defaultValues: {
      fullName: '',
      phone: '',
      address: '',
      content: '',
    },
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value);
      alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.');
    },
  });

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-2xl rounded-lg p-0 sm:p-4 lg:p-8">
        <div className="mb-3">
          <h1 className="mb-2 text-2xl font-semibold text-[#05302C] md:text-xl">
            Liên hệ với F Production
          </h1>
          <p className="text-sm text-[#9B9B9B] md:text-base">
            Vui lòng để lại thông tin nếu bạn có nhu cầu quay chụp sự kiện cùng
            F Production
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {FORM_FIELDS.map((fieldConfig) => (
            <form.Field
              key={fieldConfig.name}
              name={fieldConfig.name}
              validators={{
                onChange: ({ value }) => fieldConfig.validator(value),
              }}
            >
              {(field) => (
                <div className="flex flex-col gap-2">
                  <div className="space-y-1 rounded-xl border border-[#E4E4E4] bg-gray-50 p-3">
                    <Label
                      htmlFor={field.name}
                      className="mb-1 gap-1 text-sm md:text-base"
                    >
                      {fieldConfig.label}
                      <span className="text-red-500">*</span>
                    </Label>

                    {fieldConfig.type === 'textarea' ? (
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
                    <p className="text-xs text-red-500 md:text-sm">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          ))}

          <p className="text-sm text-red-500">* Thông tin bắt buộc</p>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="bg-background-secondary hover:bg-background-secondary/80 text-foreground layout-padding w-min cursor-pointer py-2 text-base"
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi liên hệ'}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </div>
    </div>
  );
}
