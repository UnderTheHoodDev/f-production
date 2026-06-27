"use client";

import * as React from "react";
import { Loader2, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import type { BuilderState, BuilderAction } from "./builder-reducer";

export function QuoteMetaFields({
  state,
  dispatch,
}: {
  state: BuilderState;
  dispatch: React.Dispatch<BuilderAction>;
}) {
  const { content } = state;
  const [uploading, setUploading] = React.useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const presignedRes = await fetch("/api/admin/quotes/presigned-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          fileSize: file.size,
        }),
      });
      const presigned = await presignedRes.json();
      if (!presigned.success) {
        alert(presigned.message || "Không thể tải chữ ký lên.");
        return;
      }
      await fetch(presigned.presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      dispatch({
        type: "SET_SIGNATURE",
        key: presigned.s3Key,
        url: URL.createObjectURL(file),
      });
    } catch (err) {
      console.error("Signature upload failed", err);
      alert("Không thể tải chữ ký lên.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Recipient */}
      <FieldGroup className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground">Người nhận</h3>
        <div className="grid grid-cols-3 gap-2">
          <Field>
            <FieldLabel htmlFor="salutation">Xưng hô</FieldLabel>
            <Input
              id="salutation"
              value={content.recipient.salutation}
              onChange={(e) =>
                dispatch({ type: "SET_RECIPIENT", field: "salutation", value: e.target.value })
              }
            />
          </Field>
          <Field className="col-span-2">
            <FieldLabel htmlFor="recipientName">
              Tên người nhận <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="recipientName"
              value={content.recipient.name}
              placeholder="VD: Anh Nguyễn Văn A / Công ty ABC"
              onChange={(e) =>
                dispatch({ type: "SET_RECIPIENT", field: "name", value: e.target.value })
              }
              required
            />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="intro">Lời mở đầu</FieldLabel>
          <Textarea
            id="intro"
            rows={2}
            value={content.recipient.intro}
            onChange={(e) =>
              dispatch({ type: "SET_RECIPIENT", field: "intro", value: e.target.value })
            }
          />
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field>
            <FieldLabel htmlFor="issueDate">Ngày lập</FieldLabel>
            <Input
              id="issueDate"
              type="date"
              value={state.issueDate}
              onChange={(e) =>
                dispatch({ type: "SET_DATE", field: "issueDate", value: e.target.value })
              }
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="validUntil">Hiệu lực đến</FieldLabel>
            <Input
              id="validUntil"
              type="date"
              value={state.validUntil}
              onChange={(e) =>
                dispatch({ type: "SET_DATE", field: "validUntil", value: e.target.value })
              }
            />
          </Field>
        </div>
      </FieldGroup>

      {/* Company + representative */}
      <FieldGroup className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground">Công ty & người đại diện</h3>
        <Field>
          <FieldLabel htmlFor="companyName">Tên công ty</FieldLabel>
          <Input
            id="companyName"
            value={content.company.name}
            onChange={(e) =>
              dispatch({ type: "SET_COMPANY", field: "name", value: e.target.value })
            }
          />
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field>
            <FieldLabel htmlFor="taxCode">MST</FieldLabel>
            <Input
              id="taxCode"
              value={content.company.taxCode}
              onChange={(e) =>
                dispatch({ type: "SET_COMPANY", field: "taxCode", value: e.target.value })
              }
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="hotline">Hotline</FieldLabel>
            <Input
              id="hotline"
              value={content.company.hotline}
              onChange={(e) =>
                dispatch({ type: "SET_COMPANY", field: "hotline", value: e.target.value })
              }
            />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="companyAddress">Địa chỉ</FieldLabel>
          <Input
            id="companyAddress"
            value={content.company.address}
            onChange={(e) =>
              dispatch({ type: "SET_COMPANY", field: "address", value: e.target.value })
            }
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="companyEmail">Email</FieldLabel>
          <Input
            id="companyEmail"
            value={content.company.email}
            onChange={(e) =>
              dispatch({ type: "SET_COMPANY", field: "email", value: e.target.value })
            }
          />
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field>
            <FieldLabel htmlFor="repName">Người đại diện</FieldLabel>
            <Input
              id="repName"
              value={content.representative.name}
              placeholder="VD: Trương Quốc Hùng"
              onChange={(e) =>
                dispatch({ type: "SET_REPRESENTATIVE", field: "name", value: e.target.value })
              }
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="repTitle">Chức danh</FieldLabel>
            <Input
              id="repTitle"
              value={content.representative.title}
              placeholder="Account Manager"
              onChange={(e) =>
                dispatch({ type: "SET_REPRESENTATIVE", field: "title", value: e.target.value })
              }
            />
          </Field>
        </div>
        <Field>
          <FieldLabel>Chữ ký (PNG/JPEG)</FieldLabel>
          {state.representativeUrl ? (
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={state.representativeUrl}
                alt="Chữ ký"
                className="h-16 w-32 rounded border bg-white object-contain"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => dispatch({ type: "SET_SIGNATURE", key: null, url: null })}
              >
                <X className="mr-1 size-4" />
                Xóa
              </Button>
            </div>
          ) : (
            <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent">
              {uploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}
              <span>{uploading ? "Đang tải..." : "Tải chữ ký"}</span>
              <input
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                  e.target.value = "";
                }}
              />
            </label>
          )}
        </Field>
      </FieldGroup>
    </div>
  );
}
