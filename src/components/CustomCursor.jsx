import { useEffect, useRef, useState } from "react";

const CIRCLE_SIZE = 44;
const DOT_SIZE = 6;
const HOVER_SCALE = 1.7;

// Chase feel: lower = looser/slower trail, higher = tighter/faster catch-up.
// 0.12–0.18 is the "visibly chasing" sweet spot; above ~0.3 it starts to
// look glued to the dot again.
const CHASE_SPEED = 0.15;
const TARGET_SELECTOR = [
  "a",
  "button",
  "input",
  "textarea",
  "select",
  "[data-cursor-hover]",
  ".tilt-shell",
  "[data-project-card]",
  "[data-lab-card]",
  "[data-nav-item]",
  "[role='button']",
].join(", ");
/* Ringed dot cursor. Dot snaps to the pointer instantly; the ring eases
   toward the dot's position every frame using simple lerp (not a spring),
   which is what makes the trail look smooth instead of springy/jittery. */
export default function CustomCursor() {
  const circleRef = useRef(null);
  const dotRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  const mouse = useRef({ x: 0, y: 0 });
  const circlePos = useRef({ x: 0, y: 0 });
  const scale = useRef(1);
  const targetScale = useRef(1);
  const hasMoved = useRef(false);
  // True while the pointer is over a light-background preview (e.g. an
  // embedded HTML page), so the cursor can flip to black there instead
  // of staying the site's usual accent color and disappearing against
  // a pale background.
  const onLightSurface = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setEnabled(mq.matches);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Shared by real mousemove and by positions forwarded from inside
    // same-origin iframes (see DetailPanel's iframe onLoad handler) —
    // both end up moving the dot/ring the same way.
    const updatePosition = (x, y) => {
      mouse.current.x = x;
      mouse.current.y = y;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x - DOT_SIZE / 2}px, ${
          y - DOT_SIZE / 2
        }px)`;
        dotRef.current.style.background = onLightSurface.current ? "#000" : "";
      }
      if (!hasMoved.current) {
        // snap the ring to the first known position so it doesn't animate
        // in from (0,0) the moment the page loads
        circlePos.current.x = x;
        circlePos.current.y = y;
        hasMoved.current = true;
      }
    };

    const move = (e) => updatePosition(e.clientX, e.clientY);

    const over = (e) => {
      targetScale.current = e.target.closest(TARGET_SELECTOR) ? HOVER_SCALE : 1;
    };

    // Embedded preview iframes are separate documents, so native mouse
    // events over them never reach this window. Same-origin previews
    // (DetailPanel.jsx) forward pointer position/hover state as these
    // custom events instead, translated into page coordinates, so the
    // cursor can glide across the preview instead of vanishing at its
    // edge.
    const onExternalMove = (e) => updatePosition(e.detail.x, e.detail.y);
    const onExternalHover = (e) => {
      targetScale.current = e.detail.hovering ? HOVER_SCALE : 1;
    };
    // Fired directly by any light-background preview element (e.g. the
    // iframe's onMouseEnter/onMouseLeave in DetailPanel.jsx) — this
    // boundary event works even for cross-origin iframes, since it's
    // just a normal DOM event on the iframe element itself.
    const onSurface = (e) => {
      onLightSurface.current = !!e.detail.light;
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("customcursor:move", onExternalMove);
    window.addEventListener("customcursor:hover", onExternalHover);
    window.addEventListener("customcursor:surface", onSurface);

    let frame;
    const tick = () => {
      // Pure lerp toward the mouse — this is the "chase" motion. Doing this
      // for x/y directly (rather than via velocity/acceleration) avoids the
      // overshoot/wobble that made the spring version feel jerky.
      circlePos.current.x += (mouse.current.x - circlePos.current.x) * CHASE_SPEED;
      circlePos.current.y += (mouse.current.y - circlePos.current.y) * CHASE_SPEED;

      // Scale eases separately and a bit faster, so growing on hover
      // doesn't feel like it's lagging the same amount as the position.
      scale.current += (targetScale.current - scale.current) * 0.2;

      if (circleRef.current) {
        const size = CIRCLE_SIZE * scale.current;
        const offset = size / 2;
        circleRef.current.style.width = `${size}px`;
        circleRef.current.style.height = `${size}px`;
        circleRef.current.style.transform = `translate(${
          circlePos.current.x - offset
        }px, ${circlePos.current.y - offset}px)`;
        circleRef.current.style.borderColor = onLightSurface.current ? "#000" : "";
      }

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("customcursor:move", onExternalMove);
      window.removeEventListener("customcursor:hover", onExternalHover);
      window.removeEventListener("customcursor:surface", onSurface);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={circleRef} className="ring-cursor-outer" aria-hidden="true" />
      <div ref={dotRef} className="ring-cursor-dot" aria-hidden="true" />
    </>
  );
}