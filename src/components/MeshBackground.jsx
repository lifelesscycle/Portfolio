/* Per-section backdrop, crossfaded as the visitor scrolls between
   sections. "start" (the hero/landing section) keeps its own quiet
   wash with no texture, and "contact" keeps its own centered purple
   glow. Work, Lab and About share one consistent look — Lab's
   blue-violet glow (top-right placement) plus its dot-grid texture —
   so that stretch of the page reads as one continuous "room."
   Layers are stacked and only ever animate opacity, since browsers
   can't interpolate between two different gradients/patterns. */
const BACKDROPS = {
  start: {
    wash: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(94,156,137,0.02), rgba(7,7,10,0) 65%)",
    bars: false,
  },
  work: {
    wash: "radial-gradient(ellipse 80% 60% at 78% 12%, rgba(96,108,150,0.045), rgba(7,7,10,0) 68%)",
    bars: true,
  },
  lab: {
    wash: "radial-gradient(ellipse 80% 60% at 78% 12%, rgba(96,108,150,0.045), rgba(7,7,10,0) 68%)",
    bars: true,
  },
  about: {
    wash: "radial-gradient(ellipse 80% 60% at 78% 12%, rgba(96,108,150,0.045), rgba(7,7,10,0) 68%)",
    bars: true,
  },
  contact: {
    wash: "radial-gradient(ellipse 60% 55% at 50% 45%, rgba(108,88,132,0.05), rgba(7,7,10,0) 65%)",
    bars: false,
  },
};

const SECTION_ORDER = ["start", "work", "lab", "about", "contact"];

/* Ambient light bars — replaces the old dot-grid texture for
   Work/Lab/About. Soft, wide, sparse vertical streaks in the same
   blue-violet / purple hues already used for those sections' wash and
   the contact glow — so it reads as the same light system bleeding
   through, not a new decorative pattern. Positions/timings are seeded
   so the bars are stable across re-renders, same approach as the
   triangle/diamond mesh below.

   Motion is two combined animations rather than a static glow:
   - barFlow: a repeating vertical gradient scrolling through the bar
     (background-position), so light appears to travel and ripple
     inside the beam like a flowing wave rather than just fading in/out.
   - barSway: a slow, small horizontal drift, so the whole bar leans
     side to side like it's being pushed by a current.
   Each bar gets its own randomized durations/delays so they never
   sync up and read as one mechanical loop. */
function LightBars() {
  const bars = [];
  let seed = 19;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const BAR_COUNT = 4; // sparser than before
  for (let i = 0; i < BAR_COUNT; i++) {
    const left = 12 + (i / (BAR_COUNT - 1)) * 76 + (rand() - 0.5) * 8;
    const spread = 120 + rand() * 90; // wider blurred beam, px
    const flowDuration = 12 + rand() * 8;
    const flowDelay = -rand() * flowDuration;
    const swayDuration = 18 + rand() * 10;
    const swayDelay = -rand() * swayDuration;
    // Same two families as before (blue-violet / purple) but pulled
    // down in saturation and brightness — a muted slate and a muted
    // aubergine, so the bars read as depth rather than as neon.
    const hue = i % 2 === 0 ? "96,108,150" : "108,88,132";
    bars.push(
      <div
        key={i}
        className="absolute top-0 bottom-0"
        style={{
          left: `${left}%`,
          width: `${spread}px`,
          marginLeft: `-${spread / 2}px`,
        }}
      >
        <div
          className="light-bar-flow absolute inset-0"
          style={{
            background: `repeating-linear-gradient(180deg, transparent 0px, rgba(${hue},0.065) 70px, transparent 140px)`,
            filter: "blur(28px)",
            animationDuration: `${flowDuration}s, ${swayDuration}s`,
            animationDelay: `${flowDelay}s, ${swayDelay}s`,
          }}
        />
      </div>
    );
  }
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {bars}
    </div>
  );
}

export function SectionTint({ active }) {
  return (
    <div className="fixed inset-0 z-[1] pointer-events-none" aria-hidden="true">
      {SECTION_ORDER.map((id) => {
        const b = BACKDROPS[id];
        const isActive = active === id;
        return (
          <div key={id}>
            <div
              className="absolute inset-0 transition-opacity duration-[1400ms] ease-out"
              style={{ background: b.wash, opacity: isActive ? 1 : 0 }}
            />
            {b.bars && (
              <div
                className="absolute inset-0 transition-opacity duration-[1400ms] ease-out"
                style={{ opacity: isActive ? 1 : 0 }}
              >
                <LightBars />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* Deterministic pseudo-random low-poly triangle mesh — landing page only.
   Uses a seeded LCG so the mesh is stable across re-renders. */
function TriangleMesh() {
  const tris = [];
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < 46; i++) {
    const x1 = rand() * 100;
    const y1 = rand() * 100;
    const x2 = x1 + (rand() - 0.5) * 26;
    const y2 = y1 + (rand() - 0.5) * 26;
    const x3 = x1 + (rand() - 0.5) * 26;
    const y3 = y1 + (rand() - 0.5) * 26;
    const light = rand() > 0.5;
    tris.push(
      <polygon
        key={i}
        points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
        fill={light ? "rgba(94,156,137,0.025)" : "rgba(0,0,0,0.26)"}
      />
    );
  }
  return (
    <svg
      className="mesh-bg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {tris}
    </svg>
  );
}

/* Deterministic pseudo-random diamond mesh — used for every section after
   the landing page. Deliberately mirrors the triangle mesh's restraint:
   same seeded-LCG approach, same sparse count, same large scale, same flat
   fills with no strokes, same low opacity range. Only the polygon shape
   (rugged diamond instead of triangle) and the addition of two soft ambient
   glows (teal + deep purple, blended at the same low opacity as everything
   else here) change — so the page reads as "same system, next room," not
   a different visual language. */
function DiamondMesh() {
  const shapes = [];
  let seed = 41;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  // Two soft ambient glows, matched to the wash colors used elsewhere on
  // the page (teal top area, deep purple lower area) — subtle enough to
  // read as atmosphere, not as decoration sitting on top of the mesh.
  shapes.push(
    <circle key="glow-teal" cx={78} cy={12} r={42} fill="url(#glow-teal)" />,
    <circle key="glow-purple" cx={18} cy={82} r={40} fill="url(#glow-purple)" />
  );

  // Rugged diamonds: large, sparse, irregular quadrilaterals, same scale
  // and count as the triangle mesh's polygons so density matches.
  for (let i = 0; i < 46; i++) {
    const cx = rand() * 100;
    const cy = rand() * 100;
    const rx = 6 + rand() * 10;
    const ry = 6 + rand() * 10;
    const jitter = () => (rand() - 0.5) * 5;
    const pts = [
      [cx + jitter(), cy - ry + jitter()], // top
      [cx + rx + jitter(), cy + jitter()], // right
      [cx + jitter(), cy + ry + jitter()], // bottom
      [cx - rx + jitter(), cy + jitter()], // left
    ]
      .map((p) => p.join(","))
      .join(" ");
    const light = rand() > 0.5;
    shapes.push(
      <polygon
        key={`d-${i}`}
        points={pts}
        fill={light ? "rgba(94,156,137,0.025)" : "rgba(0,0,0,0.26)"}
      />
    );
  }

  return (
    <svg
      className="mesh-bg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="glow-teal">
          <stop offset="0%" stopColor="rgba(94,156,137,0.045)" />
          <stop offset="100%" stopColor="rgba(127,217,196,0)" />
        </radialGradient>
        <radialGradient id="glow-purple">
          <stop offset="0%" stopColor="rgba(80,45,95,0.11)" />
          <stop offset="100%" stopColor="rgba(90,40,140,0)" />
        </radialGradient>
      </defs>
      {shapes}
    </svg>
  );
}

/* Crossfades between the two meshes the same way SectionTint crossfades
   backdrops: both layers always mounted, only opacity animates. Triangle
   mesh shows on "start", diamond mesh shows everywhere else. */
export default function MeshBackground({ active }) {
  const showTriangles = active === "start";
  return (
    <div className="fixed inset-0 z-[0] pointer-events-none" aria-hidden="true">
      <div
        className="absolute inset-0 transition-opacity duration-[1400ms] ease-out"
        style={{ opacity: showTriangles ? 1 : 0 }}
      >
        <TriangleMesh />
      </div>
      <div
        className="absolute inset-0 transition-opacity duration-[1400ms] ease-out"
        style={{ opacity: showTriangles ? 0 : 1 }}
      >
        <DiamondMesh />
      </div>
    </div>
  );
}