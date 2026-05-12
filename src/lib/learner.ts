// Learner profile, IQ, tier and ranking helpers.
// All client-side, stored in localStorage. No real assessment is performed —
// the "IQ" is a motivational gamified score, not a clinical measurement.

import { MODULES } from "./curriculum";

export type ModuleProgress = {
  lesson: boolean;
  game: boolean;
  exercises: boolean[];
  quiz: boolean;
  quizScorePct?: number; // best percent
  iq?: number;           // last IQ for this module
};

export type Progress = Record<string, ModuleProgress>;

export type IqEntry = { module: string; iq: number; pct: number; at: number };

export type LearnerData = {
  name: string;
  createdAt: number;
  progress: Progress;
  iqHistory: IqEntry[];
};

export const TIERS = [
  { name: "Rookie",  min: 0,   color: "oklch(0.7 0.05 270)", emoji: "🌱" },
  { name: "Coder",   min: 16,  color: "oklch(0.78 0.18 165)", emoji: "💻" },
  { name: "Hacker",  min: 32,  color: "oklch(0.82 0.2 200)",  emoji: "⚡" },
  { name: "Wizard",  min: 48,  color: "oklch(0.7 0.27 330)",  emoji: "🧙" },
  { name: "Legend",  min: 60,  color: "oklch(0.78 0.18 90)",  emoji: "👑" },
];

export function emptyProgress(): Progress {
  return Object.fromEntries(
    MODULES.map((m) => [
      m.id,
      { lesson: false, game: false, exercises: m.exercises.map(() => false), quiz: false },
    ]),
  );
}

export function moduleStars(p: ModuleProgress): number {
  const exAll = p.exercises.length > 0 && p.exercises.every(Boolean);
  return (p.lesson ? 1 : 0) + (p.game ? 1 : 0) + (exAll ? 1 : 0) + (p.quiz ? 1 : 0);
}

export function totalStars(progress: Progress): number {
  return Object.values(progress).reduce((n, p) => n + moduleStars(p), 0);
}

export function maxStars(): number {
  return MODULES.length * 4;
}

export function tierFor(stars: number) {
  let t = TIERS[0];
  for (const x of TIERS) if (stars >= x.min) t = x;
  return t;
}

/**
 * Adaptive IQ: scales with quiz score, current tier, and a tiny module-specific
 * pseudo-random nudge so the number feels alive. Capped at 168.
 */
export function computeIq(scorePct: number, stars: number, moduleId: string): number {
  const tierIdx = TIERS.findIndex((t) => t.name === tierFor(stars).name);
  const seed = [...moduleId].reduce((a, c) => a + c.charCodeAt(0), 0);
  const wobble = (seed % 9) - 4; // -4..+4
  const base = 96 + Math.round(scorePct * 0.55) + tierIdx * 6 + wobble;
  return Math.max(95, Math.min(168, base));
}

export function listLearners(): string[] {
  try {
    const raw = localStorage.getItem("codesafari-learners");
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  // legacy single name
  const single = localStorage.getItem("codesafari-name");
  return single ? [single] : [];
}

export function saveLearners(names: string[]) {
  localStorage.setItem("codesafari-learners", JSON.stringify(names));
}

export function loadLearner(name: string): LearnerData {
  try {
    const raw = localStorage.getItem(`codesafari-data:${name}`);
    if (raw) {
      const d = JSON.parse(raw) as Partial<LearnerData>;
      const fresh = emptyProgress();
      const saved = d.progress || {};
      for (const id of Object.keys(fresh)) {
        if (saved[id]) {
          fresh[id] = {
            lesson: !!saved[id].lesson,
            game: !!saved[id].game,
            quiz: !!saved[id].quiz,
            quizScorePct: saved[id].quizScorePct,
            iq: saved[id].iq,
            exercises: fresh[id].exercises.map((_, i) => !!saved[id].exercises?.[i]),
          };
        }
      }
      return {
        name,
        createdAt: d.createdAt || Date.now(),
        progress: fresh,
        iqHistory: d.iqHistory || [],
      };
    }
  } catch { /* ignore */ }
  // legacy fallback
  try {
    const legacy = localStorage.getItem(`codesafari-progress:${name}`);
    if (legacy) {
      const fresh = emptyProgress();
      const saved = JSON.parse(legacy) as Progress;
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
      return { name, createdAt: Date.now(), progress: fresh, iqHistory: [] };
    }
  } catch { /* ignore */ }
  return { name, createdAt: Date.now(), progress: emptyProgress(), iqHistory: [] };
}

export function saveLearner(d: LearnerData) {
  localStorage.setItem(`codesafari-data:${d.name}`, JSON.stringify(d));
}

export function deleteLearner(name: string) {
  localStorage.removeItem(`codesafari-data:${name}`);
  localStorage.removeItem(`codesafari-progress:${name}`);
  saveLearners(listLearners().filter((n) => n !== name));
}

/** Stable fake leaderboard so the user has someone to beat. */
const FAKE = [
  ["Amani K.", 58], ["Zuri M.", 52], ["Kwame O.", 49], ["Imani N.", 45],
  ["Jabari T.", 41], ["Nia W.", 38], ["Sefu R.", 34], ["Ayana B.", 31],
  ["Kofi A.", 27], ["Lulu S.", 22], ["Tendai P.", 18], ["Chipo D.", 14],
] as const;

export function leaderboard(currentName: string, currentStars: number) {
  const rows = FAKE.map(([n, s]) => ({ name: n as string, stars: s as number, you: false }));
  rows.push({ name: currentName, stars: currentStars, you: true });
  rows.sort((a, b) => b.stars - a.stars);
  return rows.map((r, i) => ({ ...r, rank: i + 1 }));
}
