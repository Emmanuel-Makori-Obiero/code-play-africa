import { useState } from "react";
import { listLearners, deleteLearner } from "@/lib/learner";

export function LearnerSwitcher({
  current,
  onPick,
  onClose,
}: {
  current: string | null;
  onPick: (name: string) => void;
  onClose: () => void;
}) {
  const [learners, setLearners] = useState<string[]>(listLearners());
  const [name, setName] = useState("");

  const add = () => {
    const trimmed = name.trim().slice(0, 30);
    if (trimmed.length < 2) return;
    if (!learners.includes(trimmed)) {
      const next = [...learners, trimmed];
      setLearners(next);
      localStorage.setItem("codesafari-learners", JSON.stringify(next));
    }
    onPick(trimmed);
  };

  const remove = (n: string) => {
    if (!confirm(`Remove ${n}? Their progress will be deleted.`)) return;
    deleteLearner(n);
    setLearners(listLearners());
    if (current === n) {
      const next = listLearners();
      if (next[0]) onPick(next[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-bounce-in">
      <div className="glass border-grad rounded-2xl w-full max-w-md p-6 space-y-4 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-xl">Choose learner</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl">
            ✕
          </button>
        </div>

        {learners.length === 0 ? (
          <p className="text-sm text-muted-foreground">No learners yet — add one below.</p>
        ) : (
          <ul className="space-y-2 max-h-60 overflow-auto">
            {learners.map((n) => (
              <li key={n} className="flex items-center gap-2">
                <button
                  onClick={() => onPick(n)}
                  className={`flex-1 text-left px-3 py-2 rounded-xl font-semibold pop border ${
                    current === n
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border"
                  }`}
                >
                  👤 {n}
                  {current === n && <span className="ml-2 text-xs opacity-80">(current)</span>}
                </button>
                <button
                  onClick={() => remove(n)}
                  className="text-xs px-2 py-2 rounded-lg text-destructive hover:bg-destructive/10"
                  aria-label={`remove ${n}`}
                >
                  🗑
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="pt-2 border-t border-border">
          <label className="text-xs text-muted-foreground">Add a new learner</label>
          <div className="flex gap-2 mt-1">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder="e.g. Zuri"
              maxLength={30}
              className="flex-1 rounded-xl bg-input p-2 border border-border focus:outline-none focus:ring-2 focus:ring-ring font-semibold"
            />
            <button
              onClick={add}
              disabled={name.trim().length < 2}
              className="px-4 py-2 rounded-xl bg-neon text-primary-foreground font-bold pop disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
