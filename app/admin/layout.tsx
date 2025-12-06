import { ThemeProvider } from "@/components/theme-provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="fproduction-theme">
      {children}
    </ThemeProvider>
  );
}

