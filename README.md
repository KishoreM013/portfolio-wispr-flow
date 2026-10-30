# The Museum of Kishore

A scroll-driven personal portfolio built as a museum. Visitors approach the
building at dusk, scroll through the gates and doors, and arrive in a marble
main hall with eight rooms to explore.

Built with **React + Vite + Tailwind CSS + React Three Fiber**. The dusk
exterior, gates, doors and marble hall are real 3D scenes. The facade is
procedural (canvas textures and geometry), so the entrance downloads no image
assets; the hall's marble bust is a small CC0 model loaded only when needed.

## Run locally

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

```bash
npm run build     # type-check + production build
npm run preview   # preview the production build
npm run lint      # oxlint
```

## Project structure

```
src/
  pages/
    EntrancePage.tsx     # scroll-driven entrance + reduced-motion fallback
    MainHallPage.tsx     # two-floor hall, statue and gallery wayfinding
    SkillsPage.tsx       # interactive planetarium and accessible skill catalogue
    RoomPage.tsx         # room shell for the remaining future exhibits
  components/
    three/
      MuseumScene.tsx    # entrance canvas, camera rig, lights, atmosphere
      MuseumBuilding.tsx # facade, columns, pediment, doors and lit corridor
      MuseumGate.tsx     # opening courtyard gates
      MuseumLamp.tsx     # courtyard lamps
      HallScene.tsx      # marble hall, reflective floor, pedestal and bust
      textures.ts        # procedural stone, marble, wood, sky and plaque maps
      scene.ts           # scroll phases and scene context
    HallPaths.tsx        # the eight hanging gallery signs in the hall
    TourGuide.tsx        # the illustrated guide
    MapOverlay.tsx       # floating map + visited-room progress
    RoomShell.tsx        # consistent room frame, plaque, back button, guide
    entrance.css         # entrance interface over the 3D scene
    hall.css             # hall interface over the 3D scene
  data/
    museum.ts            # rooms, copy, guide lines, site details
  context/
    museum-context.ts    # context + useMuseum hook
    MuseumContext.tsx    # provider, visited rooms (localStorage) + map state

public/
  models/
    marble_bust_01/      # CC0 Poly Haven bust + credits
```

## Editing content

Almost all copy lives in `src/data/museum.ts`:

- `site` — name, email, social links.
- `rooms` — the eight wings, their labels, icons and guide lines.
- `entrance` / `hall` / `guide` — entrance and hall copy.

Room bodies will live in their own components as they are built. Keep project
and song lists in `src/data/` so adding an item never means touching layout.

## Deployment

The app uses `BrowserRouter`, so the host needs an SPA fallback:

- **Vercel**: `vercel.json` is included.
- **Netlify**: `public/_redirects` is included.
- **GitHub Pages**: either use a 404 fallback or switch to `HashRouter`.

Replace the relative `og:image` in `index.html` with the final absolute URL
after deploying so LinkedIn and WhatsApp render the preview reliably.

## Current status

- [x] Part 1 — the 3D scroll-driven entrance: gate, facade, stairs, doors and
      the lit corridor reveal, with Skip Intro, reduced-motion and lite modes
- [x] Global shell — map, visited progress, room frame, guide, footer
- [x] Part 2 — the 3D main hall: marble architecture, reflective floor,
      pedestal plaque, cursor-reactive marble bust, welcome card and the
      eight hanging gallery signs with visited state
- [x] Part 3 — planetarium skills room: five orbits, selectable planets, catalogue, mobile and reduced-motion support
- [x] Parts 4–10 — vaulted galleries populated from the résumé; writing awaits original pieces
- [ ] Deployment + final QA

## Credits

- Marble bust: [Poly Haven — Marble Bust 01](https://polyhaven.com/a/marble_bust_01), CC0.
  It is a placeholder for a custom scan or sculpt of Kishore; see
  `public/models/marble_bust_01/CREDITS.md`.

## Hall and planetarium

The hall has four ground-floor open archways and four upper-gallery archways, a 26-tread
staircase, a curved apse and balcony, a ribbed dome with an oculus, a brass
chandelier and radial marble inlays. The hall fills the viewport without a scrolling page layout. Drag to look,
use WASD or arrow keys to explore, select a side-mounted interpretation board to enter a gallery, or use the
viewpoint dock to approach the statue and ascend the stairs. The gallery
directory and gallery boards provide keyboard-accessible routes. A fullscreen
control is available where the browser supports it. Reduced-motion mode
changes viewpoints immediately instead of animating camera travel.
The museum map uses the same floor assignments.

The apse wall is built around eight actual openings. Each arch has stone
reveals, a vaulted passage and a lit exhibit beyond. Navigation boards sit to
the side at reading height; the arches themselves have no doors or click
handlers. The original exterior entrance remains unchanged.

Résumé content is transcribed from `Kishore_M_Resume.pdf` in Downloads into
`src/data/collection.ts`. Projects, volunteering, contributions, accounts,
experience and credentials are presented in vaulted exhibit rooms with selectable
wall labels, previous/next controls, an information panel and a résumé download.
The writing gallery deliberately contains no invented work. Platform statistics
are labelled as résumé snapshots rather than live results. Public profile links
are retained exactly from the résumé; direct project and model links await input.

Skills are editable in `src/data/skills.ts`. Its 27 skills and project examples
come from the PDF. Ratings remain provisional; three stars is a layout default,
not an inferred professional self-rating. Java is described as basic in the
source. Documented project years are distinguished from experience durations.
The planetarium shows twelve featured planets on desktop and seven on phones;
the filterable HTML catalogue includes all skills. Hover, focus, selection and
the pause control stop the orbits. Reduced motion makes the planets static.

The bundled bust remains the credited CC0 placeholder, not a likeness of Kishore.

## Hall regression checks

Run `node scripts/check-hall.mjs` to check balcony movement bounds, board-to-wall
clearance, route clearance from the statue and stair rails, and the absence of
HTML signs that could show through the 3D floors. Boards use depth-tested canvas
textures and direct pointer navigation; keyboard visitors use the Galleries
button or museum map. Viewpoint buttons and scroll navigation share the same
route in both directions. The staircase treads and handrails meet the landing.

These automated checks and the production build do not replace browser visual QA.

## Mobile support and validation

The hall and exhibit rooms support horizontal swipes to turn and vertical swipes
to walk. Mouse drag, wheel and keyboard controls remain available. Entrance and
planetarium canvases permit native vertical page scrolling. Layouts use dynamic
viewport height and safe-area insets, with larger touch controls and compact dock
labels. The map, directory, information panels and skill cards have bounded,
scrollable layouts for portrait and landscape screens. Touch devices use lighter
3D settings; screen-size queries update on rotation. A GPU error boundary preserves
navigation and the HTML catalogue if 3D rendering is unavailable.

- `npm run test:geometry` checks hall and gallery movement and layout geometry.
- `npm run test:components` runs server-render smoke checks for pages and shared UI.
- `npm run test:responsive` builds and runs Playwright against the packaged assets,
  covering 320×568, 390×844, 430×932, 844×390 and 768×1024, plus rotation,
  dialogs, catalogue filters, exhibit cards, touch/drag and reduced motion.
- `node scripts/check-responsive.mjs --list` lists planned cases without running them.

Browser execution in the editing environment is blocked by an operating-system
permission error. Geometry, component-render and production-build checks can run;
the responsive browser suite and device screenshots still need a browser-enabled
machine. Server-render checks do not validate CSS layout, touch events or WebGL.

## Portrait alcoves and exhibit studies

Every exhibit gallery now opens into a half-round portrait chamber rather than
ending with a flat wall. The scroll endpoint reaches the chamber, leaving safe
clearance from the portrait. The portrait source is the blazer photograph
`Pictures/WhatsApp Image 2026-09-27 at 12.33.19 PM.jpeg`, copied unchanged to
`public/images/kishore-portrait.jpeg`. No identity document images are included.
The alcove includes a framed photograph, engraved résumé panels, a nameplate,
marble inlays and visitor benches.

`exhibitArtwork.ts` draws original explanatory studies for the contract review,
data structures, interpolation, feedback and other exhibits. These are diagrams,
not claimed screenshots of the actual applications. Selecting a project opens
an editorial case study with its question, construction and result, grounded
in the supplied PDF. Mobile panels retain bounded scrolling and touch controls.

## Framed artwork visibility

`FramedArtwork.tsx` shares a frame depth and artwork offset from the gallery
layout module. The image plane sits 0.025m in front of the backing's front face,
rather than inside the backing. The gallery regression suite raycasts from the
visitor aisle to displays on both walls and checks that the image is hit first.
This catches the blank-brass-frame failure without requiring a GPU.

## Circular skills gallery

Skills now uses the same full-viewport museum presentation as the other rooms,
with a circular stone room, columns, marble floor and starry dome. Scroll or
vertical swipe walks around a fixed circular visitor path; drag or horizontal
swipe turns the view. The Centre button restores the initial viewpoint.

The central sun is surrounded by five proficiency orbits, from Expert (5 stars)
to Exploring (1 star). A planet's radial position and visible stars encode its
rating. Planets with the same rating are spaced evenly around the same orbit.
Selecting a planet opens an exhibit dossier with its rating, usage information
and résumé-grounded example. All 27 skills remain in an accessible catalogue.
Phones show fewer, static planets. Reduced motion freezes planets and removes
camera easing. Ratings are explicitly provisional pending the curator's input.
Run `node scripts/check-skills.mjs` for orbit ordering, planet separation and
visitor-path bounds.

The skills planetarium now has a 44.6m-diameter hall, 12m columns and a higher
dome. The planetary plane is lowered to 1.55m over a low marble exhibition stage.
Desktop visitors view it from a 14.5m circular path; phones use a more distant
19m path to frame the display. The viewpoint is above the installation so the
near and far orbits separate visibly rather than stacking at eye level.

The skills roof uses a shallow architectural dome with stone cornices, radial
brass ribs, coffer rings, a central medallion and warm lighting. The lower spring
line and camera framing bring the roof into the normal view. Scroll/swipe still
walks around the circular aisle while keeping the installation central.
Hovered skill spheres and their rings grow to 2.35× normal size; selected skills
retain a smaller 1.65× emphasis. Labels move down to clear the enlarged sphere.
Reduced-motion mode applies the size immediately. The skills geometry checks
also verify roof projection and expanded planet/label clearance.

## Complete museum shell and return entrances

The main hall now uses one continuous 29.2m-radius wall and a dome sharing the
same perimeter, rather than joining semicircles with mismatched radii. Its eight
gallery arches and courtyard entrance are cut into that shell. Continuous
cornices connect the columns to the roof, and stone piers support the wider
upper-gallery slab. The longer stair meets the inner edge of the balcony; its
handrails have return pieces connecting to the balustrade.

Turning around in the hall reveals a double entrance door marked “Museum Gate”.
Selecting its door, arch or plaque returns to `/`, the existing gate approach.
Every exhibit room now has a full-height entrance wall and vaulted portal back
to `/hall`, set far enough behind the starting position to be seen in full when
turning around. The circular skills room has the same return portal cut into
its perimeter. The portal geometry includes stone reveals, a threshold,
side walls, vault and a lit vestibule, rather than an exposed scene boundary.

`node scripts/check-museum-structure.mjs` raycasts around 360° of the hall to find
missing wall sectors, checks roof coverage above the perimeter, verifies the
openings on both floors, and checks entrance apertures, clickable navigation
surfaces, camera clearance and exact stair-to-landing alignment.
