# Portfolio — Mick

A single-page developer portfolio: hero, Work (staggered project grid), Lab
(experiments list), About (code-as-bio), and Contact — built with **React +
Vite + Tailwind CSS**, following the jade/dark design language in
`DESIGN_REFERENCE.md`.

> **Heads up:** every project, skill, and social link in this repo is
> **placeholder content**, so you can see the layout working end to end.
> Swap it for your own — see "Add your own details" below.

---

## 1. Run it locally

```bash
npm install
npm run dev       # starts a dev server, usually at http://localhost:5173
```

Other commands:

```bash
npm run build      # production build → dist/
npm run preview    # preview the production build locally
```

Requires Node.js 18+.

---

## 2. Project structure

```
src/
  data/
    content.js       ← ALL your real content lives here (see below)
  components/
    Chrome.jsx        Logo, top nav, left rail, scroll cue, side badge
    Hero.jsx           "Start" section
    Work.jsx            Project grid + category ghost text + showreel line
    TiltCard.jsx         Hover-tilt project thumbnail
    DetailPanel.jsx       Split-screen project modal
    Lab.jsx              Experiments list with hover preview
    About.jsx             Code-as-bio section
    Contact.jsx            Social links + CTA + footer
    MeshBackground.jsx      Low-poly background texture (generated, no assets)
    CustomCursor.jsx         Ring cursor (desktop only)
  App.jsx              Page layout, scroll tracking, detail-panel state
  index.css            Tailwind layers + the handful of effects that aren't
                        plain utility classes (mesh bg, ghost text, rail line,
                        cursor ring, tilt perspective)
  main.jsx             React entry point
```

**You should only ever need to edit `src/data/content.js`** to make this
your own. The components read from it — you shouldn't need to touch JSX
unless you want to change the *layout* itself.

---

## 3. Add your own details

Open `src/data/content.js`. It's one file, grouped into exported objects:

### `SITE`
Your name, the logo tag (`<mick/>` → change `logoTag`), the hero's
italic-serif verb (`taglineVerb`, e.g. "design"), the hero's monospace
closing phrase (`taglineTail`, e.g. "web apps / products"), the side badge
text, and the footer year.

### `WORK_PROJECTS`
One object per project. Each needs:
- `id` — unique, used internally (URL-safe string, no spaces)
- `category` — must match one of the strings in `CATEGORIES` (see below)
- `index` — display string like `"00"`, `"01"` (shown next to the arrow)
- `name`, `full` — short name and full project title
- `tags` — array of tech tags, shown as `#hashtags` in the detail panel
- `description` — one paragraph
- `features` — array of short strings, each can start with an emoji for flavor
- `gradient` — a CSS gradient string used as the card's placeholder background
  (swap this for a real screenshot later if you want — see note below)
- `rotate` — base tilt angle in degrees, e.g. `-4` or `3` (keeps the grid
  feeling hand-placed rather than uniform)
- `video` — `true` to show a "See Video" link in the detail panel
- `link` — the project's live URL (used by the VISIT button)

**To add a project:** copy an existing object, give it a new `id`, and fill
in your details. It'll automatically appear in its category's grid.

**To add a new category:** add the category name to the `CATEGORIES` array
(order controls display order), then set that string as the `category` on
any project.

### `LAB_CATEGORIES`
Array of `{ name, items }`. Each item is `{ name, live? }` — set `live: true`
to render that item in accent color (signals "still active/clickable").
Add or remove categories/items freely; the layout re-flows automatically.

### `ABOUT`
- `tagline` — the `//` comment line at the top of the code block
- `name`, `email` — used in the `constructor()` lines
- `work` — array of `{ range, role }`, rendered as the `workExperience()`
  return array. Keep to one line each — no overlapping date ranges.
- `education` — array of `{ years, degree }`, rendered as a small note below
  the code block
- `skills` — an object of **grouped** arrays (e.g. `languages`, `frontend`,
  `backend`, `tools`). Add or rename groups freely — grouped skills read as
  more intentional than one long flat list.

### `SOCIALS`
Array of `{ icon, label, href }`. `icon` must be one of the names imported
in `src/components/Contact.jsx` (`Github`, `Linkedin`, `Mail`, `Twitter` by
default). To add another platform:
1. Import its icon from `lucide-react` in `Contact.jsx` (browse icons at
   https://lucide.dev/icons)
2. Add it to the `ICONS` map at the top of that file
3. Reference it by name in `SOCIALS`

---

## 4. Using real project screenshots instead of gradients

Right now each `WORK_PROJECTS` card and the `DetailPanel` preview use a CSS
`gradient` as a placeholder "screenshot." To use a real image:

1. Drop the image in `public/` (e.g. `public/projects/efms.png`)
2. In `TiltCard.jsx`, replace the `background: gradient` style with a
   `background-image` pointing at `/projects/efms.png` (or add an `<img>`
   inside the card)
3. Do the same in `DetailPanel.jsx`'s left preview panel if you want the
   modal to show it too

---

## 5. Design notes (for future tweaks)

- Color tokens, fonts, shadows, and animation keyframes are all defined in
  `tailwind.config.js` — change them there and every component updates.
- The mesh background, ghost text, rail line, and cursor ring are hand-rolled
  CSS in `src/index.css` (they don't map cleanly to plain Tailwind utilities).
- Card depth (`shadow-card`, `shadow-card-hover`), the CTA glow
  (`shadow-glow`), and the panel shadow (`shadow-panel`) are all custom
  `boxShadow` tokens in the Tailwind config — reuse them anywhere for
  consistent elevation instead of writing new shadow values inline.
- This is a **prototype-quality single page**, not a production app: there's
  no routing, no CMS, no backend. It's meant to be edited by hand in
  `content.js` and redeployed as a static build (`npm run build` → deploy the
  `dist/` folder to Vercel, Netlify, GitHub Pages, etc.).

---

## 6. Accessibility & responsiveness

- The custom ring cursor and left rail are hidden on touch devices / small
  screens automatically.
- Interactive cards (`TiltCard`) are keyboard-focusable and respond to
  Enter/Space.
- The detail panel traps scroll to itself while open and can be closed via
  the back button.

If you make significant layout changes, re-check all five sections at a
mobile width (375px) and a desktop width (1440px) — the grid, rail, and
detail panel all have breakpoint-specific behavior.
