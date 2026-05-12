import { MODULES } from "@/lib/curriculum";
import type { LearnerData } from "@/lib/learner";
import { tierFor, totalStars, maxStars } from "@/lib/learner";

export function Certificate({ learner }: { learner: LearnerData }) {
  const stars = totalStars(learner.progress);
  const max = maxStars();
  const tier = tierFor(stars);
  const date = new Date().toLocaleDateString(undefined, {
    year: "numeric", month: "long", day: "numeric",
  });
  const completedModules = MODULES.filter((m) => {
    const p = learner.progress[m.id];
    return p && p.lesson && p.game && p.exercises.every(Boolean) && p.quiz;
  }).length;
  const avgIq = learner.iqHistory.length
    ? Math.round(learner.iqHistory.reduce((a, e) => a + e.iq, 0) / learner.iqHistory.length)
    : 0;

  return (
    <div
      id="certificate"
      className="relative mx-auto bg-gradient-to-br from-[oklch(0.22_0.05_270)] to-[oklch(0.18_0.06_310)] text-foreground rounded-3xl p-10 shadow-neon border-grad print:shadow-none"
      style={{ aspectRatio: "1.414 / 1", maxWidth: 900 }}
    >
      <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-30 bg-[radial-gradient(ellipse_at_top_left,oklch(0.82_0.2_200/.5),transparent_60%),radial-gradient(ellipse_at_bottom_right,oklch(0.7_0.27_330/.5),transparent_60%)]" />
      <div className="relative h-full flex flex-col">
        <div className="flex justify-between items-start">
          <div className="text-xs uppercase tracking-[0.4em] text-neon">CodeSafari Academy</div>
          <div className="text-xs text-muted-foreground">{date}</div>
        </div>
        <div className="text-center mt-6">
          <div className="text-5xl">🏅</div>
          <h1 className="font-bold text-4xl mt-2 text-glow">Certificate of Achievement</h1>
          <p className="text-muted-foreground mt-2">This is to certify that</p>
          <div className="text-5xl font-extrabold mt-3 text-glow-warm">{learner.name}</div>
          <p className="mt-3 max-w-2xl mx-auto">
            has successfully advanced through the CodeSafari JavaScript curriculum,
            mastering core concepts from variables to the DOM, completing exercises,
            mini-games and quizzes with skill and persistence.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-auto pt-6">
          <Stat label="Tier reached" value={`${tier.emoji} ${tier.name}`} />
          <Stat label="Stars earned" value={`${stars} / ${max}`} />
          <Stat label="Modules cleared" value={`${completedModules} / ${MODULES.length}`} />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Stat label="Average coding-IQ" value={String(avgIq || "—")} />
          <Stat label="Issued" value="CodeSafari · Nairobi" />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-3 text-center">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-bold text-lg mt-1">{value}</div>
    </div>
  );
}
