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
  { k: "所在地", v: "〒170-0005 東京都豊島区南大塚2丁目37番5号 RENEX Otsuka 10階" },
  { k: "電話番号", v: "03-6555-8000\n受付時間 10:00 – 18:00（土日祝休）" },
  { k: "メールアドレス", v: "info@qring.jp" },
  {
    k: "販売価格・サービス利用料",
    v: "【QRシール】\n販売価格：1枚880円（税込）\n\n【通話サービス】\nベーシックプラン：1回880円（税込）\n初期費用：無料\n月額基本料：無料\n通話が成立した場合にのみサービス利用料が発生します。\nQRコードの読み取りから1時間以内の同一利用では、再通話・折り返しによる追加のサービス利用料は発生しません。\n1回の通話時間は最大3分です。",
  },
  {
    k: "商品代金以外の必要料金",
    v: "【送料】\n全国一律430円（税込）\n\n【配送方法】\n日本郵便・レターパックライト\n\n【通話料金】\n通話サービス利用料とは別に、通信事業者所定の通話料金が発生する場合があります。",
  },
  {
    k: "お支払い方法",
    v: "クレジットカード決済（Stripe）\n\nQRシール購入代金、通話サービス利用料ともに、Stripeを利用したクレジットカード決済となります。",
  },
  {
    k: "お支払い時期・期限",
    v: "【QRシール購入代金】\nご注文時にクレジットカードでお支払いいただきます。\n\n【通話サービス利用料】\n通話成立後、登録された携帯電話番号へのSMSおよびメールアドレス宛に、お支払いのご案内をお送りします。\nご案内に記載された決済ページから、クレジットカードでお支払いください。\nお支払い期限は、通話が成立した日の2日後の24時（日本時間）までです。\n期限までにお支払いが確認できない場合は、サービスの利用を停止します。",
  },
  {
    k: "商品の引渡時期・サービスの提供時期",
    v: "QRシール：ご注文・決済確認後、原則5営業日以内に発送\n通話サービス：登録手続き完了後、利用可能",
  },
  {
    k: "返品・交換・キャンセル",
    v: "商品の不良・破損等については、商品到着後7日以内にご連絡いただいた場合に限り対応いたします。\n通話サービス利用料については、支払い完了後の返金は行いません。",
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
