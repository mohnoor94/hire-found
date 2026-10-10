import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Inter, Noto_Sans_Arabic } from "next/font/google";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/base-path";
import { CalDialogProvider } from "@/components/site/cal-dialog";
import { I18nProvider } from "@/components/site/i18n";
import { ar as messages } from "@/i18n/ar";
import "../globals.css";
import "../hirefound.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FCF9F5",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-dm-serif",
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HireFound - لقِ توفيقك",
  description:
    "HireFound بإدارة Yasmin Blasi - نوفّق بين الناس والفرص الصحيحة في الأردن والخليج.",
  icons: {
    icon: withBasePath("/assets/hirefound-signature.svg"),
  },
  alternates: {
    languages: {
      en: "https://hirefound.com/",
      ar: "https://hirefound.com/ar/",
    },
  },
  openGraph: {
    title: "HireFound - لقِ توفيقك",
    description: "نوفّق بين الناس والفرص الصحيحة في الأردن والخليج.",
    url: "https://hirefound.com/ar/",
    siteName: "HireFound",
    images: ["https://hirefound.com/assets/yasmin-blasi.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HireFound - لقِ توفيقك",
    description: "نوفّق بين الناس والفرص الصحيحة في الأردن والخليج.",
    images: ["https://hirefound.com/assets/yasmin-blasi.png"],
  },
};

export default function RootLayoutAr({ children }: LayoutProps<"/ar">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      data-scroll-behavior="smooth"
      className={cn(
        "scroll-smooth font-sans",
        inter.variable,
        dmSerif.variable,
        notoSansArabic.variable,
      )}
    >
      <body className="overflow-x-hidden bg-warm font-sans text-text-main antialiased">
        <I18nProvider messages={messages}>
          <CalDialogProvider>{children}</CalDialogProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

