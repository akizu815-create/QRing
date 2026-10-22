import { CONSUMER_SERVICE } from "@/config/consumerService";
export type FaqItem = {
  question: string;
  answer: string;
  link?: { label: string; href: string };
};

export type FaqCategory = { title: string; items: FaqItem[] };

const service = "/service/";
const price = "/price/";
const contact = "https://axb.qring.jp/contact";

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    title: "サービスについて",
    items: [
      { question: CONSUMER_SERVICE.faq.question, answer: CONSUMER_SERVICE.faq.answer, link: CONSUMER_SERVICE.faq.link },
      { question: "「つながるQR」とは、どのようなサービスですか？", answer: "QRコードをスキャンすることで、お互いの電話番号を知らせずに通話できるサービスです。高齢者の見守りやペットの迷子対策、落とし物の連絡など、さまざまな場面で利用できます。" },
      { question: "専用アプリのインストールは必要ですか？", answer: "いいえ、必要ありません。" },
      { question: "QRコードをスキャンする人も登録が必要ですか？", answer: "いいえ、必要ありません。" },
      { question: "どのような場面で利用できますか？", answer: "高齢者の見守り、ペットの迷子対策、落とし物の連絡などに利用できます。詳しくはサービスページの「活用シーン」をご覧ください。", link: { label: "活用シーン", href: `${service}#use-cases` } },
    ],
  },
  {
    title: "登録・QRコードについて",
    items: [
      { question: "QRコードはどのように登録しますか？", answer: "登録方法は、サービスページの「ご利用方法」でご案内しています。", link: { label: "ご利用方法", href: `${service}#how` } },
      { question: "QRコードはどこに貼ればよいですか？", answer: "バッグや持ち物、ペット用品など、用途に合った場所に貼ってご利用ください。具体的な使い方はサービスページの「活用シーン」をご覧ください。", link: { label: "活用シーン", href: `${service}#use-cases` } },
      { question: "同じQRコードを何度もスキャンしても大丈夫ですか？", answer: "はい。同じQRコードを繰り返しスキャンしてご利用いただけます。" },
    ],
  },
  {
    title: "通話・セッションについて",
    items: [
      { question: "電話に出られなかった場合、折り返しできますか？", answer: "はい。着信履歴に残ったプライバシー電話番号に、セッション開始から1時間以内であれば折り返しできます。詳しくは料金ページの「セッションとは？」をご覧ください。", link: { label: "セッションとは？", href: `${price}#session-title` } },
      { question: "1回の通話は何分までですか？", answer: "1回の通話は最大3分です。3分経過して通話が終了した場合も、同じ相手であればセッション開始から1時間以内は再通話できます。", link: { label: "CASE 01を見る", href: `${price}#session-case-01` } },
      { question: "1時間以内なら何度でも電話できますか？", answer: "はい。同じ登録者と発見者の組み合わせであれば、セッション開始から1時間以内は再通話や折り返しが可能です。詳しくは料金ページの「同じ相手なら、1時間以内は何度でも。」をご覧ください。", link: { label: "同じ相手なら、1時間以内は何度でも。", href: `${price}#session-case-01` } },
      { question: "1時間を過ぎたらどうなりますか？", answer: "そのセッションのプライバシー電話番号は使えなくなります。もう一度通話するには、QRコードを再スキャンしてください。詳しくは料金ページの「1時間を過ぎて、また電話したら？」をご覧ください。", link: { label: "1時間を過ぎて、また電話したら？", href: `${price}#session-case-03` } },
      { question: "別の人が同じQRコードをスキャンした場合はどうなりますか？", answer: "発見者が異なる場合は、別のセッションになります。同じQRコードでも、それぞれ個別のセッションとして扱われます。詳しくは料金ページの「別の人から電話があったら？」をご覧ください。", link: { label: "別の人から電話があったら？", href: `${price}#session-case-02` } },
    ],
  },
  {
    title: "料金・お支払いについて",
    items: [
      { question: "「つながるQR」のサービス利用料はいくらですか？", answer: "通話が成立した1セッションにつき880円（税込）です。登録料・月額基本料はかかりません。ただし、通話時間が5秒未満の場合、サービス利用料は発生しません。", link: { label: "料金のご案内", href: `${price}#pricing-title` } },
      { question: "サービス利用料は誰が支払いますか？", answer: "QRコードの登録者が負担します。発見者に「つながるQR」のサービス利用料はかかりません。" },
      { question: "QRコードをスキャンしただけで料金はかかりますか？", answer: "いいえ。QRコードをスキャンしただけではサービス利用料は発生しません。" },
      { question: "電話に出なかった場合、料金はかかりますか？", answer: "いいえ。電話がつながらなかった場合、サービス利用料は発生しません。留守番電話につながった場合は通話成立として扱われますが、通話時間が5秒未満の場合、サービス利用料は発生しません。" },
      { question: "留守番電話につながった場合も料金はかかりますか？", answer: "はい。留守番電話につながった場合は通話が成立したものとして扱われ、1セッション880円（税込）のサービス利用料が発生します。ただし、通話時間が5秒未満の場合、サービス利用料は発生しません。" },
      { question: "同じ相手と何度も通話した場合、その都度880円かかりますか？", answer: "いいえ。同じ相手との1時間以内の再通話や折り返しには、追加のサービス利用料はかかりません。詳しくは料金ページのCASE 01をご覧ください。", link: { label: "CASE 01", href: `${price}#session-case-01` } },
      { question: "違う人から電話がかかってきた場合も、880円かかりますか？", answer: "はい。発見者が異なる場合は別のセッションになります。それぞれ課金対象の通話が成立すると、1セッションにつき880円（税込）が発生します。詳しくは料金ページのCASE 02をご覧ください。", link: { label: "CASE 02", href: `${price}#session-case-02` } },
      { question: "1時間を過ぎて、同じ相手と再び通話した場合は料金がかかりますか？", answer: "はい。QRコードを再スキャンし、新しいセッションで課金対象の通話が成立した場合は、改めて880円（税込）が発生します。詳しくは料金ページのCASE 03をご覧ください。", link: { label: "CASE 03", href: `${price}#session-case-03` } },
      { question: "通常の電話料金もかかりますか？", answer: "はい。「つながるQR」のサービス利用料とは別に、通常の電話料金がかかる場合があります。電話をかけた方が、ご自身の通信会社・料金プランに応じた通話料を負担します。", link: { label: "通常の電話料金について", href: `${price}#call-charges-title` } },
      { question: "サービス利用料はどのように支払いますか？", answer: "サービス利用料が発生した場合、登録者にSMSとメールでお支払い案内をお送りします。案内に記載された決済ページから、クレジットカードでお支払いください。", link: { label: "お支払いについて", href: `${price}#payment-title` } },
      { question: "支払い期限はいつですか？", answer: "サービス利用料が発生した通話日の2日後、23時59分（日本時間）までです。", link: { label: "お支払いについて", href: `${price}#payment-title` } },
    ],
  },
  {
    title: "プライバシー・安全性について",
    items: [
      { question: "お互いの電話番号は相手に知られませんか？", answer: "はい。「つながるQR」ではプライバシー電話番号を使用するため、お互いの本来の電話番号を相手に表示せずに通話できます。", link: { label: "プライバシー電話番号について", href: `${service}#privacy-call` } },
      { question: "プライバシー電話番号とは何ですか？", answer: "お互いの本来の電話番号を知らせずに通話するための番号です。セッション開始から1時間が経過すると、その番号は利用できなくなります。詳しくはサービスページの「プライバシー電話番号について」をご覧ください。", link: { label: "プライバシー電話番号について", href: `${service}#privacy-call` } },
      { question: "QRコードをスキャンすると、登録者の氏名や住所が知られることはありますか？", answer: "いいえ。QRコードをスキャンしても、登録者の氏名や住所が相手に知られることはありません。" },
    ],
  },
  {
    title: "法人・自治体でのご利用について",
    items: [
      { question: "法人や自治体でも利用できますか？", answer: "はい。企業や自治体、各種施設での導入についてもご相談いただけます。", link: { label: "お問い合わせ", href: contact } },
      { question: "ホテルや施設で実証実験を行うことはできますか？", answer: "はい。実証実験についても積極的にご相談を承っております。導入目的や利用シーンに合わせて、実施方法をご相談いただけます。", link: { label: "お問い合わせ", href: contact } },
      { question: "複数のQRコードを導入することはできますか？", answer: "はい。複数のQRコードを導入いただけます。導入規模や運用方法については、お問い合わせください。", link: { label: "お問い合わせ", href: contact } },
    ],
  },
];
