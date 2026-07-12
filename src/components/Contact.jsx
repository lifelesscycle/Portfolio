import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { SITE, SOCIALS } from "../data/content";

const ICONS = { Github, Linkedin, Mail, Twitter };

export default function Contact({ sectionRef }) {
  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative px-6 md:px-24 pt-28 md:pt-36 pb-24 text-center"
    >
      {/* Faint centered glow marks the handoff into Contact and doubles as
          a soft spotlight behind the CTA below. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 40%, rgba(158,122,224,0.08), rgba(10,15,18,0) 65%)",
        }}
        aria-hidden="true"
      />

      <div className="font-mono text-xs tracking-[2px] text-muted mb-2">
        05 — Contact
      </div>
      <h2 className="text-muted text-lg mb-10">Find me on:</h2>

      <div className="flex flex-wrap justify-center gap-x-10 gap-y-6 mb-14">
        {SOCIALS.map((s) => {
          const Icon = ICONS[s.icon] ?? Mail;
          return (
            <a
              key={s.label}
              href={s.href}
              className="flex items-center gap-2 font-mono text-sm text-accent hover:text-accent-light
                px-3 py-2 -mx-3 -my-2 rounded-full transition-all duration-300
                hover:bg-surface hover:shadow-tile-rest hover:-translate-y-0.5"
            >
              <Icon size={16} /> {s.label}
            </a>
          );
        })}
      </div>

      <a href="mailto:yourname@example.com?subject=Portfolio%20Inquiry&body=Hi%20Aarya,">
        <button className="bg-accent text-bg font-bold text-sm tracking-wide rounded-full px-12 py-4 shadow-cta-deep hover:brightness-110 hover:scale-[1.02] transition-all inline-block text-center">
          GET IN TOUCH
        </button> 
      </a>

      <div className="text-muted text-xs mt-16">
        © Made with {"</react>"} by {SITE.name}.
        <div className="text-muted text-xxs mt-15">
          Inspired by {"</Yasio>"}
        </div>
      </div>
    </section>
  );
}