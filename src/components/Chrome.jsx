import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE, NAV_ITEMS } from "../data/content";

export function Logo({ visible }) {
  return (
    <div
      className="fixed top-6 left-6 md:top-8 md:left-10 z-50 font-mono font-bold text-lg select-none
        transition-transform duration-300 ease-out"
      style={{
        // A percentage-based translateY is relative to this element's own
        // height — and this is only a single line of text (~24px tall),
        // so "-140%" only ever moved it up ~34px. Since it's also
        // positioned top-6/top-8 (24-32px) down from the viewport edge,
        // hiding barely cleared that offset: the element landed right at
        // y≈0, clipped by the viewport instead of actually leaving it.
        // A fixed px value well past both the offset and element height
        // guarantees it's fully gone, regardless of the element's own size.
        transform: visible ? "translateY(0)" : "translateY(-120px)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <span className="text-accent">{"<"}</span>
      {SITE.logoTag}
      <span className="text-accent">{"/>"}</span>
    </div>
  );
}

export function TopNav({ active, onNavigate, visible }) {
  return (
    <nav
      className="fixed top-6 right-6 md:top-8 md:right-10 z-50 flex gap-5 md:gap-7
        transition-transform duration-300 ease-out"
      style={{
        // See Logo's comment above — same self-relative percentage bug.
        transform: visible ? "translateY(0)" : "translateY(-120px)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={
            "font-mono text-xs md:text-sm tracking-wide transition-colors " +
            (active === item.id
              ? "text-text font-bold"
              : "text-muted hover:text-accent-light")
          }
        >
          {item.label} <span className="text-accent">{"/>"}</span>
        </button>
      ))}
    </nav>
  );
}

export function Rail({ activeIndex }) {
  const percent =
    NAV_ITEMS.length > 1 ? (activeIndex / (NAV_ITEMS.length - 1)) * 100 : 0;
  const label = NAV_ITEMS[activeIndex]?.label ?? "";

  return (
    <div className="rail-line hidden md:block" aria-hidden="true">
      <div className="rail-dot" style={{ top: `${percent}%` }} />
      <div className="rail-label" style={{ top: `${percent}%` }}>
        {label} <span className="text-accent">/&gt;</span>
      </div>
    </div>
  );
}

export function ScrollCue({ visible }) {
  if (!visible) return null;
  return (
    <div className="fixed left-[34px] bottom-10 z-40 hidden md:flex flex-col items-center gap-3">
      <div className="mouse-icon" />
      <span className="font-mono text-[10px] tracking-[3px] text-muted [writing-mode:vertical-rl] rotate-180">
        SCROLL
      </span>
    </div>
  );
}

// TODO: if the address already lives in SITE (data/content.js), swap this
// for SITE.email instead of duplicating it here.
const CONTACT_EMAIL = "aaryanema2004@gmail.com";

// Collapsed = the original vertical "Contact Me />" pill.
// Expanded = the same element morphed into a small contact form, still
// anchored to the right edge, so it reads as one badge opening up rather
// than a separate panel appearing from nowhere.
const PANEL_CLOSED = { width: 40, height: 150 };
const PANEL_OPEN = { width: 340, height: 460 };

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// The whole badge is one motion.div whose width/height are driven directly
// by `animate` between the two fixed pixel targets above — deliberately
// NOT using Framer's `layout` prop or height: "auto". Layout animations
// FLIP-scale the box (and everything inside it) between its old and new
// bounding rects, which reads badly here: the vertical writing-mode text
// and the form's borders would visibly skew mid-scale. Fixed pixel targets
// sidestep that — the box just tweens between two known sizes, and the
// inner content (also pixel-sized below, not %-based) gets progressively
// revealed by the parent's overflow-hidden rather than squashed to fit.
const MORPH_TRANSITION = prefersReducedMotion
  ? { duration: 0.01 }
  : { duration: 0.5, ease: [0.16, 0.6, 0.2, 1] };

export function SideBadge() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const nameInputRef = useRef(null);

  // Close on Escape from anywhere on the page.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus the first field once the panel has more or less finished opening.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => nameInputRef.current?.focus(), 250);
    return () => clearTimeout(t);
  }, [open]);

  // A beat after closing, wipe the form back to blank — so the next open
  // is always a clean slate instead of a stale "sent" confirmation. If the
  // panel reopens before this fires, the cleanup below cancels it, so a
  // quick close/reopen doesn't lose what was typed.
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setSent(false);
      setForm({ name: "", email: "", message: "" });
    }, MORPH_TRANSITION.duration * 1000);
    return () => clearTimeout(t);
  }, [open]);

  const updateField = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  // No backend wired up here, so this opens the visitor's own mail client
  // with the message pre-filled rather than pretending to submit silently.
  // Swap this for a fetch() to Formspree/EmailJS/your own endpoint if you'd
  // rather it send in-page without leaving the site.
  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio message from ${form.name}`);
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name} (${form.email})`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-bg/70 backdrop-blur-[2px] hidden lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        role={open ? "dialog" : undefined}
        aria-label={open ? "Contact form" : undefined}
        aria-modal={open}
        animate={open ? PANEL_OPEN : PANEL_CLOSED}
        transition={MORPH_TRANSITION}
        style={{ transformOrigin: "right center" }}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 border border-border bg-surface/90
          shadow-card backdrop-blur-sm overflow-hidden hidden lg:flex items-center justify-center
          rounded-l-md"
      >
        {/* mode="wait" so the collapsed label fully fades out before the
            form fades in — letting both crossfade at once looked like a
            flicker while the box was still mid-resize. */}
        <AnimatePresence mode="wait" initial={false}>
          {!open ? (
            <motion.button
              key="collapsed"
              type="button"
              onClick={() => setOpen(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-10 h-[150px] flex items-center justify-center text-[11px] font-mono
                tracking-[2px] text-muted [writing-mode:vertical-rl] hover:text-accent-light
                transition-colors"
            >
              {SITE.badge}
            </motion.button>
          ) : (
            <motion.form
              key="expanded"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, delay: 0.15 }}
              className="w-[340px] h-[460px] p-5 flex flex-col gap-3 font-mono"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] tracking-[2px] text-muted">
                  // contact_me
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close contact form"
                  className="text-muted hover:text-accent-light text-lg leading-none transition-colors"
                >
                  ×
                </button>
              </div>

              {sent ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
                  <span className="text-accent text-xl">✓</span>
                  <p className="text-sm text-text">Message ready.</p>
                  <p className="text-xs text-muted leading-relaxed px-2">
                    Your email app should have opened, everything filled
                    in — just hit send there.
                  </p>
                </div>
              ) : (
                <>
                  <label className="flex flex-col gap-1">
                    <span className="text-[10px] tracking-[1.5px] text-muted">
                      NAME
                    </span>
                    <input
                      ref={nameInputRef}
                      required
                      name="name"
                      autoComplete="name"
                      value={form.name}
                      onChange={updateField("name")}
                      placeholder="jane_doe"
                      className="bg-transparent border border-border rounded px-2.5 py-1.5 text-sm
                        text-text placeholder:text-muted/50 outline-none focus:border-accent
                        focus:shadow-[0_0_12px_rgba(127,217,196,0.35)] transition-colors"
                    />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-[10px] tracking-[1.5px] text-muted">
                      EMAIL
                    </span>
                    <input
                      required
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={updateField("email")}
                      placeholder="jane@doe.com"
                      className="bg-transparent border border-border rounded px-2.5 py-1.5 text-sm
                        text-text placeholder:text-muted/50 outline-none focus:border-accent
                        focus:shadow-[0_0_12px_rgba(127,217,196,0.35)] transition-colors"
                    />
                  </label>

                  <label className="flex flex-col gap-1 flex-1">
                    <span className="text-[10px] tracking-[1.5px] text-muted">
                      MESSAGE
                    </span>
                    <textarea
                      required
                      name="message"
                      value={form.message}
                      onChange={updateField("message")}
                      placeholder="say hello..."
                      className="bg-transparent border border-border rounded px-2.5 py-1.5 text-sm
                        text-text placeholder:text-muted/50 outline-none focus:border-accent
                        focus:shadow-[0_0_12px_rgba(127,217,196,0.35)] transition-colors resize-none
                        flex-1"
                    />
                  </label>

                  <button
                    type="submit"
                    className="bg-accent text-bg font-bold text-xs tracking-[1.5px] rounded-full
                      py-2.5 hover:bg-accent-light transition-colors"
                  >
                    SEND
                  </button>
                </>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}