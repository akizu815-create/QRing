import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Noto+Serif+JP:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-ivory text-ink antialiased">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-M75FF9RHJ6"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-M75FF9RHJ6');
          `}
        </Script>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
