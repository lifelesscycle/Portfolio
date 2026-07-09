import { useState } from "react";
import { PROJECT_CATEGORIES, projects } from "../data/projects";
import { Barcode } from "./DecryptFX";

export default function Lab({ sectionRef }) {
  const [preview, setPreview] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e) => setPos({ x: e.clientX, y: e.clientY });

  return (
    <section id="lab" ref={sectionRef} className="relative px-6 md:px-24 py-28 md:py-36">
      <div className="flex items-start justify-between gap-6 flex-wrap mb-2">
        <div className="font-mono text-xs tracking-[2px] text-muted">
          03 — Lab
        </div>
        <Barcode
          seed={19}
          bars={16}
          heightClass="h-6"
          label="LAB.LOG"
          className="hidden md:block opacity-60"
        />
      </div>
      <h2 className="text-3xl md:text-4xl font-bold mb-6">
        Lab <span className="text-accent">{"/>"}</span>
      </h2>
      <p className="text-muted max-w-xl mb-14 leading-relaxed">
        Other things I've built — full-stack systems, ML pipelines and
        experiments outside the main showcase above.
      </p>

      <div
        className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12"
        onMouseMove={handleMove}
        onMouseLeave={() => setPreview(null)}
      >
        {PROJECT_CATEGORIES.map((cat) => (
          <div key={cat}>
            <div className="text-accent-light font-bold text-lg mb-4">
              {cat}
            </div>
            <ul className="space-y-3">
              {projects
                .filter((p) => p.category === cat)
                .map((project) => (
                  <li
                    key={project.id}
                    onMouseEnter={() => setPreview(project)}
                    onMouseLeave={() => setPreview(null)}
                    className="text-sm cursor-pointer transition-all duration-300 text-text/85 hover:text-accent-light hover:translate-x-1"
                  >
                    {project.title}
                  </li>
                ))}
            </ul>
          </div>
        ))}

        {preview && (
          <div
            className="fixed z-50 pointer-events-none w-80 bg-surface border border-accent/30
              rounded-2xl p-5 shadow-lab-float"
            style={{
              left: Math.min(pos.x + 24, window.innerWidth - 340),
              top: Math.min(pos.y + 12, window.innerHeight - 260),
            }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <span className="font-bold text-base text-accent-light leading-snug">
                {preview.title}
              </span>
              <span className="font-mono text-[10px] text-muted shrink-0 mt-0.5">
                {preview.year}
              </span>
            </div>

            <p className="text-xs text-text/80 leading-relaxed mb-3">
              {preview.summary}
            </p>
            <p className="text-xs text-muted/70 leading-relaxed mb-4">
              {preview.detail}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {preview.stack.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-[10px] px-2 py-0.5 rounded-full border border-border text-muted"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className="font-serif italic text-sm text-accent-light">
                {preview.stat.value}
              </span>
              <span className="font-mono text-[10px] text-muted">
                {preview.stat.label}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}