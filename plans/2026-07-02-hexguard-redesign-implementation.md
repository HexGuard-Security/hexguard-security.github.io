# HexGuard Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild hexguard.net as a multi-page Eleventy (11ty) static site, repositioning HexGuard from a hardware-hacking-village community into a professional cybersecurity VAPT and security solutions consultancy, with a white/near-black-navy design system.

**Architecture:** Eleventy reads Nunjucks templates and data from `src/`, builds static HTML into `docs/` (unchanged GitHub Pages source). A shared `base.njk` layout provides nav/footer; a shared `service.njk` layout renders all 6 service pages from front-matter data, keeping service page markup DRY. No client framework; a small vanilla JS file handles nav/dropdown toggling. Tests run the real build and assert on the generated HTML in `docs/`.

**Tech Stack:** Node.js, `@11ty/eleventy` (static site generator), Nunjucks templates, hand-written CSS with custom-property design tokens, vanilla JS, Node's built-in test runner (`node:test`).

## Global Constraints

- Output directory stays `docs/` at repo root (GitHub Pages source) — do not change repo Pages settings.
- Design tokens: `--bg:#FFFFFF`, `--bg-alt:#F6F8FB`, `--ink:#0A1220`, `--ink-soft:#334155`, `--accent:#1E3A8A`, `--accent-hover:#152C6B`, `--border:#E4E9F0`. Dark `--ink` background is reserved for footer and CTA/stats bands only — the rest of the site is white/near-white.
- Headings use **Manrope** (600/700), body uses **Inter** (400/500), both via Google Fonts.
- No client-side JS framework and no animation library (no three.js) — vanilla JS only, limited to nav/dropdown toggling.
- Contact page uses a `mailto:` link only — no third-party form backend.
- No named client case studies — `/client-work/` uses anonymized, aggregate content only.
- Real stats to use verbatim: **31 engagements since 2020**, **15 since incorporation**, presence in **India and globally**.
- Certifications to reference verbatim: **CRTP, OSCP, OSED, CEH, CREST**.
- Team roles verbatim: Adlin Seedon D'Souza — Founder; Prashant KV — Advisor; Mohd. Arif, Fazalu Rahman, Dhanesh Sivasamy, Minhaj, Sanju Patil, Franveen Deepak D'Souza — Security Consultant.
- Company legal info verbatim: **HexGuard Security (OPC) Private Limited**; CIN **U72900KA2024PTC186498**; registered office **No 11, Mourya Layout, Vartur, Bangalore, Karnataka, India, 560087**.
- Contact info verbatim: email **hexguardsec@gmail.com**; phone **+91 6366934469**; hours **Mon-Fri: 2AM-10AM UTC**.
- Social links verbatim: `https://x.com/hexguardsec`, `https://www.linkedin.com/company/hexguardsec`, `https://github.com/HexGuard-Security`, `https://www.facebook.com/hexguardsec`, `https://www.instagram.com/hexguardsec`, `https://www.youtube.com/@hexguardsec`.
- `docs/ctf/` is removed entirely — not migrated.
- No Anthropic/Claude/AI-tool attribution anywhere: not in commit messages, commit trailers, code comments, or page content. Commits must read as ordinary human-authored work, consistent with this repo's existing commit history.
- Every commit in this plan is a plain, single-purpose commit message with no co-author trailer.

---

## File Structure Overview

```
package.json                       Node project + npm scripts
.eleventy.js                       Eleventy config (input/output dirs, passthrough copy)
.gitignore                         Ignore node_modules
src/CNAME                          Custom domain, passthrough-copied to docs/CNAME
src/index.njk                      Home page (/)
src/services/index.njk             Services hub (/services/)
src/services/cloud-vapt.njk        VAPT — Cloud (/services/cloud-vapt/)
src/services/network-vapt.njk      VAPT — Network (/services/network-vapt/)
src/services/application-security.njk   VAPT — Application/Product (/services/application-security/)
src/services/network-implementation.njk Security Solutions — Network (/services/network-implementation/)
src/services/sdlc-security.njk     Security Solutions — SDLC (/services/sdlc-security/)
src/services/policy-creation.njk   Security Solutions — Policy (/services/policy-creation/)
src/about.njk                      About (/about/)
src/client-work.njk                Client Work (/client-work/)
src/contact.njk                    Contact (/contact/)
src/privacy-policy.njk             Privacy Policy (/privacy-policy/)
src/terms-of-service.njk           Terms of Service (/terms-of-service/)
src/_includes/base.njk             Shared HTML shell (head, nav include, footer include)
src/_includes/nav.njk              Site navigation with VAPT/Security Solutions dropdowns
src/_includes/footer.njk           Site footer (sitemap, socials, legal)
src/_includes/service.njk          Shared layout for the 6 service pages, data-driven
src/assets/css/tokens.css          CSS custom properties (palette, spacing, fonts)
src/assets/css/styles.css          All component/page styles
src/assets/js/nav.js               Mobile nav + dropdown toggle behavior
src/assets/img/logo.svg            Recolored HexGuard mark
tests/site.test.mjs                Node test-runner assertions against built docs/ output
README.md                          Modified: new build/serve instructions
docs/ctf/                          Deleted
docs/css/, docs/js/, docs/img/     Deleted (old asset paths, superseded by src/assets/*)
```

---

### Task 1: Project Scaffold, Eleventy Config, and Test Harness

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `.eleventy.js`
- Create: `src/CNAME`
- Create: `src/index.njk` (temporary stub — replaced with real content in Task 5)
- Create: `tests/site.test.mjs`
- Delete: `docs/ctf/` (entire directory)
- Delete: `docs/css/` (entire directory)
- Delete: `docs/js/` (entire directory)
- Delete: `docs/img/` (entire directory)
- Delete: `docs/index.html`

**Interfaces:**
- Produces: `npm run build` (runs `eleventy`, writes to `docs/`), `npm test` (runs build then `node --test tests/`), Eleventy input dir `src/`, output dir `docs/`, includes dir `_includes`.

- [ ] **Step 1: Remove obsolete site directories**

```bash
git rm -r docs/ctf docs/css docs/js docs/img docs/index.html
```

- [ ] **Step 2: Write `package.json`**

```json
{
  "name": "hexguard-website",
  "version": "1.0.0",
  "private": true,
  "description": "HexGuard Security marketing website, built with Eleventy.",
  "scripts": {
    "build": "eleventy",
    "serve": "eleventy --serve",
    "test": "npm run build && node --test tests/"
  },
  "devDependencies": {
    "@11ty/eleventy": "^2.0.1"
  }
}
```

- [ ] **Step 3: Write `.gitignore`**

```
node_modules/
```

- [ ] **Step 4: Install dependencies**

```bash
npm install
```

- [ ] **Step 5: Write the failing test**

Create `tests/site.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const DOCS = join(process.cwd(), 'docs');

export function readOutput(relativePath) {
  return readFileSync(join(DOCS, relativePath), 'utf8');
}

test('home page builds and contains the HexGuard brand name', () => {
  const html = readOutput('index.html');
  assert.match(html, /HexGuard/);
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — Eleventy errors because `.eleventy.js` and `src/` don't exist yet (or `docs/index.html` is missing).

- [ ] **Step 7: Write `.eleventy.js`**

```js
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });

  return {
    dir: {
      input: "src",
      output: "docs",
      includes: "_includes",
    },
  };
};
```

- [ ] **Step 8: Write `src/CNAME`**

```
hexguard.net
```

- [ ] **Step 9: Write the stub `src/index.njk`**

```html
---
title: Home
description: HexGuard Security — Cybersecurity VAPT and Security Solutions Consultancy
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{{ title }} | HexGuard Security</title>
</head>
<body>
  <h1>HexGuard Security</h1>
  <p>Site under construction.</p>
</body>
</html>
```

- [ ] **Step 10: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 11: Commit**

```bash
git add package.json package-lock.json .gitignore .eleventy.js src/CNAME src/index.njk tests/site.test.mjs
git commit -m "Scaffold Eleventy build and remove legacy site files"
```

---

### Task 2: Design Tokens and Base Stylesheet

**Files:**
- Create: `src/assets/css/tokens.css`
- Create: `src/assets/css/styles.css`
- Modify: `src/index.njk` (link the two stylesheets in `<head>` so the test can verify passthrough copy works end-to-end)
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Produces: CSS custom properties consumed by every later template: `--bg`, `--bg-alt`, `--ink`, `--ink-soft`, `--accent`, `--accent-hover`, `--border`, `--font-heading`, `--font-body`, `--space-1`..`--space-7`, `--max-width`, `--radius`. Class names later tasks rely on: `.container`, `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-primary-inverse`, `.section`, `.section-alt`, `.site-nav`, `.nav-inner`, `.nav-brand`, `.nav-logo`, `.nav-links`, `.nav-dropdown`, `.nav-dropdown-toggle`, `.nav-dropdown-menu`, `.nav-cta`, `.nav-toggle`, `.hero`, `.eyebrow`, `.lead`, `.trust-strip`, `.cert-badge`, `.stats-band`, `.stat-item`, `.cards-grid`, `.card`, `.check-list`, `.methodology-list`, `.faq-item`, `.team-grid`, `.team-card`, `.cta-band`, `.site-footer`, `.footer-grid`, `.footer-col`, `.footer-brand`, `.footer-legal`, `.footer-bottom`, `.footer-social`.

- [ ] **Step 1: Write the failing test**

Append to `tests/site.test.mjs`:

```js
test('design tokens stylesheet is copied to the build output', () => {
  const css = readOutput('assets/css/tokens.css');
  assert.match(css, /--bg: #FFFFFF/);
  assert.match(css, /--ink: #0A1220/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `ENOENT` reading `docs/assets/css/tokens.css`.

- [ ] **Step 3: Write `src/assets/css/tokens.css`**

```css
:root {
  /* Colors */
  --bg: #FFFFFF;
  --bg-alt: #F6F8FB;
  --ink: #0A1220;
  --ink-soft: #334155;
  --accent: #1E3A8A;
  --accent-hover: #152C6B;
  --border: #E4E9F0;
  --white: #FFFFFF;

  /* Typography */
  --font-heading: 'Manrope', sans-serif;
  --font-body: 'Inter', sans-serif;

  /* Spacing scale */
  --space-1: 0.5rem;
  --space-2: 1rem;
  --space-3: 1.5rem;
  --space-4: 2rem;
  --space-5: 3rem;
  --space-6: 4rem;
  --space-7: 6rem;

  /* Layout */
  --max-width: 1200px;
  --radius: 10px;
}
```

- [ ] **Step 4: Write `src/assets/css/styles.css`**

```css
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-body);
  color: var(--ink-soft);
  background: var(--bg);
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 {
  font-family: var(--font-heading);
  color: var(--ink);
  line-height: 1.2;
  margin: 0 0 var(--space-2);
}

h1 { font-size: 2.75rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.25rem; }

p { margin: 0 0 var(--space-3); }

a {
  color: var(--accent);
  text-decoration: none;
}

a:hover {
  color: var(--accent-hover);
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--space-3);
}

/* Buttons */
.btn {
  display: inline-block;
  font-family: var(--font-heading);
  font-weight: 600;
  padding: 0.85rem 1.75rem;
  border-radius: var(--radius);
  border: 1px solid transparent;
  cursor: pointer;
}

.btn-primary {
  background: var(--accent);
  color: var(--white);
}

.btn-primary:hover {
  background: var(--accent-hover);
  color: var(--white);
}

.btn-secondary {
  background: transparent;
  color: var(--ink);
  border-color: var(--border);
}

.btn-secondary:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.btn-primary-inverse {
  background: var(--white);
  color: var(--ink);
}

.btn-primary-inverse:hover {
  background: var(--bg-alt);
}

/* Section rhythm */
.section {
  padding: var(--space-7) 0;
}

.section-alt {
  background: var(--bg-alt);
  padding: var(--space-7) 0;
}

/* Nav */
.site-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-family: var(--font-heading);
  font-weight: 700;
  color: var(--ink);
}

.nav-logo {
  height: 32px;
  width: 32px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.nav-links > a {
  color: var(--ink-soft);
  font-weight: 500;
}

.nav-links > a:hover {
  color: var(--accent);
}

.nav-dropdown {
  position: relative;
}

.nav-dropdown-toggle {
  background: none;
  border: none;
  font: inherit;
  font-weight: 500;
  color: var(--ink-soft);
  cursor: pointer;
  padding: 0;
}

.nav-dropdown-toggle:hover {
  color: var(--accent);
}

.nav-dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--space-1) 0;
  min-width: 240px;
  box-shadow: 0 12px 24px rgba(10, 18, 32, 0.08);
}

.nav-dropdown:hover .nav-dropdown-menu,
.nav-dropdown.is-open .nav-dropdown-menu {
  display: block;
}

.nav-dropdown-menu a {
  display: block;
  padding: var(--space-1) var(--space-2);
  color: var(--ink-soft);
}

.nav-dropdown-menu a:hover {
  background: var(--bg-alt);
  color: var(--accent);
}

.nav-cta {
  background: var(--accent);
  color: var(--white);
  padding: 0.6rem 1.25rem;
  border-radius: var(--radius);
  font-weight: 600;
}

.nav-cta:hover {
  background: var(--accent-hover);
  color: var(--white);
}

.nav-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--ink);
  cursor: pointer;
}

@media (max-width: 860px) {
  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: flex-start;
    background: var(--white);
    border-bottom: 1px solid var(--border);
    padding: var(--space-2) var(--space-3);
    gap: var(--space-2);
  }

  .nav-links.is-open {
    display: flex;
  }

  .nav-dropdown-menu {
    position: static;
    border: none;
    box-shadow: none;
    padding-left: var(--space-2);
  }

  .nav-toggle {
    display: block;
  }
}

/* Hero */
.hero {
  padding: var(--space-7) 0;
  text-align: center;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: var(--space-2);
}

.lead {
  font-size: 1.15rem;
  max-width: 640px;
  margin: 0 auto var(--space-4);
}

.hero-actions {
  display: flex;
  gap: var(--space-2);
  justify-content: center;
  flex-wrap: wrap;
}

/* Trust strip */
.trust-strip {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) 0;
}

.cert-badge {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.4rem 0.9rem;
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--ink);
}

.trust-strip .trust-stat {
  font-weight: 600;
  color: var(--ink-soft);
}

/* Stats band (dark) */
.stats-band {
  background: var(--ink);
  color: var(--white);
  padding: var(--space-6) 0;
}

.stats-band h2 {
  color: var(--white);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-4);
  text-align: center;
}

.stat-item .stat-number {
  display: block;
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--white);
}

.stat-item .stat-label {
  color: #C7D0E0;
}

/* Cards */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-3);
}

.card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--space-4);
}

.card h3 {
  margin-bottom: var(--space-1);
}

/* Check lists */
.check-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.check-list li {
  position: relative;
  padding-left: var(--space-4);
  margin-bottom: var(--space-2);
}

.check-list li::before {
  content: "\2713";
  position: absolute;
  left: 0;
  color: var(--accent);
  font-weight: 700;
}

/* Methodology list */
.methodology-list {
  list-style: none;
  counter-reset: step;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--space-4);
}

.methodology-list li {
  counter-increment: step;
  position: relative;
  padding-left: var(--space-6);
}

.methodology-list li::before {
  content: counter(step);
  position: absolute;
  left: 0;
  top: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--accent);
  color: var(--white);
  font-family: var(--font-heading);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* FAQ */
.faq-list {
  display: grid;
  gap: var(--space-2);
}

.faq-item {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--space-2) var(--space-3);
  background: var(--white);
}

.faq-item summary {
  font-family: var(--font-heading);
  font-weight: 600;
  color: var(--ink);
  cursor: pointer;
}

.faq-item p {
  margin-top: var(--space-2);
  margin-bottom: 0;
}

/* Team */
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--space-3);
}

.team-card {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--space-3);
  text-align: center;
  background: var(--white);
}

.team-card h3 {
  margin-bottom: 0.25rem;
}

.team-card .team-role {
  color: var(--accent);
  font-weight: 600;
  font-size: 0.9rem;
}

/* CTA band */
.cta-band {
  background: var(--ink);
  color: var(--white);
  padding: var(--space-6) 0;
  text-align: center;
}

.cta-band h2 {
  color: var(--white);
}

/* Footer */
.site-footer {
  background: var(--ink);
  color: #C7D0E0;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: var(--space-4);
  padding: var(--space-6) 0 var(--space-4);
}

.footer-brand img {
  height: 32px;
  margin-bottom: var(--space-2);
}

.footer-legal {
  font-size: 0.85rem;
  color: #99A6C2;
}

.footer-col h4 {
  color: var(--white);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-2);
}

.footer-col a {
  display: block;
  color: #C7D0E0;
  margin-bottom: var(--space-1);
}

.footer-col a:hover {
  color: var(--white);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2);
  border-top: 1px solid #1D2A44;
  padding: var(--space-3) 0;
  font-size: 0.85rem;
}

.footer-social {
  display: flex;
  gap: var(--space-2);
}

.footer-social a {
  color: #C7D0E0;
  font-size: 1.1rem;
}

.footer-social a:hover {
  color: var(--white);
}

@media (max-width: 860px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 560px) {
  h1 { font-size: 2rem; }
  h2 { font-size: 1.5rem; }
  .footer-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 5: Link the stylesheets from the stub page**

Modify `src/index.njk`, replacing the `<head>` block:

```html
---
title: Home
description: HexGuard Security — Cybersecurity VAPT and Security Solutions Consultancy
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{{ title }} | HexGuard Security</title>
  <link rel="stylesheet" href="/assets/css/tokens.css">
  <link rel="stylesheet" href="/assets/css/styles.css">
</head>
<body>
  <h1>HexGuard Security</h1>
  <p>Site under construction.</p>
</body>
</html>
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/assets/css/tokens.css src/assets/css/styles.css src/index.njk tests/site.test.mjs
git commit -m "Add navy/white design token system and base stylesheet"
```

---

### Task 3: Recolor the Logo Mark

**Files:**
- Create: `src/assets/img/logo.svg`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Produces: `docs/assets/img/logo.svg`, referenced by `src="/assets/img/logo.svg"` in Task 4's nav/footer includes.

- [ ] **Step 1: Write the failing test**

Append to `tests/site.test.mjs`:

```js
test('logo mark uses the navy palette, not the old cyan/blue gradient', () => {
  const svg = readOutput('assets/img/logo.svg');
  assert.match(svg, /#1E3A8A/);
  assert.doesNotMatch(svg, /#00D4FF/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `ENOENT` reading `docs/assets/img/logo.svg`.

- [ ] **Step 3: Write `src/assets/img/logo.svg`**

```svg
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2C4A8C;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#1E3A8A;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0A1220;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="16" cy="16" r="14" fill="url(#logoGradient)" opacity="0.1"/>
  <circle cx="16" cy="16" r="12" fill="url(#logoGradient)" opacity="0.2"/>
  <circle cx="16" cy="16" r="10" fill="url(#logoGradient)" opacity="0.3"/>
  <circle cx="16" cy="16" r="8" fill="url(#logoGradient)" opacity="0.4"/>
  <circle cx="16" cy="16" r="6" fill="url(#logoGradient)" opacity="0.6"/>
  <circle cx="16" cy="16" r="4" fill="url(#logoGradient)" opacity="0.8"/>
  <circle cx="16" cy="16" r="2" fill="url(#logoGradient)"/>
</svg>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/assets/img/logo.svg tests/site.test.mjs
git commit -m "Recolor HexGuard logo mark to the navy palette"
```

---

### Task 4: Shared Layout, Navigation, and Footer

**Files:**
- Create: `src/_includes/base.njk`
- Create: `src/_includes/nav.njk`
- Create: `src/_includes/footer.njk`
- Create: `src/assets/js/nav.js`
- Modify: `src/index.njk` (use `layout: base.njk` instead of a full HTML document)
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: CSS classes from Task 2 (`.site-nav`, `.nav-inner`, `.nav-brand`, `.nav-links`, `.nav-dropdown`, `.nav-dropdown-toggle`, `.nav-dropdown-menu`, `.nav-cta`, `.nav-toggle`, `.site-footer`, `.footer-grid`, `.footer-col`, `.footer-brand`, `.footer-legal`, `.footer-bottom`, `.footer-social`), logo at `/assets/img/logo.svg` from Task 3.
- Produces: `layout: base.njk` — every later page sets this in front matter along with `title` and `description`; body content becomes `{{ content }}` wrapped in nav/main/footer.

- [ ] **Step 1: Write the failing test**

Append to `tests/site.test.mjs`:

```js
test('home page includes primary navigation and footer legal info', () => {
  const html = readOutput('index.html');
  assert.match(html, /href="\/services\/cloud-vapt\/"/);
  assert.match(html, /href="\/contact\/"/);
  assert.match(html, /U72900KA2024PTC186498/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — nav/footer markup doesn't exist yet.

- [ ] **Step 3: Write `src/_includes/nav.njk`**

```html
<header class="site-nav">
  <div class="container nav-inner">
    <a href="/" class="nav-brand">
      <img src="/assets/img/logo.svg" alt="HexGuard" class="nav-logo">
      <span>HexGuard</span>
    </a>
    <nav class="nav-links" aria-label="Primary">
      <a href="/">Home</a>
      <div class="nav-dropdown">
        <button class="nav-dropdown-toggle" aria-expanded="false">VAPT</button>
        <div class="nav-dropdown-menu">
          <a href="/services/cloud-vapt/">Cloud Security Assessment</a>
          <a href="/services/network-vapt/">Network Penetration Testing</a>
          <a href="/services/application-security/">Application/Product Security</a>
        </div>
      </div>
      <div class="nav-dropdown">
        <button class="nav-dropdown-toggle" aria-expanded="false">Security Solutions</button>
        <div class="nav-dropdown-menu">
          <a href="/services/network-implementation/">Network Infrastructure</a>
          <a href="/services/sdlc-security/">SDLC Integration</a>
          <a href="/services/policy-creation/">Policy &amp; Governance</a>
        </div>
      </div>
      <a href="/about/">About</a>
      <a href="/client-work/">Client Work</a>
      <a href="/contact/" class="nav-cta">Contact Us</a>
    </nav>
    <button class="nav-toggle" aria-label="Toggle navigation menu"><i class="fas fa-bars"></i></button>
  </div>
</header>
```

- [ ] **Step 4: Write `src/_includes/footer.njk`**

```html
<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      <img src="/assets/img/logo.svg" alt="HexGuard">
      <p>HexGuard Security (OPC) Private Limited</p>
      <p class="footer-legal">CIN: U72900KA2024PTC186498</p>
      <p class="footer-legal">No 11, Mourya Layout, Vartur<br>Bangalore, Karnataka, India, 560087</p>
    </div>
    <div class="footer-col">
      <h4>Services</h4>
      <a href="/services/">All Services</a>
      <a href="/services/cloud-vapt/">Cloud VAPT</a>
      <a href="/services/network-vapt/">Network VAPT</a>
      <a href="/services/application-security/">Application/Product Security</a>
      <a href="/services/network-implementation/">Network Implementation</a>
      <a href="/services/sdlc-security/">SDLC Security</a>
      <a href="/services/policy-creation/">Policy Creation</a>
    </div>
    <div class="footer-col">
      <h4>Company</h4>
      <a href="/about/">About</a>
      <a href="/client-work/">Client Work</a>
      <a href="/contact/">Contact</a>
    </div>
    <div class="footer-col">
      <h4>Legal</h4>
      <a href="/privacy-policy/">Privacy Policy</a>
      <a href="/terms-of-service/">Terms of Service</a>
    </div>
  </div>
  <div class="container footer-bottom">
    <span>&copy; 2026 HexGuard Security</span>
    <div class="footer-social">
      <a href="https://x.com/hexguardsec" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"><i class="fab fa-twitter"></i></a>
      <a href="https://www.linkedin.com/company/hexguardsec" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
      <a href="https://github.com/HexGuard-Security" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i class="fab fa-github"></i></a>
      <a href="https://www.facebook.com/hexguardsec" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
      <a href="https://www.instagram.com/hexguardsec" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
      <a href="https://www.youtube.com/@hexguardsec" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
    </div>
  </div>
</footer>
```

- [ ] **Step 5: Write `src/_includes/base.njk`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title }} | HexGuard Security</title>
  <meta name="description" content="{{ description }}">
  <link rel="icon" type="image/svg+xml" href="/assets/img/logo.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="/assets/css/tokens.css">
  <link rel="stylesheet" href="/assets/css/styles.css">
</head>
<body>
  {% include "nav.njk" %}
  <main>
    {{ content | safe }}
  </main>
  {% include "footer.njk" %}
  <script src="/assets/js/nav.js"></script>
</body>
</html>
```

- [ ] **Step 6: Write `src/assets/js/nav.js`**

```js
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('.nav-dropdown-toggle').forEach(function (button) {
    button.addEventListener('click', function () {
      var dropdown = button.parentElement;
      var isOpen = dropdown.classList.contains('is-open');

      document.querySelectorAll('.nav-dropdown.is-open').forEach(function (openDropdown) {
        openDropdown.classList.remove('is-open');
        openDropdown.querySelector('.nav-dropdown-toggle').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        dropdown.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
});
```

- [ ] **Step 7: Update `src/index.njk` to use the shared layout**

```html
---
layout: base.njk
title: Home
description: HexGuard Security — Cybersecurity VAPT and Security Solutions Consultancy
---
<section class="hero">
  <div class="container">
    <h1>HexGuard Security</h1>
    <p>Site under construction.</p>
  </div>
</section>
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add src/_includes/base.njk src/_includes/nav.njk src/_includes/footer.njk src/assets/js/nav.js src/index.njk tests/site.test.mjs
git commit -m "Add shared layout, navigation, and footer"
```

---

### Task 5: Home Page Content

**Files:**
- Modify: `src/index.njk` (replace stub content with full home page)
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: `.hero`, `.eyebrow`, `.lead`, `.hero-actions`, `.btn`, `.btn-primary`, `.btn-secondary`, `.trust-strip`, `.cert-badge`, `.cards-grid`, `.card`, `.stats-band`, `.stats-grid`, `.stat-item`, `.stat-number`, `.stat-label`, `.cta-band` from Task 2's stylesheet.

- [ ] **Step 1: Write the failing test**

Append to `tests/site.test.mjs`:

```js
test('home page has the new positioning headline, certifications, and engagement count', () => {
  const html = readOutput('index.html');
  assert.match(html, /Cybersecurity That Protects What You've Built/);
  assert.match(html, /OSCP/);
  assert.match(html, /31 engagements since 2020/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — stub page doesn't contain this copy.

- [ ] **Step 3: Replace the content of `src/index.njk`**

```html
---
layout: base.njk
title: Home
description: HexGuard Security helps organizations find and fix real vulnerabilities across cloud, network, and applications, and build lasting security into how they operate.
---
<section class="hero">
  <div class="container">
    <p class="eyebrow">Cybersecurity VAPT &amp; Security Solutions</p>
    <h1>Cybersecurity That Protects What You've Built</h1>
    <p class="lead">HexGuard Security helps organizations find and fix real vulnerabilities &mdash; across cloud, network, and applications &mdash; and build lasting security into how they operate.</p>
    <div class="hero-actions">
      <a href="/contact/" class="btn btn-primary">Book a Consultation</a>
      <a href="/services/" class="btn btn-secondary">Explore Services</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="trust-strip">
      <span class="cert-badge">CRTP</span>
      <span class="cert-badge">OSCP</span>
      <span class="cert-badge">OSED</span>
      <span class="cert-badge">CEH</span>
      <span class="cert-badge">CREST</span>
      <span class="trust-stat">31 engagements since 2020</span>
    </div>
  </div>
</section>

<section class="section-alt">
  <div class="container">
    <h2>How We Help</h2>
    <div class="cards-grid">
      <div class="card">
        <h3>Vulnerability Assessment &amp; Penetration Testing</h3>
        <p>Manual, expert-led testing of your cloud environments, networks, and applications to find exploitable vulnerabilities before attackers do.</p>
        <a href="/services/">Learn more &rarr;</a>
      </div>
      <div class="card">
        <h3>Security Solutions &amp; Implementation</h3>
        <p>Beyond the report &mdash; we help implement network security controls, integrate security into your SDLC, and build audit-ready security policies.</p>
        <a href="/services/">Learn more &rarr;</a>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>Why HexGuard</h2>
    <div class="cards-grid">
      <div class="card">
        <h3>Manual-First Testing</h3>
        <p>Automated scanners find the obvious. Our consultants manually validate and exploit findings to show real business impact, not noise.</p>
      </div>
      <div class="card">
        <h3>Certified, Experienced Consultants</h3>
        <p>Our team holds industry-recognized certifications including OSCP, OSED, CRTP, CEH, and CREST.</p>
      </div>
      <div class="card">
        <h3>Global Engagement Experience</h3>
        <p>We've delivered engagements for organizations across India and internationally.</p>
      </div>
      <div class="card">
        <h3>Beyond the Report</h3>
        <p>We don't just hand you a PDF. We help implement fixes &mdash; from network hardening to SDLC integration and policy creation.</p>
      </div>
    </div>
  </div>
</section>

<section class="stats-band">
  <div class="container">
    <h2>Proven Track Record</h2>
    <div class="stats-grid">
      <div class="stat-item">
        <span class="stat-number">31</span>
        <span class="stat-label">Engagements since 2020</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">15</span>
        <span class="stat-label">Since incorporation</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">5+</span>
        <span class="stat-label">Team certifications (CRTP, OSCP, OSED, CEH, CREST)</span>
      </div>
    </div>
    <p style="text-align:center; margin-top: 2rem;"><a href="/client-work/" style="color:#fff; text-decoration: underline;">See our client work &rarr;</a></p>
  </div>
</section>

<section class="cta-band">
  <div class="container">
    <h2>Ready to Understand Your Real Security Posture?</h2>
    <a href="/contact/" class="btn btn-primary-inverse">Book a Consultation</a>
  </div>
</section>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/index.njk tests/site.test.mjs
git commit -m "Write new Home page content and positioning"
```

---

### Task 6: Services Hub Page

**Files:**
- Create: `src/services/index.njk`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: `.hero`, `.section`, `.section-alt`, `.cards-grid`, `.card` from Task 2.

- [ ] **Step 1: Write the failing test**

Append to `tests/site.test.mjs`:

```js
test('services hub lists both categories and links to all six service pages', () => {
  const html = readOutput('services/index.html');
  assert.match(html, /Vulnerability Assessment/);
  assert.match(html, /Security Solutions/);
  assert.match(html, /href="\/services\/policy-creation\/"/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `ENOENT` reading `docs/services/index.html`.

- [ ] **Step 3: Write `src/services/index.njk`**

```html
---
layout: base.njk
title: Services
description: HexGuard Security services — Vulnerability Assessment & Penetration Testing (VAPT) and Security Solutions & Implementation.
---
<section class="hero">
  <div class="container">
    <p class="eyebrow">Services</p>
    <h1>Two Ways We Strengthen Your Security</h1>
    <p class="lead">Find real vulnerabilities before attackers do, and build the controls, processes, and policies that keep you secure long-term.</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>Vulnerability Assessment &amp; Penetration Testing (VAPT)</h2>
    <div class="cards-grid">
      <div class="card">
        <h3>Cloud Security Assessment</h3>
        <p>Identify misconfigurations, excessive permissions, and exploitable vulnerabilities across AWS, Azure, and GCP.</p>
        <a href="/services/cloud-vapt/">Learn more &rarr;</a>
      </div>
      <div class="card">
        <h3>Network Penetration Testing</h3>
        <p>Internal and external network testing to find exploitable vulnerabilities across your infrastructure.</p>
        <a href="/services/network-vapt/">Learn more &rarr;</a>
      </div>
      <div class="card">
        <h3>Application/Product Security</h3>
        <p>Manual and automated testing of your web applications, APIs, and products across the SDLC.</p>
        <a href="/services/application-security/">Learn more &rarr;</a>
      </div>
    </div>
  </div>
</section>

<section class="section-alt">
  <div class="container">
    <h2>Security Solutions &amp; Implementation</h2>
    <div class="cards-grid">
      <div class="card">
        <h3>Network Infrastructure Security</h3>
        <p>Design and implementation of segmentation, monitoring, and hardening across your network.</p>
        <a href="/services/network-implementation/">Learn more &rarr;</a>
      </div>
      <div class="card">
        <h3>SDLC Security Integration</h3>
        <p>Embed security into your development lifecycle, from secure coding to CI/CD security gates.</p>
        <a href="/services/sdlc-security/">Learn more &rarr;</a>
      </div>
      <div class="card">
        <h3>Policy &amp; Governance</h3>
        <p>Practical, audit-ready information security policies tailored to your organization.</p>
        <a href="/services/policy-creation/">Learn more &rarr;</a>
      </div>
    </div>
  </div>
</section>

<section class="cta-band">
  <div class="container">
    <h2>Not Sure Where to Start?</h2>
    <a href="/contact/" class="btn btn-primary-inverse">Talk to Us</a>
  </div>
</section>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/index.njk tests/site.test.mjs
git commit -m "Add services hub page"
```

---

### Task 7: Shared Service Page Layout

**Files:**
- Create: `src/_includes/service.njk`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: front-matter fields set by each of the 6 service pages (Tasks 8–13): `title`, `description`, `category`, `summary`, `whatItIs`, `whoForList` (array of strings), `methodology` (array of `{step, description}`), `deliverables` (array of strings), `engagementModel`, `faq` (array of `{q, a}`). Chains to `layout: base.njk`.
- Produces: the rendered service page body passed as `content` into `base.njk`.

- [ ] **Step 1: Write the failing test**

Create a temporary fixture page to exercise the layout, since no real service page exists yet. Append to `tests/site.test.mjs`:

```js
test('service layout renders all structured sections for a fixture service page', () => {
  const html = readOutput('services/_fixture/index.html');
  assert.match(html, /Fixture Service/);
  assert.match(html, /Who It's For/);
  assert.match(html, /Our Methodology/);
  assert.match(html, /Deliverables/);
  assert.match(html, /Frequently Asked Questions/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `ENOENT` reading `docs/services/_fixture/index.html`.

- [ ] **Step 3: Write `src/_includes/service.njk`**

```html
---
layout: base.njk
---
<section class="hero">
  <div class="container">
    <p class="eyebrow">{{ category }}</p>
    <h1>{{ title }}</h1>
    <p class="lead">{{ summary }}</p>
    <div class="hero-actions">
      <a href="/contact/" class="btn btn-primary">Book a Consultation</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>What It Is</h2>
    <p>{{ whatItIs }}</p>
  </div>
</section>

<section class="section-alt">
  <div class="container">
    <h2>Who It's For</h2>
    <ul class="check-list">
      {% for item in whoForList %}
      <li>{{ item }}</li>
      {% endfor %}
    </ul>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>Our Methodology</h2>
    <ol class="methodology-list">
      {% for step in methodology %}
      <li>
        <h3>{{ step.step }}</h3>
        <p>{{ step.description }}</p>
      </li>
      {% endfor %}
    </ol>
  </div>
</section>

<section class="section-alt">
  <div class="container">
    <h2>Deliverables</h2>
    <ul class="check-list">
      {% for item in deliverables %}
      <li>{{ item }}</li>
      {% endfor %}
    </ul>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>Engagement Model</h2>
    <p>{{ engagementModel }}</p>
  </div>
</section>

<section class="section-alt">
  <div class="container">
    <h2>Frequently Asked Questions</h2>
    <div class="faq-list">
      {% for item in faq %}
      <details class="faq-item">
        <summary>{{ item.q }}</summary>
        <p>{{ item.a }}</p>
      </details>
      {% endfor %}
    </div>
  </div>
</section>

<section class="cta-band">
  <div class="container">
    <h2>Ready to Talk About {{ title }}?</h2>
    <a href="/contact/" class="btn btn-primary-inverse">Contact HexGuard</a>
  </div>
</section>
```

- [ ] **Step 4: Write the fixture page `src/services/_fixture.njk`**

```html
---
layout: service.njk
title: Fixture Service
description: Fixture page used only to test the shared service layout.
category: Fixture
summary: This is a fixture page and is deleted once real service pages exist.
whatItIs: Fixture content.
whoForList:
  - Fixture audience
methodology:
  - step: Fixture Step
    description: Fixture description.
deliverables:
  - Fixture deliverable
engagementModel: Fixture engagement model.
faq:
  - q: Fixture question?
    a: Fixture answer.
---
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 6: Delete the fixture page and its test (it was only scaffolding to validate the shared layout)**

```bash
rm src/services/_fixture.njk
```

Remove the `'service layout renders all structured sections for a fixture service page'` test block from `tests/site.test.mjs`.

- [ ] **Step 7: Run the full test suite to confirm nothing else broke**

Run: `npm test`
Expected: PASS (fixture test removed, all other tests still pass)

- [ ] **Step 8: Commit**

```bash
git add src/_includes/service.njk tests/site.test.mjs
git status
git add -u
git commit -m "Add shared, data-driven layout for service pages"
```

---

### Task 8: Cloud VAPT Service Page

**Files:**
- Create: `src/services/cloud-vapt.njk`
- Modify: `tests/site.test.mjs`

- [ ] **Step 1: Write the failing test**

Append to `tests/site.test.mjs`:

```js
test('cloud VAPT service page renders with methodology and FAQ', () => {
  const html = readOutput('services/cloud-vapt/index.html');
  assert.match(html, /Cloud Security Assessment/);
  assert.match(html, /CIS benchmarks/);
  assert.match(html, /Which cloud providers do you support/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `ENOENT` reading `docs/services/cloud-vapt/index.html`.

- [ ] **Step 3: Write `src/services/cloud-vapt.njk`**

```html
---
layout: service.njk
title: Cloud Security Assessment (VAPT)
description: A structured assessment of your cloud environment to identify misconfigurations, excessive permissions, and exploitable vulnerabilities.
category: VAPT
summary: A structured assessment of your cloud environment (AWS, Azure, GCP) to identify misconfigurations, excessive permissions, and exploitable vulnerabilities before attackers do.
whatItIs: HexGuard's Cloud Security Assessment combines automated configuration review with manual, expert-led exploitation testing across your cloud accounts. We go beyond a compliance checklist to show you the real attack paths available to someone who gains a foothold in your environment.
whoForList:
  - Organizations running production workloads on AWS, Azure, or GCP
  - Teams who have not had an independent review of IAM policies and cloud configuration
  - Companies preparing for SOC 2, ISO 27001, or customer security questionnaires
methodology:
  - step: Scoping & Access Provisioning
    description: Define cloud accounts and subscriptions in scope, agree rules of engagement, and set up scoped, read-only access.
  - step: Configuration Review
    description: Assess IAM policies, storage bucket permissions, network security groups, logging/monitoring, and encryption settings against CIS benchmarks.
  - step: Exploitation & Privilege Escalation Testing
    description: Attempt to chain misconfigurations into real attack paths, including privilege escalation, data exposure, and lateral movement between services.
  - step: Reporting & Risk Rating
    description: Document findings with severity ratings, business impact, and reproduction steps.
  - step: Debrief & Remediation Support
    description: Walk through findings with your engineering team and advise on fixes.
deliverables:
  - Executive summary report for leadership
  - Detailed technical findings with reproduction steps and screenshots
  - Risk-rated remediation roadmap
  - One free retest of critical/high findings within 60 days
engagementModel: Typical cloud assessments run 1-3 weeks depending on the number of accounts and services in scope, and are billed as a fixed-price engagement agreed during scoping.
faq:
  - q: Do you need production access or credentials?
    a: We typically work with scoped, read-only IAM roles you provision for us; we never require your account root credentials.
  - q: Which cloud providers do you support?
    a: AWS, Microsoft Azure, and Google Cloud Platform.
  - q: Will testing disrupt our production environment?
    a: Cloud assessments are primarily configuration and permission reviews, so disruption risk is low; any active exploitation steps are scoped and agreed with you in advance.
---
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/cloud-vapt.njk tests/site.test.mjs
git commit -m "Add Cloud VAPT service page"
```

---

### Task 9: Network VAPT Service Page

**Files:**
- Create: `src/services/network-vapt.njk`
- Modify: `tests/site.test.mjs`

- [ ] **Step 1: Write the failing test**

Append to `tests/site.test.mjs`:

```js
test('network VAPT service page renders with methodology and FAQ', () => {
  const html = readOutput('services/network-vapt/index.html');
  assert.match(html, /Network Penetration Testing/);
  assert.match(html, /lateral movement/);
  assert.match(html, /Do you test internal networks/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `ENOENT` reading `docs/services/network-vapt/index.html`.

- [ ] **Step 3: Write `src/services/network-vapt.njk`**

```html
---
layout: service.njk
title: Network Penetration Testing (VAPT)
description: Internal and external network penetration testing to identify exploitable vulnerabilities across your infrastructure.
category: VAPT
summary: Internal and external network penetration testing to identify exploitable vulnerabilities across your infrastructure before they're used against you.
whatItIs: HexGuard's network penetration testing combines automated vulnerability scanning with manual exploitation to show which vulnerabilities are actually exploitable, and how far an attacker could move once inside your network.
whoForList:
  - Organizations that need regular VAPT for compliance (ISO 27001, PCI DSS, SOC 2, customer audits)
  - Companies wanting an independent view of their external attack surface
  - Teams planning infrastructure changes who want a security baseline first
methodology:
  - step: Reconnaissance & Scoping
    description: Enumerate in-scope IP ranges, domains, and network segments; agree testing windows and rules of engagement.
  - step: Vulnerability Discovery
    description: Automated and manual scanning of hosts, services, and network devices for known vulnerabilities and misconfigurations.
  - step: Manual Exploitation
    description: Attempt to exploit discovered vulnerabilities to validate real-world impact, including privilege escalation and lateral movement where in scope.
  - step: Post-Exploitation Analysis
    description: Assess how far an attacker could realistically move within the network from an initial foothold.
  - step: Reporting & Debrief
    description: Deliver a prioritized report and walk through findings with your technical team.
deliverables:
  - Executive summary and technical report with CVSS-rated findings
  - Network topology risk map showing lateral movement paths
  - Prioritized remediation plan
  - Retest of critical/high findings within 60 days
engagementModel: Typical internal/external network assessments run 1-2 weeks, scoped by number of live hosts and IP ranges, and can be scheduled outside business-critical hours on request.
faq:
  - q: Do you test internal networks, external networks, or both?
    a: Both — engagements can be scoped as external-only, internal-only, or combined based on your risk priorities.
  - q: Will you test during business hours?
    a: We plan testing windows with you in advance and can run outside business hours for sensitive systems.
  - q: What happens if you find a critical vulnerability mid-engagement?
    a: We flag critical, actively exploitable findings immediately rather than waiting for the final report, so you can start remediation right away.
---
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/network-vapt.njk tests/site.test.mjs
git commit -m "Add Network VAPT service page"
```

---

### Task 10: Application/Product Security Service Page

**Files:**
- Create: `src/services/application-security.njk`
- Modify: `tests/site.test.mjs`

- [ ] **Step 1: Write the failing test**

Append to `tests/site.test.mjs`:

```js
test('application security service page renders with methodology and FAQ', () => {
  const html = readOutput('services/application-security/index.html');
  assert.match(html, /Application\/Product Security/);
  assert.match(html, /OWASP Top 10/);
  assert.match(html, /Do you test mobile apps/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `ENOENT` reading `docs/services/application-security/index.html`.

- [ ] **Step 3: Write `src/services/application-security.njk`**

```html
---
layout: service.njk
title: Application/Product Security (VAPT)
description: Manual and automated security testing of your web applications, APIs, and products across the SDLC.
category: VAPT
summary: Manual and automated security testing of your web applications, APIs, and products across the SDLC — before release and on an ongoing basis.
whatItIs: HexGuard tests your applications the way a real attacker would — combining automated scanning with manual business-logic and access-control testing that tools alone can't find, across web apps, APIs, and connected mobile clients.
whoForList:
  - Product and engineering teams shipping web applications, APIs, or SaaS products
  - Companies required to provide a penetration test report to enterprise customers
  - Teams releasing major new features who want a pre-launch security check
methodology:
  - step: Threat Modeling & Scoping
    description: Understand the application architecture, authentication model, and data sensitivity to focus testing effort.
  - step: Automated Scanning
    description: Baseline scanning for common vulnerability classes across the OWASP Top 10 and OWASP API Top 10.
  - step: Manual Testing
    description: Business-logic abuse cases, authentication/authorization flaws, injection, and access control testing that automated tools miss.
  - step: API & Integration Testing
    description: Testing of REST/GraphQL APIs, third-party integrations, and mobile app backends where in scope.
  - step: Reporting & Fix Verification
    description: Deliver findings with proof-of-concept detail and retest fixes.
deliverables:
  - Detailed technical report mapped to the OWASP Top 10 and OWASP API Top 10
  - Proof-of-concept evidence for each finding
  - Developer-facing remediation guidance
  - One retest cycle for critical/high findings
engagementModel: Application assessments typically run 1-4 weeks depending on application size and the number of user roles/APIs in scope.
faq:
  - q: Do you test mobile apps as well as web apps?
    a: Yes — where the mobile app talks to APIs in scope, we include client-side and API-level testing.
  - q: Can you test in a staging environment instead of production?
    a: Yes, and it's usually preferred; we agree the target environment during scoping.
  - q: Do you provide a letter/certificate we can share with customers?
    a: Yes, we provide an executive summary and attestation letter suitable for sharing with your customers or auditors.
---
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/application-security.njk tests/site.test.mjs
git commit -m "Add Application/Product Security service page"
```

---

### Task 11: Network Infrastructure Implementation Service Page

**Files:**
- Create: `src/services/network-implementation.njk`
- Modify: `tests/site.test.mjs`

- [ ] **Step 1: Write the failing test**

Append to `tests/site.test.mjs`:

```js
test('network implementation service page renders with methodology and FAQ', () => {
  const html = readOutput('services/network-implementation/index.html');
  assert.match(html, /Network Infrastructure Security/);
  assert.match(html, /segmentation/);
  assert.match(html, /administrative access to our network devices/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `ENOENT` reading `docs/services/network-implementation/index.html`.

- [ ] **Step 3: Write `src/services/network-implementation.njk`**

```html
---
layout: service.njk
title: Network Infrastructure Security Implementation
description: Design and implementation of security controls across your network infrastructure — segmentation, monitoring, and hardening.
category: Security Solutions & Implementation
summary: Design and implementation of security controls across your network infrastructure — segmentation, monitoring, and hardening — not just testing, but fixing.
whatItIs: We work alongside your IT and network teams to design and implement the network security architecture your organization actually needs, whether you're starting from scratch or acting on findings from a penetration test.
whoForList:
  - Organizations that received a VAPT report and need help implementing the fixes
  - Growing companies building out network security controls for the first time
  - Teams needing help designing secure network architecture for new offices, data centers, or cloud connectivity
methodology:
  - step: Current-State Assessment
    description: Review existing network architecture, firewall rules, and monitoring coverage.
  - step: Design
    description: Propose segmentation, access control, and monitoring architecture aligned to your risk profile and growth plans.
  - step: Implementation Support
    description: Work alongside your IT/network team to configure firewalls, VPNs, network segmentation, and logging.
  - step: Validation
    description: Verify controls behave as designed through targeted testing.
  - step: Documentation & Handover
    description: Provide network security architecture documentation and operating procedures for your team.
deliverables:
  - Network security architecture document
  - Implementation runbook and configuration guidance
  - Validation test results
  - Operational handover documentation
engagementModel: Scoped as a project engagement based on network size and complexity, typically 2-6 weeks, with an optional ongoing advisory retainer.
faq:
  - q: Do you need administrative access to our network devices?
    a: We work alongside your team; access level is agreed during scoping and can range from advisory-only to hands-on configuration support.
  - q: Can you help implement fixes from a VAPT report done by another vendor?
    a: Yes, we regularly help implement remediation for findings from third-party assessments.
  - q: Do you support hybrid/cloud-connected network setups?
    a: Yes, including site-to-cloud VPN, SD-WAN, and hybrid segmentation architectures.
---
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/network-implementation.njk tests/site.test.mjs
git commit -m "Add Network Infrastructure Security Implementation page"
```

---

### Task 12: SDLC Security Integration Service Page

**Files:**
- Create: `src/services/sdlc-security.njk`
- Modify: `tests/site.test.mjs`

- [ ] **Step 1: Write the failing test**

Append to `tests/site.test.mjs`:

```js
test('SDLC security service page renders with methodology and FAQ', () => {
  const html = readOutput('services/sdlc-security/index.html');
  assert.match(html, /SDLC Security Integration/);
  assert.match(html, /CI\/CD/);
  assert.match(html, /Which CI\/CD platforms do you support/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `ENOENT` reading `docs/services/sdlc-security/index.html`.

- [ ] **Step 3: Write `src/services/sdlc-security.njk`**

```html
---
layout: service.njk
title: SDLC Security Integration
description: Embedding security into your software development lifecycle, from secure coding standards to CI/CD security gates.
category: Security Solutions & Implementation
summary: Embedding security into your software development lifecycle — from secure coding standards to CI/CD security gates — so vulnerabilities are caught before release.
whatItIs: We help engineering teams shift security left by embedding practical, low-friction security gates and secure coding practices directly into your existing development workflow, rather than bolting on security as an afterthought.
whoForList:
  - Engineering teams without a formal secure development process
  - Companies wanting to add security gates (SAST/DAST/dependency scanning) into CI/CD
  - Organizations needing to demonstrate secure SDLC practices for compliance or customer audits
methodology:
  - step: SDLC Assessment
    description: Review your current development process, tooling, and release pipeline for security gaps.
  - step: Tooling & Gate Design
    description: Recommend and help configure SAST, dependency/SCA scanning, and secrets detection integrated into CI/CD.
  - step: Secure Coding Enablement
    description: Provide secure coding guidelines and targeted training for your development team based on your tech stack.
  - step: Pipeline Integration
    description: Implement security gates and reporting into your existing CI/CD pipeline.
  - step: Process Documentation
    description: Document the resulting secure SDLC process for audits and onboarding.
deliverables:
  - SDLC security gap assessment
  - Configured CI/CD security gates (SAST/SCA/secrets scanning)
  - Secure coding guidelines tailored to your stack
  - SDLC security process documentation
engagementModel: Typically a 3-6 week engagement depending on the number of pipelines and repositories, with an optional ongoing advisory retainer for new projects.
faq:
  - q: Which CI/CD platforms do you support?
    a: We work with common platforms including GitHub Actions, GitLab CI, Jenkins, and Azure DevOps.
  - q: Do you provide developer training?
    a: Yes, we include targeted secure coding sessions based on the vulnerability classes most relevant to your stack.
  - q: Will this slow down our release pipeline?
    a: Gates are tuned to flag high-confidence, high-severity issues so they don't become a bottleneck for routine releases.
---
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/sdlc-security.njk tests/site.test.mjs
git commit -m "Add SDLC Security Integration service page"
```

---

### Task 13: Policy & Governance Service Page

**Files:**
- Create: `src/services/policy-creation.njk`
- Modify: `tests/site.test.mjs`

- [ ] **Step 1: Write the failing test**

Append to `tests/site.test.mjs`:

```js
test('policy creation service page renders with methodology and FAQ', () => {
  const html = readOutput('services/policy-creation/index.html');
  assert.match(html, /Policy &amp; Governance|Policy & Governance/);
  assert.match(html, /ISO 27001/);
  assert.match(html, /help us pass an ISO 27001/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `ENOENT` reading `docs/services/policy-creation/index.html`.

- [ ] **Step 3: Write `src/services/policy-creation.njk`**

```html
---
layout: service.njk
title: Policy & Governance
description: Practical, audit-ready information security policies and governance frameworks tailored to your organization.
category: Security Solutions & Implementation
summary: Practical, audit-ready information security policies and governance frameworks tailored to your organization's size and risk profile — not generic templates.
whatItIs: We write information security policies that reflect how your organization actually operates, so they hold up under audit and are actually followed day to day, rather than generic templates that sit unread.
whoForList:
  - Organizations pursuing ISO 27001, SOC 2, or similar compliance certifications
  - Companies without formal information security policies in place
  - Teams that have policies on paper but not reflected in actual practice
methodology:
  - step: Gap Assessment
    description: Review existing policies (if any) and practices against your compliance or risk objectives.
  - step: Policy Drafting
    description: Draft information security policies covering access control, incident response, data classification, acceptable use, vendor risk, and more as needed.
  - step: Stakeholder Review
    description: Work with your leadership and relevant teams to align policies with actual operational practice.
  - step: Rollout Support
    description: Help communicate and roll out policies across the organization.
  - step: Ongoing Governance
    description: Optional periodic review to keep policies current as your organization grows.
deliverables:
  - Gap assessment report
  - Complete set of tailored information security policies
  - Rollout/communication plan
  - Annual review recommendation
engagementModel: Initial policy development typically runs 2-4 weeks depending on scope, with an optional annual review retainer.
faq:
  - q: Will these policies help us pass an ISO 27001 or SOC 2 audit?
    a: Yes, policies are structured to align with common frameworks like ISO 27001 Annex A and SOC 2 Trust Services Criteria, though certification also depends on your operational evidence.
  - q: Do you provide templates or fully custom policies?
    a: Policies are tailored to your organization's actual size, industry, and risk profile rather than generic templates.
  - q: Can you help train staff on the new policies?
    a: Yes, we can run rollout sessions to help staff understand and adopt new policies.
---
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/policy-creation.njk tests/site.test.mjs
git commit -m "Add Policy & Governance service page"
```

---

### Task 14: About Page

**Files:**
- Create: `src/about.njk`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: `.hero`, `.section`, `.section-alt`, `.trust-strip`, `.cert-badge`, `.team-grid`, `.team-card`, `.team-role` from Task 2.

- [ ] **Step 1: Write the failing test**

Append to `tests/site.test.mjs`:

```js
test('about page lists company facts, certifications, and team with roles', () => {
  const html = readOutput('about/index.html');
  assert.match(html, /U72900KA2024PTC186498/);
  assert.match(html, /CRTP/);
  assert.match(html, /Adlin Seedon D&#39;Souza|Adlin Seedon D'Souza/);
  assert.match(html, /Founder/);
  assert.match(html, /Advisor/);
  assert.match(html, /Security Consultant/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `ENOENT` reading `docs/about/index.html`.

- [ ] **Step 3: Write `src/about.njk`**

```html
---
layout: base.njk
title: About
description: HexGuard Security is a cybersecurity VAPT and security solutions consultancy, founded in India, serving clients globally.
---
<section class="hero">
  <div class="container">
    <p class="eyebrow">About HexGuard</p>
    <h1>Security Testing and Implementation You Can Trust</h1>
    <p class="lead">HexGuard Security exists to help organizations understand and reduce real security risk &mdash; through rigorous testing, practical implementation support, and policies that hold up under audit and under attack.</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>Company</h2>
    <p><strong>HexGuard Security (OPC) Private Limited</strong></p>
    <p>Corporate Identity Number: U72900KA2024PTC186498</p>
    <p>Registered Office: No 11, Mourya Layout, Vartur, Bangalore, Karnataka, India, 560087</p>
  </div>
</section>

<section class="section-alt">
  <div class="container">
    <h2>Certifications</h2>
    <div class="trust-strip">
      <span class="cert-badge">CRTP</span>
      <span class="cert-badge">OSCP</span>
      <span class="cert-badge">OSED</span>
      <span class="cert-badge">CEH</span>
      <span class="cert-badge">CREST</span>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>Our Team</h2>
    <div class="team-grid">
      <div class="team-card">
        <h3>Adlin Seedon D'Souza</h3>
        <p class="team-role">Founder</p>
      </div>
      <div class="team-card">
        <h3>Prashant KV</h3>
        <p class="team-role">Advisor</p>
      </div>
      <div class="team-card">
        <h3>Mohd. Arif</h3>
        <p class="team-role">Security Consultant</p>
      </div>
      <div class="team-card">
        <h3>Fazalu Rahman</h3>
        <p class="team-role">Security Consultant</p>
      </div>
      <div class="team-card">
        <h3>Dhanesh Sivasamy</h3>
        <p class="team-role">Security Consultant</p>
      </div>
      <div class="team-card">
        <h3>Minhaj</h3>
        <p class="team-role">Security Consultant</p>
      </div>
      <div class="team-card">
        <h3>Sanju Patil</h3>
        <p class="team-role">Security Consultant</p>
      </div>
      <div class="team-card">
        <h3>Franveen Deepak D'Souza</h3>
        <p class="team-role">Security Consultant</p>
      </div>
    </div>
  </div>
</section>

<section class="cta-band">
  <div class="container">
    <h2>Want to Work With Us?</h2>
    <a href="/contact/" class="btn btn-primary-inverse">Contact HexGuard</a>
  </div>
</section>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/about.njk tests/site.test.mjs
git commit -m "Add About page with company facts, certifications, and team"
```

---

### Task 15: Client Work Page

**Files:**
- Create: `src/client-work.njk`
- Modify: `tests/site.test.mjs`

**Note:** The anonymized engagement summaries below are illustrative drafts written to satisfy the design spec's requirement for anonymized, non-named client content. Per spec Section 7, review these with the user for factual accuracy before the site goes live.

- [ ] **Step 1: Write the failing test**

Append to `tests/site.test.mjs`:

```js
test('client work page has real stats and anonymized engagement summaries', () => {
  const html = readOutput('client-work/index.html');
  assert.match(html, /31/);
  assert.match(html, /15/);
  assert.match(html, /Fintech Startup/);
  assert.doesNotMatch(html, /hexguardsec@gmail\.com.*client|client.*@/i);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `ENOENT` reading `docs/client-work/index.html`.

- [ ] **Step 3: Write `src/client-work.njk`**

```html
---
layout: base.njk
title: Client Work
description: HexGuard Security has delivered 31 security engagements since 2020, across India and globally.
---
<section class="hero">
  <div class="container">
    <p class="eyebrow">Client Work</p>
    <h1>Real Engagements, Real Impact</h1>
    <p class="lead">Because our work is NDA-bound, we can't name clients &mdash; but here's an honest look at the scale and impact of our engagements so far.</p>
  </div>
</section>

<section class="stats-band">
  <div class="container">
    <div class="stats-grid">
      <div class="stat-item">
        <span class="stat-number">31</span>
        <span class="stat-label">Engagements since 2020</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">15</span>
        <span class="stat-label">Since incorporation as HexGuard Security (OPC) Private Limited</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">India &amp; Global</span>
        <span class="stat-label">Client locations</span>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>Illustrative Engagement Summaries</h2>
    <p>All client details below are anonymized. No client names, logos, or identifying information are shared without explicit permission.</p>
    <div class="cards-grid">
      <div class="card">
        <h3>Fintech Startup (India) &mdash; Cloud &amp; Application VAPT</h3>
        <p>Engaged ahead of a funding round. Testing uncovered a critical privilege escalation path between staging and production cloud environments. The client remediated the finding within 48 hours, avoiding a potential compliance flag during due diligence.</p>
      </div>
      <div class="card">
        <h3>Enterprise SaaS Provider (Global) &mdash; Application Security</h3>
        <p>Performed a full application penetration test ahead of a major enterprise customer's security review. Findings were resolved and retested within the audit deadline, helping close a contract contingent on passing that review.</p>
      </div>
      <div class="card">
        <h3>Manufacturing Company (India) &mdash; Network VAPT &amp; Implementation</h3>
        <p>An internal network penetration test revealed flat network segmentation exposing operational technology systems to the corporate network. HexGuard designed and helped implement segmentation controls, reducing the blast radius of a potential ransomware incident.</p>
      </div>
      <div class="card">
        <h3>Healthcare Technology Company (Global) &mdash; Policy Creation</h3>
        <p>Helped build a first formal information security policy set ahead of an ISO 27001 certification effort, aligning existing informal practices with audit-ready documentation.</p>
      </div>
    </div>
  </div>
</section>

<section class="cta-band">
  <div class="container">
    <h2>Ready to Be Our Next Engagement?</h2>
    <a href="/contact/" class="btn btn-primary-inverse">Book a Consultation</a>
  </div>
</section>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/client-work.njk tests/site.test.mjs
git commit -m "Add Client Work page with engagement stats and anonymized summaries"
```

---

### Task 16: Contact Page

**Files:**
- Create: `src/contact.njk`
- Modify: `tests/site.test.mjs`

- [ ] **Step 1: Write the failing test**

Append to `tests/site.test.mjs`:

```js
test('contact page has a mailto CTA and carried-over contact info', () => {
  const html = readOutput('contact/index.html');
  assert.match(html, /mailto:hexguardsec@gmail\.com/);
  assert.match(html, /\+91 6366934469/);
  assert.match(html, /U72900KA2024PTC186498/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `ENOENT` reading `docs/contact/index.html`.

- [ ] **Step 3: Write `src/contact.njk`**

```html
---
layout: base.njk
title: Contact
description: Contact HexGuard Security to discuss a VAPT engagement or security solutions project.
---
<section class="hero">
  <div class="container">
    <p class="eyebrow">Get in Touch</p>
    <h1>Let's Talk About Your Security</h1>
    <p class="lead">Whether you need a VAPT engagement or help implementing security controls, reach out and we'll get back to you.</p>
    <div class="hero-actions">
      <a href="mailto:hexguardsec@gmail.com?subject=Security%20Consultation%20Inquiry" class="btn btn-primary">Email Us</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container cards-grid">
    <div class="card">
      <h3>Contact Information</h3>
      <p>Email: hexguardsec@gmail.com</p>
      <p>Phone: +91 6366934469</p>
      <p>Business Hours: Mon-Fri: 2AM-10AM UTC</p>
    </div>
    <div class="card">
      <h3>Company Information</h3>
      <p>HexGuard Security (OPC) Private Limited</p>
      <p>CIN: U72900KA2024PTC186498</p>
      <p>No 11, Mourya Layout, Vartur<br>Bangalore, Karnataka, India, 560087</p>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/contact.njk tests/site.test.mjs
git commit -m "Add Contact page with mailto CTA"
```

---

### Task 17: Privacy Policy Page

**Files:**
- Create: `src/privacy-policy.njk`
- Modify: `tests/site.test.mjs`

**Note:** This is placeholder legal content per spec Section 5 — flag for the user's legal counsel to review before treating it as binding.

- [ ] **Step 1: Write the failing test**

Append to `tests/site.test.mjs`:

```js
test('privacy policy page exists and covers data collection and confidentiality', () => {
  const html = readOutput('privacy-policy/index.html');
  assert.match(html, /Privacy Policy/);
  assert.match(html, /does not use cookies/);
  assert.match(html, /confidential/i);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `ENOENT` reading `docs/privacy-policy/index.html`.

- [ ] **Step 3: Write `src/privacy-policy.njk`**

```html
---
layout: base.njk
title: Privacy Policy
description: HexGuard Security Privacy Policy.
---
<section class="hero">
  <div class="container">
    <p class="eyebrow">Legal</p>
    <h1>Privacy Policy</h1>
    <p class="lead">Effective Date: July 2, 2026</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>Website Data Collection</h2>
    <p>This website does not use cookies or tracking technologies, and does not collect personal data through forms. The only personal data HexGuard Security receives from visitors is what you voluntarily send us by email at hexguardsec@gmail.com.</p>

    <h2>Engagement Data</h2>
    <p>Where you engage HexGuard Security for a security assessment or consulting service, any data shared with us in connection with that engagement (including systems information, credentials, and findings) is treated as strictly confidential and is governed by the separate confidentiality/NDA terms agreed in your engagement contract, not by this website's Privacy Policy.</p>

    <h2>Third-Party Services</h2>
    <p>This website loads fonts and icon assets from third-party content delivery networks (Google Fonts, cdnjs). These providers may process standard technical request data (such as IP address and browser type) as part of serving those assets.</p>

    <h2>Contact</h2>
    <p>Questions about this Privacy Policy can be sent to hexguardsec@gmail.com.</p>

    <p><em>This page is a general policy summary and does not replace the confidentiality and data handling terms in a signed engagement contract. It should be reviewed by qualified legal counsel before being relied upon as a binding legal document.</em></p>
  </div>
</section>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/privacy-policy.njk tests/site.test.mjs
git commit -m "Add Privacy Policy page"
```

---

### Task 18: Terms of Service Page

**Files:**
- Create: `src/terms-of-service.njk`
- Modify: `tests/site.test.mjs`

**Note:** This is placeholder legal content per spec Section 5 — flag for the user's legal counsel to review before treating it as binding.

- [ ] **Step 1: Write the failing test**

Append to `tests/site.test.mjs`:

```js
test('terms of service page exists and covers authorization and liability', () => {
  const html = readOutput('terms-of-service/index.html');
  assert.match(html, /Terms of Service/);
  assert.match(html, /authorized/i);
  assert.match(html, /liability/i);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `ENOENT` reading `docs/terms-of-service/index.html`.

- [ ] **Step 3: Write `src/terms-of-service.njk`**

```html
---
layout: base.njk
title: Terms of Service
description: HexGuard Security Terms of Service.
---
<section class="hero">
  <div class="container">
    <p class="eyebrow">Legal</p>
    <h1>Terms of Service</h1>
    <p class="lead">Effective Date: July 2, 2026</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2>Use of This Website</h2>
    <p>This website is provided by HexGuard Security (OPC) Private Limited to describe our services and provide a way to get in touch. Content on this site is for general informational purposes and does not constitute a binding offer of services.</p>

    <h2>Security Testing Authorization</h2>
    <p>All security testing services (including VAPT engagements) described on this website are performed only under a signed Statement of Work and explicit written authorization from the client for the specific systems in scope. HexGuard Security does not perform, and this website does not authorize, any testing of systems without the system owner's explicit written consent.</p>

    <h2>Engagement Terms</h2>
    <p>The specific scope, deliverables, timeline, fees, confidentiality obligations, and liability terms for any consulting or testing engagement are set out in a separate signed contract or Statement of Work between HexGuard Security and the client, which takes precedence over this general website Terms of Service for that engagement.</p>

    <h2>Limitation of Liability</h2>
    <p>To the maximum extent permitted by law, HexGuard Security is not liable for any indirect, incidental, or consequential damages arising from use of this website. Liability arising from a specific engagement is governed by that engagement's signed contract.</p>

    <h2>Governing Law</h2>
    <p>These terms are governed by the laws of India.</p>

    <h2>Contact</h2>
    <p>Questions about these Terms can be sent to hexguardsec@gmail.com.</p>

    <p><em>This page is a general terms summary and does not replace the terms in a signed engagement contract. It should be reviewed by qualified legal counsel before being relied upon as a binding legal document.</em></p>
  </div>
</section>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/terms-of-service.njk tests/site.test.mjs
git commit -m "Add Terms of Service page"
```

---

### Task 19: README Update and Full-Site Verification

**Files:**
- Modify: `README.md`
- Modify: `tests/site.test.mjs`

- [ ] **Step 1: Write the failing test**

Append to `tests/site.test.mjs`:

```js
test('every top-level page in the sitemap builds successfully', () => {
  const pages = [
    'index.html',
    'services/index.html',
    'services/cloud-vapt/index.html',
    'services/network-vapt/index.html',
    'services/application-security/index.html',
    'services/network-implementation/index.html',
    'services/sdlc-security/index.html',
    'services/policy-creation/index.html',
    'about/index.html',
    'client-work/index.html',
    'contact/index.html',
    'privacy-policy/index.html',
    'terms-of-service/index.html',
  ];

  for (const page of pages) {
    const html = readOutput(page);
    assert.match(html, /<html/, `${page} did not build valid HTML`);
    assert.match(html, /class="site-nav"/, `${page} is missing the shared nav`);
    assert.match(html, /class="site-footer"/, `${page} is missing the shared footer`);
  }
});
```

- [ ] **Step 2: Run test to verify it passes (this is a coverage check on already-built pages, not new functionality)**

Run: `npm test`
Expected: PASS. If any page fails, fix that page's template before proceeding — do not skip this check.

- [ ] **Step 3: Update `README.md`**

Replace the "Local Preview" and "Deployment" sections:

```markdown
### Local Preview

This site is built with [Eleventy](https://www.11ty.dev/). To preview it locally:

```bash
npm install
npm run serve
# open http://localhost:8080
```

### Building

```bash
npm run build
```

This compiles the templates in `src/` into static HTML in `docs/`, which is the GitHub Pages source directory.

### Testing

```bash
npm test
```

This builds the site and runs assertions against the generated HTML in `docs/` using Node's built-in test runner.

### Deployment

The site is served from the `docs/` directory on the `main` branch using GitHub Pages. After making changes under `src/`, run `npm run build`, commit both the `src/` changes and the regenerated `docs/` output, and push to `main` — GitHub Pages will pick up the change automatically.
```

- [ ] **Step 4: Commit**

```bash
git add README.md tests/site.test.mjs
git commit -m "Update README with Eleventy build instructions and add full-sitemap build check"
```

---

## Self-Review Notes

- **Spec coverage:** Every page in the spec's sitemap (Section 3) has a task (Tasks 5, 6, 8-18); design system (Section 4) is implemented in Task 2 (palette/typography/layout) and Task 3 (logo); content plan (Section 5) is implemented per-page in Tasks 5, 6, 8-18; technical architecture (Section 6) is implemented in Task 1 (Eleventy/build) and Task 4 (shared layout/nav/footer); `docs/ctf/` removal (Section 3) is handled in Task 1.
- **Placeholder scan:** No TBD/TODO steps. The two legal pages (Tasks 17-18) and the client-work summaries (Task 15) contain complete, real draft text, with an explicit note (not a placeholder) that they need the user's/legal review before launch, per spec Section 7.
- **Type/interface consistency:** Service page front-matter keys (`title`, `description`, `category`, `summary`, `whatItIs`, `whoForList`, `methodology`, `deliverables`, `engagementModel`, `faq`) are defined once in Task 7's `service.njk` and used identically across Tasks 8-13. `layout: base.njk` / `layout: service.njk` chaining is consistent across all page tasks.
