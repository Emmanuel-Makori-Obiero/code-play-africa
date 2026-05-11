import { useMemo, useState } from "react";
import type { Game } from "@/lib/curriculum";

export function GamePlayer({ game, onWin }: { game: Game; onWin: () => void }) {
  if (game.kind === "predict" || game.kind === "bug") return <ChoiceGame game={game} onWin={onWin} />;
  if (game.kind === "match") return <MatchGame game={game} onWin={onWin} />;
  if (game.kind === "fill") return <FillGame game={game} onWin={onWin} />;
  return null;
}

function ChoiceGame({
  game,
  onWin,
}: {
  game: Extract<Game, { kind: "predict" | "bug" }>;
  onWin: () => void;
}) {
  const [pick, setPick] = useState<number | null>(null);
  const code = game.kind === "predict" ? game.code : game.buggy;
  const title = game.kind === "predict" ? "🔮 Predict the output" : "🐛 Find the bug";

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-lg">{title}</h3>
      <pre className="mono text-sm bg-foreground/95 text-background rounded-xl p-3 whitespace-pre-wrap">
        {code}
      </pre>
      <div className="grid sm:grid-cols-2 gap-2">
        {game.choices.map((c, i) => {
          const chosen = pick === i;
          const correct = pick !== null && i === game.answer;
          const wrong = chosen && i !== game.answer;
          return (
            <button
              key={i}
              onClick={() => {
                setPick(i);
                if (i === game.answer) onWin();
              }}
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
        <p className="text-sm bg-accent/40 rounded-lg p-2 animate-bounce-in">
          {pick === game.answer ? "✅ " : "🤔 "}
          {game.explain}
        </p>
      )}
    </div>
  );
}

function MatchGame({
  game,
  onWin,
}: {
  game: Extract<Game, { kind: "match" }>;
  onWin: () => void;
}) {
  const rights = useMemo(
    () => [...new Set(game.pairs.map((p) => p.right))].sort(),
    [game.pairs],
  );
  const [picks, setPicks] = useState<Record<number, string>>({});
  const allCorrect =
    Object.keys(picks).length === game.pairs.length &&
    game.pairs.every((p, i) => picks[i] === p.right);

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-lg">🧩 Match each value to its type</h3>
      <div className="space-y-2">
        {game.pairs.map((p, i) => (
          <div key={i} className="flex items-center gap-2 bg-card rounded-xl p-2 shadow-card">
            <code className="mono bg-muted px-3 py-2 rounded-lg flex-1">{p.left}</code>
            <span>→</span>
            <select
              value={picks[i] ?? ""}
              onChange={(e) => {
                const next = { ...picks, [i]: e.target.value };
                setPicks(next);
                const done =
                  Object.keys(next).length === game.pairs.length &&
                  game.pairs.every((pp, ii) => next[ii] === pp.right);
                if (done) onWin();
              }}
              className="rounded-lg p-2 border-2 border-border bg-background font-semibold"
            >
              <option value="">choose…</option>
              {rights.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      {allCorrect && (
        <div className="animate-bounce-in rounded-xl bg-success text-success-foreground p-3 font-bold">
          🎉 All matched! Safi sana!
        </div>
      )}
    </div>
  );
}

function FillGame({ game, onWin }: { game: Extract<Game, { kind: "fill" }>; onWin: () => void }) {
  const [vals, setVals] = useState<string[]>(game.blanks.map(() => ""));
  const parts = game.code.split("___");
  const correct = vals.every((v, i) => v.trim() === game.answers[i]);
  return (
    <div className="space-y-3">
      <h3 className="font-bold text-lg">✍️ Fill in the blank</h3>
      <pre className="mono text-sm bg-foreground/95 text-background rounded-xl p-3 whitespace-pre-wrap">
        {parts.map((p, i) => (
          <span key={i}>
            {p}
            {i < vals.length && (
              <input
                value={vals[i]}
                onChange={(e) => {
                  const next = [...vals];
                  next[i] = e.target.value;
                  setVals(next);
                  if (next.every((v, j) => v.trim() === game.answers[j])) onWin();
                }}
                className="mono inline-block w-16 text-center mx-1 rounded px-1 bg-accent text-accent-foreground"
                placeholder="?"
              />
            )}
          </span>
        ))}
      </pre>
      {correct && (
        <p className="text-sm bg-success text-success-foreground rounded-lg p-2 font-bold animate-bounce-in">
          ✅ {game.explain}
        </p>
      )}
    </div>
  );
}
