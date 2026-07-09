import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Shared terminal/decrypt effects.                                   */
/*  Used by Hero (mount-triggered), Work + TiltCard (scroll-triggered) */
/*  so the whole site reads as one system, not a Hero-only trick.      */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Scramble character pools — mixed each frame for a richer, more     */
/*  "data stream" decrypt look instead of flat symbol noise. Weighted  */
/*  so blocks/barcode glyphs show up often (visually strongest) while  */
/*  katakana and hex add flavor without dominating.                    */
/*                                                                      */
/*  NOTE: box-drawing / katakana / block glyphs can render at slightly */
/*  different widths than Latin chars in non-monospace fonts, causing  */
/*  a faint width wobble mid-scramble. Wrap decrypting spans in        */
/*  font-mono if you want it perfectly stable — it settles once        */
/*  resolved either way.                                                */
/* ------------------------------------------------------------------ */
const SCRAMBLE_POOLS = [
  { chars: "!<>-_\\/[]{}—=+*^?#", weight: 3 },              // original symbol noise
  { chars: "01", weight: 2 },                                 // binary
  { chars: "0123456789ABCDEF", weight: 1 },                   // hex
  { chars: "░▒▓█▄▀▌▐■□▪▫", weight: 3 },                        // block/glyph noise
  { chars: "▏▎▍▌▋▊▉█▁▂▃▄▅▆▇", weight: 2 },                     // barcode/bar-height glyphs
  { chars: "─│┌┐└┘├┤┬┴┼═║╔╗╚╝", weight: 1 },                  // box-drawing / circuitry
  { chars: "ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾜ", weight: 2 }, // half-width katakana (Matrix rain)
];

// Flattened weighted pool, built once — avoids re-summing weights every frame.
const WEIGHTED_POOL = SCRAMBLE_POOLS.flatMap(({ chars, weight }) =>
  Array(weight).fill(chars)
);

function randomScrambleChar() {
  const pool = WEIGHTED_POOL[Math.floor(Math.random() * WEIGHTED_POOL.length)];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/* Fires `inView = true` once the element crosses `threshold`, then
   stops observing (triggerOnce) — used to start scroll-based decrypts
   exactly when a section/card actually becomes visible. */
export function useInView({ threshold = 0.4, rootMargin = "0px", triggerOnce = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (triggerOnce) obs.unobserve(entry.target);
          } else if (!triggerOnce) {
            setInView(false);
          }
        });
      },
      { threshold, rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, rootMargin, triggerOnce]);
  return [ref, inView];
}

function useDecryptedDisplay(text, { active, charMs = 26 } = {}) {
  const reducedMotion = usePrefersReducedMotion();
  const [display, setDisplay] = useState(reducedMotion ? text : "");
  const frameRef = useRef();

  useEffect(() => {
    if (!active) return;
    if (reducedMotion) {
      setDisplay(text);
      return;
    }
    let cancelled = false;
    let start = null;

    const loop = (now) => {
      if (cancelled) return;
      if (start === null) start = now;
      const elapsed = now - start;
      const revealed = Math.min(text.length, Math.floor(elapsed / charMs));
      let out = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") out += " ";
        else if (i < revealed) out += text[i];
        else out += randomScrambleChar();
      }
      setDisplay(out);
      if (revealed < text.length) frameRef.current = requestAnimationFrame(loop);
      else setDisplay(text);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frameRef.current);
    };
  }, [active, text, charMs, reducedMotion]);

  return display;
}

/* Mount-triggered decrypt — starts `startDelay` ms after render.
   Used in Hero, where the whole page-load sequence is orchestrated
   by hand. */
export function DecryptText({ text, as: Tag = "span", startDelay = 0, charMs = 26, className = "" }) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setActive(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);
  const display = useDecryptedDisplay(text, { active, charMs });
  return <Tag className={className}>{display}</Tag>;
}

/* Scroll-triggered decrypt — starts the moment the element itself
   scrolls into view. Used in Work/TiltCard, where content is far
   below the fold and a mount timer would fire long before anyone
   sees it.

   Normally it watches itself via its own IntersectionObserver. But
   when a parent already knows when it's in view (e.g. TiltCard,
   which needs that same moment to trigger its pop-in animation), pass
   `active` to let the parent drive it directly instead — so the tile
   popping in and its name decrypting both fire off one shared
   trigger rather than two independent observers that could disagree
   by a frame or a threshold. */
export function ScrollDecryptText({
  text,
  as: Tag = "span",
  charMs = 26,
  className = "",
  threshold = 0.4,
  rootMargin = "0px",
  active,
}) {
  const isControlled = active !== undefined;
  const [selfRef, selfInView] = useInView({ threshold, rootMargin, triggerOnce: true });
  const inView = isControlled ? active : selfInView;
  const display = useDecryptedDisplay(text, { active: inView, charMs });
  return (
    <Tag ref={isControlled ? undefined : selfRef} className={className}>
      {display}
    </Tag>
  );
}

/* Cycling decrypt — scrambles into `words[0]`, holds for `holdMs`,
   then scrambles into `words[1]`, holds, loops forever. Same weighted
   scramble pool as DecryptText/ScrollDecryptText, so it reads as part
   of the same system rather than a separate effect.

   Used e.g. in Hero for a headline word that alternates between two
   states ("and build" / "and deploy") without ever going fully idle. */
export function CyclingDecryptText({
  words,
  holdMs = 4000,
  charMs = 40,
  startDelay = 0,
  className = "",
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [display, setDisplay] = useState(words[0]);
  const timersRef = useRef([]);

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(words[0]);
      return;
    }

    let cancelled = false;
    const addTimer = (fn, ms) => {
      const id = setTimeout(fn, ms);
      timersRef.current.push(id);
      return id;
    };

    const scrambleTo = (target, onDone) => {
      const length = target.length;
      let revealed = 0;
      const tick = () => {
        if (cancelled) return;
        let out = "";
        for (let i = 0; i < length; i++) {
          if (i < revealed || target[i] === " ") out += target[i];
          else out += randomScrambleChar();
        }
        setDisplay(out);
        if (revealed < length) {
          revealed++;
          addTimer(tick, charMs);
        } else {
          setDisplay(target);
          onDone && onDone();
        }
      };
      tick();
    };

    let index = 0;
    const runCycle = () => {
      scrambleTo(words[index], () => {
        addTimer(() => {
          index = (index + 1) % words.length;
          runCycle();
        }, holdMs);
      });
    };

    addTimer(runCycle, startDelay);

    return () => {
      cancelled = true;
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  return <span className={className}>{display}</span>;
}

/* Typed-out line with a persistent blinking block cursor at the end —
   matches the existing `animate-blink` cursor used elsewhere (e.g.
   Work.jsx's "play showreel_2026.web" line). */
export function TypewriterText({ text, startDelay = 0, charMs = 32, className = "" }) {
  const reducedMotion = usePrefersReducedMotion();
  const [count, setCount] = useState(reducedMotion ? text.length : 0);

  useEffect(() => {
    if (reducedMotion) {
      setCount(text.length);
      return;
    }
    let cancelled = false;
    const startTimeout = setTimeout(() => {
      let i = 0;
      const step = () => {
        if (cancelled) return;
        i += 1;
        setCount(i);
        if (i < text.length) setTimeout(step, charMs);
      };
      step();
    }, startDelay);
    return () => {
      cancelled = true;
      clearTimeout(startTimeout);
    };
  }, [text, startDelay, charMs, reducedMotion]);

  return (
    <span className={className}>
      {text.slice(0, count)}
      <span className="inline-block w-2 h-4 -mb-0.5 ml-1 bg-accent animate-blink" />
    </span>
  );
}

/* Deterministic pseudo-random barcode — seeded LCG so bar widths stay
   stable across re-renders (same approach as MeshBackground.jsx).
   Purely decorative sci-fi/HUD flavor, not a real encoding. */
export function Barcode({ seed = 1, bars = 24, label, heightClass = "h-8", className = "" }) {
  let s = seed || 1;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const widths = Array.from({ length: bars }, () => ({
    w: rand() > 0.72 ? 3 : 1.5,
    h: 35 + rand() * 65,
  }));

  return (
    <div className={`select-none ${className}`} aria-hidden="true">
      <div className={`flex items-end gap-[2px] ${heightClass}`}>
        {widths.map((bar, i) => (
          <span
            key={i}
            className="bg-accent/70"
            style={{ width: `${bar.w}px`, height: `${bar.h}%` }}
          />
        ))}
      </div>
      {label && (
        <div className="font-mono text-[9px] tracking-[2px] text-muted/60 mt-1 whitespace-nowrap">
          {label}
        </div>
      )}
    </div>
  );
}

/* Sci-fi HUD corner brackets framing a `relative` parent — the parent
   needs its own padding so the brackets don't collide with content. */
export function CornerFrame({ className = "" }) {
  const corner = "absolute w-4 h-4 border-accent/40";
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      <span className={`${corner} top-0 left-0 border-t-2 border-l-2`} />
      <span className={`${corner} top-0 right-0 border-t-2 border-r-2`} />
      <span className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${corner} bottom-0 right-0 border-b-2 border-r-2`} />
    </div>
  );
}

/* One-shot vertical scan sweep — a soft light band that passes down
   through the parent once on mount, like a scanner reading the
   content. Plays once (not looped) to stay a "moment," not ambient
   noise. Parent needs `relative overflow-hidden`. */
export function ScanlineSweep({ className = "", delay = 0 }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <style>{`
        @keyframes decryptfx-scan {
          0%   { transform: translateY(-120%); opacity: 0; }
          8%   { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateY(620%); opacity: 0; }
        }
      `}</style>
      <div
        className="absolute inset-x-0 h-20 bg-gradient-to-b from-transparent via-accent/10 to-transparent"
        style={{ animation: `decryptfx-scan 4.6s ease-in-out ${delay}ms 1 both` }}
      />
    </div>
  );
}