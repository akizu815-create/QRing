import { CONSUMER_SERVICE } from "@/config/consumerService";

export type UseCaseQuestion = {
  question: string;
  answer: string;
  link?: { href: string; label: string };
};

export const elderlyQuestions: readonly UseCaseQuestion[] = [
  {
    question: "高齢の家族がスマートフォンを操作できなくても使えますか？",
    answer: "外出する方がQRコードを身につけ、発見した方のスマートフォンから登録先へ連絡する仕組みです。QRコードを身につける方ご本人のスマートフォン操作を前提としていません。",
  },
  {
    question: "自宅での安否確認や、転倒の自動検知もできますか？",
    answer: "つながるQRは、QRコードを見つけた方から登録先へ電話するサービスです。自宅の様子を監視したり、転倒を自動で検知したりする機能はありません。",
  },
  {
    question: "GPSのように、現在地を追跡できますか？",
    answer: "つながるQRには現在地を追跡する機能はありません。QRコードを読み取った方とご家族が、通話で場所や状況を伝え合うための連絡手段です。",
  },
  {
    question: "家族の電話番号は発見者に分かりますか？",
    answer: "プライバシー電話番号を経由して通話するため、ご家族と発見者は、お互いの本来の電話番号を公開せずに連絡できます。",
  },
];

export const belongingsQuestions: readonly UseCaseQuestion[] = [
  {
    question: "なくした持ち物の位置を確認できますか？",
    answer: "つながるQRに位置を追跡する機能はありません。事前に付けたQRコードを見つけた方が読み取り、持ち主へ連絡する仕組みです。位置を確認する方法と、発見後に連絡を受ける方法は、役割を確かめて選べます。",
  },
  {
    question: "拾った方も専用アプリが必要ですか？",
    answer: "専用アプリは不要です。スマートフォンでQRコードを読み取り、画面の案内から電話をかけます。通話機能は日本国内でのみご利用いただけます。",
  },
  {
    question: "QRコードを付ければ、必ず持ち物が戻りますか？",
    answer: "返還を保証するものではありません。発見者がQRコードを見つけて読み取り、登録先へ連絡できる状態であることが必要です。",
  },
  {
    question: "すでになくした持ち物を探せますか？",
    answer: "QRコードを事前に取り付けて備えるサービスです。取り付けていない持ち物を、後から追跡したり捜索したりすることはできません。",
  },
];

export const commonQuestions: readonly UseCaseQuestion[] = [
  {
    question: "費用はいつ発生しますか？",
    answer: "ベーシックプランでは、通話成立時に登録者へ1セッション880円（税込）のサービス利用料が発生します。通話時間が5秒未満の場合は、サービス利用料は発生しません。発信した方には通常の電話料金が別途かかります。",
    link: { href: "/price/", label: "料金と利用条件を確認する" },
  },
  {
    question: CONSUMER_SERVICE.faq.question,
    answer: CONSUMER_SERVICE.faq.answer,
    link: CONSUMER_SERVICE.faq.link,
  },
];
