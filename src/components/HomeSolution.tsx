import Reveal from "@/components/Reveal";
import Link from "next/link";

export default function HomeSolution() {
  return <section id="home-solution" className="bg-moss/5 py-12 md:py-24" aria-labelledby="home-solution-heading">
    <div className="container-narrow">
      <Reveal>
        <p className="text-[11px] tracking-[0.3em] text-ink/60">SOLUTION</p>
        <h2 id="home-solution-heading" className="mt-5 font-serif text-[clamp(28px,3.5vw,48px)] font-light leading-[1.6] md:mt-6">その「もしも」に、<span className="inline-block text-moss">つながるQR。</span></h2>
        <p className="mt-7 font-serif text-[clamp(24px,2.6vw,34px)] font-light leading-relaxed text-ink">電話番号を教えずに、<span className="inline-block text-moss">直接話せる。</span></p>
        <p className="body-jp mt-4 text-sm text-ink/70 md:text-base">知らない人に電話番号を教える必要も、メッセージをやり取りする必要もありません。</p>
        <p className="body-jp mt-5 text-sm text-ink/80 md:text-base">QRコードをスキャンして、「電話をかける」をタップするだけ。お互いの電話番号を公開せず、その場で声をつなぎます。</p>
        <ul className="mt-5 flex flex-wrap gap-y-2 text-[13px] leading-7 text-moss md:text-sm" aria-label="操作の特徴">
          <li className="pr-4">専用アプリ不要</li>
          <li className="border-l border-moss/25 pl-4">発見者の番号入力不要</li>
        </ul>
        <div className="mt-7 border-t border-moss/20 pt-5">
          <p className="font-serif text-lg font-light leading-relaxed text-ink/85 md:text-xl">特許技術を活用した、<span className="inline-block">独自の通話接続方式。</span></p>
          <p className="body-jp mt-3 text-sm text-ink/70">このシンプルな操作を支えているのが、プライバシー電話番号を利用する仕組みです。</p>
          <Link href="/service/#privacy-call" className="link-underline mt-3 inline-flex min-h-11 items-center py-2 text-sm leading-7 text-moss">電話番号を公開しない仕組みを見る</Link>
        </div>
        <p className="body-jp mt-6 text-[13px] leading-7 text-ink/60">GPSによる位置追跡や、紛失そのものを防ぐサービスではありません。見つけてくださった方からの連絡を支えます。</p>
      </Reveal>
    </div>
  </section>;
}
