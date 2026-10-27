import Link from "next/link";
import GuidePage, { GuideSection } from "@/components/GuidePage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("elderlyGuide");

const methods = [
  ["自宅での様子を知りたい", "カメラ・生活反応を確認するセンサーなど", "設置場所、通信環境、通知や駆けつけの条件"],
  ["外出先の居場所を知りたい", "GPSなどの位置確認端末", "持ち歩きやすさ、充電、測位・通信の条件"],
  ["発見した方から家族へ連絡してほしい", "連絡先の名札・見守りQRシールなど", "発見者の操作、通知・通話の方法、個人情報の表示"],
];

export default function ElderlyMonitoringGuide() {
  return (
    <GuidePage
      page="elderlyGuide"
      title="高齢者の見守り方法の選び方。自宅の安否確認と、外出時の備え。"
      introduction="離れて暮らす親や、一人暮らしのご家族が心配。見守りを考えるときは、自宅での様子を知りたいのか、外出先の居場所を確認したいのか、発見した方から連絡してほしいのかを整理すると選びやすくなります。"
      relatedHref="/use-cases/elderly/"
      relatedLabel="高齢者の外出時の見守りに、つながるQR"
      sources={[
        { label: "鈴鹿市：高齢の親が道に迷う場合に利用できるサービス", href: "https://www.city.suzuka.lg.jp/faq/kenko/1008249/1008260.html" },
        { label: "倉敷市：高齢者の外出時の連絡支援", href: "https://www.city.kurashiki.okayama.jp/fukushi/elderly/1004100/1012661/1004131.html" },
      ]}
    >
      <GuideSection id="choose-purpose" title="どの場面に備えたいかを整理する">
        <p>高齢者の見守りサービスは、機器や連絡の仕組みによって、できることが異なります。「家の中」と「外出中」に分け、特に気になる場面を考えてみましょう。</p>
        <div className="overflow-x-auto overscroll-x-contain focus-visible:outline focus-visible:outline-2 focus-visible:outline-moss" role="region" aria-label="見守りの目的と方法の比較表" tabIndex={0}>
          <table className="w-full min-w-[640px] border-collapse text-left text-sm leading-7">
            <caption className="sr-only">見守りの目的、方法、導入前の確認点</caption>
            <thead><tr className="border-y border-ink/20"><th scope="col" className="p-4 font-medium">備えたいこと</th><th scope="col" className="p-4 font-medium">方法の例</th><th scope="col" className="p-4 font-medium">確認したいこと</th></tr></thead>
            <tbody>{methods.map(([purpose, method, check]) => <tr key={purpose} className="border-b border-ink/10"><th scope="row" className="p-4 font-medium">{purpose}</th><td className="p-4">{method}</td><td className="p-4">{check}</td></tr>)}</tbody>
          </table>
        </div>
      </GuideSection>
      <GuideSection id="at-home" title="自宅での安否確認には、生活の変化を知る方法を">
        <p>カメラは映像を確認する方法、センサーは動きなどの生活反応を確認する方法です。一定時間の反応がないときに通知するものや、通報・駆けつけに対応するものなど、機能はサービスによって異なります。</p>
        <p>カメラを置きたくない場合は、映像を使わない方法も検討できます。ご本人がどう感じるか、通知を受ける家族が対応できるか、Wi-Fiなどの通信環境が必要かを確認してください。</p>
      </GuideSection>
      <GuideSection id="outside" title="外出先の居場所を確認したい場合は、端末の使い方も確認">
        <p>GPSなどの位置確認端末は、外出中の居場所を把握するための選択肢です。位置の更新間隔や利用できる環境、電池の持ち、月額費用は、選ぶ機種やサービスで異なります。</p>
        <p>毎日の充電や持ち歩きが続けられるかも大切です。認知症のあるご家族の一人歩きや迷子に備える場合は、地域の見守りシールやGPSの費用支援など、自治体が案内する制度も確認してみましょう。利用条件は自治体ごとに異なります。</p>
      </GuideSection>
      <GuideSection id="contact-family" title="名前や連絡先を伝えにくいときは、発見後の連絡手段も">
        <p>外出先で道に迷ったとき、ご本人が連絡先を説明しにくい場合があります。名札や見守りQRシールなどは、見つけた方が家族や登録された窓口へ連絡するきっかけになります。</p>
        <p>つながるQRでは、身につけたQRコードを発見者がスマートフォンで読み取り、「電話をかける」をタップして登録先へ連絡します。発見者とご家族は、お互いの本来の電話番号を公開せずに、音声で場所や状況を伝え合えます。</p>
        <p>QRコードを身につける方ご本人のスマートフォン操作は前提としていません。現在地を追跡したり、異変を自動で検知したりする機能とは役割が異なります。</p>
        <Link href="/use-cases/elderly/" className="link-underline text-moss">見守りQRからご家族へ連絡する仕組みを見る →</Link>
      </GuideSection>
      <GuideSection id="before-start" title="費用・通信環境・使いやすさを確かめて選ぶ">
        <ul className="list-disc space-y-3 pl-5">
          <li>何を確認でき、いつ、誰に連絡が来るか。</li>
          <li>ご本人が無理なく身につけたり、使い続けたりできるか。</li>
          <li>初期費用、月額費用、利用したときの料金はいくらか。</li>
          <li>電池・充電・通信環境と、対応している地域はどうか。</li>
          <li>ご本人や家族の連絡先が、誰に、どのように表示されるか。</li>
        </ul>
        <p>ご自宅の見守りに、外出先で連絡を受ける手段を組み合わせることもできます。ご本人とご家族にとって必要な役割を確かめて、備えを選びましょう。</p>
      </GuideSection>
    </GuidePage>
  );
}
