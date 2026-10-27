import Link from "next/link";
import GuidePage, { GuideSection } from "@/components/GuidePage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("belongingsGuide");

const methods = [
  ["AirTag", "Bluetoothと「探す」ネットワークなどで、持ち物の位置を確認", "紛失時に連絡方法を表示できる場合もある。対応端末・設定を確認"],
  ["find return", "警察署・対応施設などに届いた拾得物の登録・検知後に通知", "保管場所や引き取り方法をメールで知らせる。対象施設・運用条件を確認"],
  ["つながるQR", "QRコードを読み取った発見者から登録先へ、番号非公開で通話", "位置追跡は行わず、発見者の読み取り・発信と登録先の応答が必要"],
];

export default function LostItemPreparationGuide() {
  return (
    <GuidePage
      page="belongingsGuide"
      title="物をよくなくす方の紛失対策。AirTagとQRタグは、どう違う？"
      introduction="鍵や財布をよくなくす場合は、なくしにくくする、なくした場所を探す、見つけた方から連絡を受ける、という段階に分けて備えを考えられます。困る場面と、端末・費用・個人情報の扱いを確かめて選びましょう。"
      relatedHref="/use-cases/belongings/"
      relatedLabel="鍵・財布の落とし物対策に、つながるQR"
      sources={[
        { label: "Apple：AirTagの仕組み", href: "https://www.apple.com/jp/airtag/" },
        { label: "Apple：見つかったAirTagで持ち主への連絡方法を確認する", href: "https://support.apple.com/ja-jp/119874" },
        { label: "find：find returnの仕組みと利用条件", href: "https://www.finds.co.jp/service/find-return" },
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
      <GuideSection id="airtag" title="AirTagなどのタグは、持ち物の位置を確認する方法">
        <p>AirTagは、Bluetooth信号を近くの「探す」ネットワーク上のデバイスが検知し、その位置情報を持ち主が確認できる仕組みです。GPS搭載端末とは仕組みが異なります。</p>
        <p>対応するスマートフォンや設定、使う環境によって、利用できる機能は変わります。Android用の位置確認タグを探している場合も、対応端末とネットワークを確認することが必要です。</p>
        <p>AirTagにも、紛失物として指定した際に持ち主への連絡方法を表示できる場合があります。位置確認の有無だけでなく、発見後にどのように連絡してもらえるかも確かめましょう。</p>
      </GuideSection>
      <GuideSection id="compare" title="find returnとQRタグは、発見後の連絡方法も比較">
        <p>find returnは、落とし物が警察署や対応施設などに届き、登録・検知された後に、保管場所や引き取り方法をメールで知らせるサービスです。施設向けの「落とし物クラウドfind」とは、対象や利用場面を分けて確認しましょう。</p>
        <p>つながるQRは、拾った方が持ち物のQRコードを読み取り、登録先へ直接電話する仕組みです。持ち主と発見者は、お互いの本来の電話番号を公開せず通話できます。</p>
        <div className="overflow-x-auto overscroll-x-contain focus-visible:outline focus-visible:outline-2 focus-visible:outline-moss" role="region" aria-label="紛失対策サービスの役割の比較表" tabIndex={0}>
          <table className="w-full min-w-[700px] border-collapse text-left text-sm leading-7">
            <caption className="sr-only">AirTag、find return、つながるQRの役割と確認点</caption>
            <thead><tr className="border-y border-ink/20"><th scope="col" className="p-4 font-medium">方法</th><th scope="col" className="p-4 font-medium">主な役割</th><th scope="col" className="p-4 font-medium">連絡の仕組み・確認点</th></tr></thead>
            <tbody>{methods.map(([name, role, check]) => <tr key={name} className="border-b border-ink/10"><th scope="row" className="p-4 font-medium">{name}</th><td className="p-4">{role}</td><td className="p-4">{check}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="text-xs text-ink/60">各サービスの公式情報を基に、2026年10月27日時点で整理しています。機能・対応条件は各公式サイトをご確認ください。</p>
      </GuideSection>
      <GuideSection id="privacy" title="電話番号をタグに書きたくない場合は、表示の仕組みを確認">
        <p>ネームタグに電話番号を直接書けば、見つけた方が連絡先を確認できます。一方で、誰から見えるかが気になる方もいるでしょう。番号を直接記載しない方法では、発見者がどのような操作をし、何の情報が表示されるかを確認してください。</p>
        <p>つながるQRは、プライバシー電話番号を経由する音声通話で、発見者と登録先をつなぎます。専用アプリは不要です。発見者がQRコードを見つけて読み取り、発信できることが必要で、返還を保証するものではありません。</p>
        <Link href="/use-cases/belongings/" className="link-underline text-moss">番号を公開しない落とし物・忘れ物対策を見る →</Link>
      </GuideSection>
    </GuidePage>
  );
}
