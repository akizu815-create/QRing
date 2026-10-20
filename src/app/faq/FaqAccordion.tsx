"use client";

import { useState } from "react";
import { FAQ_CATEGORIES, type FaqItem } from "./faqData";

function Answer({ item }: { item: FaqItem }) {
  const { answer, link } = item;
  if (!link) return <p>{answer}</p>;

  const index = answer.indexOf(link.label);
  const anchor = <a href={link.href} className="text-moss underline decoration-moss/40 underline-offset-4 hover:decoration-moss focus-visible:outline-moss">{link.label}</a>;

  if (index >= 0) {
    return <p>{answer.slice(0, index)}{anchor}{answer.slice(index + link.label.length)}</p>;
  }
  return <><p>{answer}</p><p className="mt-3">{anchor}<span aria-hidden="true"> →</span></p></>;
}

function Chevron({ open }: { open: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className={`h-5 w-5 shrink-0 text-moss transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}><path d="m4 7 6 6 6-6" /></svg>;
}

export default function FaqAccordion() {
  const [openCategories, setOpenCategories] = useState<Record<number, boolean>>({});
  const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>({});

  return (
    <div className="border-t border-ink/15">
      {FAQ_CATEGORIES.map((category, categoryIndex) => {
        const categoryOpen = !!openCategories[categoryIndex];
        const categoryId = `faq-category-${categoryIndex + 1}`;
        return (
          <section key={category.title} className="border-b border-ink/15" aria-labelledby={`${categoryId}-heading`}>
            <h2 id={`${categoryId}-heading`}>
              <button type="button" aria-expanded={categoryOpen} aria-controls={`${categoryId}-panel`} onClick={() => setOpenCategories((current) => ({ ...current, [categoryIndex]: !current[categoryIndex] }))} className="flex min-h-20 w-full items-center gap-4 py-5 text-left font-serif text-xl leading-relaxed text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-moss md:min-h-24 md:text-2xl">
                <span className="font-sans text-sm font-medium tabular-nums tracking-widest text-moss">{String(categoryIndex + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1">{category.title}</span>
                <Chevron open={categoryOpen} />
              </button>
            </h2>
            <div id={`${categoryId}-panel`} hidden={!categoryOpen} className="pb-7 pl-0 md:pb-10 md:pl-10">
              {category.items.map((item, questionIndex) => {
                const key = `${categoryIndex}-${questionIndex}`;
                const questionOpen = !!openQuestions[key];
                const questionId = `faq-question-${categoryIndex + 1}-${questionIndex + 1}`;
                return (
                  <div key={item.question} className="border-t border-ink/10">
                    <h3>
                      <button type="button" aria-expanded={questionOpen} aria-controls={`${questionId}-answer`} onClick={() => setOpenQuestions((current) => ({ ...current, [key]: !current[key] }))} className="flex min-h-16 w-full items-center gap-4 py-4 text-left text-base leading-relaxed text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-moss md:text-lg">
                        <span className="min-w-0 flex-1">{item.question}</span>
                        <Chevron open={questionOpen} />
                      </button>
                    </h3>
                    <div id={`${questionId}-answer`} hidden={!questionOpen} className="body-jp pb-6 pr-8 text-sm leading-loose text-ink/75 md:text-base"><Answer item={item} /></div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
