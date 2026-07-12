/* Per-section backdrop, crossfaded as the visitor scrolls between
   sections.

   UPDATE — "Signal Field" (the seeded starfield/constellation SVG that
   used to back work/lab/about/contact) has been replaced by
   EffectBackground: one real WebGL effect per section (Galaxy /
   LightRays / LightPillar / LaserFlow), instead of one shared field.
   The landing section ("start") is untouched — same TriangleMesh, same
   seed, same fills as before.

   Two structural rules carry over unchanged from the original file:
   layers are stacked and only ever animate opacity for crossfades (so
   two different-looking layers can blend without the browser having to
   interpolate between incompatible gradients), and every generated
   shape uses a small seeded LCG so it's stable across re-renders instead
   of reshuffling every time React re-renders this component. */

import EffectBackground from "./EffectBackground";

const BACKDROPS = {
  start: {
    wash: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(94,156,137,0.02), rgba(7,7,10,0) 65%)",
  },
  contact: {
    wash: "radial-gradient(ellipse 60% 55% at 50% 45%, rgba(90,40,140,0.045), rgba(7,7,10,0) 68%)",
  },
};

/* Shared seeded LCG — identical formula the original mesh functions each
   defined inline; pulled out once since this file now has more than two
   shapes that need one. */
function makeRand(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/* ================================================================
   Layer 0 (MeshBackground, default export) — structural shapes.
   start -> TriangleMesh (unchanged). everything else -> EffectBackground.
   ================================================================ */

/* Deterministic pseudo-random low-poly triangle mesh — landing page only.
   Byte-for-byte the same generation logic as before (same seed, same
   scale, same fills), just reusing the shared makeRand helper. */
function TriangleMesh() {
  const rand = makeRand(7);
  const tris = [];
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

/* Crossfades between the landing triangle mesh and the per-section WebGL
   effect layer. Same mechanism the original file used for
   Triangle <-> SignalField: TriangleMesh stays always-mounted with only
   opacity animating; EffectBackground manages its own mount/unmount
   lifecycle internally since its layers are WebGL, not free SVG/CSS. */
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
      <EffectBackground active={active} />
    </div>
  );
}

/* ================================================================
   Layer 1 (SectionTint, named export) — color / light.
   start keeps its original wash. work/lab/about share one slow aurora
   glow. contact keeps a residual wash; its signature orb has been
   removed — the laser layer in EffectBackground.jsx carries the
   section on its own now.
   ================================================================ */

/* Two glows, each built from a soft halo + a brighter, tighter core —
   replaces the old repeating-gradient light bars. Same two hues the bars
   used (slate blue-violet + aubergine), now expressed as drifting light.
   Only `transform` and `opacity` ever animate, so all four blobs stay
   compositor-only regardless of blur radius. */
function AuroraGlow() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="aurora-blob aurora-blob--halo aurora-blob--a-halo" />
      <div className="aurora-blob aurora-blob--core aurora-blob--a-core" />
      <div className="aurora-blob aurora-blob--halo aurora-blob--b-halo" />
      <div className="aurora-blob aurora-blob--core aurora-blob--b-core" />
    </div>
  );
}

/* UPDATE — the signature orb that used to sit here has been removed
   entirely. Contact's identity now comes purely from the laser layer
   in EffectBackground.jsx (fog widened, core beam glow pulled back —
   see that file for the reasoning), plus the residual wash below. */

export function SectionTint({ active }) {
  const showAurora = active === "work" || active === "lab" || active === "about";
  const showContactWash = active === "contact";
  const showStartWash = active === "start";

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none" aria-hidden="true">
      <div
        className="absolute inset-0 transition-opacity duration-[1400ms] ease-out"
        style={{ background: BACKDROPS.start.wash, opacity: showStartWash ? 1 : 0 }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-[1400ms] ease-out"
        style={{ background: BACKDROPS.contact.wash, opacity: showContactWash ? 1 : 0 }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-[1400ms] ease-out"
        style={{ opacity: showAurora ? 1 : 0 }}
      >
        <AuroraGlow />
      </div>
      {/* Always-on vignette — pulls the frame edges toward black so the
          glow/stars read as light in a dark room rather than a gray
          wash filling the screen. Not crossfaded; applies the same on
          every section, including start. */}
      <div className="absolute inset-0 vignette" />
    </div>
  );
}