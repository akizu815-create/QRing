import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "料金案内へ移動",
  robots: { index: false, follow: true },
  alternates: { canonical: "/price/" },
};

export default function FormerShopPage() {
  return (
    <section className="container-narrow min-h-[60vh] py-40">
      <meta httpEquiv="refresh" content="0;url=/price/" />
      <h1 className="font-serif text-3xl">料金案内ページへ移動します</h1>
      <p className="mt-6 text-sm">自動で移動しない場合は、<a className="text-moss underline" href="/price/">料金案内</a>をご覧ください。</p>
    </section>
  );
}
