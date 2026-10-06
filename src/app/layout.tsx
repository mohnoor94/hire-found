import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HireFound",
  description: "HireFound — hiring, found.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
