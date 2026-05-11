import { useState } from "react";
import type { QuizQuestion } from "@/lib/curriculum";

export function Quiz({ questions, onPass }: { questions: QuizQuestion[]; onPass: () => void }) {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = questions[i];

  if (done) {
    const passed = score >= Math.ceil(questions.length * 0.6);
    return (
      <div className="space-y-3 animate-bounce-in">
        <div
          className={`rounded-xl p-4 font-bold ${
            passed ? "bg-success text-success-foreground" : "bg-destructive/15 text-destructive"
          }`}
        >
          {passed ? "🎉 Hongera!" : "🤔 Almost!"} You got {score} / {questions.length}
        </div>
        <button
          onClick={() => {
            setI(0);
            setPick(null);
            setScore(0);
            setDone(false);
          }}
          className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground font-bold pop"
        >
          ↺ Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-bold opacity-70">
        Question {i + 1} / {questions.length}
      </div>
      <h3 className="font-extrabold text-lg">{q.q}</h3>
      <div className="grid sm:grid-cols-2 gap-2">
        {q.choices.map((c, idx) => {
          const chosen = pick === idx;
          const correct = pick !== null && idx === q.answer;
          const wrong = chosen && idx !== q.answer;
          return (
            <button
              key={idx}
              disabled={pick !== null}
              onClick={() => setPick(idx)}
              className={`p-3 rounded-xl border-2 font-semibold pop text-left ${
                correct
                  ? "bg-success text-success-foreground border-success"
                  : wrong
                    ? "bg-destructive/20 border-destructive"
                    : "bg-card border-border"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>
      {pick !== null && (
        <>
          <p className="text-sm bg-accent/40 rounded-lg p-2 animate-bounce-in">
            {pick === q.answer ? "✅ " : "🤔 "}
            {q.explain}
          </p>
          <button
            onClick={() => {
              const nextScore = score + (pick === q.answer ? 1 : 0);
              if (i + 1 >= questions.length) {
                setScore(nextScore);
                setDone(true);
                if (nextScore >= Math.ceil(questions.length * 0.6)) onPass();
              } else {
                setScore(nextScore);
                setI(i + 1);
                setPick(null);
              }
            }}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold pop shadow-fun"
          >
            {i + 1 >= questions.length ? "See result →" : "Next question →"}
          </button>
        </>
      )}
    </div>
  );
}
