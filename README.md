# AdemDEV Portfolio Website

A custom Minecraft-themed portfolio and storefront website built with plain HTML, CSS, and JavaScript.

This site is fully config-driven, so most updates can be done from a single file without touching most code.

## Features

- Config-driven content rendering for projects, services, stats, and store items
- Project gallery modal with image navigation
- Store item modal with Markdown support
- Custom UI textures, sounds, and glyph assets
- Responsive layout for desktop and mobile
- No build step required (static site)

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Marked (CDN) for Markdown rendering

## Project Structure

```text
.
|-- index.html          # Main page structure
|-- styles.css          # Full site styling
|-- index.js            # Rendering, interactions, modals, markdown loading
|-- config.js           # Main content source (edit this most often)
|-- markdown/           # Markdown content for store modal descriptions
|-- images/             # Project/store/cover assets
|-- fonts/              # Minecraft-style fonts
|-- sounds/             # UI click audio assets
|-- ui/                 # Button textures, glyphs, and UI textures
`-- README.md
```

## Quick Start

### 1. Clone

```bash
git clone https://github.com/AdemonG1tHub/AdemDEV-Portfolio.git
cd AdemDEV-Portfolio
```

### 2. Run Locally

Because this is a static site, use any local server.

Python:

```bash
python -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

Optional (Node):

```bash
npx serve .
```

## Editing Content

Most content is controlled in config.js.

You can update:

- Hero identity and contact links
- Stats and skills
- Projects (including cover image, status, tags, links, gallery)
- Services
- Store items and modal descriptions

### Markdown in Store Items

In `currentlySelling` entries, `md` supports either:

- Inline markdown text
- A local markdown file path (example: markdown/astral-engine.md)

## Asset Notes

- Keep image paths relative to the project root (example: images/cover-art/MyCover.png)
- Keep external links absolute (https://...)
- For consistent project cover display, use a wide banner ratio (for example 1000 x 400)

## Deployment

This project can be deployed to any static host:

- GitHub Pages
- Netlify
- Vercel (static)
- Cloudflare Pages

No build pipeline is required unless you want one.

## License

This project is licensed under the MIT License.

See [LICENSE](LICENSE) for full text.
