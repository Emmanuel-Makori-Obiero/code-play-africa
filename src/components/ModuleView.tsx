import { useState } from "react";
import type { Module } from "@/lib/curriculum";
import { CodeRunner } from "./CodeRunner";
import { GamePlayer } from "./Game";
import { Quiz } from "./Quiz";

export type ModuleProgress = {
  lesson: boolean;
  game: boolean;
  exercises: boolean[];
  quiz: boolean;
  quizScorePct?: number;
  iq?: number;
};

export function ModuleView({
  module,
  onBack,
  progress,
  setProgress,
  onQuizComplete,
}: {
  module: Module;
  onBack: () => void;
  progress: ModuleProgress;
  setProgress: (updater: (p: ModuleProgress) => ModuleProgress) => void;
  onQuizComplete?: (scorePct: number) => void;
}) {
  const [tab, setTab] = useState<"learn" | "play" | "do" | "quiz">("learn");
  const allEx = progress.exercises.every(Boolean);
  const tabs = [
    { id: "learn", label: "📖 Learn", done: progress.lesson },
    { id: "play", label: "🎮 Play", done: progress.game },
    { id: "do", label: "✍️ Exercises", done: allEx },
    { id: "quiz", label: "🧠 Quiz", done: progress.quiz },
  ] as const;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-5">
      <button onClick={onBack} className="text-sm font-bold pop">
        ← All modules
      </button>
      <header className="rounded-3xl bg-sunset text-primary-foreground p-6 shadow-fun">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-5xl">{module.emoji}</div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">{module.title}</h1>
            <p className="opacity-95 mt-1">{module.tagline}</p>
          </div>
          <span className="text-xs font-bold bg-background/30 px-2 py-1 rounded-full whitespace-nowrap">
            {module.level}
          </span>
        </div>
      </header>

      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 rounded-xl font-bold pop text-sm ${
              tab === t.id
                ? "bg-primary text-primary-foreground shadow-fun"
                : "bg-card text-foreground border-2 border-border"
            }`}
          >
            {t.done && "✅ "}
            {t.label}
          </button>
        ))}
      </div>

      {tab === "learn" && (
        <section className="space-y-4 animate-bounce-in">
          <div className="bg-accent/40 rounded-2xl p-4">
            <p className="font-semibold">🌍 Story: {module.story}</p>
          </div>
          {module.lesson.map((l, i) => (
            <div key={i} className="bg-card rounded-2xl p-4 shadow-card">
              <h3 className="font-bold text-lg">{l.heading}</h3>
              <p className="mt-1">{l.body}</p>
              {l.code && (
                <pre className="mono mt-3 text-sm bg-foreground/95 text-background rounded-xl p-3 whitespace-pre-wrap">
                  {l.code}
                </pre>
              )}
            </div>
          ))}
          <button
            onClick={() => {
              setProgress((p) => ({ ...p, lesson: true }));
              setTab("play");
            }}
            className="px-5 py-3 rounded-xl bg-secondary text-secondary-foreground font-extrabold pop shadow-fun"
          >
            I understand — let's play! 🎮
          </button>
        </section>
      )}

      {tab === "play" && (
        <section className="bg-card rounded-2xl p-4 shadow-card animate-bounce-in">
          <GamePlayer
            game={module.game}
            onWin={() => setProgress((p) => ({ ...p, game: true }))}
          />
          <button
            onClick={() => setTab("do")}
            className="mt-4 px-5 py-3 rounded-xl bg-secondary text-secondary-foreground font-extrabold pop"
          >
            Next: exercises → ✍️
          </button>
        </section>
      )}

      {tab === "do" && (
        <section className="space-y-5 animate-bounce-in">
          {module.exercises.map((ex, i) => (
            <div key={i} className="space-y-2">
              <div className="bg-accent/40 rounded-2xl p-4 font-semibold flex items-start gap-2">
                <span>
                  {progress.exercises[i] ? "✅" : "📝"} #{i + 1}
                </span>
                <span>{ex.prompt}</span>
              </div>
              <CodeRunner
                starter={ex.starter}
                expected={ex.expected}
                hint={ex.hint}
                onPass={() =>
                  setProgress((p) => {
                    const exs = [...p.exercises];
                    exs[i] = true;
                    return { ...p, exercises: exs };
                  })
                }
              />
            </div>
          ))}
          <button
            onClick={() => setTab("quiz")}
            className="px-5 py-3 rounded-xl bg-secondary text-secondary-foreground font-extrabold pop"
          >
            Next: take the quiz → 🧠
          </button>
        </section>
      )}

      {tab === "quiz" && (
        <section className="bg-card rounded-2xl p-4 shadow-card animate-bounce-in">
          <h2 className="font-extrabold text-lg mb-2">🧠 Quiz time</h2>
          <Quiz
            questions={module.quiz}
            onPass={() => setProgress((p) => ({ ...p, quiz: true }))}
            onComplete={onQuizComplete}
          />
        </section>
      )}
    </div>
  );
}
