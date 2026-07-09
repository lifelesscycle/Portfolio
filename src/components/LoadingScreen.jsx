import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Full-screen intro loader shown before the landing page mounts.
 *
 * - BarField: soft vertical glow bars, breathing on independent loops.
 * - Panda: the panda-loading.webm clip, played plainly (no circular
 *   frame or ring) with a gentle bob + breathing scale loop on the
 *   wrapper so it still feels alive.
 * - Progress: mono-labelled bar filling across `duration`, whole
 *   screen cross-fades out via AnimatePresence + onFinish.
 *
 * ASSET SETUP: place panda-loading.webm in your public/ folder so it's
 * servable at "/panda-loading.webm". If your bundler prefers imported
 * assets instead (e.g. importing from src/assets), swap the `src`
 * prop on the <video> below for the imported module.
 *
 * Colors from tailwind.config.js:
 *   bg #0A0F12  surface #11191C  border #1E2B2E
 *   text #E4EEEC  muted #6B8280
 *   accent #7FD9C4  accent-light #C9F2E8
 */

const BARS = [
  { left: "4%", width: 46, blur: 40, opacity: 0.5, delay: 0, dur: 7 },
  { left: "13%", width: 14, blur: 18, opacity: 0.28, delay: 1.1, dur: 5.5 },
  { left: "27%", width: 70, blur: 55, opacity: 0.22, delay: 2.4, dur: 8 },
  { left: "41%", width: 10, blur: 14, opacity: 0.32, delay: 0.6, dur: 6.2 },
  { left: "58%", width: 22, blur: 26, opacity: 0.4, delay: 1.8, dur: 6.8 },
  { left: "71%", width: 90, blur: 65, opacity: 0.5, delay: 0.3, dur: 9 },
  { left: "86%", width: 16, blur: 20, opacity: 0.3, delay: 2, dur: 5.8 },
  { left: "95%", width: 34, blur: 34, opacity: 0.26, delay: 1.4, dur: 7.4 },
];

const MESSAGES = ["warming the mug", "lifting it up", "first sip...", "mmm, perfect"];

export default function LoadingScreen({ onFinish, duration = 4000 }) {
  const [visible, setVisible] = useState(true);
  const [msgIndex, setMsgIndex] = useState(0);
  const d = duration / 1000; // seconds, for motion transitions

  useEffect(() => {
    const leaveTimer = setTimeout(() => setVisible(false), duration);
    const doneTimer = setTimeout(() => onFinish?.(), duration + 650);
    const msgTimer = setInterval(
      () => setMsgIndex((i) => (i + 1) % MESSAGES.length),
      duration / MESSAGES.length
    );
    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(doneTimer);
      clearInterval(msgTimer);
    };
  }, [duration, onFinish]);

  return (
    <AnimatePresence onExitComplete={() => {}}>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-bg overflow-hidden"
          style={{ cursor: "none" }}
          role="status"
          aria-label="Loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <style>{`
            html, body { cursor: none !important; }
            [data-loading-screen], [data-loading-screen] * { cursor: none !important; }
          `}</style>
          <div data-loading-screen className="contents">
          <BarField />

          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(10,15,18,0.35) 0%, rgba(10,15,18,0.85) 72%, rgba(10,15,18,0.97) 100%)",
            }}
          />

          <motion.div
            className="relative z-10 flex flex-col items-center gap-0 py-4 my-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Panda />

            <div className="flex flex-col items-center gap-3 -mt-24">
              <AnimatePresence mode="wait">
                <motion.p
                  key={msgIndex}
                  className="font-mono text-[11px] tracking-[0.25em] uppercase text-white font-bold"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  {MESSAGES[msgIndex]}
                </motion.p>
              </AnimatePresence>
              <div className="w-[180px] h-[2px] rounded-full bg-border overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-accent shadow-glow-sm"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: d, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BarField() {
  return (
    <div className="absolute inset-0">
      {BARS.map((b, i) => (
        <motion.span
          key={i}
          className="absolute top-0 bottom-0"
          style={{
            left: b.left,
            width: `${b.width}px`,
            filter: `blur(${b.blur}px)`,
            background:
              "linear-gradient(to bottom, rgba(127,217,196,0) 0%, rgba(127,217,196,0.9) 20%, rgba(127,217,196,0.9) 80%, rgba(127,217,196,0) 100%)",
            transformOrigin: "center",
          }}
          initial={{ opacity: b.opacity, scaleY: 1 }}
          animate={{ opacity: [b.opacity, b.opacity * 1.6, b.opacity], scaleY: [1, 1.04, 1] }}
          transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <svg className="absolute inset-0 w-full h-full opacity-[0.05] mix-blend-overlay">
        <filter id="loaderGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#loaderGrain)" />
      </svg>
    </div>
  );
}

/**
 * Panda video clip, shown plainly (no frame/ring) with a gentle
 * bob + breathing scale loop so it still feels alive on screen.
 */
function Panda() {
  return (
    <motion.div
      className="relative flex items-center justify-center -mt-6"
      style={{ width: 800, height: 533, flexShrink: 0 }}
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.video
        src="/panda-loading.webm"
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          pointerEvents: "none",
        }}
        animate={{ scale: [1, 1.035, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}