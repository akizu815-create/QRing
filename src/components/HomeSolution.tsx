import Reveal from "@/components/Reveal";

export default function HomeSolution() {
  return <section id="home-solution" className="bg-moss/5 py-12 md:py-24" aria-labelledby="home-solution-heading">
    <div className="container-narrow">
      <Reveal>
        <p className="text-[11px] tracking-[0.3em] text-ink/60">SOLUTION</p>
        <h2 id="home-solution-heading" className="mt-5 font-serif text-[clamp(28px,3.5vw,48px)] font-light leading-[1.6] md:mt-6">その「もしも」に、<span className="inline-block text-moss">つながるQR。</span></h2>
        <p className="body-jp mt-7 text-base text-ink/80 md:text-lg">お互いの電話番号を公開せずに、<span className="inline-block">声で連絡できる仕組みです。</span></p>
        <p className="body-jp mt-5 text-sm text-ink/70 md:text-base">発見した方がQRコードをスキャンし、「電話をかける」をタップすると登録先へつながります。プライバシー電話番号を使うため、互いの電話番号は公開されません。専用アプリは不要です。</p>
        <p className="body-jp mt-6 text-xs text-ink/60 md:text-sm">GPSによる位置追跡や、紛失そのものを防ぐサービスではありません。見つけてくださった方からの連絡を支えます。</p>
      </Reveal>
    </div>
  </section>;
}
