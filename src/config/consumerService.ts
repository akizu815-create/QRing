// 一般向けサービスの提供状況と導線を共通管理する。
// 正式リリース時は、この設定の案内文・FAQ回答・CTA文言とリンク先をまとめて更新する。
// 利用開始URLは、提供が始まった時点で確定したものを設定する。
const CONTACT_LINK = { label: "お問い合わせ", href: "https://axb.qring.jp/contact" } as const;

export const CONSUMER_SERVICE = {
  notice: "一般向けサービスは正式リリースに向けて準備中です。",
  heading: "つながるQRを、あなたの暮らしにも。",
  description: "現在、一般向けサービスの正式リリースに向けて準備を進めています。",
  availability: "一般向けサービス 準備中",
  announcement: "サービス開始のお知らせは、公式サイトのNEWSでご案内します。開始時のご連絡をご希望の方は、お問い合わせフォームからご連絡ください。",
  cta: {
    label: "開始のお知らせを希望する →",
    href: CONTACT_LINK.href,
  },
  faq: {
    question: "一般向けサービスはいつから利用できますか？",
    answer: "現在、正式リリースに向けて準備を進めています。開始時期は公式サイトのNEWSでご案内します。開始のお知らせをご希望の場合は、お問い合わせフォームからご連絡ください。",
    link: { label: "お問い合わせフォーム", href: CONTACT_LINK.href },
  },
} as const;
