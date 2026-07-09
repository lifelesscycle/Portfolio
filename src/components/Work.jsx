import { useState } from "react";
import TiltCard from "./TiltCard";
import ScatterGrid from "./ScatterGrid";
import { CATEGORIES, WORK_PROJECTS } from "../data/content";
import { ScrollDecryptText, Barcode } from "./DecryptFX";

export default function Work({ sectionRef, onOpenProject }) {
  const [closingId, setClosingId] = useState(null);

  const handleOpen = (project) => {
    if (closingId) return; // ignore rapid double-clicks mid-animation
    setClosingId(project.id);
  };

  // Called by TiltCard's onAnimationComplete once the "closing" variant
  // has actually finished playing (not a guessed setTimeout duration),
  // so the three beats — tile vanishes, page dissolves, panel appears —
  // are genuinely sequential instead of racing each other.
  const handleClosed = (project) => {
    onOpenProject(project);
    setClosingId(null);
  };

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative px-6 md:px-16 py-28 md:py-36"
    >
      <div className="flex items-start justify-between gap-6 flex-wrap mb-2">
        <div className="font-mono text-xs tracking-[2px] text-muted">
          02 — Selected Work
        </div>
        <Barcode
          seed={12}
          bars={16}
          heightClass="h-6"
          label="WORK.LOG"
          className="hidden md:block opacity-60"
        />
      </div>
      <h2 className="text-3xl md:text-4xl font-bold mb-16 md:mb-24">
        Work <span className="text-accent">{"/>"}</span>
      </h2>

      {CATEGORIES.map((cat, catIndex) => {
        const onRight = catIndex % 2 === 1;
        const projects = WORK_PROJECTS.filter((p) => p.category === cat);

        return (
          <div key={cat} className="relative mb-16 md:mb-24">
            {/* ScatterGrid first — tiles render, then ghost text flows
                naturally below the last tile in the stack */}

            {/* Ghost text below the tile row in normal document flow */}
            <div
              className={
                "w-full flex mt-10 md:mt-14 select-none pointer-events-none " +
                (onRight ? "justify-end" : "justify-start")
              }
              aria-hidden="true"
            >
              <ScrollDecryptText
                as="div"
                text={cat}
                charMs={65}
                threshold={0.5}
                className="ghost-text max-w-full"
              />
            </div>
            <ScatterGrid items={projects} getKey={(p) => p.id}>
              {(p, { shape }) => (
                <TiltCard
                  gradient={p.gradient}
                  image={p.image}
                  name={p.name}
                  index={p.index}
                  shape={shape}
                  closing={p.id === closingId}
                  onClosed={() => handleClosed(p)}
                  onClick={() => handleOpen(p)}
                />
              )}
            </ScatterGrid>

          </div>
        );
      })}

      <div className="relative mt-20 py-16 text-center">
        <div className="ghost-text absolute inset-x-0 top-0 text-center select-none">
          SHOWREEL
        </div>
        <button className="relative font-mono text-sm md:text-base inline-flex items-center gap-2 mx-auto hover:text-accent-light transition-colors">
          <span className="text-accent">λ&gt;</span>
          <span>play showreel_2026.web</span>
          <span className="inline-block w-2 h-4 bg-accent animate-blink" />
        </button>
      </div>
    </section>
  );
}