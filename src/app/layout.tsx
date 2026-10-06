import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { BookingModalProvider } from "@/components/site/booking-modal";
import "./globals.css";
import "./hirefound.css";

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

export const metadata: Metadata = {
  title: "HireFound - You want a hire? We got you found.",
  description:
    "HireFound by Yasmin Blasi - Connecting the right people with where they belong. Executive search, recruitment, and career matchmaking across MENA.",
  openGraph: {
    title: "HireFound - You want a hire? We got you found.",
    description: "Connecting the right people with where they belong.",
    url: "https://hirefound.com/",
    siteName: "HireFound",
    images: ["https://hirefound.com/assets/yasmin-blasi.png"],
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("scroll-smooth font-sans", inter.variable, dmSerif.variable)}
    >
      <body className="overflow-x-hidden bg-warm font-sans text-text-main antialiased">
        <BookingModalProvider>{children}</BookingModalProvider>
      </body>
    </html>
  );
}
