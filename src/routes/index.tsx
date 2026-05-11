import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { MODULES } from "@/lib/curriculum";
import { ModuleView, type ModuleProgress } from "@/components/ModuleView";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CodeSafari — Learn JavaScript with Games (for African Kids)" },
      {
        name: "description",
        content:
          "CodeSafari is a fun, story-based JavaScript learning adventure for Kenyan and African children. 15 modules with games, exercises and quizzes.",
      },
      { property: "og:title", content: "CodeSafari — Learn JavaScript with Games" },
      {
        property: "og:description",
        content: "Fun JavaScript adventure for African kids. Stories, games, quizzes and live code.",
      },
    ],
  }),
  component: Home,
});

type Progress = Record<string, ModuleProgress>;

function emptyProgress(): Progress {
  return Object.fromEntries(
    MODULES.map((m) => [
      m.id,
      {
        lesson: false,
        game: false,
        exercises: m.exercises.map(() => false),
        quiz: false,
      },
    ]),
  );
}

function moduleStars(p: ModuleProgress): number {
  const exAll = p.exercises.length > 0 && p.exercises.every(Boolean);
  return (
    (p.lesson ? 1 : 0) + (p.game ? 1 : 0) + (exAll ? 1 : 0) + (p.quiz ? 1 : 0)
  );
}

function Home() {
  const [name, setName] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const [progress, setProgress] = useState<Progress>(emptyProgress);

  // load name on first paint
  useEffect(() => {
    try {
      const n = localStorage.getItem("codesafari-name");
      if (n) setName(n);
    } catch {
      /* ignore */
    }
  }, []);

  // load progress whenever the active learner changes
  useEffect(() => {
    if (!name) return;
    try {
      const raw = localStorage.getItem(`codesafari-progress:${name}`);
      const fresh = emptyProgress();
      if (raw) {
        const saved = JSON.parse(raw) as Progress;
        for (const id of Object.keys(fresh)) {
          if (saved[id]) {
            fresh[id] = {
              lesson: !!saved[id].lesson,
              game: !!saved[id].game,
              quiz: !!saved[id].quiz,
              exercises: fresh[id].exercises.map((_, i) => !!saved[id].exercises?.[i]),
            };
          }
        }
      }
      setProgress(fresh);
    } catch {
      setProgress(emptyProgress());
    }
  }, [name]);

  useEffect(() => {
    if (!name) return;
    localStorage.setItem(`codesafari-progress:${name}`, JSON.stringify(progress));
  }, [progress, name]);

  const totals = useMemo(() => {
    const maxPerModule = 4;
    const total = MODULES.length * maxPerModule;
    const done = Object.values(progress).reduce((n, p) => n + moduleStars(p), 0);
    return { pct: Math.round((done / total) * 100), done, total };
  }, [progress]);

  // ── Name gate ────────────────────────────────────────────────
  if (!name) {
    const submit = () => {
      const trimmed = nameInput.trim().slice(0, 30);
      if (trimmed.length < 2) return;
      localStorage.setItem("codesafari-name", trimmed);
      setName(trimmed);
    };
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-3xl shadow-card p-6 sm:p-8 space-y-4">
          <div className="text-center">
            <div className="text-6xl">🦁</div>
            <h1 className="text-3xl font-extrabold mt-2">Karibu CodeSafari!</h1>
            <p className="text-muted-foreground mt-1">
              Tell us your name so we can save your progress.
            </p>
          </div>
          <input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="e.g. Amani"
            maxLength={30}
            className="w-full rounded-xl border-2 border-border bg-background p-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={submit}
            disabled={nameInput.trim().length < 2}
            className="w-full px-5 py-3 rounded-xl bg-primary text-primary-foreground font-extrabold pop shadow-fun disabled:opacity-50"
          >
            Start the safari →
          </button>
        </div>
      </main>
    );
  }

  const mod = MODULES.find((m) => m.id === active) ?? null;

  if (mod) {
    return (
      <ModuleView
        module={mod}
        onBack={() => setActive(null)}
        progress={progress[mod.id]}
        setProgress={(updater) =>
          setProgress((all) => ({ ...all, [mod.id]: updater(all[mod.id]) }))
        }
      />
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-8 space-y-8">
      <header className="rounded-3xl bg-sunset p-6 sm:p-10 shadow-fun text-primary-foreground relative overflow-hidden">
        <div className="absolute -top-6 -right-6 text-[140px] opacity-30 select-none">🦁</div>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-3xl sm:text-5xl font-extrabold drop-shadow-sm">
              Habari, {name}! 👋
            </h1>
            <p className="mt-2 text-lg sm:text-xl opacity-95 max-w-2xl">
              Learn JavaScript the fun way — 15 modules, mini-games, exercises and quizzes.
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("codesafari-name");
              setName(null);
              setNameInput("");
            }}
            className="text-xs font-bold bg-background/30 px-3 py-1.5 rounded-full pop"
          >
            Switch learner
          </button>
        </div>
        <div className="mt-4 bg-background/30 backdrop-blur rounded-full h-3 overflow-hidden max-w-md">
          <div
            className="h-full bg-success transition-all"
            style={{ width: `${totals.pct}%` }}
            aria-label={`${totals.pct}% complete`}
          />
        </div>
        <p className="mt-1 text-sm opacity-90">
          {totals.pct}% complete — {totals.done} / {totals.total} stars
        </p>
      </header>

      <section>
        <h2 className="text-2xl font-extrabold mb-3">Pick a module</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map((m, idx) => {
            const p = progress[m.id];
            const stars = moduleStars(p);
            return (
              <button
                key={m.id}
                onClick={() => setActive(m.id)}
                className="text-left bg-card rounded-2xl p-5 shadow-card pop border-2 border-border"
              >
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{m.emoji}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wide bg-muted px-2 py-1 rounded-full">
                    {m.level}
                  </span>
                </div>
                <h3 className="font-extrabold mt-2">{m.title}</h3>
                <p className="text-sm text-muted-foreground">{m.tagline}</p>
                <div className="mt-3 text-lg">
                  {"⭐".repeat(stars)}
                  <span className="opacity-30">{"⭐".repeat(4 - stars)}</span>
                  <span className="text-xs ml-2 opacity-70">#{idx + 1}</span>
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
