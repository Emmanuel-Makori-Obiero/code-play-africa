import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useLearner } from "@/lib/learner-context";
import { totalStars, tierFor, leaderboard } from "@/lib/learner";
import { NavBar } from "@/components/NavBar";
import { LearnerSwitcher } from "@/components/LearnerSwitcher";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Ranks · CodeSafari" },
      { name: "description", content: "See where you stand on the CodeSafari ranks." },
    ],
  }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const { learner, setActive } = useLearner();
  const nav = useNavigate();
  const [switcher, setSwitcher] = useState(false);

  if (!learner) {
    if (typeof window !== "undefined") nav({ to: "/" });
    return null;
  }

  const stars = totalStars(learner.progress);
  const rows = leaderboard(learner.name, stars);
  const you = rows.find((r) => r.you)!;

  return (
    <>
      <NavBar learnerName={learner.name} stars={stars} onSwitch={() => setSwitcher(true)} />
      <main className="max-w-3xl mx-auto p-4 sm:p-8 space-y-6">
        <header>
          <div className="text-xs uppercase tracking-[0.3em] text-neon">Hall of fame</div>
          <h1 className="text-3xl font-bold mt-1">CodeSafari ranks</h1>
          <p className="text-sm text-muted-foreground mt-1">
            You&apos;re ranked <span className="font-bold text-foreground">#{you.rank}</span> of{" "}
            {rows.length}. Keep climbing!
          </p>
        </header>

        <ol className="space-y-2">
          {rows.map((r) => {
            const t = tierFor(r.stars);
            const podium = r.rank === 1 ? "🥇" : r.rank === 2 ? "🥈" : r.rank === 3 ? "🥉" : null;
            return (
              <li
                key={`${r.name}-${r.rank}`}
                className={`flex items-center gap-3 p-3 rounded-2xl border ${
                  r.you
                    ? "glass border-grad ring-neon"
                    : "bg-card/40 border-border"
                }`}
              >
                <div className="w-10 text-center font-bold text-lg tabular-nums">
                  {podium ?? `#${r.rank}`}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate">
                    {r.name}
                    {r.you && (
                      <span className="ml-2 text-[10px] uppercase tracking-wider text-neon">
                        you
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t.emoji} {t.name}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold tabular-nums">⭐ {r.stars}</div>
                </div>
              </li>
            );
          })}
        </ol>

        <p className="text-[11px] text-muted-foreground italic text-center">
          Other names are demo competitors — the real fight is with yesterday&apos;s you.
        </p>
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
