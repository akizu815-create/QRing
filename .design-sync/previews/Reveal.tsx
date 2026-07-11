import Reveal from '../../src/components/Reveal';
import SectionTitle from '../../src/components/SectionTitle';

export function Default() {
  return (
    <Reveal>
      <SectionTitle eyebrow="— Features" en="Three Promises." jp="QRingの、三つの約束。" />
    </Reveal>
  );
}

export function Delayed() {
  return (
    <Reveal delay={120} as="p" className="body-jp max-w-md">
      電話番号を相手に教えることなく、QRコードを読み取るだけで音声通話。アプリ不要、特許取得済の安心の通信体験を、すべての人に。
    </Reveal>
  );
}
