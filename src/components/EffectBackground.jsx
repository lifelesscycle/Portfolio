import { useEffect, useRef, useState } from "react";
import { Galaxy } from "./effects/Galaxy";
import { LightPillar } from "./effects/LightPillar";
import { LaserFlow } from "./effects/LaserFlow";

/* UPDATE — work/lab/about no longer get three different effects
   (galaxy / rays / pillar). All three now share the same combined
   galaxy+pillar layer, so the only two effects mounted anywhere in the
   site are that combo and contact's laser. LightRays is no longer used
   here at all. */
const SECTION_EFFECT = {
  work: "galaxy",
  lab: "galaxy",
  about: "galaxy",
  contact: "laser",
};

// UPDATE — cut from 1400ms to 700ms. These layers are real WebGL
// contexts, not free CSS/SVG like the rest of MeshBackground: during a
// crossfade, the outgoing and incoming layer are BOTH rendering every
// frame for the full fade window. A long overlap between two (or,
// briefly, three — see the "galaxy" case below) heavy shaders was the
// main source of the constant background lag and the flash on the
// about<->contact transition specifically, since that's the one crossfade
// where a 2-canvas layer (galaxy+pillar) and a 1-canvas layer (laser) were
// both fully live at once. Halving the overlap halves how long that
// worst case lasts.
const FADE_MS = 700;

/* Colors are pulled straight from the existing palette (index.css /
   MeshBackground.jsx) rather than the demo defaults, so this reads as
   "the same site" rather than unrelated snippets:
     #7fd9c4 / #9fe0c6 — bright teal (signal-star, rail, cursor ring)
     #5e9c89            — rgba(94,156,137) muted teal, the "start" wash
     #6c5884            — rgba(108,88,132) aubergine aurora-blob B */
function EffectLayer({ kind }) {
  switch (kind) {
    case "galaxy":
      // Shared work/lab/about backdrop. Galaxy renders first (sparse,
      // dim stars) with LightPillar layered on top of it — painted
      // after, so the pillar visually overlaps the star field instead
      // of sitting behind it. Both stay low-intensity/transparent so
      // the overlap reads as one soft scene rather than two effects
      // fighting for attention.
      //
      // quality="low" here (was "medium"): this pillar sits at 0.1
      // intensity behind a transparent scene, so the drop in
      // iterations/resolution isn't visible — but running it alongside
      // Galaxy continuously for three whole sections was the main
      // source of the constant lag, since two raymarched shaders were
      // running every frame instead of one.
      //
      // Galaxy itself had no throttle at all in the base engine — full
      // container resolution, one full shader pass per rAF regardless
      // of display refresh rate. resolutionScale/maxFPS below cut both:
      // rendered at 65% resolution then CSS-stretched back up, capped
      // to 30 renders/sec instead of running at 120Hz+ on capable
      // displays. Neither is visible at this glow/twinkle level, since
      // the motion is already slow and soft-edged.
      return (
        <>
          <Galaxy
            density={0.35}
            hueShift={158}
            saturation={0.05}
            speed={0.025}
            starSpeed={0.1}
            glowIntensity={0.125}
            twinkleIntensity={0.15}
            rotationSpeed={0.04}
            mouseInteraction={false}
            mouseRepulsion={false}
            resolutionScale={0.65}
            maxFPS={30}
            transparent
          />
          <LightPillar
            topColor="#7fd9c4"
            bottomColor="#5e9c89"
            intensity={0.7}
            rotationSpeed={0.052}
            interactive={false}
            glowAmount={0.0016}
            pillarWidth={10.5}
            pillarHeight={0.85}
            noiseIntensity={0.8}
            pillarRotation={225}
            quality="low"
          />
        </>
      );
    case "laser":
      // Recolored from the demo's pink (#FF79C6) to the site's own muted
      // teal (#5e9c89 == rgba(94,156,137), already used for the "start"
      // wash) so Contact's beam reads as part of the same family as the
      // rest of the page.
      //
      // The orb that used to sit in front of this is gone now (see
      // MeshBackground.jsx), so the laser carries the section on its
      // own: fog pushed wider and brighter (fogIntensity up, fogScale
      // down so the noise features are larger and spread further past
      // the beam's edges) while the core beam itself is pulled in
      // (falloffStart down, wispIntensity down) so it reads as soft
      // ambient spill rather than a bright glowing column.
      // dpr capped at 1: this shader's cost is fixed-per-pixel (5-octave
      // fog noise + wisp loops with no exposed iteration count), so on a
      // retina display the uncapped default (dpr 2) was pushing 4x the
      // pixel count for no visible gain at this size/opacity.
      return (
        <LaserFlow
          color="#acb4b186"
          dpr={1}
          wispDensity={0.8}
          flowSpeed={0.2}
          verticalSizing={4}
          horizontalSizing={4.2}
          fogIntensity={0.65}
          fogScale={0.66}
          wispSpeed={0.55}
          wispIntensity={7.8}
          flowStrength={0}
          decay={1.1}
          falloffStart={0.85}
          followMouse={false}
          mouseTiltStrength={0}
          horizontalBeamOffset={0}
          verticalBeamOffset={-0.5}
        />
      );
    default:
      return null;
  }
}

/* Crossfades between whichever single WebGL effect the active section
   maps to. These are real WebGL contexts (not CSS/SVG like the rest of
   MeshBackground), so — unlike TriangleMesh/SignalField, which could
   stay permanently mounted and just cross-fade opacity — this only ever
   keeps the outgoing effect mounted for the duration of the fade, then
   unmounts it. Note the "galaxy" case is itself two canvases (Galaxy +
   LightPillar), so the worst case during a start<->galaxy or
   galaxy<->laser transition is three live contexts for the FADE_MS
   window, not one — see the quality/dpr notes on those cases above for
   how that's kept affordable, and the shortened FADE_MS for how that
   window is kept short.

   No file in this tree reads pointer position by default: every effect
   defaults its mouse-tracking prop to false, so this stack is a pure
   function of `active`. */
export default function EffectBackground({ active }) {
  const kind = SECTION_EFFECT[active];
  const [layers, setLayers] = useState(() => (kind ? [{ kind, id: kind }] : []));
  const timeoutsRef = useRef(new Map());

  useEffect(() => {
    if (!kind) return;
    setLayers((prev) => (prev.some((l) => l.kind === kind) ? prev : [...prev, { kind, id: `${kind}-${Date.now()}` }]));
  }, [kind]);

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    layers.forEach((l) => {
      if (l.kind !== kind && !timeouts.has(l.id)) {
        const t = setTimeout(() => {
          setLayers((prev) => prev.filter((x) => x.id !== l.id));
          timeouts.delete(l.id);
        }, FADE_MS + 60);
        timeouts.set(l.id, t);
      }
    });
  }, [layers, kind]);

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <>
      {layers.map((l) => (
        <div
          key={l.id}
          className="absolute inset-0 transition-opacity duration-[700ms] ease-out"
          style={{ opacity: l.kind === kind ? 1 : 0 }}
        >
          <EffectLayer kind={l.kind} />
        </div>
      ))}
    </>
  );
}