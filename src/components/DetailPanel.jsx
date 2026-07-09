import { ArrowLeft, ArrowRight, ExternalLink, Play } from "lucide-react";
import { forwardRef, useState } from "react";
import { motion } from "framer-motion";

const DetailPanel = forwardRef(function DetailPanel(
  { project, onClose, onPrev, onNext },
  ref
) {
  // Tracks whether the scrollable content has been scrolled away from the
  // top, so the close button can fade to a lighter/transparent state once
  // it's no longer sitting right at the edge of freshly-opened content.
  const [scrolled, setScrolled] = useState(false);

  if (!project) return null;

  const handleScroll = (e) => {
    setScrolled(e.currentTarget.scrollTop > 8);
  };

  return (
    <motion.div
      ref={ref}
      className="fixed inset-0 z-[200] flex flex-col md:flex-row"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} project details`}
      // Mounts invisible while covered by ProjectTransition's blackout.
      // The fade-in itself is NOT declared here — it's triggered
      // imperatively from App.jsx, in the same synchronous block of
      // code that fades the blackout overlay out. Two separate
      // components each animating off their own `animate` prop would
      // mean coordinating them through a React state update (a prop
      // change has to round-trip through a re-render before the second
      // animation even starts), which is exactly what let the main
      // page peek through for a frame or two between the blackout and
      // the panel. Driving both from one ref-based call removes that
      // gap entirely — there's no render round-trip for either side to
      // lag behind.
      initial={{ opacity: 0, scale: 0.985 }}
      exit={{ opacity: 0, scale: 0.985, transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] } }}
    >
      {/* Live preview side — embeds the project's own HTML page via
          project.previewUrl. This can be a full hosted URL, or just a
          path to a static file living in your app's /public folder
          (e.g. "/previews/ai-annotate-landing.html") — the browser
          treats both the same way, no code is inlined into the bundle.
          The iframe is its own document, so it scrolls independently:
          wheel/touch input over it scrolls *that* page, never the info
          panel behind it, and scrolling the info panel never reaches
          into the iframe. */}
      <div
        className="relative flex-1 md:flex-[1.4] min-h-[220px] flex flex-col shadow-panel overflow-hidden"
        style={{ background: project.previewUrl ? "#000" : project.gradient }}
      >
        {/* Light glass strip floating over the preview — the page itself
            runs the full height underneath it, rather than being pushed
            down by a bar in normal flow. */}
        <div className="absolute top-0 left-0 right-0 z-20 flex gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
        </div>

        {project.previewUrl ? (
          <div className="absolute inset-0">
            <iframe
              key={project.previewUrl}
              title={`${project.name} preview`}
              src={project.previewUrl}
              className="w-full h-full border-0 block"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              loading="lazy"
              // These are boundary events on the iframe element itself in
              // the parent document, so they fire regardless of whether
              // the preview is same-origin or a remote URL. Preview pages
              // tend to be light-background, so the cursor flips to black
              // here and back to the site's normal color on leave.
              onMouseEnter={() =>
                window.dispatchEvent(
                  new CustomEvent("customcursor:surface", { detail: { light: true } })
                )
              }
              onMouseLeave={() =>
                window.dispatchEvent(
                  new CustomEvent("customcursor:surface", { detail: { light: false } })
                )
              }
              onLoad={(e) => {
                const iframe = e.currentTarget;
                try {
                  const doc = iframe.contentDocument;
                  if (!doc) return;

                  // Hide the scrollbar, and hide the native cursor so the
                  // app's custom ring/dot (forwarded in below) reads as
                  // the only pointer, instead of both showing at once.
                  const style = doc.createElement("style");
                  style.textContent = `
                    html { scrollbar-width: none; }
                    body::-webkit-scrollbar, html::-webkit-scrollbar { display: none; }
                    * { cursor: none !important; }
                  `;
                  doc.head.appendChild(style);

                  // mousemove over an iframe never reaches the parent
                  // window natively — it's a separate document. Since
                  // this preview is same-origin, we can listen inside it
                  // directly and re-dispatch the position (translated
                  // into page coordinates via the iframe's own rect) as
                  // a window-level custom event that CustomCursor.jsx
                  // listens for. This is what lets the custom cursor
                  // glide across the preview instead of disappearing at
                  // its edge.
                  const forwardMove = (ev) => {
                    const rect = iframe.getBoundingClientRect();
                    window.dispatchEvent(
                      new CustomEvent("customcursor:move", {
                        detail: { x: rect.left + ev.clientX, y: rect.top + ev.clientY },
                      })
                    );
                  };
                  const forwardHover = (ev) => {
                    const hovering = !!ev.target.closest(
                      "a, button, input, textarea, select, [role='button']"
                    );
                    window.dispatchEvent(
                      new CustomEvent("customcursor:hover", { detail: { hovering } })
                    );
                  };
                  const forwardLeave = () => {
                    window.dispatchEvent(
                      new CustomEvent("customcursor:hover", { detail: { hovering: false } })
                    );
                  };

                  doc.addEventListener("mousemove", forwardMove);
                  doc.addEventListener("mouseover", forwardHover);
                  doc.addEventListener("mouseleave", forwardLeave);
                } catch (err) {
                  // Cross-origin preview — can't reach into its document,
                  // so the browser's native cursor shows there instead.
                }
              }}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <div className="text-3xl md:text-5xl font-bold">{project.name}</div>
            <div className="text-muted mt-2">{project.full}</div>
          </div>
        )}
      </div>

      {/* Info side */}
      <div className="relative flex-1 min-h-0 md:w-[520px] md:flex-none bg-bg border-l border-border flex flex-col shadow-panel">
        <button
          onClick={onClose}
          aria-label="Close"
          className={
            "absolute top-6 left-3 z-10 w-9 h-9 rounded-full flex items-center justify-center " +
            "transition-all duration-300 hover:scale-105 " +
            (scrolled
              ? "bg-white/10 text-text/60 shadow-none backdrop-blur-sm"
              : "bg-accent text-bg shadow-glow-sm")
          }
        >
          <ArrowLeft size={16} />
        </button>

        {/* Scrollable content — everything that can grow with copy length
            lives in here, so a long description never pushes the video
            link or the VISIT button out of view; only this block scrolls. */}
        <div
          onScroll={handleScroll}
          className="flex-1 min-h-0 overflow-y-auto scrollbar-hide p-8 md:p-10 md:pl-12 pb-0"
        >
          <div className="flex gap-3 self-end justify-end mb-10 md:mb-16">
            <button
              onClick={onPrev}
              aria-label="Previous project"
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center
                text-muted hover:text-accent hover:border-accent transition-colors"
            >
              <ArrowLeft size={14} />
            </button>
            <button
              onClick={onNext}
              aria-label="Next project"
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center
                text-muted hover:text-accent hover:border-accent transition-colors"
            >
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="font-mono text-sm text-muted mb-3 leading-relaxed">
            {project.tags.join("  ")}
          </div>
          <h3 className="text-3xl md:text-4xl font-bold mb-5">{project.name}</h3>
          <p className="text-base md:text-[17px] text-muted leading-relaxed mb-6">
            {project.description}
          </p>

          <ul className="space-y-2.5 mb-6">
            {project.features.map((f, i) => (
              <li key={i} className="text-base text-text/90">
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Pinned action footer — always visible regardless of how long
            the description/features above are; only the block above
            scrolls to reach it. Video + Visit sit side by side, with the
            category/index marked off underneath by a rule that runs in
            from the left edge to meet the label. */}
        <div className="shrink-0 p-8 md:p-10 md:pl-12 pt-4 border-t border-border/60 bg-bg">
          <div className="flex items-center gap-5 mb-6">
            <a
              href={project.link || "#"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-accent text-bg
                font-bold text-sm rounded-full px-8 py-3 w-fit shadow-glow hover:brightness-110
                transition-all"
            >
              VISIT <ExternalLink size={14} />
            </a>

            {project.video && (
              <button className="flex items-center gap-2 text-accent text-sm w-fit hover:underline">
                <Play size={12} /> See Video
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-white" />
            <div className="font-mono text-xs text-muted whitespace-nowrap">
              {project.category}/{project.index}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default DetailPanel;