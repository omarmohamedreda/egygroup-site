# Egy Group Company — Website (Static HTML/CSS/JS)

A 6-page, framework-free, responsive marketing site for a plastics/pipe
manufacturer, built with semantic HTML, one shared stylesheet, and one
small JS file.

## Project structure

```
egygroup-site/
├── index.html          Home
├── about.html           About Us
├── products.html        Products (PVC-U, PPR, PPH, Fittings)
├── brands.html           Brands & partners
├── services.html        Services
├── contact.html         Contact Us (validated form)
├── css/
│   └── style.css        Single stylesheet: tokens, layout, components
├── js/
│   └── main.js           Nav toggle, active link, smooth scroll, form validation
└── assets/               (empty — see "Adding real images" below)
```

There is no build step. Every page is a plain `.html` file that links the
same `css/style.css` and `js/main.js`.

## Run it locally

1. Unzip the project.
2. Double-click `index.html` to open it in your browser — or, for best
   results with relative paths, serve it with a tiny local server:
   ```bash
   cd egygroup-site
   python3 -m http.server 8000
   # then open http://localhost:8000
   ```
3. Click through the nav to confirm all six pages load and the mobile
   menu (resize the window below ~860px) opens and closes correctly.

No dependencies, no `npm install`. Google Fonts (Space Grotesk + Inter)
load from a CDN `<link>` in each page's `<head>` — the site still works
without internet access, it just falls back to system fonts.

## How the shared header/footer works

This is plain static HTML, so the header and footer markup is **duplicated
in each page** rather than injected via JavaScript `fetch()`. That's
deliberate: fetching partials from `file://` fails silently in some
browsers, and duplicated markup keeps every page crawlable and fast.
The trade-off is that editing the nav/footer means editing all six files.

**If the site grows past ~10 pages**, consider one of:
- A static site generator (11ty, Astro, Jekyll) with a real header/footer
  partial — the CSS and JS here will drop in mostly unchanged.
- Server-side includes if hosting on Apache/Nginx (`<!--#include -->`).
- A tiny build script that stitches `header.html` + page + `footer.html`
  before deploy.

## Common tweaks

- **Colors / fonts** — everything is driven by CSS custom properties at
  the top of `css/style.css` (`:root { --color-orange: ...; }`). Change a
  token once, it updates the whole site.
- **Add a nav link** — add an `<li><a href="...">` inside `<nav class="main-nav">`
  in all six files, and add matching footer links if relevant.
- **Add a new page** — copy any existing page, keep the header/footer,
  replace `<main>`'s content, update `<title>`/`<meta description>`, and
  add it to the nav in the other six files.
- **Real logo / photos** — replace the inline `<svg>` brand mark and the
  placeholder brand tiles (`brands.html`) with `<img src="assets/...">`.
  Drop image files into `assets/` and update the `src` paths; keep the
  `alt` text meaningful for accessibility/SEO.
- **Wire up the contact form** — `js/main.js` currently validates the
  form client-side and shows a fake "success" message on submit (no
  backend). To actually send messages, either:
  - point the `<form>` at a form-backend service (Formspree, Getform,
    Netlify Forms) by setting `action`/`method` and removing the
    `e.preventDefault()` submit-hijack in `main.js`, or
  - wire it to your own backend endpoint with `fetch()` inside the
    existing `submit` handler.
- **Real map** — swap the SVG placeholder in `contact.html` for a Google
  Maps `<iframe>` embed once you have a maps API key/embed URL.

## Accessibility & SEO notes already in place

- Semantic landmarks (`header`, `nav`, `main`, `footer`), one `<h1>` per
  page, logical heading order.
- Skip-to-content link, visible focus outlines, `aria-current="page"` on
  the active nav link (set automatically by `main.js`).
- Form fields have associated `<label>`s, `aria-required`, and live
  error text tied via `aria-describedby`; the status banner uses
  `aria-live="polite"`.
- Unique `<title>` and `<meta name="description">` per page; `alt`/`aria-label`
  on every decorative and informational SVG.
- `prefers-reduced-motion` respected for smooth scrolling and transitions.

## Deploying

This is a static site — upload the whole `egygroup-site/` folder as-is to
any static host (Netlify, Vercel, GitHub Pages, S3, or a plain Apache/Nginx
server). No server-side processing required.
