import { ABOUT } from "../data/content";
import { Barcode } from "./DecryptFX";

function CodeLine({ no, indent = 0, children }) {
  return (
    <div className="flex text-sm leading-7 font-mono">
      <span className="w-8 shrink-0 text-right pr-4 text-muted/60 select-none">
        {no}
      </span>
      <span style={{ paddingLeft: `${indent * 20}px` }}>{children}</span>
    </div>
  );
}

export default function About({ sectionRef }) {
  const workLines = ABOUT.work.length;
  const skillKeys = Object.keys(ABOUT.skills);

  return (
    <section id="about" ref={sectionRef} className="relative px-6 md:px-24 py-28 md:py-36">
      {/* Faint warm wash marks the handoff from Lab into About — a slightly
          more personal, amber-leaning tint against the same dark jade
          base, distinct from Work's teal and Lab's blue washes. */}
      {/* Section-level texture handled by the global per-section backdrop
          (see MeshBackground.jsx / SectionTint) */}

      <div className="flex items-start justify-between gap-6 flex-wrap mb-2">

        <div className="font-mono text-xs tracking-[2px] text-muted mb-2">
          04 — About
        </div>
        <Barcode
          seed={19}
          bars={16}
          heightClass="h-6"
          label="ABOUT.LOG"
          className="hidden md:block opacity-60"
        />
      </div>
      <h2 className="text-3xl md:text-4xl font-bold mb-12">
        About <span className="text-accent">{"/>"}</span>
      </h2>

      <div className="relative bg-surface border border-border/70 rounded-xl p-6 md:p-10 shadow-code-panel max-w-3xl overflow-x-auto">
        {/* top seam — a thin accent hairline standing in for a power-on
            indicator, echoing the scanline language used in Hero */}
        <div
          className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent"
          aria-hidden="true"
        />
        <CodeLine no={1}>
          <span className="text-accent/80">{ABOUT.tagline}</span>
        </CodeLine>
        <CodeLine no={2}>
          <span className="text-accent-light">class</span> {ABOUT.name} {"{"}
        </CodeLine>
        <CodeLine no={3} indent={1}>
          <span className="text-accent-light">constructor</span>() {"{"}
        </CodeLine>
        <CodeLine no={4} indent={2}>
          <span className="text-muted">this.</span>
          <span className="text-accent-light">name</span> ={" "}
          <span className="text-accent">'{ABOUT.name}'</span>;
        </CodeLine>
        <CodeLine no={5} indent={2}>
          <span className="text-muted">this.</span>
          <span className="text-accent-light">email</span> ={" "}
          <span className="text-accent">'{ABOUT.email}'</span>;
        </CodeLine>
        <CodeLine no={6} indent={2}>
          <span className="text-muted">this.</span>
          <span className="text-accent-light">place</span> ={" "}
          <span className="text-accent">'{ABOUT.place}'</span>;
        </CodeLine>
        <CodeLine no={7} indent={1}>{"}"}</CodeLine>

        <CodeLine no={8} indent={1}>
          <span className="text-accent-light">workExperience</span>() {"{"}
        </CodeLine>
        <CodeLine no={9} indent={2}>
          <span className="text-accent-light">return</span> [
        </CodeLine>
        {ABOUT.work.map((w, i) => (
          <CodeLine no={10 + i} indent={3} key={i}>
            {"{ "}
            <span className="text-accent">'{w.range}'</span>:{" "}
            <span className="text-accent">'{w.role}'</span> {"}"},
          </CodeLine>
        ))}
        <CodeLine no={11 + workLines} indent={2}>];</CodeLine>
        <CodeLine no={12 + workLines} indent={1}>{"}"}</CodeLine>

        <CodeLine no={12 + workLines} indent={1}>
          <span className="text-accent-light">skills</span>() {"{"}
        </CodeLine>
        <CodeLine no={13 + workLines} indent={2}>
          <span className="text-accent-light">return</span> {"{"}
        </CodeLine>
        {skillKeys.map((k, i) => (
          <CodeLine no={14 + workLines + i} indent={3} key={k}>
            <span className="text-accent-light">{k}</span>: [
            {ABOUT.skills[k].map((s, si) => (
              <span key={s}>
                <span className="text-accent">'{s}'</span>
                {si < ABOUT.skills[k].length - 1 ? ", " : ""}
              </span>
            ))}
            ],
          </CodeLine>
        ))}
        <CodeLine no={14 + workLines + skillKeys.length} indent={2}>{"};"}</CodeLine>
        <CodeLine no={15 + workLines + skillKeys.length} indent={1}>{"}"}</CodeLine>
        <CodeLine no={16 + workLines + skillKeys.length}>{"}"}</CodeLine>
      </div>

      {ABOUT.education.length > 0 && (
        <div className="max-w-3xl mt-6 font-mono text-xs text-muted">
          {ABOUT.education.map((e, i) => (
            <div key={i}>
              // {e.years} — {e.degree}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}