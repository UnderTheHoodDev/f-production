"use client";

import * as React from "react";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Option = {
  value: string;
  label: string;
};

type MultiSelectProps = {
  options: Option[];
  selected: string[];
  onSelectedChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  position?: "top" | "bottom";
};

export function MultiSelect({
  options,
  selected,
  onSelectedChange,
  placeholder = "Chọn...",
  className,
  disabled = false,
  position = "bottom",
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onSelectedChange(selected.filter((v) => v !== value));
    } else {
      onSelectedChange([...selected, value]);
    }
  };

  const removeOption = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectedChange(selected.filter((v) => v !== value));
  };

  const selectedLabels = options
    .filter((opt) => selected.includes(opt.value))
    .map((opt) => opt.label);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <Button
        type="button"
        variant="outline"
        className={cn(
          "w-full justify-between text-left font-normal",
          !selected.length && "text-muted-foreground",
          className
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className="truncate">
          {selected.length > 0
            ? selectedLabels.length === 1
              ? selectedLabels[0]
              : `Đã chọn ${selected.length} mục`
            : placeholder}
        </span>
        <ChevronDownIcon
          className={cn(
            "ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform",
            position === "top" && isOpen && "rotate-180",
            position === "bottom" && isOpen && "rotate-180"
          )}
        />
      </Button>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 w-full rounded-md border bg-popover shadow-md",
            position === "top"
              ? "bottom-full mb-1"
              : "top-full mt-1"
          )}
        >
          <div className="max-h-[300px] overflow-auto p-1">
            {options.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <div
                  key={option.value}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                    isSelected
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                  onClick={() => toggleOption(option.value)}
                >
                  <div className="flex h-4 w-4 items-center justify-center rounded-sm border mr-2">
                    {isSelected && (
                      <CheckIcon className="h-3 w-3 text-primary" />
                    )}
                  </div>
                  <span>{option.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selected.map((value) => {
            const option = options.find((opt) => opt.value === value);
            if (!option) return null;
            return (
              <div
                key={value}
                className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs"
              >
                <span>{option.label}</span>
                <button
                  type="button"
                  onClick={(e) => removeOption(value, e)}
                  className="ml-1 rounded-full hover:bg-secondary-foreground/20"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

