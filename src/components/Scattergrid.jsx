import { useEffect, useRef, useState } from "react";


const SLOTS = [
  { left: 2,  topRatio: 0.02, width: 37, shape: "square" },
  { left: 3, width: 55, shape: "wide" }, // top computed dynamically
  { left: 60, topRatio: 0.05, width: 32, shape: "tall" },
];

// Fixed chrome clearance (px) for TiltCard's floating title plate
// above the card and its footer row below. Stays constant — it's
// fixed-size text/UI, not something that scales with card width.
const CHROME_CLEARANCE = 5;
// Small breathing room between the anchor row and the cascading tile
// below it — just enough to read as separate, not a big drop. Fixed
// px value, not proportional, on purpose.
const CASCADE_GAP = 10;
const BOTTOM_BUFFER = 2;

function aspectHeight(widthPx, shape) {
  if (shape === "tall") return widthPx * (4 / 3); // portrait, ~3:4
  if (shape === "square") return widthPx; // 1:1
  return widthPx * (9 / 16); // wide, 16:9
}

function slotBottom(slot, width) {
  const cardWidthPx = (slot.width / 100) * width;
  const cardHeightPx = aspectHeight(cardWidthPx, slot.shape);
  const topPx = (slot.topRatio ?? 0) * width;
  return topPx + cardHeightPx + CHROME_CLEARANCE;
}

// slot index 1 always sits below both anchors (0 and 2), regardless
// of how tall each anchor actually renders at the current width.
function getSlotTop(slotIndex, width) {
  if (slotIndex === 1) {
    return (
      Math.max(slotBottom(SLOTS[0], width), slotBottom(SLOTS[2], width)) +
      CASCADE_GAP
    );
  }
  return (SLOTS[slotIndex].topRatio ?? 0) * width;
}

/**
 * ScatterGrid
 *
 * Owns every placement decision for a list of items and exposes a
 * render-prop API so the parent only says what to draw, not where.
 * Interface is unchanged: children(item, { shape, index }).
 *
 * Layout strategy (Yasio-style, hardcoded slot pattern, measured
 * placement):
 *   - Exactly 3 tiles per category, each pinned to one of SLOTS above.
 *   - Desktop (md+): row width is measured via ResizeObserver. Anchor
 *     slots (0, 2) are positioned proportionally to that width. The
 *     cascading slot (1) is positioned below whichever anchor is
 *     taller at that width, plus a fixed gap — so it can never
 *     collide with them, at any size. Row height is likewise derived
 *     from the actual tallest content, not guessed.
 *   - Mobile (<md): simple full-width stack, since the scattered
 *     effect needs horizontal room to read.
 *   - If a category has more or fewer than 3 items, slots repeat via
 *     modulo so nothing breaks, but the layout is tuned for 3.
 *
 * Usage:
 *   <ScatterGrid items={arr} getKey={item => item.id}>
 *     {(item, { shape }) => <TiltCard shape={shape} ... />}
 *   </ScatterGrid>
 */
export default function ScatterGrid({
  items,
  getKey = (item, i) => item.id ?? i,
  children,
}) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width;
      if (w) setWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  let rowHeight = 0;
  if (width > 0) {
    rowHeight =
      items.reduce((max, _item, i) => {
        const slotIndex = i % SLOTS.length;
        const slot = SLOTS[slotIndex];
        const cardWidthPx = (slot.width / 100) * width;
        const cardHeightPx = aspectHeight(cardWidthPx, slot.shape);
        const topPx = getSlotTop(slotIndex, width);
        return Math.max(max, topPx + cardHeightPx + CHROME_CLEARANCE);
      }, 0) + BOTTOM_BUFFER;
  }

  return (
    <div
      ref={containerRef}
      className="relative md:h-[var(--h)]"
      style={{ "--h": `${rowHeight}px` }}
    >
      <div className="pointer-events-none absolute left-0 top-1 bottom-1 w-px bg-border/60 hidden md:block" />

      {items.map((item, i) => {
        const key = getKey(item, i);
        const slotIndex = i % SLOTS.length;
        const { left, width: wPct, shape } = SLOTS[slotIndex];
        const topPx = getSlotTop(slotIndex, width);

        return (
          <div
            key={key}
            className="w-full mt-10 first:mt-0 md:absolute md:mt-0 md:w-[var(--w)] md:left-[var(--l)] md:top-[var(--t)]"
            style={{
              "--w": `${wPct}%`,
              "--l": `${left}%`,
              "--t": `${topPx}px`,
            }}
          >
            {children(item, { shape, index: i })}
          </div>
        );
      })}
    </div>
  );
}