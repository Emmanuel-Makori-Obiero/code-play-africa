import { useEffect, useState } from "react";
import { TIERS } from "@/lib/learner";

export function IqReveal({
  iq,
  scorePct,
  tier,
  moduleTitle,
  onClose,
}: {
  iq: number;
  scorePct: number;
  tier: { name: string; emoji: string };
  moduleTitle: string;
  onClose: () => void;
}) {
  const [shown, setShown] = useState(0);
  // animate counter
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 1200;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      setShown(Math.round(eased * iq));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [iq]);

  const band =
    iq >= 145 ? "Genius level" :
    iq >= 130 ? "Highly gifted" :
    iq >= 115 ? "Above average" :
    iq >= 100 ? "Sharp mind" : "Rising star";

  // motivational only — make it visually obvious this is for fun
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-bounce-in">
      <div className="glass border-grad rounded-2xl max-w-md w-full p-6 text-center shadow-neon relative overflow-hidden">
        <div className="absolute -inset-1 bg-neon opacity-20 blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="text-xs uppercase tracking-[0.3em] text-neon">Cognitive Boost Detected</div>
          <h2 className="font-bold text-2xl mt-2">{moduleTitle} cleared</h2>
          <div className="my-6">
            <div className="text-sm text-muted-foreground">Estimated coding-IQ</div>
            <div className="text-7xl font-extrabold text-glow tabular-nums leading-none mt-2">
              {shown}
            </div>
            <div className="text-base mt-2 font-semibold">{band}</div>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Quiz score</div>
              <div className="font-bold text-lg">{scorePct}%</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <div className="text-muted-foreground">Tier</div>
              <div className="font-bold text-lg">
                {tier.emoji} {tier.name}
              </div>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-4 italic">
            For fun & motivation — this is a gamified score, not a real IQ test.
          </p>
          <button
            onClick={onClose}
            className="mt-5 w-full px-4 py-3 rounded-xl bg-neon text-primary-foreground font-bold pop"
          >
            Keep going →
          </button>
        </div>
      </div>
    </div>
  );
}

export function tierFromName(name: string) {
  return TIERS.find((t) => t.name === name) || TIERS[0];
}
