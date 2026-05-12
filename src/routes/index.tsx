import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MODULES } from "@/lib/curriculum";
import { useLearner } from "@/lib/learner-context";
import {
  emptyProgress,
  moduleStars,
  totalStars,
  maxStars,
  tierFor,
  listLearners,
  saveLearners,
} from "@/lib/learner";
import { NavBar } from "@/components/NavBar";
import { LearnerSwitcher } from "@/components/LearnerSwitcher";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CodeSafari — Learn JavaScript with Games" },
      {
        name: "description",
        content:
          "An interactive JavaScript adventure for African learners. 16 modules, mini-games, exercises, quizzes, leaderboard and a printable certificate.",
      },
      { property: "og:title", content: "CodeSafari — Learn JavaScript with Games" },
      {
        property: "og:description",
        content: "Stories, games, quizzes and live code — built for fast learners.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { learner, setActive } = useLearner();
  const [pickName, setPickName] = useState("");
  const [switcher, setSwitcher] = useState(false);
  const nav = useNavigate();

  // No learner yet → name gate
  if (!learner) {
    const submit = () => {
      const trimmed = pickName.trim().slice(0, 30);
      if (trimmed.length < 2) return;
      const list = listLearners();
      if (!list.includes(trimmed)) saveLearners([...list, trimmed]);
      setActive(trimmed);
    };
    const existing = listLearners();
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="glass border-grad rounded-3xl shadow-card p-7 sm:p-9 max-w-md w-full space-y-5">
          <div className="text-center">
            <div className="text-xs uppercase tracking-[0.4em] text-neon">CodeSafari Academy</div>
            <h1 className="text-3xl font-bold mt-2 text-glow">
              Welcome, future engineer
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Enter your name to start your JavaScript journey. Your progress, IQ
              history and rank are saved on this device.
            </p>
          </div>
          <input
            value={pickName}
            onChange={(e) => setPickName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="e.g. Amani"
            maxLength={30}
            className="w-full rounded-xl bg-input p-3 text-lg font-semibold border border-border focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={submit}
            disabled={pickName.trim().length < 2}
            className="w-full px-5 py-3 rounded-xl bg-neon text-primary-foreground font-bold pop disabled:opacity-50 shadow-neon"
          >
            Begin →
          </button>
          {existing.length > 0 && (
            <div className="text-center text-xs text-muted-foreground">
              Returning learner?{" "}
              <button
                onClick={() => setSwitcher(true)}
                className="underline hover:text-foreground"
              >
                Pick from saved profiles
              </button>
            </div>
          )}
        </div>
        {switcher && (
          <LearnerSwitcher
            current={null}
            onPick={(n) => {
              setActive(n);
              setSwitcher(false);
            }}
            onClose={() => setSwitcher(false)}
          />
        )}
      </main>
    );
  }

  const { progress } = learner;
  const stars = totalStars(progress);
  const max = maxStars();
  const pct = Math.round((stars / max) * 100);
  const tier = tierFor(stars);

  return (
    <>
      <NavBar learnerName={learner.name} stars={stars} onSwitch={() => setSwitcher(true)} />
      <main className="max-w-6xl mx-auto p-4 sm:p-8 space-y-8">
        <header className="relative rounded-3xl bg-hero p-6 sm:p-10 shadow-card border border-border overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-neon opacity-20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gold opacity-20 blur-3xl pointer-events-none" />
          <div className="relative grid sm:grid-cols-[1fr_auto] gap-4 items-end">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-neon">Mission Control</div>
              <h1 className="text-3xl sm:text-5xl font-bold mt-2">
                Habari, <span className="text-glow-warm">{learner.name}</span>
              </h1>
              <p className="mt-2 text-base sm:text-lg text-muted-foreground max-w-xl">
                16 modules · mini-games, live coding, quizzes, fake-IQ boosts,
                leaderboard and a printable certificate.
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2">
              <div className="glass rounded-2xl px-4 py-3 ring-neon">
                <div className="text-[10px] uppercase tracking-wider text-neon">Current tier</div>
                <div className="text-2xl font-bold mt-1">
                  {tier.emoji} {tier.name}
                </div>
              </div>
              <div className="glass rounded-2xl px-4 py-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Progress
                </div>
                <div className="text-2xl font-bold mt-1 tabular-nums">
                  {pct}% · ⭐ {stars}/{max}
                </div>
              </div>
            </div>
          </div>
          <div className="relative mt-5 h-2 rounded-full bg-background/40 overflow-hidden">
            <div
              className="h-full bg-neon transition-all"
              style={{ width: `${pct}%` }}
              aria-label={`${pct}% complete`}
            />
          </div>
        </header>

        <section>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-xl font-bold">Modules</h2>
            <span className="text-xs text-muted-foreground">
              Difficulty adapts as you level up
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODULES.map((m, idx) => {
              const p = progress[m.id] ?? emptyProgress()[m.id];
              const s = moduleStars(p);
              const locked = idx > 0 && totalStars(progress) < idx; // soft lock
              return (
                <button
                  key={m.id}
                  onClick={() => nav({ to: "/modules/$id", params: { id: m.id } })}
                  className="text-left glass rounded-2xl p-5 pop border-grad relative overflow-hidden group"
                >
                  <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary/20 blur-2xl group-hover:bg-primary/40 transition" />
                  <div className="relative flex items-center justify-between">
                    <span className="text-4xl">{m.emoji}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-card px-2 py-1 rounded-full border border-border">
                      {m.level}
                    </span>
                  </div>
                  <h3 className="font-bold mt-3 text-lg">{m.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{m.tagline}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-lg">
                      {"⭐".repeat(s)}
                      <span className="opacity-30">{"⭐".repeat(4 - s)}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {locked ? "🔒 soon" : `#${idx + 1}`}
                    </span>
                  </div>
                  {p.iq && (
                    <div className="mt-2 text-[11px] text-neon">
                      Last IQ: <span className="font-bold tabular-nums">{p.iq}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid sm:grid-cols-3 gap-4">
          <a
            href="/downloads/CodeSafari-Syllabus.docx"
            className="glass rounded-2xl p-5 pop block"
          >
            <div className="text-2xl">📄</div>
            <div className="font-bold mt-2">Syllabus (.docx)</div>
            <div className="text-xs text-muted-foreground">
              Full lesson plan with code walkthrough.
            </div>
          </a>
          <a
            href="/downloads/CodeSafari-Source.zip"
            className="glass rounded-2xl p-5 pop block"
          >
            <div className="text-2xl">🗂️</div>
            <div className="font-bold mt-2">Source (.zip)</div>
            <div className="text-xs text-muted-foreground">
              Whole project source for teachers & devs.
            </div>
          </a>
          <button
            onClick={() => nav({ to: "/certificate" })}
            className="glass rounded-2xl p-5 pop text-left"
          >
            <div className="text-2xl">🏅</div>
            <div className="font-bold mt-2">Your certificate</div>
            <div className="text-xs text-muted-foreground">
              View & print your achievement.
            </div>
          </button>
        </section>

        <footer className="text-center text-xs text-muted-foreground py-6">
          Made with ❤️ for African coders. Asante sana.
        </footer>
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
