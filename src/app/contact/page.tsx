import type { Metadata } from "next";

const CONTACT_URL = "https://axb.qring.jp/contact";
const title = "お問い合わせ窓口を移動しました｜株式会社QRing";
const description = "お問い合わせは、新しいお問い合わせ窓口をご利用ください。";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: CONTACT_URL },
  openGraph: { title, description, url: CONTACT_URL },
};

export default function ContactPage() {
  return (
    <>
      {/* React hoists this metadata element into the exported HTML head.
          This is an HTML redirect (HTTP 200), not an HTTP 301 redirect. */}
      <meta httpEquiv="refresh" content={`0;url=${CONTACT_URL}`} />
      <section className="bg-cream pt-40 pb-24 md:pt-52 md:pb-32">
        <div className="container-narrow">
          <h1 className="font-serif text-2xl md:text-4xl font-light leading-relaxed">
            お問い合わせ窓口を移動しました。
          </h1>
          <p className="body-jp mt-8">
            自動的に新しいお問い合わせページへ移動します。
          </p>
          <p className="body-jp mt-4">
            自動的に移動しない場合は、以下からお進みください。
          </p>
          <a href={CONTACT_URL} className="btn-primary mt-8">
            お問い合わせページへ
          </a>
        </div>
      </section>
    </>
  );
}
