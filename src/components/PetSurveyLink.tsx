"use client";

import type { ReactNode } from "react";

const SURVEY_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdvOXFd-VyGCZvC3b1kio4N3lzDuXI3qqTCFXtzEO2BJam5ZA/viewform";
type Placement = "home" | "pets" | "column";

export default function PetSurveyLink({ placement, children, className }: { placement: Placement; children: ReactNode; className?: string }) {
  function trackClick() {
    const { gtag } = window as Window & { gtag?: (command: "event", name: string, parameters: { source_page: string; placement: Placement }) => void };
    if (typeof gtag === "function") {
      gtag("event", "pet_survey_click", { source_page: window.location.pathname, placement });
    }
  }

  return <a href={SURVEY_URL} target="_blank" rel="noopener noreferrer" className={className} onClick={trackClick} data-pet-survey-link={placement}>
    {children}<span className="sr-only">（Googleフォーム・別タブで開きます）</span>
  </a>;
}
