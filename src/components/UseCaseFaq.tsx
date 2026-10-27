import Link from "next/link";
import type { UseCaseQuestion } from "@/content/useCaseFaqs";

export default function UseCaseFaq({
  id,
  title,
  questions,
}: {
  id: string;
  title: string;
  questions: readonly UseCaseQuestion[];
}) {
  return (
    <section className="bg-cream py-20 md:py-28" aria-labelledby={id}>
      <div className="container-narrow">
        <p className="text-[10px] font-medium tracking-[0.3em] text-ink/60">QUESTIONS</p>
        <h2 id={id} className="mt-6 font-serif text-[clamp(26px,3.5vw,44px)] font-light leading-[1.6]">{title}</h2>
        <div className="mt-10 border-t border-ink/15">
          {questions.map(({ question, answer, link }) => (
            <details key={question} className="group border-b border-ink/15">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-5 py-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-moss [&::-webkit-details-marker]:hidden">
                <h3 className="text-sm font-medium leading-7 md:text-base">{question}</h3>
                <span aria-hidden="true" className="shrink-0 text-xl text-moss group-open:rotate-45">+</span>
              </summary>
              <div className="body-jp space-y-4 pb-7 text-sm text-ink/70">
                <p>{answer}</p>
                {link && <Link href={link.href} className="link-underline text-moss">{link.label} →</Link>}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
