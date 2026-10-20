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
    k: "サービス利用料",
    v: "つながるQRサービス利用料：1セッション880円（税込）\n登録料：無料\n月額基本料：無料\n\nサービス利用料は、通話が成立した場合に登録者へ発生します。QRコードを読み取っただけでは料金は発生しません。\nこの880円はQRシール等の専用アイテムの商品代金ではありません。",
  },
  {
    k: "セッションの定義・利用条件",
    v: "1セッションとは、同じ登録者と発見者の組み合わせについて、QRコードの読み取りから始まる1時間の通話利用単位です。\n\n1回の通話時間は最大3分です。同じ登録者と発見者の組み合わせであれば、1時間以内の再通話・折り返しに追加のサービス利用料は発生しません。\n\n別の発見者が同じQRコードを読み取った場合は、1時間以内であっても別のセッションになります。\n\n1時間経過後、それまでのプライバシー電話番号は利用できなくなります。同じ相手と再び通話する場合は、QRコードを再スキャンして新しいセッションを開始する必要があります。新しいセッションで通話が成立した場合は、改めて880円（税込）が発生します。",
  },
  {
    k: "通常の電話料金",
    v: "つながるQRのサービス利用料とは別に、電話を発信した方に、ご契約の通信会社・料金プランに応じた通常の通話料が発生します。",
  },
  {
    k: "お支払い方法",
    v: "つながるQRサービス利用料は、Stripeを利用したクレジットカード決済でお支払いいただきます。",
  },
  {
    k: "お支払い時期・期限",
    v: "通話成立後、登録者にSMSおよびメールでお支払い案内を送信します。ご案内に記載された決済ページから、クレジットカードでお支払いください。\n\nお支払い期限は、通話が成立した日の2日後の23時59分（日本時間）までです。",
  },
  {
    k: "サービスの提供時期",
    v: "登録手続き完了後、利用可能",
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
