import { forwardRef } from "react";

/**
 * ProjectTransition
 *
 * Purely presentational now — just the full-screen blackout div, mounted
 * whenever `active` is true. It used to also own the fade-in/hold/
 * fade-out timing itself, driven by its own useAnimate() sequence. That
 * meant the panel's reveal (in DetailPanel) had to be triggered via a
 * separate callback -> React state update -> re-render -> new `animate`
 * prop, which is a round-trip that can land a frame or two after this
 * overlay's own fade-out has already started — exactly the gap that let
 * the main page flash through before the panel appeared.
 *
 * The fix: App.jsx now owns the whole open sequence and animates this
 * overlay's ref and DetailPanel's ref directly, in the same synchronous
 * block of code, so neither side can lag behind the other. This
 * component just needs to exist and expose its DOM node via ref.
 *
 * IMPORTANT: the covering color must be fully opaque at every point,
 * not just on average — the gradient below only varies hue, never
 * alpha, so the cover is always solid and the only thing that ever
 * animates is this element's own opacity.
 */
const ProjectTransition = forwardRef(function ProjectTransition({ active }, ref) {
  if (!active) return null;

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[300] pointer-events-none"
      style={{
        background: "radial-gradient(ellipse at center, #10171a 0%, #07070a 75%)",
        opacity: 0,
      }}
      aria-hidden="true"
    />
  );
});

export default ProjectTransition;