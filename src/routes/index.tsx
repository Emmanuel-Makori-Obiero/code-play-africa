import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MODULES } from "@/lib/curriculum";
import { ModuleView } from "@/components/ModuleView";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CodeSafari — Learn JavaScript with Games (for African Kids)" },
      {
        name: "description",
        content:
          "CodeSafari is a fun, story-based JavaScript learning adventure for Kenyan and African children. Short modules, mini-games, live code, and friendly exercises.",
      },
      { property: "og:title", content: "CodeSafari — Learn JavaScript with Games" },
      {
        property: "og:description",
        content: "Fun JavaScript adventure for African kids. Stories, games and live code.",
      },
    ],
  }),
  component: Home,
});

type Progress = Record<string, { lesson: boolean; game: boolean; exercise: boolean }>;

const empty: Progress = Object.fromEntries(
  MODULES.map((m) => [m.id, { lesson: false, game: false, exercise: false }]),
);

function Home() {
  const [active, setActive] = useState<string | null>(null);
  const [progress, setProgress] = useState<Progress>(empty);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("codesafari-progress");
      if (raw) setProgress({ ...empty, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("codesafari-progress", JSON.stringify(progress));
  }, [progress]);

  const mod = MODULES.find((m) => m.id === active) ?? null;

  if (mod) {
    const d = progress[mod.id];
    const stage = !d.lesson ? "lesson" : !d.game ? "game" : "exercise";
    return (
      <ModuleView
        module={mod}
        done={d}
        onBack={() => setActive(null)}
        onComplete={() =>
          setProgress((p) => ({ ...p, [mod.id]: { ...p[mod.id], [stage]: true } }))
        }
      />
    );
  }

  const totalDone = Object.values(progress).reduce(
    (n, m) => n + (m.lesson ? 1 : 0) + (m.game ? 1 : 0) + (m.exercise ? 1 : 0),
    0,
  );
  const totalSteps = MODULES.length * 3;
  const pct = Math.round((totalDone / totalSteps) * 100);

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-8 space-y-8">
      <header className="rounded-3xl bg-sunset p-6 sm:p-10 shadow-fun text-primary-foreground relative overflow-hidden">
        <div className="absolute -top-6 -right-6 text-[140px] opacity-30 select-none">🦁</div>
        <h1 className="text-3xl sm:text-5xl font-extrabold drop-shadow-sm">
          CodeSafari 🦁
        </h1>
        <p className="mt-2 text-lg sm:text-xl opacity-95 max-w-2xl">
          Karibu! Learn JavaScript the fun way — stories from the savanna, mini-games and code
          you actually run. Built for clever kids in Kenya and across Africa.
        </p>
        <div className="mt-4 bg-background/30 backdrop-blur rounded-full h-3 overflow-hidden max-w-md">
          <div
            className="h-full bg-success transition-all"
            style={{ width: `${pct}%` }}
            aria-label={`${pct}% complete`}
          />
        </div>
        <p className="mt-1 text-sm opacity-90">{pct}% of the safari complete</p>
      </header>

      <section>
        <h2 className="text-2xl font-extrabold mb-3">Pick a module</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map((m, idx) => {
            const d = progress[m.id];
            const stars = (d.lesson ? 1 : 0) + (d.game ? 1 : 0) + (d.exercise ? 1 : 0);
            return (
              <button
                key={m.id}
                onClick={() => setActive(m.id)}
                className="text-left bg-card rounded-2xl p-5 shadow-card pop border-2 border-border"
              >
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{m.emoji}</span>
                  <span className="text-sm font-bold opacity-70">#{idx + 1}</span>
                </div>
                <h3 className="font-extrabold mt-2">{m.title}</h3>
                <p className="text-sm text-muted-foreground">{m.tagline}</p>
                <div className="mt-3 text-lg">
                  {"⭐".repeat(stars)}
                  <span className="opacity-30">{"⭐".repeat(3 - stars)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="bg-card rounded-2xl p-5 shadow-card">
        <h2 className="text-xl font-extrabold">📥 Download the syllabus & source</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Teachers and parents can download a complete Word document explaining every lesson
          and every line of source code, plus a zip of the project.
        </p>
        <div className="flex gap-3 mt-3 flex-wrap">
          <a
            href="/downloads/CodeSafari-Syllabus.docx"
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold pop shadow-fun"
          >
            📄 Syllabus (.docx)
          </a>
          <a
            href="/downloads/CodeSafari-Source.zip"
            className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground font-bold pop"
          >
            🗂️ Source code (.zip)
          </a>
        </div>
      </section>

      <footer className="text-center text-sm text-muted-foreground py-6">
        Made with ❤️ for African coders. Asante sana!
      </footer>
    </main>
  );
}
