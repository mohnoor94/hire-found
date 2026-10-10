import type { Metadata } from "next";
import { Toaster } from "sonner";
import { YasminPageClient } from "@/components/yasmin/yasmin-page-client";
import { withBasePath } from "@/lib/base-path";
import "./yasmin.css";

export const metadata: Metadata = {
  title: "Yasmin's Space - Yasmin's Studio",
  description: "HireFound studio for Yasmin Blasi to curate and manage opportunities.",
  robots: { index: false, follow: false },
  icons: {
    icon: withBasePath("/assets/butterfly-favicon.svg"),
  },
};

export default function YasminPage() {
  return (
    <div className="min-h-dvh font-sans text-text-main antialiased bg-[#FCF9F5]">
      <YasminPageClient />
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
