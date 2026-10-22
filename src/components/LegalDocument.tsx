import PageHeader from "@/components/PageHeader";

type Props = {
  englishTitle: string;
  paragraphs: readonly string[];
};

// 添付DOCXから抽出した段落を原文・順序のまま表示する。条番号も本文に含めて保持する。
export default function LegalDocument({ englishTitle, paragraphs }: Props) {
  return (
    <>
      <PageHeader eyebrow="— Legal" en={englishTitle} jp={paragraphs[0]} />
      <article aria-label={paragraphs[0]} className="container-narrow py-16 md:py-24">
        {paragraphs.slice(1).map((paragraph, index) => (
          /^第\d+条（/.test(paragraph) ? (
            <h2 key={index} className="mt-10 border-t border-ink/15 pt-8 font-serif text-xl font-light leading-relaxed text-ink md:mt-14 md:text-2xl">
              {paragraph}
            </h2>
          ) : (
            <p key={index} className="body-jp mt-4 whitespace-pre-wrap break-words text-sm text-ink/80 md:text-base">
              {paragraph}
            </p>
          )
        ))}
      </article>
    </>
  );
}
