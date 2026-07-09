import { SITE, NAV_ITEMS } from "../data/content";

export function Logo({ visible }) {
  return (
    <div
      className="fixed top-6 left-6 md:top-8 md:left-10 z-50 font-mono font-bold text-lg select-none
        transition-transform duration-300 ease-out"
      style={{ transform: visible ? "translateY(0)" : "translateY(-140%)" }}
    >
      <span className="text-accent">{"<"}</span>
      {SITE.logoTag}
      <span className="text-accent">{"/>"}</span>
    </div>
  );
}

export function TopNav({ active, onNavigate, visible }) {
  return (
    <nav
      className="fixed top-6 right-6 md:top-8 md:right-10 z-50 flex gap-5 md:gap-7
        transition-transform duration-300 ease-out"
      style={{ transform: visible ? "translateY(0)" : "translateY(-140%)" }}
    >
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={
            "font-mono text-xs md:text-sm tracking-wide transition-colors " +
            (active === item.id
              ? "text-text font-bold"
              : "text-muted hover:text-accent-light")
          }
        >
          {item.label} <span className="text-accent">{"/>"}</span>
        </button>
      ))}
    </nav>
  );
}

export function Rail({ activeIndex }) {
  const percent =
    NAV_ITEMS.length > 1 ? (activeIndex / (NAV_ITEMS.length - 1)) * 100 : 0;
  const label = NAV_ITEMS[activeIndex]?.label ?? "";

  return (
    <div className="rail-line hidden md:block" aria-hidden="true">
      <div className="rail-dot" style={{ top: `${percent}%` }} />
      <div className="rail-label" style={{ top: `${percent}%` }}>
        {label} <span className="text-accent">/&gt;</span>
      </div>
    </div>
  );
}

export function ScrollCue({ visible }) {
  if (!visible) return null;
  return (
    <div className="fixed left-[34px] bottom-10 z-40 hidden md:flex flex-col items-center gap-3">
      <div className="mouse-icon" />
      <span className="font-mono text-[10px] tracking-[3px] text-muted [writing-mode:vertical-rl] rotate-180">
        SCROLL
      </span>
    </div>
  );
}

export function SideBadge() {
  return (
    <div
      className="fixed right-0 top-1/2 -translate-y-1/2 z-40 border border-border bg-surface/60
      px-3 py-4 text-[11px] font-mono tracking-[2px] text-muted [writing-mode:vertical-rl]
      shadow-card backdrop-blur-sm rounded-l-md hidden lg:block"
    >
      {SITE.badge}
    </div>
  );
}