import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useLearner } from "@/lib/learner-context";
import { totalStars } from "@/lib/learner";
import { NavBar } from "@/components/NavBar";
import { LearnerSwitcher } from "@/components/LearnerSwitcher";
import { Certificate } from "@/components/Certificate";

export const Route = createFileRoute("/certificate")({
  head: () => ({
    meta: [
      { title: "Your certificate · CodeSafari" },
      { name: "description", content: "Print your CodeSafari Certificate of Achievement." },
    ],
  }),
  component: CertificatePage,
});

function CertificatePage() {
  const { learner, setActive } = useLearner();
  const nav = useNavigate();
  const [switcher, setSwitcher] = useState(false);

  if (!learner) {
    if (typeof window !== "undefined") nav({ to: "/" });
    return null;
  }
  const stars = totalStars(learner.progress);

  return (
    <>
      <NavBar learnerName={learner.name} stars={stars} onSwitch={() => setSwitcher(true)} />
      <main className="max-w-5xl mx-auto p-4 sm:p-8 space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-3 print:hidden">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-neon">Achievement</div>
            <h1 className="text-3xl font-bold mt-1">Your certificate</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Earn more stars to make it shine. Print to keep a copy.
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-neon text-primary-foreground font-bold pop shadow-neon"
          >
            🖨 Print / Save as PDF
          </button>
        </header>
        <Certificate learner={learner} />
      </main>
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
