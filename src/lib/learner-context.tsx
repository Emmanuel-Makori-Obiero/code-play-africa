import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import {
  type LearnerData,
  type Progress,
  loadLearner,
  saveLearner,
  listLearners,
  saveLearners,
} from "@/lib/learner";

type Ctx = {
  learner: LearnerData | null;
  setActive: (name: string | null) => void;
  updateProgress: (updater: (p: Progress) => Progress) => void;
  pushIq: (entry: { module: string; iq: number; pct: number }) => void;
};

const LearnerCtx = createContext<Ctx | null>(null);

export function LearnerProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useState<string | null>(null);
  const [learner, setLearner] = useState<LearnerData | null>(null);

  // hydrate active name
  useEffect(() => {
    try {
      const active = localStorage.getItem("codesafari-active");
      if (active) {
        setName(active);
      } else {
        const list = listLearners();
        if (list[0]) setName(list[0]);
      }
    } catch { /* ignore */ }
  }, []);

  // load learner data when name changes
  useEffect(() => {
    if (!name) {
      setLearner(null);
      return;
    }
    setLearner(loadLearner(name));
    localStorage.setItem("codesafari-active", name);
    const list = listLearners();
    if (!list.includes(name)) saveLearners([...list, name]);
  }, [name]);

  // persist on change
  useEffect(() => {
    if (learner) saveLearner(learner);
  }, [learner]);

  const setActive = useCallback((n: string | null) => {
    if (!n) {
      localStorage.removeItem("codesafari-active");
      setName(null);
      return;
    }
    setName(n);
  }, []);

  const updateProgress = useCallback(
    (updater: (p: Progress) => Progress) => {
      setLearner((l) => (l ? { ...l, progress: updater(l.progress) } : l));
    },
    [],
  );

  const pushIq = useCallback(
    (entry: { module: string; iq: number; pct: number }) => {
      setLearner((l) =>
        l ? { ...l, iqHistory: [...l.iqHistory, { ...entry, at: Date.now() }] } : l,
      );
    },
    [],
  );

  return (
    <LearnerCtx.Provider value={{ learner, setActive, updateProgress, pushIq }}>
      {children}
    </LearnerCtx.Provider>
  );
}

export function useLearner() {
  const ctx = useContext(LearnerCtx);
  if (!ctx) throw new Error("useLearner must be inside LearnerProvider");
  return ctx;
}
