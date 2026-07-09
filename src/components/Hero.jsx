import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
import { SITE } from "../data/content";
import {
  DecryptText,
  TypewriterText,
  Barcode,
  CornerFrame,
  ScanlineSweep,
  CyclingDecryptText,
  usePrefersReducedMotion,
} from "./DecryptFX";

export default function Hero({ sectionRef }) {
  const reducedMotion = usePrefersReducedMotion();

  // Sequenced start times (ms) — slower, more deliberate cascade than
  // a typical page-load animation. Each element waits for the one
  // before it to roughly finish, so the whole hero reads as a single
  // boot sequence rather than several things happening at once.
  const T_PROMPT = reducedMotion ? 0 : 700;
  const T_NAME = reducedMotion ? 0 : 1500;
  const T_VERB = reducedMotion ? 0 : 2600;
  const T_BUILD = reducedMotion ? 0 : 3300;
  const T_TAIL = reducedMotion ? 0 : 4000;
  const T_CLOSING = reducedMotion ? 0 : 5400;
  const T_ARROW = reducedMotion ? 0 : 6800;
  const T_FRAME = reducedMotion ? 0 : 50;

  const [arrowVisible, setArrowVisible] = useState(reducedMotion);
  const [frameVisible, setFrameVisible] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) return;
    const t1 = setTimeout(() => setArrowVisible(true), T_ARROW);
    const t2 = setTimeout(() => setFrameVisible(true), T_FRAME);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [reducedMotion]);

  return (
    <section id="start" ref={sectionRef} className="relative min-h-screen flex items-center px-6 md:px-24">
      <div
        className="relative max-w-4xl w-full p-8 md:p-12 transition-opacity duration-700"
        style={{ opacity: frameVisible ? 1 : 0 }}
      >
        <CornerFrame />
        <ScanlineSweep delay={T_FRAME} />

        <div className="font-mono text-[11px] md:text-xs text-muted/60 mb-6 flex items-center gap-2 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-glow-sm animate-pulse" />
          SYS.BOOT // PORTFOLIO_v{SITE.year} — STATUS: ONLINE
        </div>

        <div className="font-mono text-xs md:text-sm text-muted/70 mb-5 tracking-wide">
          <TypewriterText text="> whoami" startDelay={T_PROMPT} charMs={70} />
        </div>

        <div className="text-xl md:text-3xl text-muted mb-4">
          Hi, my name is{" "}
          <DecryptText
            text={SITE.name}
            startDelay={T_NAME}
            charMs={55}
            className="text-accent font-bold"
          />
        </div>

        <h1 className="text-4xl md:text-7xl leading-[1.05] mb-7">
          <span className="font-bold">I</span>{" "}
          <DecryptText
            text={SITE.taglineVerb}
            startDelay={T_VERB}
            charMs={75}
            className="font-serif italic text-accent-light"
          />{" "}
          <CyclingDecryptText
            words={["and build", "and deploy"]}
            startDelay={T_BUILD}
            charMs={50}
            holdMs={4000}
            className="font-bold inline-block"
          />{" "}
          <DecryptText
            text={SITE.taglineTail}
            startDelay={T_TAIL}
            charMs={46}
            className="font-mono text-3xl md:text-5xl inline-block"
          />
        </h1>

        <div className="flex items-end justify-between flex-wrap gap-6">
          <div>
            <p className="text-muted text-base md:text-lg">
              <TypewriterText
                text="Building software that solves real-world problems."
                startDelay={T_CLOSING}
                charMs={32}
              />
            </p>

            <p className="text-muted text-lg md:text-xl font-mono">
              <TypewriterText
                text="Let me show you..."
                startDelay={T_CLOSING + 1800}
                charMs={58}
              />
            </p>
          </div>

          <Barcode
            seed={7}
            bars={22}
            heightClass="h-9"
            label={`SUBJECT // ${SITE.name.toUpperCase()}`}
            className="hidden md:block opacity-80"
          />
        </div>
      </div>

      <ArrowDown
        className="hidden md:block absolute bottom-10 right-10 text-muted animate-bounce transition-opacity duration-700"
        style={{ opacity: arrowVisible ? 1 : 0 }}
        size={18}
        aria-hidden="true"
      />
    </section>
  );
}