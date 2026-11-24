import Reveal from "@/components/Reveal";
import Link from "next/link";

export default function HomeSolution() {
  return <section id="home-solution" className="bg-moss/5 py-12 md:py-24" aria-labelledby="home-solution-heading">
    <div className="container-narrow">
      <Reveal>
        <p className="eyebrow">SOLUTION</p>
        <h2 id="home-solution-heading" className="mt-5 font-serif text-[clamp(22px,2.5vw,30px)] font-light leading-[1.6] text-ink/70 md:mt-6">その「もしも」に、<span className="inline-block">つながるQR。</span></h2>
        <p className="mt-7 font-serif text-[clamp(30px,4.4vw,54px)] font-light leading-[1.5] tracking-tight text-ink"><span className="block">電話番号を教えずに、</span><span className="block text-moss">直接話せる。</span></p>
        <p className="body-jp mt-5 max-w-2xl text-sm text-ink/70 md:text-base">知らない人に電話番号を教える必要も、メッセージをやり取りする必要もありません。</p>
        <p className="mt-8 text-lg font-medium leading-8 text-ink md:text-xl">QRコードをスキャンして、<br className="md:hidden" /><span className="text-moss">「電話をかける」</span>をタップするだけ。</p>
        <p className="body-jp mt-2 text-sm text-ink/70 md:text-base">お互いの電話番号を公開せず、その場で声をつなぎます。</p>
        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm leading-7 text-ink/70" aria-label="操作の特徴">
          <li>専用アプリ不要</li>
          <li>発見者の番号入力不要</li>
          <li>番号非公開</li>
        </ul>
        <div className="mt-8 grid gap-4 border-t border-moss/25 pt-6 md:mt-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-8">
          <h3 className="font-serif font-light leading-relaxed">
            <span className="block font-sans text-sm text-ink/60">特許技術を活用した、</span>
            <span className="mt-1 block text-2xl text-ink md:text-[28px]">独自の通話接続方式。</span>
          </h3>
          <div>
            <p className="body-jp text-sm text-ink/70">プライバシー電話番号は、お互いの電話番号を相手に公開せずに、通話をつなぐための番号です。</p>
            <Link href="/service/#privacy-call" className="link-underline mt-3 inline-flex min-h-11 items-center py-2 text-sm leading-7 text-moss">電話番号を公開しない仕組みを見る</Link>
          </div>
        </div>
        <p className="body-jp mt-6 text-[13px] leading-7 text-ink/60">GPSによる位置追跡や、紛失そのものを防ぐサービスではありません。見つけてくださった方からの連絡を支えます。</p>
      </Reveal>
    </div>
  </section>;
}
