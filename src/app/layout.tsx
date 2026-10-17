import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Inter, Noto_Sans_Arabic } from "next/font/google";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/base-path";
import { CalDialogProvider } from "@/components/site/cal-dialog";
import "./globals.css";
import "./hirefound.css";

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
  variable: "--font-noto-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HireFound | Founded by Yasmin Blasi - The Right People Change Everything",
  description:
    "HireFound by Yasmin Blasi. Boutique recruitment, executive search, and people development across Jordan and the GCC. The right people change everything.",
  icons: {
    icon: withBasePath("/assets/hirefound-signature.svg"),
  },
  openGraph: {
    title: "HireFound | Founded by Yasmin Blasi - The Right People Change Everything",
    description:
      "Boutique recruitment, executive search, and people development across Jordan and the GCC.",
    url: "https://hirefound.com/",
    siteName: "HireFound",
    images: [
      {
        url: "https://hirefound.com/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "HireFound by Yasmin Blasi - Boutique Search & Speaking",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HireFound | Founded by Yasmin Blasi - The Right People Change Everything",
    description:
      "Boutique recruitment, executive search, and people development across Jordan and the GCC.",
    images: ["https://hirefound.com/assets/og-image.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn(
        "scroll-smooth font-sans",
        inter.variable,
        dmSerif.variable,
        notoSansArabic.variable,
      )}
    >
      <body className="overflow-x-hidden bg-background font-sans text-foreground antialiased">
        <CalDialogProvider>{children}</CalDialogProvider>
      </body>
    </html>
  );
}
