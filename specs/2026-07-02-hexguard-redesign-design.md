# HexGuard Website Redesign & Repositioning — Design Spec

Date: 2026-07-02

## 1. Purpose

Reposition HexGuard Security from "Hardware Hacking Village / conference community" to a
professional **Cybersecurity Service Provider and Consultant for organizations**, primarily
offering:

- Vulnerability Assessment & Penetration Testing (VAPT) for Cloud, Network, and
  Application/Product Security
- Security Solutions & Implementation across IT infrastructure: Network security
  implementation, Software Development Lifecycle (SDLC) security integration, and
  security Policy creation/governance

The current site (`docs/index.html`) is a single-page hardware-hacking-village site with a
dark, colorful, animated theme. This redesign replaces both the positioning/content and the
visual design, and restructures the site into a proper multi-page site.

## 2. Non-goals

- No client-facing web app functionality (no logins, dashboards, or backend services)
- No working contact form backend — Contact page uses a `mailto:` link only, per explicit
  decision (site remains static, hosted on GitHub Pages, no server)
- No blog/insights section at launch (previously CTF/research content is being retired, not
  migrated)
- No case studies naming actual clients — VAPT engagements are NDA-bound, so "Client Work"
  content is anonymized/aggregate only

## 3. Sitemap

```
/                                   Home
/services/                          Services hub (links to all 6, grouped by category)
/services/cloud-vapt/                     VAPT — Cloud Security Assessment
/services/network-vapt/                   VAPT — Network Penetration Testing
/services/application-security/           VAPT — Application/Product Security
/services/network-implementation/         Security Solutions — Network Infrastructure
/services/sdlc-security/                  Security Solutions — SDLC Integration
/services/policy-creation/                Security Solutions — Policy & Governance
/about/                              Company, mission, team (with roles), certifications strip
/client-work/                        Anonymized engagement stats and impact narrative
/contact/                            Contact info + mailto CTA
/privacy-policy/                     Legal
/terms-of-service/                   Legal
```

**Primary navigation:** `Home | VAPT ▾ | Security Solutions ▾ | About | Client Work | Contact`
Each dropdown (`VAPT`, `Security Solutions`) lists its 3 sub-pages.

**Footer:** full sitemap links, social links (X, LinkedIn, GitHub, Facebook, Instagram,
YouTube — carried over from current site), company legal block (Corporate Identity Number
`U72900KA2024PTC186498`, registered office address — carried over from current site), links
to Privacy Policy / Terms of Service.

**Removed:** `docs/ctf/` (drone-hacking CTF write-ups/files) is retired and deleted from the
repository entirely — it does not fit the new B2B consultancy positioning and is out of scope
for migration.

## 4. Visual Design System

### 4.1 Palette

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#FFFFFF` | Page background (pure white) |
| `--bg-alt` | `#F6F8FB` | Alternating section backgrounds, card fills |
| `--ink` | `#0A1220` | Near-black navy — headings, primary text, footer background |
| `--ink-soft` | `#334155` | Body copy (slate gray) |
| `--accent` | `#1E3A8A` | Links, buttons, active nav state, icon accents |
| `--accent-hover` | `#152C6B` | Hover/active state for accent elements |
| `--border` | `#E4E9F0` | Hairline borders/dividers |

Dark navy (`--ink`) is reserved for the footer (and optionally one stats/impact band) as a
full-bleed background. Everywhere else stays white/near-white — the site should read as
light and airy, not "dark mode."

### 4.2 Typography

- Headings: **Manrope**, weights 600/700
- Body: **Inter**, weights 400/500, line-height 1.6+
- Both loaded via Google Fonts

### 4.3 Layout language

- Max content width ~1200px, 8px spacing scale, generous whitespace
- Sticky top nav: white background, hairline bottom border, logo + wordmark left, nav +
  dropdowns right, single solid navy "Contact Us" button as the one CTA color pop
- Cards: white fill, 1px hairline border, small border-radius (8–10px) — no heavy drop
  shadows or gradients
- Section rhythm: alternate `--bg` / `--bg-alt` bands instead of hard dividers
- Footer: full-bleed `--ink` navy background, white/muted text, sitemap columns + socials +
  legal line

### 4.4 Hero

- No 3D/particle animation (replaces current three.js hero visual)
- Large Manrope headline + slate subhead + two CTA buttons (primary solid navy "Book a
  Consultation", secondary outline "Explore Services")
- Subtle abstract background motif (thin geometric line-grid or hexagon/shield outline,
  low opacity, static or near-static) — evokes the HexGuard hex mark without a "hacker-con"
  feel

### 4.5 Logo

Recolor the existing `docs/img/logo.svg` (concentric-circle gradient mark) — replace its
current cyan/blue gradient (`#00D4FF → #0066FF → #0044CC`) with a navy-toned gradient
consistent with `--ink`/`--accent` so it fits the new palette. Keep the existing shape/mark
unchanged.

## 5. Content Plan (per page)

- **Home**: Hero → trust strip (certifications: CRTP, OSCP, OSED, CEH, CREST + "31
  engagements since 2020") → Services overview (2 category cards linking to the services hub
  sections) → Why HexGuard (3–4 differentiators) → Client Work teaser (stat callout, links to
  `/client-work/`) → final CTA band → footer
- **Services hub**: Two category sections — "VAPT" and "Security Solutions & Implementation"
  — each listing its 3 services as cards (1-line description + "Learn more" link)
- **Each of the 6 service pages** follows a common template: what it is → who it's for →
  methodology/process (steps) → deliverables (e.g. report, debrief, retest) → engagement
  model → FAQ → CTA to Contact
- **About**: Mission/positioning statement → company facts (CIN, incorporation info,
  registered office — carried over from current site) → certifications strip (CRTP, OSCP,
  OSED, CEH, CREST) → team grid:
  - Adlin Seedon D'Souza — Founder
  - Prashant KV — Advisor
  - Mohd. Arif — Security Consultant
  - Fazalu Rahman — Security Consultant
  - Dhanesh Sivasamy — Security Consultant
  - Minhaj — Security Consultant
  - Sanju Patil — Security Consultant
  - Franveen Deepak D'Souza — Security Consultant
- **Client Work**: Stat band (31 engagements since 2020, 15 since incorporation, India +
  global reach) → 3–4 anonymized engagement summaries (industry + challenge + outcome, no
  client names or identifying details) → CTA to Contact
- **Contact**: Contact info card (email `hexguardsec@gmail.com`, phone `+91 6366934469`,
  business hours — carried over from current site) + company registration card (carried over)
  + prominent "Email Us" `mailto:` button. No embedded form.
- **Privacy Policy / Terms of Service**: Standard boilerplate structured for a security
  consulting firm (data handling, confidentiality/NDA note, engagement terms, liability
  limitations). This is placeholder legal content for launch — **flagged for the user's legal
  counsel to review before being treated as binding.**

## 6. Technical Architecture

- **Static site generator:** Eleventy (11ty), Node-based build, output directory remains
  `docs/` (unchanged GitHub Pages source — no repo settings changes needed)
- **Source layout:**
  - `src/_includes/layout.njk` — shared `<head>`, nav, footer
  - `src/_includes/service.njk` — template for the 6 service pages, driven by front-matter
    data (title, category, summary, methodology steps, deliverables, FAQ)
  - Page content as Markdown/Nunjucks under `src/`
  - `src/assets/css/` — token-based custom CSS (`tokens.css` + component/page CSS, no
    framework)
  - `src/assets/img/` — recolored logo + any motif SVGs
- **Build tooling:** `package.json` with `build` / `serve` scripts, `.eleventy.js` config
- **Client-side JS:** vanilla only, limited to nav dropdown/mobile menu toggle — no animation
  library, no three.js
- **Deployment:** unchanged — build locally, commit generated `docs/` output, GitHub Pages
  serves `main`/`docs` as today
- **README:** updated with new build/serve instructions for the 11ty workflow

## 7. Content still needed from user before launch

- Final marketing copy review/edits on service page methodology & FAQ sections (initial
  drafts will be written as part of implementation, but should be reviewed for accuracy)
- Legal review of Privacy Policy / Terms of Service placeholder content
- Confirmation of anonymized engagement summaries used on `/client-work/` (industries/outcomes
  should be reviewed for accuracy and confidentiality before publishing)

## 8. Out of scope / explicitly decided against

- Tailwind CSS or other utility CSS framework (custom CSS with design tokens chosen instead)
- Third-party form backend (Formspree etc.) for Contact (mailto only, chosen instead)
- Folding CTF/research content into an Insights section (retired entirely instead)
- Client testimonials with named clients (anonymized aggregate stats instead)
