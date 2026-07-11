import SectionTitle from '../../src/components/SectionTitle';

export function Default() {
  return <SectionTitle eyebrow="— Features" en="Three Promises." jp="QRingの、三つの約束。" />;
}

export function Centered() {
  return (
    <SectionTitle
      align="center"
      eyebrow="— Service"
      en="Where it works."
      jp="QRingが活躍する場面。"
    />
  );
}

export function Invert() {
  return (
    <div style={{ background: '#1F1A14', padding: 40 }}>
      <SectionTitle invert eyebrow="— Connect" en="Get in touch." jp="お問い合わせ" />
    </div>
  );
}

export function NoJapanese() {
  return <SectionTitle en="Recent." />;
}
