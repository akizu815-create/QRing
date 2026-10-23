import { pageMetadata } from "@/lib/seo";
import PageStructuredData from "@/components/PageStructuredData";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";


export const metadata = pageMetadata("contact");

export default function ContactPage() {
  return (
    <>
      <PageStructuredData page="contact" />
      <PageHeader
        eyebrow="— Contact"
        en="Get in touch."
        jp="お問い合わせ"
      />

      <section className="py-24 md:py-32">
        <div className="container-wide grid md:grid-cols-12 gap-12 md:gap-16">
          {/* INFO */}
          <div className="md:col-span-4">
            <Reveal>
              <SectionTitle eyebrow="— Direct" en="Contact." jp="お問い合わせ窓口" />
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-12 space-y-8">
                <div>
                  <p className="text-[11px] tracking-[0.3em] uppercase text-moss mb-2">
                    Phone
                  </p>
                  <p className="font-serif text-2xl">03-6555-8000</p>
                  <p className="mt-2 text-xs text-ink/60">
                    受付時間 10:00 – 18:00 / 土日祝休
                  </p>
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.3em] uppercase text-moss mb-2">
                    For Business
                  </p>
                  <p className="body-jp text-sm">
                    法人プラン・API連携・大量導入・ホワイトラベル展開のご相談
                  </p>
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.3em] uppercase text-moss mb-2">
                    Press
                  </p>
                  <p className="body-jp text-sm">
                    取材・メディアからのご依頼もフォームより承ります
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* FORM */}
          <div className="md:col-span-8">
            <Reveal delay={200}>
              <form
                action="https://formspree.io/f/xeedwlak"
                method="POST"
                className="space-y-10"
              >
                {/* Formspree: スパム対策ハニーポット */}
                <input type="text" name="_gotcha" className="hidden" />
                <div className="grid md:grid-cols-2 gap-8">
                  <Field label="お名前" name="name" placeholder="山田 太郎" required />
                  <Field label="会社名 (任意)" name="company" placeholder="株式会社○○" />
                  <Field label="メールアドレス" name="email" type="email" placeholder="you@example.com" required />
                  <Field label="電話番号 (任意)" name="tel" type="tel" placeholder="03-0000-0000" />
                </div>

                <div>
                  <label className="block text-[11px] tracking-[0.3em] uppercase text-moss mb-3">
                    お問い合わせ種別
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {["資料請求", "サービスについて", "法人導入", "メディア取材", "その他"].map(
                      (t) => (
                        <label
                          key={t}
                          className="inline-flex items-center gap-2 cursor-pointer border border-ink/20 px-4 py-2 text-sm hover:border-moss transition-colors"
                        >
                          <input type="radio" name="type" className="accent-moss" />
                          {t}
                        </label>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] tracking-[0.3em] uppercase text-moss mb-3">
                    お問い合わせ内容
                  </label>
                  <textarea
                    name="message"
                    rows={6}
                    required
                    placeholder="ご相談内容をご記入ください"
                    className="w-full bg-transparent border-b border-ink/30 focus:border-moss outline-none py-4 text-base resize-none transition-colors"
                  />
                </div>

                <label className="flex items-start gap-3 text-sm text-ink/70">
                  <input type="checkbox" required className="mt-1 accent-moss" />
                  <span>
                    プライバシーポリシーに同意の上、送信します。
                  </span>
                </label>

                <button
                  type="submit"
                  className="btn-primary w-full md:w-auto"
                >
                  Send Message
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-cream py-24 md:py-32">
        <div className="container-wide">
          <Reveal>
            <SectionTitle
              eyebrow="— FAQ"
              en="Frequently Asked."
              jp="よくあるご質問"
            />
          </Reveal>
          <p className="body-jp mt-10 text-sm text-ink/75 md:text-base">サービスの使い方や料金に関するご質問は、専用ページにまとめています。</p>
          <a href="/faq/" className="mt-6 inline-flex min-h-11 items-center text-sm text-moss underline decoration-moss/40 underline-offset-4 hover:decoration-moss">よくあるご質問を見る →</a>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[11px] tracking-[0.3em] uppercase text-moss mb-3">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-ink/30 focus:border-moss outline-none py-3 text-base placeholder:text-ink/30 transition-colors"
      />
    </div>
  );
}
