import Link from "next/link";
import GuidePage, { GuideSection } from "@/components/GuidePage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("belongingsGuide");

const methods = [
  ["位置確認タグ", "スマートフォンなどで持ち物の位置を確認", "対応端末、通信・電池の条件、位置を確認できる環境を確認"],
  ["拾得後の通知サービス", "対応施設などで拾得物が登録された後、持ち主へ通知", "対象施設、通知が届く条件、受け取り手順を確認"],
  ["つながるQR", "QRコードを読み取った発見者から登録先へ、番号非公開で通話", "位置追跡は行わず、発見者の読み取り・発信と登録先の応答が必要"],
];

export default function LostItemPreparationGuide() {
  return (
    <GuidePage
      page="belongingsGuide"
      title="物をよくなくす方の紛失対策。位置確認と、発見後の連絡。"
      introduction="鍵や財布をよくなくす場合は、なくしにくくする、なくした場所を探す、見つけた方から連絡を受ける、という段階に分けて備えを考えられます。困る場面と、端末・費用・個人情報の扱いを確かめて選びましょう。"
      relatedHref="/use-cases/belongings/"
      relatedLabel="鍵・財布の落とし物対策に、つながるQR"
      sources={[
        { label: "政府広報オンライン：紛失防止タグの仕組み", href: "https://www.gov-online.go.jp/article/202603/entry-11166.html" },
      ]}
    >
      <GuideSection id="situations" title="家の中で見つからない場合と、外で紛失する場合">
        <p>「家の中にあるはずの鍵が見つからない」と「外出先に財布を置き忘れた」では、役立つ備えが違います。家の中で探す場面なら、定位置を決めたり、音を鳴らせる機器を検討したりする方法があります。外で紛失する場面なら、位置の確認に加えて、拾った方が連絡できる手段も検討できます。</p>
        <p>事前に取り付けたタグや連絡先は、なくした後の備えになります。すでになくした、タグの付いていない持ち物を後から追跡することはできません。</p>
      </GuideSection>
      <GuideSection id="habits" title="置き忘れへの備えは、毎日の置き場所から">
        <p>鍵は玄関近くの決まった場所、財布はバッグの同じポケットなど、戻す場所を決めると、確認する場所を絞れます。外出前や移動時に、鍵・財布・スマートフォンなどを同じ順序で確認する習慣も考えられます。</p>
        <p>タグを選ぶ場合も、付けたまま使える大きさ・形状かを確認しましょう。対応端末や電池交換の方法は製品ごとに異なります。</p>
      </GuideSection>
      <GuideSection id="location-tags" title="位置確認タグは、持ち物の場所を調べるための備え">
        <p>位置確認タグは、鍵や財布などに取り付け、スマートフォンなどでその位置を調べるための機器です。通信の仕組みや、位置を確認できる範囲・条件は機器によって異なります。</p>
        <p>対応するスマートフォンや設定、使う環境によって、利用できる機能は変わります。Android用の位置確認タグを探している場合も、対応端末とネットワークを確認することが必要です。</p>
        <p>位置確認に加えて、持ち主への連絡に関する機能が用意されている機器もあります。どこにあるかを調べる方法と、見つかった後に連絡を受ける方法の両方を確かめましょう。</p>
      </GuideSection>
      <GuideSection id="compare" title="見つかった後は、どのように連絡を受けるか">
        <p>拾得後の通知サービスは、対応施設などで落とし物が登録された後、持ち主に知らせる仕組みです。通知方法や対象施設、利用条件はサービスによって異なります。</p>
        <p>つながるQRは、拾った方が持ち物のQRコードを読み取り、登録先へ直接電話する仕組みです。持ち主と発見者は、お互いの本来の電話番号を公開せず通話できます。</p>
        <div className="overflow-x-auto overscroll-x-contain focus-visible:outline focus-visible:outline-2 focus-visible:outline-moss" role="region" aria-label="紛失対策サービスの役割の比較表" tabIndex={0}>
          <table className="w-full min-w-[700px] border-collapse text-left text-sm leading-7">
            <caption className="sr-only">位置確認、拾得後の通知、QRによる連絡の役割と確認点</caption>
            <thead><tr className="border-y border-ink/20"><th scope="col" className="p-4 font-medium">方法</th><th scope="col" className="p-4 font-medium">主な役割</th><th scope="col" className="p-4 font-medium">連絡の仕組み・確認点</th></tr></thead>
            <tbody>{methods.map(([name, role, check]) => <tr key={name} className="border-b border-ink/10"><th scope="row" className="p-4 font-medium">{name}</th><td className="p-4">{role}</td><td className="p-4">{check}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="text-xs text-ink/60">一般的な機能の役割を整理したものです。個別の機器・サービスによって、利用条件や対応機能は異なります。</p>
      </GuideSection>
      <GuideSection id="privacy" title="電話番号をタグに書きたくない場合は、表示の仕組みを確認">
        <p>ネームタグに電話番号を直接書けば、見つけた方が連絡先を確認できます。一方で、誰から見えるかが気になる方もいるでしょう。番号を直接記載しない方法では、発見者がどのような操作をし、何の情報が表示されるかを確認してください。</p>
        <p>つながるQRは、プライバシー電話番号を経由する音声通話で、発見者と登録先をつなぎます。専用アプリは不要です。発見者がQRコードを見つけて読み取り、発信できることが必要で、返還を保証するものではありません。</p>
        <Link href="/use-cases/belongings/" className="link-underline text-moss">番号を公開しない落とし物・忘れ物対策を見る →</Link>
      </GuideSection>
    </GuidePage>
  );
}
