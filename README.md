# FluxCanvas

An original interactive system architecture portfolio built with React, TypeScript and Next.js-compatible Vinext.

## What it demonstrates

- Six original system concepts rendered with HTML and CSS
- Clickable functional modules with contextual component cards
- Scenario switching, diagram zoom and responsive layouts
- Keyboard-accessible controls and reduced-motion support
- No third-party diagrams, logos, product numbers or proprietary material

All system names, topologies, copy and `DEMO-*` component names are fictional and were created specifically for this portfolio. They do not represent real products or vendor recommendations.

## Local preview

```bash
npm install
npm run dev
```

## Validation

```bash
npm run build
npm test
```

## Project structure

- `app/page.tsx` — application data, diagram renderer and interactions
- `app/globals.css` — visual system and responsive layouts
- `app/layout.tsx` — metadata and page language

## Replacing the concept products

Concept component cards are stored in the `diagrams` data inside `app/page.tsx`. Replace each node's `products` array with data from your own approved API or product database. Keep the `DEMO-*` convention until real content has been reviewed for publication.

## Rights statement

The front-end implementation and portfolio content in this repository are original demonstration work. Third-party marks and copyrighted diagrams are intentionally excluded.
