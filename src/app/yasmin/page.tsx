import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import { Toaster } from "sonner";
import { YasminPageClient } from "@/components/yasmin/yasmin-page-client";
import { withBasePath } from "@/lib/base-path";
import { cn } from "@/lib/utils";
import "./yasmin.css";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

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
    <div
      className={cn(
        "yasmin-app min-h-screen overflow-x-hidden font-sans text-text-main antialiased",
        caveat.variable,
      )}
    >
      <YasminPageClient />
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
