"use client";

import { ThemeToggle } from "@/components/theme-toggle";

export function AdminHeaderActions() {
    return (
        <div className="flex items-center gap-2 px-4">
            <ThemeToggle />
        </div>
    );
}
