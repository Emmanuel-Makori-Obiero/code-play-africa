import { Link, useNavigate } from "@tanstack/react-router";
import { tierFor } from "@/lib/learner";

export function NavBar({
  learnerName,
  stars,
  onSwitch,
}: {
  learnerName: string;
  stars: number;
  onSwitch: () => void;
}) {
  const tier = tierFor(stars);
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-background/60 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
        <button
          onClick={() => nav({ to: "/" })}
          className="font-extrabold text-lg flex items-center gap-2"
        >
          <span className="text-glow text-neon">{"</>"}</span>
          <span>Code<span className="text-primary text-glow-warm">Safari</span></span>
        </button>
        <nav className="hidden sm:flex items-center gap-1 ml-4 text-sm">
          <NavLink to="/">Modules</NavLink>
          <NavLink to="/progress">Progress</NavLink>
          <NavLink to="/leaderboard">Ranks</NavLink>
          <NavLink to="/certificate">Certificate</NavLink>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs">
            <span>{tier.emoji}</span>
            <span className="font-bold">{tier.name}</span>
            <span className="text-muted-foreground">· ⭐ {stars}</span>
          </div>
          <div className="text-sm hidden sm:block opacity-80">
            👤 <span className="font-bold">{learnerName}</span>
          </div>
          <button
            onClick={onSwitch}
            className="text-xs font-bold px-3 py-1.5 rounded-full glass pop"
          >
            Switch
          </button>
        </div>
      </div>
      <nav className="sm:hidden flex items-center gap-1 px-4 pb-2 text-xs overflow-x-auto">
        <NavLink to="/">Modules</NavLink>
        <NavLink to="/progress">Progress</NavLink>
        <NavLink to="/leaderboard">Ranks</NavLink>
        <NavLink to="/certificate">Cert</NavLink>
      </nav>
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: true }}
      activeProps={{ className: "bg-card text-foreground" }}
      className="px-3 py-1.5 rounded-lg font-semibold text-muted-foreground hover:text-foreground hover:bg-card/60 transition-colors whitespace-nowrap"
    >
      {children}
    </Link>
  );
}
