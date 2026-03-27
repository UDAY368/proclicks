import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { VisitTracker } from "@/components/analytics/VisitTracker";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
  display: "swap",
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pro Capture's Photography",
  description:
    "Elevate your brand's visual identity with comprehensive content creation services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} h-full scroll-smooth antialiased`}
    >
      <body
        className={`${sans.className} min-h-full flex flex-col bg-[#fbfbfc] text-zinc-900`}
      >
        <VisitTracker />
        {children}
      </body>
    </html>
  );
}
