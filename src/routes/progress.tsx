import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MODULES } from "@/lib/curriculum";
import { useLearner } from "@/lib/learner-context";
import { moduleStars, totalStars, maxStars, tierFor, TIERS } from "@/lib/learner";
import { NavBar } from "@/components/NavBar";
import { LearnerSwitcher } from "@/components/LearnerSwitcher";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Your progress · CodeSafari" },
      { name: "description", content: "Track your modules, IQ history and tier on CodeSafari." },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const { learner, setActive } = useLearner();
  const nav = useNavigate();
  const [switcher, setSwitcher] = useState(false);

  if (!learner) {
    if (typeof window !== "undefined") nav({ to: "/" });
    return null;
  }

  const stars = totalStars(learner.progress);
  const max = maxStars();
  const tier = tierFor(stars);
  const tierIdx = TIERS.findIndex((t) => t.name === tier.name);
  const next = TIERS[tierIdx + 1];
  const toNext = next ? next.min - stars : 0;
  const avgIq = learner.iqHistory.length
    ? Math.round(learner.iqHistory.reduce((a, e) => a + e.iq, 0) / learner.iqHistory.length)
    : 0;
  const peakIq = learner.iqHistory.reduce((a, e) => Math.max(a, e.iq), 0);

  return (
    <>
      <NavBar learnerName={learner.name} stars={stars} onSwitch={() => setSwitcher(true)} />
      <main className="max-w-5xl mx-auto p-4 sm:p-8 space-y-6">
        <header>
          <div className="text-xs uppercase tracking-[0.3em] text-neon">Learner dossier</div>
          <h1 className="text-3xl font-bold mt-1">{learner.name}'s progress</h1>
        </header>

        <div className="grid sm:grid-cols-4 gap-4">
          <Stat label="Tier" value={`${tier.emoji} ${tier.name}`} sub={next ? `${toNext} ⭐ to ${next.name}` : "Maxed out"} />
          <Stat label="Stars" value={`${stars} / ${max}`} sub={`${Math.round((stars / max) * 100)}% complete`} />
          <Stat label="Avg IQ" value={String(avgIq || "—")} sub={`Peak ${peakIq || "—"}`} />
          <Stat label="Quizzes passed" value={String(learner.iqHistory.length)} sub="Adaptive scoring" />
        </div>

        <section className="glass rounded-2xl p-5">
          <h2 className="font-bold text-lg mb-3">Modules</h2>
          <div className="space-y-2">
            {MODULES.map((m) => {
              const p = learner.progress[m.id];
              if (!p) return null;
              const s = moduleStars(p);
              return (
                <div key={m.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-card/60">
                  <div className="text-2xl w-8 text-center">{m.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{m.title}</div>
                    <div className="text-xs text-muted-foreground">{m.tagline}</div>
                  </div>
                  <div className="text-sm tabular-nums w-20 text-right">
                    {p.quizScorePct ? `${p.quizScorePct}%` : "—"}
                  </div>
                  <div className="text-sm w-16 text-right text-neon tabular-nums">
                    {p.iq ?? "—"}
                  </div>
                  <div className="w-24 text-right text-base">
                    {"⭐".repeat(s)}
                    <span className="opacity-30">{"⭐".repeat(4 - s)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {learner.iqHistory.length > 0 && (
          <section className="glass rounded-2xl p-5">
            <h2 className="font-bold text-lg mb-3">IQ history</h2>
            <IqChart history={learner.iqHistory} />
          </section>
        )}
      </main>
      {switcher && (
        <LearnerSwitcher
          current={learner.name}
          onPick={(n) => {
            setActive(n);
            setSwitcher(false);
          }}
          onClose={() => setSwitcher(false)}
        />
      )}
    </>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

function IqChart({ history }: { history: { iq: number; at: number; module: string }[] }) {
  const min = 90;
  const max = 170;
  const w = 600;
  const h = 140;
  const step = history.length > 1 ? w / (history.length - 1) : 0;
  const points = history.map((e, i) => {
    const x = i * step;
    const y = h - ((e.iq - min) / (max - min)) * h;
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-36">
      <defs>
        <linearGradient id="iq" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.82 0.2 200)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="oklch(0.82 0.2 200)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        fill="url(#iq)"
        stroke="none"
        points={`0,${h} ${points.join(" ")} ${w},${h}`}
      />
      <polyline
        fill="none"
        stroke="oklch(0.82 0.2 200)"
        strokeWidth="2"
        points={points.join(" ")}
      />
      {history.map((e, i) => (
        <circle key={i} cx={i * step} cy={h - ((e.iq - min) / (max - min)) * h} r="3" fill="oklch(0.82 0.2 200)" />
      ))}
    </svg>
  );
}
