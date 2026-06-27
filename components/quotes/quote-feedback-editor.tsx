"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import type { QuoteFeedbackConfig } from "@/lib/quotes/types";
import type { BuilderAction } from "./builder-reducer";

export function QuoteFeedbackEditor({
  feedback,
  dispatch,
}: {
  feedback: QuoteFeedbackConfig;
  dispatch: React.Dispatch<BuilderAction>;
}) {
  const setOption = (index: number, value: string) => {
    const options = feedback.options.map((o, i) => (i === index ? value : o));
    dispatch({ type: "SET_FEEDBACK_OPTIONS", options });
  };
  const addOption = () =>
    dispatch({ type: "SET_FEEDBACK_OPTIONS", options: [...feedback.options, ""] });
  const removeOption = (index: number) =>
    dispatch({
      type: "SET_FEEDBACK_OPTIONS",
      options: feedback.options.filter((_, i) => i !== index),
    });

  return (
    <div className="space-y-3">
      <Field>
        <FieldLabel htmlFor="feedback-prompt">Câu hỏi phản hồi</FieldLabel>
        <Input
          id="feedback-prompt"
          value={feedback.prompt}
          onChange={(e) => dispatch({ type: "SET_FEEDBACK_PROMPT", value: e.target.value })}
          placeholder="Báo giá này có vừa với ngân sách của bạn không?"
        />
      </Field>

      <div className="space-y-2">
        <FieldLabel>Các lựa chọn</FieldLabel>
        {feedback.options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              aria-label={`Lựa chọn ${index + 1}`}
              value={option}
              onChange={(e) => setOption(index, e.target.value)}
              placeholder={`Lựa chọn ${index + 1}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 text-destructive hover:text-destructive"
              disabled={feedback.options.length <= 1}
              onClick={() => removeOption(index)}
            >
              <Trash2 className="size-4" />
              <span className="sr-only">Xóa lựa chọn</span>
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addOption}>
          <Plus className="mr-1 size-4" />
          Thêm lựa chọn
        </Button>
      </div>
    </div>
  );
}
