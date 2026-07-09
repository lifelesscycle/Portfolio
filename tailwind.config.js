/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#07070A",
        surface: "#0D1013",
        hover: "#141B1E",
        border: "#1A2528",
        text: "#E4EEEC",
        muted: "#6B8280",
        /* Jade pulled darker and less saturated — reads as ink/stone
           rather than mint. This is the color used almost everywhere:
           borders, small UI accents, body-level highlights. */
        accent: "#5E9C89",
        /* The old bright mint is kept, but demoted to a rare highlight —
           spend it on one hover state or one CTA, not on every glow. */
        "accent-bright": "#9FE0C6",
        "accent-light": "#B9DDD2",
        /* Warm metallic, used sparingly (a rule, a label, a single
           border) for the "expensive" note a pure teal system can't give. */
        brass: "#B08D57",
      },
      fontFamily: {
        sans: ["'Space Grotesk'", "sans-serif"],
        /* Swapped from Playfair Display — Fraunces' italic has more
           character/quirk at display size (variable optical sizing),
           reads closer to "editorial terminal" than a generic serif
           italic against the rest of the mono/sci-fi system. */
        serif: ["'Fraunces'", "serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        card: "0 20px 45px -15px rgba(0,0,0,0.55)",
        "card-hover": "0 28px 60px -12px rgba(0,0,0,0.65)",
        /* Glows softened and pulled back — wider blur, lower opacity,
           no tight bloom. A held glow reads elegant; a tight bright
           one reads like a UI kit hover state. */
        glow: "0 0 60px 4px rgba(94,156,137,0.22)",
        "glow-sm": "0 0 20px rgba(94,156,137,0.18)",
        panel: "0 30px 80px -20px rgba(0,0,0,0.7)",

        /* Layered depth for Work / Lab / About / Contact — each stacks a
           tight contact shadow, a mid falloff and a soft ambient pool so
           surfaces read as sitting above the mesh background rather than
           just having a blur behind them. */
        "code-panel":
          "inset 0 2px 10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03), 0 1px 2px rgba(0,0,0,0.35), 0 24px 50px -18px rgba(0,0,0,0.55), 0 60px 100px -30px rgba(0,0,0,0.5)",
        "tile-rest":
          "0 1px 2px rgba(0,0,0,0.4), 0 12px 24px -10px rgba(0,0,0,0.55), 0 32px 64px -20px rgba(0,0,0,0.5)",
        "tile-hover":
          "0 2px 4px rgba(0,0,0,0.5), 0 20px 40px -14px rgba(0,0,0,0.65), 0 50px 90px -24px rgba(0,0,0,0.6), 0 0 0 1px rgba(94,156,137,0.14)",
        "lab-float":
          "0 4px 10px rgba(0,0,0,0.45), 0 24px 48px -16px rgba(0,0,0,0.6), 0 0 0 1px rgba(94,156,137,0.1), 0 0 46px -10px rgba(94,156,137,0.16)",
        "cta-deep":
          "0 2px 4px rgba(0,0,0,0.3), 0 14px 28px -10px rgba(20,60,50,0.5), 0 0 60px 2px rgba(94,156,137,0.22)",
        "modal-deep":
          "0 8px 16px rgba(0,0,0,0.4), 0 40px 80px -20px rgba(0,0,0,0.7), 0 100px 160px -40px rgba(0,0,0,0.75)",
      },
      keyframes: {
        stagger: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        blink: {
          "0%, 49%": { opacity: 1 },
          "50%, 100%": { opacity: 0 },
        },
        scrollDot: {
          "0%": { opacity: 0, transform: "translateY(0)" },
          "30%": { opacity: 0.8 },
          "100%": { opacity: 0, transform: "translateY(10px)" },
        },
      },
      animation: {
        /* Slower, no overshoot — a settle rather than a spring.
           Bounce/overshoot easing is the single fastest tell for
           "friendly app," a still ease-out reads composed. */
        stagger: "stagger 0.9s cubic-bezier(.16,.6,.2,1) both",
        blink: "blink 1s step-end infinite",
        scrollDot: "scrollDot 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};