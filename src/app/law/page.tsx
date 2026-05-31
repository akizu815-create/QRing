import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記",
  description: "株式会社QRingの特定商取引法に基づく表記です。",
};

const ROWS = [
  { k: "事業者名", v: "株式会社QRing" },
  { k: "代表者名", v: "代表取締役 木津 愛子" },
  { k: "所在地", v: "〒170-0005 東京都豊島区南大塚2丁目37番5号 ONEST南大塚ビル10階" },
  { k: "電話番号", v: "03-6555-8000\n受付時間 10:00 – 18:00（土日祝休）" },
  { k: "メールアドレス", v: "info@qring.jp" },
  {
    k: "販売価格",
    v: "・シール本体：販売開始時にサイト上に表示します\n・システム利用料：年額2,000円（税込）",
  },
  { k: "追加費用", v: "送料：一律430円\nインターネット通信料・通話料は別途必要です" },
  { k: "支払方法", v: "クレジットカード決済 / PayPay" },
  {
    k: "引渡・提供時期",
    v: "・シール本体：注文確定後、5営業日以内に発送\n・システム：登録完了後、即時利用可能",
  },
  {
    k: "返品・キャンセル",
    v: "商品に欠陥がある場合に限り、商品到着後7日以内にご連絡いただいた場合のみ対応いたします。\nサービス（システム利用料）については、支払い完了後の返金および日割り計算による精算は一切行いません。",
  },
  {
    k: "動作環境",
    v: "QRコード読み取り機能およびインターネット接続が可能なスマートフォン",
  },
];

export default function LawPage() {
  return (
    <>
      <PageHeader
        eyebrow="— Legal"
        en="Specified Commercial Transactions."
        jp="特定商取引法に基づく表記"
      />

      <section className="py-24 md:py-40">
        <div className="container-wide">
          <Reveal>
            <SectionTitle
              eyebrow="— 法令に基づく表記"
              en="Disclosure."
              jp="事業者情報・取引条件"
            />
          </Reveal>

          <div className="mt-16 max-w-4xl">
            <dl>
              {ROWS.map((row, i) => (
                <Reveal as="div" key={row.k} delay={i * 60}>
                  <div className="grid grid-cols-12 gap-4 py-7 border-t border-ink/10 last:border-b">
                    <dt className="col-span-12 md:col-span-3 text-[11px] tracking-[0.3em] uppercase text-moss pt-0.5">
                      {row.k}
                    </dt>
                    <dd className="col-span-12 md:col-span-9 body-jp text-sm md:text-base text-ink/80 whitespace-pre-line">
                      {row.v}
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
