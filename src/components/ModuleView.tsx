import { useState } from "react";
import type { Module } from "@/lib/curriculum";
import { CodeRunner } from "./CodeRunner";
import { GamePlayer } from "./Game";

export function ModuleView({
  module,
  onBack,
  onComplete,
  done,
}: {
  module: Module;
  onBack: () => void;
  onComplete: () => void;
  done: { lesson: boolean; game: boolean; exercise: boolean };
}) {
  const [tab, setTab] = useState<"learn" | "play" | "do">("learn");
  const tabs = [
    { id: "learn", label: "📖 Learn", done: done.lesson },
    { id: "play", label: "🎮 Play", done: done.game },
    { id: "do", label: "✍️ Try it", done: done.exercise },
  ] as const;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-5">
      <button onClick={onBack} className="text-sm font-bold pop">
        ← All modules
      </button>
      <header className="rounded-3xl bg-sunset text-primary-foreground p-6 shadow-fun">
        <div className="text-5xl">{module.emoji}</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">{module.title}</h1>
        <p className="opacity-95 mt-1">{module.tagline}</p>
      </header>

      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl font-bold pop ${
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
              onComplete();
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
          <GamePlayer game={module.game} onWin={onComplete} />
          <button
            onClick={() => setTab("do")}
            className="mt-4 px-5 py-3 rounded-xl bg-secondary text-secondary-foreground font-extrabold pop"
          >
            Next: try writing code → ✍️
          </button>
        </section>
      )}

      {tab === "do" && (
        <section className="space-y-3 animate-bounce-in">
          <div className="bg-accent/40 rounded-2xl p-4 font-semibold">
            📝 {module.exercise.prompt}
          </div>
          <CodeRunner
            starter={module.exercise.starter}
            expected={module.exercise.expected}
            hint={module.exercise.hint}
            onPass={onComplete}
          />
        </section>
      )}
    </div>
  );
}
