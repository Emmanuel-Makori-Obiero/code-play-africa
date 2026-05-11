import { useState } from "react";

type Props = {
  starter: string;
  expected: string;
  hint: string;
  onPass?: () => void;
};

export function CodeRunner({ starter, expected, hint, onPass }: Props) {
  const [code, setCode] = useState(starter);
  const [output, setOutput] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "pass" | "fail">("idle");
  const [showHint, setShowHint] = useState(false);

  const run = () => {
    const logs: string[] = [];
    const fakeConsole = {
      log: (...args: unknown[]) =>
        logs.push(args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" ")),
    };
    try {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
      const fn = new Function("console", code);
      fn(fakeConsole);
      setOutput(logs);
      const ok = logs.join("\n").includes(expected);
      setStatus(ok ? "pass" : "fail");
      if (ok) onPass?.();
    } catch (e) {
      setOutput([`❌ ${(e as Error).message}`]);
      setStatus("fail");
    }
  };

  return (
    <div className="rounded-2xl bg-card shadow-card p-4 space-y-3">
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        className="mono w-full min-h-[140px] rounded-xl bg-muted text-foreground p-3 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <div className="flex flex-wrap gap-2">
        <button
          onClick={run}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold pop shadow-fun"
        >
          ▶ Run code
        </button>
        <button
          onClick={() => setShowHint((s) => !s)}
          className="px-4 py-2 rounded-xl bg-accent text-accent-foreground font-bold pop"
        >
          💡 {showHint ? "Hide hint" : "Hint"}
        </button>
        <button
          onClick={() => {
            setCode(starter);
            setOutput([]);
            setStatus("idle");
          }}
          className="px-4 py-2 rounded-xl bg-muted text-foreground font-bold pop"
        >
          ↺ Reset
        </button>
      </div>
      {showHint && (
        <p className="text-sm bg-accent/40 rounded-lg p-2">
          <b>Hint:</b> {hint}
        </p>
      )}
      <div className="rounded-xl bg-foreground/95 text-background p-3 mono text-sm min-h-[60px]">
        {output.length === 0 ? (
          <span className="opacity-60">// output will appear here</span>
        ) : (
          output.map((l, i) => <div key={i}>› {l}</div>)
        )}
      </div>
      {status === "pass" && (
        <div className="animate-bounce-in rounded-xl bg-success text-success-foreground p-3 font-bold">
          🎉 Hongera! You did it!
        </div>
      )}
      {status === "fail" && (
        <div className="animate-wiggle rounded-xl bg-destructive/15 text-destructive p-3 font-bold">
          Not yet — try again. Tap 💡 Hint if stuck.
        </div>
      )}
    </div>
  );
}
