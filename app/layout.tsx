import type { Metadata, Viewport } from "next";
import { Syne, Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nikolaanastasijevic.com"),
  title: "Nikola Anastasijević — Software Developer in Hamilton",
  description:
    "Nikola Anastasijević is a software developer in Hamilton, Ontario building full-stack products across maps, automotive, finance, live trading data, and immersive 3D web experiences.",
  openGraph: {
    title: "Nikola Anastasijević — Software Developer",
    description:
      "Full-stack products, mobile apps, and 3D web experiences built in Hamilton, Ontario.",
    type: "website",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nikola Anastasijević — Software Developer",
    description:
      "Full-stack products, mobile apps, and 3D web experiences built in Hamilton, Ontario.",
  },
};

export const viewport: Viewport = {
  themeColor: "#08070b",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${syne.variable} ${instrument.variable} ${plexMono.variable}`}>
      <body className="grain antialiased">
        <a href="#main" className="skip-link font-mono">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
