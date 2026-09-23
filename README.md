# Tunir Mitra — Portfolio

Static site: plain HTML, CSS and JavaScript. No build step. Open `index.html` in a browser, or serve the folder with any static host.

## Structure

```
index.html                  Home
about.html                  About me
projects/
  amazon-rufus.html         Case study (live prototype in the right panel)
  monster-bi.html           Case study (Power BI video in the right panel)
  husky-market.html         Case study (live prototype in the right panel)
  mercedes.html             Case study (single column)
  uncut-diamonds.html       Personal essay (single column)
  prototypes/               Standalone prototypes, embedded by the case studies
assets/
  css/
    site.css                Nav, footer, home + about pages, scroll animations
    case-study.css          Shared case-study layout: hero, meta bar, phase nav,
                            right panel + drag handle, sections, cards
    themes/<project>.css    Colours, fonts and components for one case study
  js/
    site.js                 Menu, scroll animations, page transitions, carousel
    case-study.js           Phase-nav highlighting, KPI count-up, panel resizing
    pages/<project>.js      Behaviour for one case study only
  media/<project>/          Images and video, one folder per project
_source/                    Raw inputs (drafts, PDF, original video). Not used by the site.
```

## Adding a case study

1. Copy an existing page in `projects/` with the layout you want:
   - `amazon-rufus.html` for a right-hand panel
   - `mercedes.html` for a single column (`cs-layout--solo`)
2. Add `assets/css/themes/<name>.css`, with the body class `theme-<name>`. Override the `--cs-*` variables and prefix new components.
3. Put images in `assets/media/<name>/`.
4. Link it from the project card in `index.html` and from the Projects menu on every page.
5. Update the "Next case study" links so the chain stays a loop:
   Uncut Diamonds → Husky → Monster → Amazon → Mercedes → Uncut Diamonds.
6. Register new animated elements in the `revealGroups` list in `assets/js/site.js`.

## Placeholders

Empty image slots are `<div class="img-slot" data-label="...">`. Replace one with an `<img>` that keeps the slot's other classes, for example `client__img` or `project__bg`.
