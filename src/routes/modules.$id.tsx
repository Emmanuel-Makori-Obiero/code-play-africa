import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MODULES } from "@/lib/curriculum";
import { useLearner } from "@/lib/learner-context";
import { totalStars, tierFor, computeIq } from "@/lib/learner";
import { ModuleView, type ModuleProgress } from "@/components/ModuleView";
import { NavBar } from "@/components/NavBar";
import { LearnerSwitcher } from "@/components/LearnerSwitcher";
import { IqReveal } from "@/components/IqReveal";

export const Route = createFileRoute("/modules/$id")({
  component: ModulePage,
});

function ModulePage() {
  const { id } = Route.useParams();
  const { learner, setActive, updateProgress, pushIq } = useLearner();
  const nav = useNavigate();
  const [switcher, setSwitcher] = useState(false);
  const [iqReveal, setIqReveal] = useState<{
    iq: number;
    pct: number;
    title: string;
  } | null>(null);

  const mod = MODULES.find((m) => m.id === id);

  if (!learner) {
    if (typeof window !== "undefined") nav({ to: "/" });
    return null;
  }
  if (!mod) {
    return (
      <main className="min-h-screen p-8 text-center">
        <p>Module not found.</p>
        <button onClick={() => nav({ to: "/" })} className="underline mt-3">
          Back home
        </button>
      </main>
    );
  }

  const stars = totalStars(learner.progress);
  const moduleProgress: ModuleProgress =
    learner.progress[mod.id] ?? {
      lesson: false,
      game: false,
      exercises: mod.exercises.map(() => false),
      quiz: false,
    };

  return (
    <>
      <NavBar learnerName={learner.name} stars={stars} onSwitch={() => setSwitcher(true)} />
      <ModuleView
        module={mod}
        onBack={() => nav({ to: "/" })}
        progress={moduleProgress}
        setProgress={(updater) =>
          updateProgress((all) => ({ ...all, [mod.id]: updater(all[mod.id] ?? moduleProgress) }))
        }
        onQuizComplete={(scorePct) => {
          const iq = computeIq(scorePct, totalStars(learner.progress), mod.id);
          updateProgress((all) => ({
            ...all,
            [mod.id]: {
              ...(all[mod.id] ?? moduleProgress),
              quizScorePct: Math.max(scorePct, all[mod.id]?.quizScorePct ?? 0),
              iq,
            },
          }));
          pushIq({ module: mod.id, iq, pct: scorePct });
          setIqReveal({ iq, pct: scorePct, title: mod.title });
        }}
      />
      {iqReveal && (
        <IqReveal
          iq={iqReveal.iq}
          scorePct={iqReveal.pct}
          tier={tierFor(totalStars(learner.progress))}
          moduleTitle={iqReveal.title}
          onClose={() => setIqReveal(null)}
        />
      )}
      {switcher && (
        <LearnerSwitcher
          current={learner.name}
          onPick={(n) => {
            setActive(n);
            setSwitcher(false);
          }}
          onClose={() => setSwitcher(false)}
        />
      )}
    </>
  );
}
