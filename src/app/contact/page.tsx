import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "QRingに関するお問い合わせ・資料請求・法人さま向けのご相談窓口です。",
};

const FAQ = [
  {
    q: "電話番号は本当に相手に伝わりませんか？",
    a: "はい。QRingは、お互いの電話番号を一切相手に開示することなく通話できる特許取得済みの技術を採用しています。通話は一時的な中間番号を経由するため、本来の番号が表示されることはありません。",
  },
  {
    q: "アプリのインストールは必要ですか？",
    a: "不要です。QRコードを読み取り、表示された案内に従って発信するだけ。普段お使いの電話アプリでそのままご利用いただけます。",
  },
  {
    q: "中間番号には有効期限がありますか？",
    a: "セキュリティ確保のため、中間番号は一定時間のみ有効です。期限経過後は自動的に無効化されますので、第三者による不正利用の心配はありません。",
  },
  {
    q: "法人での導入は可能ですか？",
    a: "もちろん可能です。配送業務、現場連絡、顧客対応など、用途に応じた法人プラン・API連携・ホワイトラベル展開もご相談いただけます。本フォームよりお気軽にお問い合わせください。",
  },
];

export default function ContactPage() {
  return (
    <>
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

      {/* FAQ */}
      <section id="faq" className="py-24 md:py-40 bg-cream">
        <div className="container-wide">
          <Reveal>
            <SectionTitle
              eyebrow="— FAQ"
              en="Frequently Asked."
              jp="よくあるご質問"
            />
          </Reveal>
          <div className="mt-16 max-w-3xl">
            {FAQ.map((item, i) => (
              <Reveal as="div" key={item.q} delay={i * 80}>
                <details className="group border-t border-ink/10 last:border-b">
                  <summary className="flex items-start justify-between gap-6 py-7 cursor-pointer list-none">
                    <span className="font-serif text-base md:text-lg text-ink">
                      {item.q}
                    </span>
                    <span className="font-serif text-2xl text-moss transition-transform duration-500 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="body-jp text-sm md:text-base pb-7 pr-10">
                    {item.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
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
