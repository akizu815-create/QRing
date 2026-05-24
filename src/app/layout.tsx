import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-cormorant",
  display: "swap",
});

const notoSerifJp = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-noto-serif",
  display: "swap",
});

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "QRing｜つながるQR｜電話番号を教えずに、つながる。",
    template: "%s｜QRing",
  },
  description:
    "QRingは、電話番号を相手に開示することなく音声通話ができる特許技術『つながるQR』を提供します。アプリ不要、QRコードを読み取るだけで、安心の連絡手段を実現。",
  metadataBase: new URL("https://www.qring.jp"),
  openGraph: {
    title: "QRing｜つながるQR",
    description: "電話番号を教えずに、つながる。特許取得済の安心通話サービス。",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ja"
      className={`${cormorant.variable} ${notoSerifJp.variable} ${notoSansJp.variable}`}
    >
      <body className="font-sans bg-ivory text-ink antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
