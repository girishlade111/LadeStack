# LadeStack — Empowering Developers with AI Tools

LadeStack is the brand home page for **LadeStack**: a collection of free, open-source
AI-powered development tools built for modern developers. This repository holds the
static website that introduces the brand — hero, tool showcase, features, and contact —
as plain HTML/CSS/JS with no build step.

## Features

- Editorial landing page for the LadeStack brand and tool ecosystem
- Tool cards highlighting AI-powered developer utilities
- Responsive layout that works on desktop and mobile
- Client-side interactivity, including an AI demo powered by Google Gemini
  (users supply their own Gemini API key in the browser — nothing is sent to a backend)
- Zero build step: open `index.html` and it just works

## Tech Stack

- **HTML5** — semantic markup, Open Graph / Twitter Card meta tags
- **CSS3** — custom `styles.css`, responsive grid layouts
- **Vanilla JavaScript** — `script.js`, no frameworks, no dependencies
- **Hosting:** GitHub Pages (static)

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/girishlade111/LadeStack.git
   cd LadeStack
   ```
2. Open `index.html` in any browser — or serve it locally:
   ```bash
   npx serve .
   ```
3. For the AI demo on the page, paste your own Gemini API key into the demo input.
   The key stays in your browser; it is never stored or sent anywhere else.

## Project Structure

```
LadeStack/
├── index.html      # landing page (hero, tools, features, contact)
├── styles.css      # all styling, responsive breakpoints
├── script.js       # client-side interactivity + Gemini demo
├── IMG*.jpg        # hero / brand imagery
└── README.md
```

## Deploy

This site is deployed as a static site on **GitHub Pages** straight from the `main`
branch (`/` path). Any push to `main` re-publishes automatically.

## Environment Variables

None required. The on-page AI demo optionally accepts a user-provided Gemini API key
at runtime (browser-only).

---

*Built by Girish Lade — [ladestack.in](https://ladestack.in)*
