import PageHeader from '../../src/components/PageHeader';

export function About() {
  return <PageHeader eyebrow="— About" en="About QRing." jp="私たちについて" />;
}

export function Service() {
  return <PageHeader eyebrow="— Service" en="Tsunagaru QR." jp="サービスについて" />;
}

export function Shop() {
  return <PageHeader eyebrow="— Shop" en="The Collection." jp="プロダクトラインナップ" />;
}
