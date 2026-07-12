import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, useAnimationControls } from "framer-motion";
import MeshBackground, { SectionTint } from "./components/MeshBackground";
import CustomCursor from "./components/CustomCursor";
import LoadingScreen from "./components/LoadingScreen";
import { Logo, TopNav, Rail, ScrollCue, SideBadge } from "./components/Chrome";
import Hero from "./components/Hero";
import Work from "./components/Work";
import Lab from "./components/Lab";
import About from "./components/About";
import Contact from "./components/Contact";
import DetailPanel from "./components/DetailPanel";
import ProjectTransition from "./components/ProjectTransition";
import { NAV_ITEMS, WORK_PROJECTS } from "./data/content";
import useDisableInspect from "./hooks/useDisableInspect"; 


export default function App() {
  useDisableInspect();

  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("start");
  const [detailProject, setDetailProject] = useState(null);
  const [navVisible, setNavVisible] = useState(true);
  // Drives the full-screen blackout that covers the moment a project tile
  // is opened. Rendered as a sibling of DetailPanel below (not nested
  // inside <main>) — <main> has `relative z-10`, which forms its own
  // stacking context, so anything rendered inside it (Work included) gets
  // painted as one sealed unit at level 10 no matter what z-index it
  // declares internally. That trapped the overlay below DetailPanel's
  // z-[200], which lives outside <main> — the transition never had a
  // chance to render on top. Living out here, at the same level as
  // DetailPanel, its z-[300] is finally compared against DetailPanel's
  // z-[200] directly, so it can actually cover it.
  const [projectTransitioning, setProjectTransitioning] = useState(false);
  // The open sequence below (fade overlay in -> hold -> fade overlay out
  // WHILE fading the panel in) drives both halves from the same
  // synchronous async function, rather than each component owning its
  // own animation off a `revealing`-style prop — two components each
  // reacting to their own prop meant the second animation only started
  // after a full React state update -> re-render round trip past the
  // first, enough of a gap for the page underneath to flash through for
  // a frame or two.
  //
  // The overlay (ProjectTransition) is a plain, non-animating div, so it's
  // safe to drive with the raw imperative animate(domNode, ...) via a ref
  // — nothing else ever writes to its style.opacity.
  //
  // The panel (DetailPanel) is a motion.div, which is NOT safe to drive
  // that way: motion.div owns its node's animated styles internally and
  // re-applies them on every one of that component's own re-renders
  // (DetailPanel re-renders itself on scroll). A raw animate(domNode, ...)
  // call never tells Framer's internal engine the target changed, so the
  // next re-render silently stomps the imperative animation back to
  // whatever Framer still thinks is current — that fight between the two
  // engines was what made the tile-to-panel transition read as one
  // jarring jump instead of two lockstepped beats. useAnimationControls()
  // fixes this: it's the same imperative trigger, but wired into
  // Framer's own `animate` prop, so its internal state and this
  // imperative call can never disagree.
  const overlayRef = useRef(null);
  const panelControls = useAnimationControls();
  const sectionRefs = useRef({});

  useEffect(() => {
    // threshold-based observation requires a fixed % of the *section's own
    // height* to be visible — but Work is now much taller than the
    // viewport (scattered card canvas), so it could never cross 0.4 and
    // the active section got stuck on "start". Using a thin horizontal
    // band at the vertical center of the viewport instead means a section
    // is "active" whenever it crosses the middle of the screen, regardless
    // of how tall it is.
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0, rootMargin: "-45% 0px -45% 0px" }
    );
    Object.values(sectionRefs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Hide the navbar while scrolling down, reveal it again on scroll up.
  // Always shown near the very top so it doesn't vanish immediately on load.
  // Polled every animation frame instead of driven by the "scroll" event —
  // some browsers/inputs (momentum scrolling, certain trackpads) don't fire
  // scroll events reliably enough for event-driven detection to feel
  // consistent, so this just reads window.scrollY every frame instead.
  useEffect(() => {
    // Frame-to-frame delta is too noisy to drive visibility directly —
    // momentum/trackpad scrolling decelerates unevenly, so delta can flip
    // sign from one frame to the next even while the user is net-scrolling
    // one way. Reacting to that noise meant setNavVisible fired almost
    // every frame, yanking the CSS transition back and forth before it
    // could ever finish — which is what read as the nav being stuck
    // "half shown, half hidden".
    //
    // Instead, accumulate movement since the last committed direction and
    // only flip once that accumulation clears a real threshold. Any tick
    // that moves against the current accumulation resets it rather than
    // subtracting, so a brief jitter can't slowly cancel out real intent
    // either.
    let lastY = window.scrollY;
    let anchorY = window.scrollY; // scrollY at the last direction commit
    let dir = 0; // -1 up, 1 down, 0 unset
    let frame;
    const THRESHOLD = 24; // px of net movement required to flip

    const tick = () => {
      const y = window.scrollY;
      const frameDelta = y - lastY;

      if (y < 80) {
        setNavVisible(true);
        anchorY = y;
        dir = 0;
      } else if (frameDelta !== 0) {
        const movingDir = frameDelta < 0 ? -1 : 1;

        if (movingDir !== dir) {
          // direction reversed (or first movement) — restart accumulation
          dir = movingDir;
          anchorY = lastY;
        }

        if (Math.abs(y - anchorY) > THRESHOLD) {
          setNavVisible(dir < 0);
          anchorY = y;
        }
      }

      lastY = y;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Lock body scroll while the project detail panel is open, or while the
  // intro loader is covering the page — same pattern, two reasons.
  useEffect(() => {
    document.body.style.overflow = detailProject || loading ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [detailProject, loading]);

  const scrollTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });
  };

  const openProject = (project) => {
    setDetailProject(project);
    setProjectTransitioning(true);
  };
  const closeProject = () => {
    setDetailProject(null);
  };

  // The open sequence itself. Runs once whenever projectTransitioning
  // flips true. By this point React has already committed the render
  // that mounted both the overlay (ProjectTransition) and the panel
  // (DetailPanel, inside AnimatePresence) — effects run after commit —
  // so overlayRef.current is attached and panelControls is already bound
  // to DetailPanel's motion.div before this fires.
  const FADE_IN_S = 0.7; // page receding into blackness — slow, on purpose
  const HOLD_S = 0.2;
  const FADE_OUT_S = 0.6; // blackness receding to reveal the panel
  const EASE = [0.16, 0.6, 0.2, 1];

  useEffect(() => {
    if (!projectTransitioning || !overlayRef.current) return;
    let cancelled = false;

    const run = async () => {
      await animate(overlayRef.current, { opacity: 1 }, { duration: FADE_IN_S, ease: EASE });
      if (cancelled) return;

      await new Promise((resolve) => setTimeout(resolve, HOLD_S * 1000));
      if (cancelled) return;

      // Both animations are started here, in the same synchronous block
      // — not one triggered by the other completing, and not one
      // waiting on a state update to reach the other component. That's
      // what guarantees they run in lockstep instead of drifting apart.
      // panelControls.start() goes through Framer's own engine (unlike a
      // raw animate() on the DOM node), so DetailPanel's later re-renders
      // (e.g. on scroll) can't stomp it mid-flight.
      const panelReveal = panelControls.start({
        opacity: 1,
        scale: 1,
        transition: { duration: FADE_OUT_S, ease: EASE },
      });
      const overlayFadeOut = animate(overlayRef.current, { opacity: 0 }, { duration: FADE_OUT_S, ease: EASE });

      await Promise.all([panelReveal, overlayFadeOut]);
      if (cancelled) return;

      setProjectTransitioning(false);
    };

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectTransitioning]);

  const step = (dir) => {
    if (!detailProject) return;
    const i = WORK_PROJECTS.findIndex((p) => p.id === detailProject.id);
    const next =
      WORK_PROJECTS[(i + dir + WORK_PROJECTS.length) % WORK_PROJECTS.length];
    setDetailProject(next);
  };

  const activeIndex = Math.max(
    0,
    NAV_ITEMS.findIndex((n) => n.id === active)
  );

  return (
    <>
      {loading && <LoadingScreen onFinish={() => setLoading(false)} />}

      <div className="cursor-none-desktop relative bg-bg text-text font-sans min-h-screen overflow-x-clip">
        <MeshBackground active={active} />
        <SectionTint active={active} />
        {!loading && <CustomCursor/>}

        <Logo visible={navVisible && !detailProject} />
        <TopNav active={active} onNavigate={scrollTo} visible={navVisible && !detailProject} />
        {!detailProject && <Rail activeIndex={activeIndex} />}
        <ScrollCue visible={active === "start" && !detailProject} />
        {!detailProject && <SideBadge />}

        <main className="relative z-10">
          {/* Everything except the final Contact section lives inside this
              centered column, leaving clear margin on both sides on wide
              screens so nothing sits flush against the browser's scrollbar. */}
          <div className="max-w-[1300px] mx-auto">
            <Hero sectionRef={(el) => (sectionRefs.current.start = el)} />
            <Work
              sectionRef={(el) => (sectionRefs.current.work = el)}
              onOpenProject={openProject}
            />
            <Lab sectionRef={(el) => (sectionRefs.current.lab = el)} />
            <About sectionRef={(el) => (sectionRefs.current.about = el)} />
          </div>

          <Contact sectionRef={(el) => (sectionRefs.current.contact = el)} />
        </main>

        {/* Keyed once (not per-project) so prev/next navigation just
            updates props in place — only a true open/close mounts or
            unmounts this, which is what AnimatePresence needs to see in
            order to play DetailPanel's exit animation instead of the
            panel just vanishing the instant detailProject goes null. */}
        <AnimatePresence>
          {detailProject && (
            <DetailPanel
              key="detail-panel"
              controls={panelControls}
              project={detailProject}
              onClose={closeProject}
              onPrev={() => step(-1)}
              onNext={() => step(1)}
            />
          )}
        </AnimatePresence>

        <ProjectTransition ref={overlayRef} active={projectTransitioning} />
      </div>
    </>
  );
}