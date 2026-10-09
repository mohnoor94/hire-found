import type { Metadata } from "next";
import { Toaster } from "sonner";
import { YasminPageClient } from "@/components/yasmin/yasmin-page-client";
import { withBasePath } from "@/lib/base-path";
import "./yasmin.css";

export const metadata: Metadata = {
  title: "Yasmin's Space",
  description: "HireFound admin panel for managing job listings.",
  robots: { index: false, follow: false },
  icons: {
    icon: withBasePath("/assets/butterfly-favicon.svg"),
  },
};

export default function YasminPage() {
  return (
    <div className="yasmin-app min-h-dvh overflow-x-hidden font-sans text-text-main antialiased">
      <YasminPageClient />
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
