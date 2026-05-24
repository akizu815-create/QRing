export default function HeroVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-ivory via-cream to-sand/60" />

      {/* Sumi-e brush wash */}
      <svg
        className="absolute -right-20 top-1/4 w-[80%] h-[70%] opacity-30 animate-fade-in"
        viewBox="0 0 800 600"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="ink" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#3F4F36" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#5B6E4F" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#5B6E4F" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D6B97A" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#B8954B" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M 100 400 Q 250 200 450 300 T 800 250"
          stroke="url(#ink)"
          strokeWidth="120"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 200 500 Q 400 350 600 420 T 900 380"
          stroke="url(#gold)"
          strokeWidth="60"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
      </svg>

      {/* QR motif card */}
      <div className="absolute right-[8%] top-1/2 -translate-y-1/2 hidden md:block animate-fade-up">
        <div className="relative">
          <div className="absolute -inset-8 bg-gradient-to-br from-white/40 to-transparent blur-2xl" />
          <div className="relative w-[260px] lg:w-[320px] aspect-[3/4] bg-white shadow-[0_30px_80px_-20px_rgba(31,26,20,0.25)] p-6 rotate-[3deg]">
            <div className="h-full w-full border border-ink/10 flex flex-col items-center justify-between p-4">
              <span className="font-serif text-xs tracking-[0.3em] text-ink/60">
                QRing
              </span>
              <svg viewBox="0 0 100 100" className="w-32 h-32 text-ink">
                <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                <rect x="5" y="5" width="20" height="20" fill="white" />
                <rect x="10" y="10" width="10" height="10" fill="currentColor" />
                <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                <rect x="75" y="5" width="20" height="20" fill="white" />
                <rect x="80" y="10" width="10" height="10" fill="currentColor" />
                <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                <rect x="5" y="75" width="20" height="20" fill="white" />
                <rect x="10" y="80" width="10" height="10" fill="currentColor" />
                <rect x="40" y="0" width="6" height="6" fill="currentColor" />
                <rect x="50" y="0" width="6" height="6" fill="currentColor" />
                <rect x="60" y="6" width="6" height="6" fill="currentColor" />
                <rect x="40" y="14" width="6" height="6" fill="currentColor" />
                <rect x="54" y="14" width="6" height="6" fill="currentColor" />
                <rect x="40" y="40" width="6" height="6" fill="currentColor" />
                <rect x="48" y="40" width="14" height="6" fill="currentColor" />
                <rect x="66" y="40" width="6" height="6" fill="currentColor" />
                <rect x="74" y="40" width="6" height="6" fill="currentColor" />
                <rect x="86" y="40" width="6" height="6" fill="currentColor" />
                <rect x="40" y="48" width="6" height="14" fill="currentColor" />
                <rect x="54" y="48" width="6" height="6" fill="currentColor" />
                <rect x="66" y="48" width="6" height="14" fill="currentColor" />
                <rect x="80" y="48" width="6" height="6" fill="currentColor" />
                <rect x="40" y="66" width="14" height="6" fill="currentColor" />
                <rect x="60" y="66" width="6" height="6" fill="currentColor" />
                <rect x="74" y="66" width="6" height="14" fill="currentColor" />
                <rect x="86" y="66" width="6" height="6" fill="currentColor" />
                <rect x="40" y="80" width="6" height="6" fill="currentColor" />
                <rect x="50" y="80" width="6" height="6" fill="currentColor" />
                <rect x="60" y="86" width="14" height="6" fill="currentColor" />
                <rect x="80" y="86" width="14" height="6" fill="currentColor" />
              </svg>
              <div className="text-center">
                <p className="font-serif text-sm tracking-widest text-ink">
                  Tap to call
                </p>
                <p className="text-[10px] tracking-[0.25em] text-ink/40 mt-1">
                  no number shared
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle grain */}
      <div className="absolute inset-0 grain" />
    </div>
  );
}
