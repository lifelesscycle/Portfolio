import { ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ScrollDecryptText, Barcode, useInView } from "./DecryptFX";

/* Determines which edge (top/right/bottom/left) a point entered a box
   from, by checking which edge the point is closest to in normalized
   space. Used so hover-tilt direction feels "pushed" from the entry
   side rather than generically following the cursor. */
function entryEdge(rect, x, y) {
  const px = (x - rect.left) / rect.width;
  const py = (y - rect.top) / rect.height;
  const distances = { top: py, bottom: 1 - py, left: px, right: 1 - px };
  return Object.entries(distances).sort((a, b) => a[1] - b[1])[0][0];
}

// Open/close variants for the outer wrapper. Framer Motion drives these
// with its own rAF-based engine and resolves onAnimationComplete only
// when the animation has genuinely finished — this replaces the old
// approach of a CSS transition timed to match a setTimeout() in
// Work.jsx, which could (and did) race: React batching the "closing"
// prop flip back to false in the same tick the parent mounted the
// blackout overlay caused the tile to visibly revert to its resting
// state for a frame or two before the overlay was opaque enough to
// hide it.
const cardVariants = {
  hidden: { opacity: 0, x: -48, scale: 1 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
  },
  closing: {
    opacity: 0,
    scale: 0.86,
    x: 0,
    transition: { duration: 0.45, ease: [0.32, 0, 0.67, 0] },
  },
};

export default function TiltCard({
  gradient,
  image,
  name,
  index,
  onClick,
  shape = "standard",
  closing = false,
  onClosed,
}) {
  const ref = useRef(null);
  // Same element also drives its own pop-in + the name decrypt below,
  // so both fire off one shared trigger instead of two separate
  // observers that could fire a frame (or a threshold) apart.
  const [inViewRef, inView] = useInView({
    threshold: 0.3,
    rootMargin: "0px 0px -10% 0px",
    triggerOnce: true,
  });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50 });
  const [settled, setSettled] = useState(true);

  const handleEnter = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const edge = entryEdge(rect, e.clientX, e.clientY);
    // Kick the object away from the edge the cursor entered from, so the
    // tilt reads as "pushed" by the cursor rather than generic hover.
    const kick = {
      left: { x: 0, y: 20 },
      right: { x: 0, y: -20 },
      top: { x: 18, y: 0 },
      bottom: { x: -18, y: 0 },
    }[edge];
    setSettled(false);
    setTilt(kick);
  };

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    // Corner-push feel: pushing the top-right corner (positive px,
    // negative py) should lift the opposite (bottom-left) corner toward
    // the viewer. rotateX responds to vertical position, rotateY to
    // horizontal — combined, the diagonal corner the cursor is nearest
    // to visually presses "in" while the opposite corner rises.
    setTilt({ x: py * -22, y: px * 22 });
    setGlow({ x: (px + 0.5) * 100, y: (py + 0.5) * 100 });
  };

  const handleLeave = () => {
    setSettled(true);
    setTilt({ x: 0, y: 0 });
  };

  const transition = settled
    ? "transform 0.5s cubic-bezier(.22,1,.36,1)"
    : "transform 0.1s ease-out";

  return (
    // Perspective lives on this static outer wrapper — it must not itself
    // rotate, or the 3D vanishing point rotates with it and the effect
    // flattens out. Only the inner object below rotates. Motion here
    // only ever animates opacity/x/scale (entrance + close), never the
    // rotateX/rotateY tilt, so there's no conflict between Framer
    // Motion's animation engine and the manual mouse-tilt transform set
    // on the inner "object" wrapper further down.
    <motion.div
      ref={(node) => {
        ref.current = node;
        inViewRef.current = node;
      }}
      role="button"
      tabIndex={0}
      onMouseEnter={handleEnter}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
      className="group relative w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl"
      style={{ perspective: "800px" }}
      initial={false}
      variants={cardVariants}
      animate={closing ? "closing" : inView ? "visible" : "hidden"}
      onAnimationComplete={(definition) => {
        // Only the close animation needs to notify the parent — this
        // fires once the tile has truly finished shrinking away, so
        // Work.jsx can open the project exactly on cue instead of
        // guessing with a timer.
        if (definition === "closing") onClosed?.();
      }}
    >
      {/* Always-on ambient glow, faint at rest and blooming on hover — this
          is what pulls the eye toward tiles before the cursor ever reaches
          one, rather than relying on hover alone to create contrast. */}
      <div
        className="pointer-events-none absolute -inset-3 rounded-2xl -z-10 opacity-40 group-hover:opacity-90 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(closest-side, rgba(127,217,196,0.16), rgba(127,217,196,0) 75%)",
        }}
        aria-hidden="true"
      />

      {/* Ground shadow — a separate, flat (non-rotating) layer sitting
          beneath the tilting object. It shrinks + darkens while settled
          and spreads + softens on hover, mimicking the card lifting off
          the page. This is what actually sells the "floating tile"
          illusion — the rotation alone reads as flat without it. */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-[50%] z-0"
        style={{
          bottom: settled ? "-10px" : "-22px",
          width: "78%",
          height: shape === "tall" ? "34px" : "26px",
          background:
            "radial-gradient(closest-side, rgba(0,0,0,0.6), rgba(0,0,0,0) 72%)",
          filter: settled ? "blur(10px)" : "blur(16px)",
          opacity: settled ? 0.55 : 0.85,
          transform: `translate(-50%, 0) translateX(${tilt.y * 0.5}px) scale(${
            settled ? 1 : 1.12
          })`,
          transition,
        }}
        aria-hidden="true"
      />

      {/* The rigid 3D object: card face + floating title + footer all live
          in here and share the same rotateX/rotateY, each offset on its
          own Z layer so the whole thing reads as one tilting object
          rather than a flat card with flat text glued on top. */}
      <div
        className="relative z-10"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition,
        }}
      >
        {/* floating title plate — sits above the card surface and drifts
            further out on hover, like a name-plate hovering in front of
            the tile */}
        <div
          className="absolute left-4 top-0 z-20 pointer-events-none"
          style={{
            transform: `translateY(-50%) translateZ(${settled ? 34 : 56}px)`,
            transition,
          }}
        >
          <span
            className="font-bold text-xl md:text-2xl tracking-tight text-text whitespace-nowrap
              bg-surface/90 border border-border rounded-full px-5 py-2 shadow-card backdrop-blur-sm"
          >
            <ScrollDecryptText text={name} charMs={58} active={inView} />
          </span>
        </div>

        {/* card face — outer div carries the hover lift (translateZ) only;
            it must NOT also carry overflow-hidden, since a transform and
            overflow-hidden on the same element can make browsers stop
            clipping at the rounded corners, letting content bleed past
            the edges. The inner div below has no transform of its own,
            so overflow-hidden + rounded-xl clip reliably. */}
        <div
          className={
            "relative w-full " +
            (shape === "tall"
              ? "aspect-[3/4]"
              : shape === "wide"
              ? "aspect-[16/9]"
              : shape === "square"
              ? "aspect-square"
              : "aspect-[4/3]")
          }
          style={{
            transform: `translateZ(${settled ? 0 : 22}px)`,
            transition,
          }}
        >
          <div
            className="absolute inset-0 rounded-xl overflow-hidden"
            style={{
              background: gradient,
              boxShadow: settled
                ? "0 14px 30px -14px rgba(0,0,0,0.55)"
                : "0 34px 60px -20px rgba(0,0,0,0.7), 0 0 44px -12px rgba(127,217,196,0.3)",
              transition,
            }}
          >
            {/* project image — gradient behind it stays as a fallback color
                (shows while the image loads, or if it fails / is omitted)
                and the chrome bar + vignette below still layer on top for
                legibility */}
            {image && (
              <img
                src={image}
                alt={name}
                className="absolute inset-0 pointer-events-none select-none"
                style={{
                  width: "100%",
                  height: "100%",
                  maxWidth: "none",
                  objectFit: "contain",
                  objectPosition: "center",
                }}
                loading="lazy"
                draggable={false}
              />
            )}

            {/* cursor-follow sheen */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(255,255,255,0.14), transparent 55%)`,
              }}
            />

            {/* faux window chrome */}
            <div className="absolute top-0 inset-x-0 flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-black/10">
              <span className="w-2 h-2 rounded-full bg-white/15" />
              <span className="w-2 h-2 rounded-full bg-white/15" />
              <span className="w-2 h-2 rounded-full bg-white/15" />
            </div>

            {/* subtle grain / vignette for depth */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
          </div>
        </div>

        {/* footer — index number, divider line, arrow — offset on its own
            Z layer so it visibly tilts as part of the same object instead
            of sitting flat underneath */}
        <div
          style={{
            transform: `translateZ(${settled ? 14 : 26}px)`,
            transition,
          }}
          className="pt-4"
        >
          <div className="h-0.5 bg-text/70 w-full" />
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Barcode seed={(parseInt(index, 10) || 0) + 3} bars={7} heightClass="h-3" className="opacity-60" />
              <span className="font-mono text-xs font-bold text-text">{index}</span>
            </div>
            <ArrowRight size={16} className="text-muted" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}