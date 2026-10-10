import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Inter, Noto_Sans_Arabic } from "next/font/google";
import Script from "next/script";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/base-path";
import { CalDialogProvider } from "@/components/site/cal-dialog";
import "./globals.css";
import "./hirefound.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FCF9F5" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1A2E" },
  ],
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
  title: "HireFound - You want a hire? We got you found.",
  description:
    "HireFound by Yasmin Blasi - Connecting the right people with where they belong. Executive search, recruitment, and career matchmaking across MENA.",
  icons: {
    icon: withBasePath("/assets/hirefound-signature.svg"),
  },
  openGraph: {
    title: "HireFound - You want a hire? We got you found.",
    description: "Connecting the right people with where they belong.",
    url: "https://hirefound.com/",
    siteName: "HireFound",
    images: ["https://hirefound.com/assets/yasmin-blasi.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HireFound - You want a hire? We got you found.",
    description: "Connecting the right people with where they belong.",
    images: ["https://hirefound.com/assets/yasmin-blasi.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={cn(
        "scroll-smooth font-sans",
        inter.variable,
        dmSerif.variable,
        notoSansArabic.variable,
      )}
    >
      <head>
        <Script
          id="hf-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k='hf-theme';var d=document.documentElement;var t=localStorage.getItem(k)||'system';var dark=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;var useDark=(t==='dark')||(t==='system'&&dark);if(useDark){d.classList.add('dark');d.style.colorScheme='dark';}else{d.classList.remove('dark');d.style.colorScheme='light';}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="overflow-x-hidden bg-background font-sans text-foreground antialiased">
        <CalDialogProvider>{children}</CalDialogProvider>
      </body>
    </html>
  );
}
