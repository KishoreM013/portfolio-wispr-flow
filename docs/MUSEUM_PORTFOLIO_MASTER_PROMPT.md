# The Museum of Kishore — complete build prompt

Copy this entire document, including its content appendix, into the AI builder. Supply the existing project, reference screenshots, résumé and portrait assets when available. The appendix is part of the specification, not optional reading.

Use this opening instruction when handing it over: **“Implement the complete specification below in the supplied workspace. Read it fully before changing files. Treat the current content appendix as the seed, the architectural requirements as the intended finished design, and the supplied images as visual references. Continue through implementation and verification.”**

Attach `public/resume.pdf`, `public/images/portraits/`, `public/images/kishore-portrait.jpeg`, model files and their credits, and the reference screenshots along with this prompt. Their paths in the appendix identify files; they do not embed the actual images or model bytes. The companion `museum-content-seed.json` contains the same seed as the appendix and is optional when the complete prompt is supplied. If the receiving tool has a short input limit, give it this document as a file and explicitly instruct it to read the entire file, including the appendix.

---

## A. Your assignment and the required result

Act as a senior creative developer, architectural environment artist, interaction designer, accessibility engineer and backend engineer. Build a complete, deployable portfolio called **The Museum of Kishore**. Implement the actual experience, content, services, database, administration and deployment configuration. Carry the work through implementation and verification; a plan, mockup, collection of screenshots or disconnected frontend is not the deliverable.

The experience is a monumental, believable, late-eighteenth-century British museum inspired by Georgian, Palladian and neoclassical architecture. It is a personal museum of Kishore M's life, engineering, learning, creativity and failures. Use this period as the artistic direction, without claiming to reconstruct a specific historical building exactly. Preserve the architecture and interactions described here even when choosing a more effective implementation.

The visitor should feel that they have entered a real building: approach through a courtyard, enter a grand rotunda, see a full standing marble statue of Kishore, read education and experience boards, explore open gallery arches, ascend one of two side staircases, discover an upper gallery and descend into an archive of failed projects. Rooms contain mounted exhibits and physical objects. The skills gallery is a large domed planetarium. Writing and songs culminate in an open book. End-of-gallery portraits use different supplied photos of Kishore.

The result must look architectural, atmospheric, carefully lit and premium. Avoid arcade controls, floating sci-fi HUDs, neon outlines, cheap primitive characters, generic card grids as the main spatial experience, default browser-looking forms, giant blank walls, oversized fences and glossy gold blocks standing in for craftsmanship. Readable accessible HTML interfaces should complement the museum wherever needed.

There are **ten primary galleries, five on each main floor, plus Basement B1**. This final layout supersedes any earlier four-plus-four layout. Preserve the existing content catalogue. Add a prominent large window in the hall, optional visitor login, a persistent public visitor notice board, a contact service and a dedicated backend with a real protected curator workspace.

## B. Source material, identity and truthful content

Use the supplied repository and screenshots as the visual and content reference. Read its architecture, navigation, assets and content before changing it. Preserve useful existing work and user edits. Resolve routine engineering choices without repeated permission questions.

For conflicts, follow this order: the owner's latest explicit instructions, this finished-design specification, the current content data and source assets, then older screenshots and README notes. In particular, some old documentation still describes eight rooms and a bust. Those are obsolete architectural states. Useful implementation references include `src/data/`, `HallScene.tsx`, `hallNavigation.ts`, `museumArchitecture.ts`, `GalleryScene.tsx`, `ExhibitArtifact.tsx`, `exhibitArtwork.ts`, `PlanetariumScene.tsx`, `SkillsDome.tsx`, `skillsRoomLayout.ts`, `BasementScene.tsx`, `PortraitAlcove.tsx` and `portraitFraming.ts` under the existing source tree. Read them as references, not as a reason to preserve a visible defect.

Owner information:

- Name: **Kishore M**; professional accounts may use **Kishore Mohan**.
- Museum name: **The Museum of Kishore**.
- Field: software engineering, artificial intelligence and data science.
- Location: Chennai, India.
- Email: **kishoremohan1307@gmail.com**.
- GitHub: **https://github.com/KishoreM013**.
- LinkedIn: **https://www.linkedin.com/in/kishore-mohan-979a0a28b/**.
- Education: B.Tech, Artificial Intelligence and Data Science, Chennai Institute of Technology, 2023–2027.
- Academic snapshot: **8.74 / 10 CGPA**.
- Microsoft Software Engineer Internship: May–July 2026, as supplied in the résumé/catalogue.
- Research internship at Chennai Institute of Technology: November–December 2024.

Treat these as supplied portfolio facts and preserve source dates. Avoid describing historical ratings or résumé metrics as live verified statistics. Do not silently change a date, invent an award, fabricate a project screenshot, turn an unfinished experiment into a delivered product, infer years of experience from a project date, or invent a public link.

The appendix contains the complete current catalogue: 70 gallery placements, 34 skills and nine detailed project narratives. Some exhibits legitimately appear in multiple sections. Import them without losing descriptions, metrics, details, links, authorship credits or status. Count placements separately from unique projects.

Where a duration or specific skill example is unknown, show an honest phrase such as “Start date not recorded” or “Project example to be added.” Keep missing fields editable in administration. Skill stars are the owner's self-ratings. Do not infer stars from résumé phrasing; for example, the supplied Java self-rating and résumé “basics” wording must not be silently rewritten to agree.

If the actual portrait, résumé or statue source is missing, identify that exact missing input and continue other work. Never substitute a stranger's face and claim it is Kishore. A prompt alone cannot recover an unavailable photograph or exact 3D likeness. Preserve asset source and licence records.

## C. Application architecture and deliverable structure

Use React and TypeScript, Three.js through React Three Fiber, and appropriate Drei utilities for the frontend. The existing Vite/React Router project is a suitable foundation. Use supported compatible package versions and a committed lockfile. Do not rewrite the application merely to switch frameworks.

Implement a separate TypeScript backend service using Fastify, PostgreSQL and Prisma, or a demonstrably equivalent architecture with the same capabilities. Provide an OpenAPI contract and typed frontend API integration. A real database and service process are required; browser storage and fake success messages are not persistence.

Use S3-compatible object storage for uploaded media, with a local development equivalent such as MinIO. Include a small background worker for transactional email delivery and media tasks. A PostgreSQL-backed job/outbox mechanism is sufficient initially; add Redis only if the actual workload warrants it.

Suggested organisation:

```text
apps/web/                 React application, routes, accessible interfaces
apps/web/src/three/       architecture, scenes, materials, camera/navigation
apps/api/                 authenticated API, validation, policies, services
apps/worker/              email/outbox and media processing
packages/contracts/      shared schemas and API types
packages/content/        seed/import definitions, content provenance
packages/scene-layout/   geometric constants and pure layout calculations
prisma/                  schema, migrations and idempotent seed
assets/                  originals, optimised derivatives, licences
docs/                    setup, operations, content guide, verification
```

Retain the existing repository structure if migration would add unnecessary risk. Maintain equivalent separation of responsibilities. Mount one active 3D experience at a time; load rooms and heavy media on demand. Dispose scene resources on unmount and bound any asset cache.

Published public content must be readable without authentication. Render or prerender meaningful semantic content for search engines and assistive technology. The 3D scene and readable catalogue consume the same content records. Private VIP material and administration data must never be embedded in the public bundle.

## D. Exterior, gate and first impression

Build a complete architectural approach, not a flat facade billboard:

1. An iron perimeter gate with slender vertical bars, restrained spear finials, believable hinges, stone gateposts and bronze detailing.
2. A stone forecourt with paving joints, shallow approach steps, substantial lanterns, low planting and a view of the building mass.
3. A symmetrical limestone museum facade, with rusticated lower masonry, a central portico, deeply recessed entrance, fluted classical columns, bases, capitals and a supported entablature.
4. A triangular pediment with a central medallion carrying a restrained **K** monogram, relief ornament and proportionate mouldings.
5. A frieze inscription reading **MUSEUM OF KISHORE**. Model the architectural backing; render the lettering sharply enough to read.
6. Recessed sash or round-headed windows with stone surrounds, reveals, sills, mullions and warm interior light. Include a roofline, cornices, parapet and plausible side wings containing the galleries.
7. Period-style brass or iron lanterns, candle-like lighting, weathered joints, modest patina, carved leaves, rosettes and dentil mouldings. Details should follow structural edges rather than appear as scattered decorations.
8. Heavy main entrance doors are acceptable at the building gate; the internal gallery entrances must be open arches.

Use warm late-afternoon or dusk lighting, soft shadows and realistic material variation. The building must remain readable on modest screens. Optional night ambience must not turn the museum into a black scene or introduce mandatory audio.

Initial welcome plaque:

- “Welcome to the Museum of Kishore”
- “A personal collection of work, curiosity and experience.”
- “Scroll to enter”
- “Enter as guest”
- “Sign in”
- “Skip intro”

Animate the gate and approach smoothly if motion is enabled. Support an immediate button and reduced-motion entry. Do not force a lengthy cinematic or account creation.

## E. Entry flow and optional visitor identity

Guest entry is a first-class path. Anyone can browse all public galleries, skills, approved notes, résumé and contact options without logging in. Sign-in offers saved visits, bookmarks, personal notes and a return-to-last-location option; explain these benefits briefly at the reception desk.

Use a period-inspired visitor registration book as the visual setting for sign-in, with ordinary accessible HTML form controls. The guest option must remain conspicuous. Visitors can sign in later from the hall or map without losing their location.

Provide registration, email verification, login, logout, forgotten-password and reset-password flows. Optional GitHub or Google sign-in may be supported when configured. Request only identity scopes. Do not imply that social sign-in grants access to private repositories, email accounts or contacts.

After entering, place the visitor at a clear, unobstructed arrival point facing the rotunda and central statue. Do not place the camera inside the gate, floor, statue, fence, column or a plaque. Restore an explicitly saved visit only after the visitor chooses to resume it.

## F. The grand rotunda

Build a complete large circular hall with a continuous enclosing shell and a fully visible dome. Use approximately these proportions as a starting point, then tune through visual inspection:

| Element | Target proportion |
|---|---|
| Rotunda radius | about 29 metres |
| Upper gallery walking surface | about 5.2 metres above the ground floor |
| Cornice / dome spring | about 11.6 metres |
| Dome rise | about 10.5 metres |
| Inner balcony radius | about 24.5 metres |
| Side-stair walking radius | about 26.6 metres |
| Normal visitor eye level | approximately 1.6–1.75 metres above the walking surface |

Use one documented coordinate system and shared polar conversion for walls, railings, torus arcs, columns, floor bands, camera paths and openings. Do not mix circle conventions with a hidden ninety-degree offset. Every dependent object must derive from the same layout definitions.

The interior has warm limestone or sandstone blockwork, muted ivory plaster, dark green panels, aged brass, dark walnut and restrained burgundy fabric. Marble floor veining and inlaid circular bands should look subtle and correctly scaled. Avoid giant repeated texture tiles, exaggerated metallic reflections and featureless flat colours.

Support the upper gallery with columns or piers that actually meet its underside. Align capitals with beams and cornices. Close all spandrels and side returns. The dome must meet the perimeter cornice continuously and include restrained ribs, coffer outlines or decorative plasterwork. A visitor looking up or turning fully around must see completed architecture.

When the visitor turns completely around from the arrival view, show the **interior face of the museum's main entrance**, with full-height walnut double doors, bronze handles, hinges, an arched stone surround, threshold and an **Exit to the Courtyard / Main Gate** plaque. Clicking the door or plaque returns to the exterior route `/`, without logging the visitor out. The hall itself is `/hall`. Provide equivalent actions in the map. This rear entrance must look integrated into the circular wall; it is not a decorative door pasted over an exposed void. Keep the large window in a different bay so neither blocks the other.

Place a **full standing statue of Kishore** at the architectural centre, with recognisable likeness based on approved references. Target natural human proportions around 1.8–2.1 metres tall on a dignified stone plinth. Model head, torso, arms, hands, clothing, legs and feet as one coherent sculpture. Do not mount a generic bust on a cylinder and call it a full-body statue. The statue may be slightly monumental if needed, but must remain anatomically coherent.

Use warm white marble, subtle surface roughness, carving detail and soft controlled light. Add a circular stepped base, brass plaque, restrained rope stanchions and clear walking clearance. The plaque may read **Kishore M — Software Engineering · AI & Data Science**. Ensure ropes, feet and plinth meet their supporting surfaces.

Place two freestanding curator boards beside the statue, balanced in size and angle:

- **Education / The Foundations:** Chennai Institute of Technology, B.Tech AI & Data Science, 2023–2027, CGPA 8.74/10, with relevant fields of study and a résumé link.
- **Experience / The Journey:** Microsoft Software Engineer Intern, May–July 2026; CIT Research Intern, November–December 2024. Use the documented responsibilities and metrics in the appendix. Label those metrics as supplied historical outcomes.

The boards use deep green faces, slim brass frames, a serif title, legible cream body text and proper stands. Their backs should be finished. Clicking a board opens a readable dossier; the in-world text is a concise summary. Avoid putting a full résumé in microscopic lettering.

## G. Two side staircases and structurally correct fencing

There must be **two symmetrical staircases, one on each side of the rotunda**. Keep the centre open for the statue and boards. Each stair has a bottom approach, consistent risers and treads, a finished underside or stringer, a top landing and a continuous walkable join to the upper floor.

Use around 32 steps for a 5.2-metre rise if appropriate to the final dimensions; derive all riser heights from the actual elevation difference. The stair path may sweep around the rotunda wall. Keep the tread surface, carpet runner, stair camera height, baluster feet and handrail slope consistent with that exact path. Prevent curved treads from overlapping into jagged spikes or leaving triangular gaps.

Railings are slender, carefully proportioned architectural elements:

- Upper gallery guardrails follow only supported slab edges.
- Cut the horizontal gallery railing precisely at stair openings and landings.
- Each stair flight has its own inner and outer handrail and posts.
- Join corresponding stair and balcony rails at a common height, approximately 1.1 metres above the local walking surface.
- Posts sit on the actual tread or slab; they never hang below it, float above it, or extend beyond the handrail.
- Use coherent stone balusters or brass/wood rail details. Avoid stretched lathe shapes, enormous posts, doubled overlapping fences and sparsely supported handrails.
- Close rail ends with appropriate newels or caps, without blocking the walking opening.
- Use the same mirrored geometry generator for both flights, and verify both sides.
- Keep the tour camera away from the railing so nearby posts do not dominate the screen through clipping or extreme perspective.

Instance repeated balusters and share materials. Structural accuracy takes priority over decorative complexity.

## H. The large window, chandelier and small lighting details

Add a **large, tall Palladian-style hall window**, approximately 7–9 metres wide with an arched head and carefully divided panes, in a free wall bay away from gallery entrances, the main gate and basement portal. It should be visible from the arrival area and from the balcony. Plan its opening before placing columns.

Give the window a genuine aperture in the wall, a deep stone reveal, mullions, sill, arch mouldings, glass and a believable view of sky, trees or the museum courtyard. Do not paste glass onto opaque masonry. Surrounding piers and lintels must visibly support the cornice. Include a lighter glazed centre and side lights, subtle warm reflections and soft daylight falling onto the marble.

Place a **large premium chandelier exactly at the geometric centre of the rotunda**. Align its vertical axis with the dome centre and statue. Use a believable suspension chain or rod reaching the ceiling, a decorative canopy, several proportionate bronze rings, branching candle arms, candle cups, subtle crystal or glass drops, and a central finial. Keep it high enough to clear upper-gallery sightlines. The chandelier must not float, hang off-centre or intersect the statue.

Add torch-style wall sconces and period lanterns between exhibit bays and beside major portals. Model wall mounting plates, metal arms, candle or flame elements and small decorative collars. Use warm amber light and soft falloff. “Torch-style” refers to the visual language, not a requirement for noisy fire simulations.

Use emissive materials or baked illumination for most candles and fixtures. Only a limited number of lights should cast dynamic shadows. Avoid giving every flame a separate expensive real-time light. Subtle flicker is optional and disabled for reduced motion and low-power mode.

Add restrained architectural detail throughout: carved leaf motifs, capitals, dentils, arch keystones, skirting, threshold stones, plaque screws, frame bevels, bench supports, pedestal mouldings, draped runner edges and small exhibit sculptures. These details must be placed coherently and rendered efficiently.

## I. Scroll navigation and full freedom to look

Scroll is the primary walking control. Looking and walking must be independent.

The hall tour sequence is:

1. Arrival / Grand Rotunda.
2. Approach the central statue and its education/experience boards.
3. Visit the ground-floor Skills entrance.
4. Volunteering.
5. Contributions.
6. Writing & Songs.
7. Hobby & More About Me.
8. Approach a side staircase at ground level.
9. Ascend the actual stair geometry and reach its landing.
10. Projects on the upper floor.
11. Accounts.
12. Achievements.
13. VIP Pass.
14. Management Room / Curator's Study.

Scrolling backwards retraces the route. Make both side staircases usable; the guided scroll route may use one and an explicit navigation choice may use the other. Do not teleport directly across the central void to reach the upper floor.

At an entrance, scrolling advances the tour past the entrance; clicking or tapping its plaque or aperture enters its own route. Do not unexpectedly navigate into a room because a wheel event arrived near its doorway.

Desktop: pointer drag turns through unlimited horizontal 360°; vertical look is sensibly clamped to prevent inversion. A/D turn; arrow controls browse exhibits; R or a labelled button resets the view. Mobile: horizontal swipes turn; vertical swipes walk; distinguish gestures after a small threshold and suppress clicks after a drag. Include visible buttons as an alternative.

Apply heading offsets to a fresh, stable route bearing on each frame. Never feed an already rotated camera target into the next frame's yaw calculation. Use time-based damping with a bounded delta, angle unwrapping at 0/360°, and no per-frame state feedback loop. Motion must not shake, oscillate, drift or snap unexpectedly.

Do not lock the camera at arrival, after returning from a room, at a stair landing or in the basement. A 360° turn must work immediately in every scene.

Normalise wheel delta units, accumulate trackpad input and apply a bounded speed. Do not jump a whole exhibit for every tiny trackpad event. Wheel and touch input inside a modal, form, book, catalogue or notice-board panel must scroll that interface, never move the background camera. Ctrl/Cmd zoom belongs to the browser.

Provide a **View / Zoom slider immediately above the bottom tour controls**, plus labelled reset and zoom buttons. Prefer bounded field-of-view zoom so visitors can inspect a plaque without walking through geometry. Keep perspective comfortable, preserve browser accessibility zoom and avoid conflicting pinch gestures.

Preserve the hall stop and heading when returning from a room. Route changes must have stable URLs, browser Back/Forward support and a short fade or architectural transition. Reduced-motion users get immediate or gently faded transitions.

## J. Open arches and the anatomy of every gallery

Use open stone arches for all internal galleries. Each arch has real jambs, bases, capitals, carefully arranged arch stones, a keystone, a recessed reveal, a threshold and a short visible passage beyond it. Arches must correspond to genuine wall apertures. The passage extends behind the wall, away from the viewer; it must not project a giant tunnel wall into the hall.

Mount a green-and-brass name plaque beside each arch at a readable height. It identifies the gallery, its floor/index and an understated “Enter gallery →” cue. Orient its face toward the visitor; do not display the blank back of a sign. Wrap long titles. Keep it clear of columns, rails, sconces and door openings. Depth-test in-world lettering and keep it slightly in front of its backing to prevent z-fighting.

An arch and its plaque both navigate to the room's dedicated route. Provide a semantic HTML directory link to the same route for keyboard and screen-reader users. Hover feedback should be subtle light or material changes rather than an arcade outline.

Standard galleries use a long vaulted hall, stone walls, a marble floor, shallow green dado, fine brass trim, arch ribs, a visible roof and realistic lighting. Place **one exhibit on the left and one on the right at each viewing bay**. Maintain a clear central aisle and adequate separation between bays. Length adapts to the collection; odd counts must not create empty placeholder paintings.

Each exhibit contains:

- A mounted framed artwork, document, explanatory diagram, approved screenshot, song cover or other content-specific image.
- A concise readable title, medium/technology, date when known and metric when documented.
- A small physical sculpture, model, book, medal or instrument on a supported plinth, related to that exhibit.
- A nearby warm sconce or picture light.
- A click/tap action opening its detailed accessible dossier with description, contribution, construction, outcome, limitations, source and working links.

Examples of miniatures: a document stack and seal for contract review; arrays and branching nodes for teaching; three framed satellite tiles for interpolation; a chessboard for chess engines; a miniature compiler/editor console; geometric solver models; books and quills for writing; a small microphone for songs; competition medals; an unfinished vehicle model in the basement. Keep these understandable and appropriate to their source material.

Give each exhibit a deliberate visual treatment. Use this artifact direction as a minimum, adapting the craft quality without changing the claims:

| Exhibit or family | Physical object and mounted content |
|---|---|
| Legal Contract Review | Layered parchment/document sheets with a burgundy seal, a clause-analysis diagram and the documented language/input capabilities. |
| TGK Learning / C teaching | A brass-and-stone branching tree with connected nodes; accompanying diagrams of arrays, lists, trees, graphs, hash tables and heaps, or the actual teaching summary. |
| Temporal Image Interpolation | Three small framed tiles on aligned supports representing first, intermediate and last frames; use genuine output imagery if supplied, otherwise label an explanatory diagram accurately. |
| Feedback Resolution | Three ranked brass/green columns or a labelled process model showing feedback, classification and proposed resolution; display the distinct supplied metrics with their correct descriptions. |
| TGK Editor | A carefully crafted miniature editor workstation with a legible authorised editor screenshot or a labelled workflow diagram; visible keys, screen rim and base. |
| Codetgk | A small terminal console study with command lines, separate controls and a diagram of provider orchestration and approvals. |
| SovereignOpt | A sculptural feasible-region or optimisation model with axes and a modest solver-engine miniature; accompanying CPU/GPU pipeline diagram. |
| Smart Email Assistant | A folded-envelope relief and miniature inbox document tray; annotated classification and action-item workflow. |
| GitHub Profile Analyzer | A magnifying ring and linked repository nodes, with a sourced profile-analysis diagram. |
| Chess contributions | A real chessboard with alternating squares and recognisable pieces, particularly the king and knight, rather than generic coloured blocks. |
| Spam classifier | Two document trays or labelled classes plus a compact model display; preserve 98.4% accuracy and approximately 7,000 parameters as supplied results. |
| Webify AI / Predict G | Event-programme booklets, a small podium or branching network study, and the actual organisation/dataset challenge description. |
| Writing essays | Framed manuscript excerpts only when supplied, paper edges, an inkwell and quill; the wall still carries the actual title and summary. |
| Original songs / singing | A small microphone with a stand, subtle brass musical notation and a labelled recording plaque; retain exact writing and music credits. |
| Online accounts | Small framed service emblems or related sculptural objects, exact account handles, historical metrics where supplied, and a working link. Do not manufacture live statistics. |
| Achievements | Engraved medals, laurel motifs, framed certificates or a knight chess piece where appropriate. Label representative objects as illustrative if they are not scans of the actual award. |
| Microsoft / research experience | Framed role-and-date records, a small engineering system or chess research model, and concise sourced contributions. |
| Private or upcoming work | Bound manuscript, sealed folio or project maquette with an honest status plaque; never expose restricted text as a texture. |
| Credentials | Individually framed certificate records and bound study volumes, with issuer, title and known date. Do not invent a certificate scan. |
| Hobbies | A lyric notebook, listening disc, microphone, Minecraft block study, learning network, conversation figures, film reels, magnifying glass, thought-loop sculpture and playful linked-block puzzle, matching the ten entries. |
| Failed power-car idea | A recognisable four-wheel vehicle maquette, partial cloth cover, separate solar/wind/piezo concept annotations and an explicit failed-hypothesis/energy-loss label. |
| TGK OS | A miniature computer or terminal and a boot/kernel study diagram, marked unfinished with its documented status. |
| One-bit mobile LLM | A phone-shaped model with a clear screen, small compute/memory diagram and the supplied limitations. |
| GAN image generator | An imaging machine or paired generator/discriminator studies, with the recorded unfinished result and no fabricated generated-output claim. |
| Other basement lessons | Archived notebooks, a shelf of abandoned prototypes and a final lessons folio; distinct titles and text rather than repeating the same blank box. |

The building's architecture is eighteenth-century in character; contemporary software and creative work are the subjects being exhibited. Make modern artifacts feel curated within historical furniture and materials. Do not turn the room into a steampunk control panel or force an inaccurate historical disguise onto the software itself.

Artworks must have real content on first usable render. Load fonts before baking canvas text, redraw after font readiness or a relevant content change, use correct colour-space/material settings, and expose a retry/fallback when imagery fails. Verify texture orientation, alpha handling and face culling. Never leave a gleaming blank gold rectangle where the project explanation should be. A designed typographic/diagram exhibit is preferable to an invented product screenshot.

Scroll moves along the aisle. Drag turns to either wall, up toward the vault or back toward the entry. The room entrance must be a complete arch labelled **Back to Hall / The Grand Rotunda**, visible when turning around and clickable from inside. Do not end the rear view at a blank wall.

At the far end, ordinary galleries open into a rounded portrait alcove with benches, a framed portrait, a nameplate and two supporting text panels. Writing uses its dedicated open-book ending described below. The circular Skills and Basement rooms retain their purpose-built layouts.

## K. Skills: the grand planetarium and its boards

Create a spacious circular room that belongs to the same museum. Use roughly a 22-metre radius, an 8.5-metre dome spring and a 6.6-metre dome rise. The roof is a complete physical dome with ribs and subtle stars across its interior. Visitors must see the ceiling when looking up, rather than an empty black void.

The centrepiece is a low, luminous astronomical orrery around 1.55 metres above floor level on a broad circular exhibition stage. It must be low enough to inspect and distant enough from the surrounding walkway. Give it an aged-brass scientific-instrument character integrated with the classical room.

At the centre is a warm glowing sun labelled **Kishore M** and **A universe of practice**. Tapping the sun opens the complete skill catalogue.

Five concentric orbit rings represent these levels, from the centre outward:

| Ring | Stars | Level |
|---|---|---|
| Innermost | 5 | Expert |
| Second | 4 | Strong |
| Third | 3 | Comfortable |
| Fourth | 2 | Learning |
| Outermost | 1 | Exploring |

An example radius mapping is `2.5 + (5 - stars) * 1.3` metres. Ratings determine orbital radius; category determines colour. Keep empty levels visible even if no current skill belongs to them.

Each skill is a planet/bubble with its actual logo where available, a readable name or symbol and star rating. Use blue for Languages, purple for Core Concepts and gold for Tools. Do not imply that the colours represent ratings. Provide text/category cues so colour is never the only distinction.

Distribute planets evenly around their rings with stable offsets. Desktop planets orbit slowly and smoothly. Hovering pauses movement and smoothly enlarges the relevant bubble, around 1.7–2.3 times its normal size as clearance permits. Its label moves with it, stays readable and does not clip into the floor, neighbouring bubbles or the sun. Tapping selects and holds the skill information until dismissed. Touch users must not depend on hover.

The information panel shows the skill name, logo, category, exact self-rating, named level, known duration or honest missing-date text, and a real project/example from the appendix. Preserve the supplied 34 skills, including the personal entries Songwriting and Walking; present their humour as the owner's personality, without inventing professional evidence for them.

Add five framed level boards around the room, each labelled with its name and stars. Add a large wall-mounted **THE SKILLS ORRERY** board listing every skill and rating, arranged in readable columns with category cues. It needs enough space, front-facing text and its own warm lighting. Avoid squeezing all rows into illegible type; split the physical board into adjacent panels or pages if required.

Scroll walks around the room's circular outer route while drag rotates the visitor's view independently. Include Centre View, Previous/Next Position, Pause/Play, Back to Hall and Map controls.

On small phones, show a reduced static or very lightly animated set of planets and a clean HTML list of **all** skills below the planetarium or in a directly accessible catalogue. Selecting a list entry exposes its actual planet and information when possible. Respect reduced motion by keeping planets static and removing scaling/flicker animation while preserving selection.

## L. Writing and songs: the library gallery and open book

Preserve all six supplied writing/song exhibits and their exact links and credits. The gallery should evoke a quiet eighteenth-century study: walnut, paper, brass, leather-bound volumes, quills, candle-style lamps, framed manuscripts and subtle musical objects.

At the end, build a substantial **open book on a lectern or plinth**, with an actual spine, boards, curved or layered pages, page edges, page numbers, a bookmark ribbon and a discreet reading lamp. It must be an object with visible depth from different viewing angles, not a flat rectangle floating in space.

Clicking the book opens a readable, accessible book interface containing the writing/song catalogue and the upcoming-work notice. Include a contents page, next/previous controls, close button, meaningful page headings and keyboard support. A page-turn animation is optional; reduced motion uses an immediate page change. On phones, readable pages take priority over a two-page simulation.

Show the current message that more writing and songs are coming. Include the supplied upcoming title **Ruins & Remains** as unpublished/upcoming only where appropriate. Never invent manuscript pages, full essays or song lyrics. Display owner-supplied text when available; otherwise use the supplied summaries and link to the original publication.

Preserve the existing book notice: **THE QUIET ARCHIVE**; **More pages are coming**; **The book is open, but the next chapter is still being written.** Under **Upcoming**, show **New writings and songs will be added to this room as the collection grows.** Keep this notice as a page within the improved book interface, alongside its contents and actual published-work links.

Do not autoplay music. Start playback only after an explicit action, allow pause and volume control, stop it when requested, and show the supplied attribution: lyrics by TGK, music by AI or Gemini where specified. Avoid loading third-party media players until the visitor chooses to play or open them.

## M. Floor plan, routes and collection coverage

Use this room ordering, independent of any older screenshot numbering:

| Floor | Gallery | Route | Collection |
|---|---|---|---|
| Ground | 01 | `/skills` | Skills planetarium, 34 skills |
| Ground | 02 | `/volunteering` | 3 exhibits: C teaching, Webify AI, Predict G |
| Ground | 03 | `/contributions` | 3 exhibits: chess engines, spam classifier, SovereignOpt |
| Ground | 04 | `/writing` | 2 essays, 4 songs, open-book ending |
| Ground | 05 | `/hobbies` | 10 personal interests and humorous entries |
| Upper | 06 | `/projects` | 9 curated engineering projects |
| Upper | 07 | `/accounts` | 13 online-account/correspondence exhibits |
| Upper | 08 | `/achievements` | 7 supplied milestones |
| Upper | 09 | `/vip` | 8 approved teasers, private work and experience exhibits |
| Upper | 10 | `/management` | Curator's study / credentials vestibule and protected workspace entrance |
| Basement | B1 | `/basement` | 7 failed-project/lesson exhibits |

The project selection is: AI-Powered Legal Contract Review, TGK Learning, Temporal Image Interpolation, AI-Powered Feedback Resolution, TGK Editor, Codetgk, SovereignOpt, AI Smart Email Assistant and GitHub Profile Analyzer. Use the complete appendix descriptions and nine case-study narratives, not title-only cards.

Preserve the achievements as supplied historical claims: LeetCode Knight/1,000+ problems/1903 maximum/top 7.48%; CodeChef ML contest first of 191; EmoDecode-7000 first place with 0.677 score; the two Vel Tech wins; IIT Bombay hackathon third prize; and Shell fuel-blending optimisation above 85% accuracy. Do not invent missing event names or dates.

Preserve hobbies including songwriting, listening, singing, Minecraft, learning, friends, movies, web curiosity, overthinking and the explicitly tongue-in-cheek “Manipulating” entry. Do not rewrite playful entries into serious professional credentials.

VIP is an editorial collection, not an automatic grant of private-data access. Public visitors may see approved teasers. Private manuscripts, patent details and private repository content require actual authorisation. A visitor login by itself does not grant VIP or curator privileges. Private repository URLs in seed material are owner metadata; expose links only when explicitly marked publishable, and make their access requirement clear.

The Management Room may have a public credentials vestibule showing the supplied Google Generative AI, NPTEL, CISCO and Shell learning records. The actual curator workspace is behind server-enforced authentication and permissions. Keep the room's architectural entrance and navigation visible without leaking private administration data.

## N. End-of-gallery portraits and image processing

Different supplied photos belong to different final portrait alcoves. They must never replace project paintings or follow the selected exhibit around a room.

Use the provided assignment as the starting point:

| Section | Supplied source |
|---|---|
| Skills asset reservation | `portrait-01.png` |
| Volunteering | `portrait-02.png` |
| Contributions | `portrait-03.png` |
| Writing asset reservation | `portrait-04.png` |
| Hobbies | `portrait-05-clean.png`, otherwise clean the original 05 |
| Projects | `portrait-06-clean.png`, otherwise clean the original 06 |
| Accounts | `portrait-07-clean.png`, otherwise clean the original 07 |
| Achievements | `portrait-08.png` |
| VIP | `portrait-09.png` |
| Management public alcove, if included | `portrait-10-clean.png`, otherwise clean the original 10 |
| Basement asset reservation | `portrait-11.png`, requiring careful restoration before use |

Reserved assets do not require adding a portrait wall to the circular Skills/Basement rooms or replacing Writing's book ending. Follow the designed room endings. Images 03 and 04 may be identical supplied sources; do not invent a distinct photo to hide that fact.

Remove actual photographic backgrounds completely where a cutout is intended. Remove background posters, faces, bystanders, coloured fragments and halos; retain only Kishore. Preserve his identity, expression, pose, glasses, natural skin tone and hair. Do not beautify or substitute another face. Save originals and clean derivatives separately, with genuine alpha transparency and documented processing.

The portrait must fill its own framed panel with a prominent, complete face and appropriate head-and-shoulders crop. Do not fit a landscape canvas or large transparent margins into a tall frame and produce a tiny person in the middle. Use per-image subject-aware focal crops, preserving image proportions, not uniform stretching. Inspect hair, chin, glasses and ears at the final crop. Keep facial features intact.

An approximate portrait image plane is 3.65 × 6.32 metres in the existing composition, but its visual scale can be tuned. Use a dark green or charcoal inset behind transparent pixels, with a narrow gilded border; avoid exposing a huge shiny gold field around a small cutout. Keep photo, inset and frame separated in depth by small controlled offsets so neither hides another.

Render a contact sheet using the exact final viewport/crop calculations and inspect every portrait. Then inspect it in the actual scene. If a source image is damaged or low-resolution, report that limitation instead of fabricating detail and claiming an exact photographic restoration.

## O. Basement: Failed Projects

Label its hall entrance exactly **Basement (Failed Projects)**, with a smaller **B1 · Lower Level** line. Use an open stone arch matching the main galleries, a side plaque at a readable height, warm sconces and a visible descending stairway. The basement entrance must sit between structural supports and have a corresponding opening in the shell.

Plan the descent behind the entry threshold. If any stairs occupy the hall floor footprint, cut a matching stairwell aperture in that floor; no solid plane, floor inlay or reflection surface may cover the stairs. Add a finished rim and safe side rails. Do not project tall tunnel walls, giant rectangular sign backs, ceiling panels or opaque barriers across the visitor's view. Align the arch, hole, stairs, landing and click target from one definition.

The basement route opens into a large circular archive with a real roof, complete walls, columns, darker aged stone, brass lanterns and clear exhibit lighting. Keep it atmospheric and readable, not horror-themed. A smaller central chandelier or archive installation may give it its own character.

Exhibits are arranged around the circular room. Scroll moves around them; drag and A/D provide unrestricted horizontal 360° viewing from the initial centre position and every subsequent position. Include a clearly modelled return stair/arch marked **The Grand Rotunda**, a working Back to Hall control and the persistent Map button.

Show these seven records from the appendix: the Infinite-Power Car, TGK OS, the One-Bit LLM on Mobile, the GAN Image Generator, Projects That Stayed Experiments, the Idea Graveyard and What the Dead Ends Taught. Distinguish a failed hypothesis, unfinished implementation, hardware limitation and demonstrated result. Explain the perpetual-power car as an unsuccessful idea constrained by energy losses; do not present it as a working unlimited-energy machine.

Each detailed exhibit explains the intention, attempted approach, observed limitation and lesson. Do not invent precise causes where the source only records that the project was unfinished.

## P. Museum interface, map and correspondence desks

Use a quiet visual system: warm cream text, restrained gold, deep museum green, walnut, stone and charcoal. Use an elegant serif such as Cormorant Garamond for titles, a readable sans-serif such as Inter for body text, and a small mono face only for accession numbers and wayfinding. Keep body copy large enough to read on a phone. Avoid all-caps body paragraphs and ultra-small tracked labels.

Persistent controls:

- Museum wordmark / home or hall route.
- Current room and floor.
- **Map**, always reachable and never covered by another control.
- **Back to Hall** inside rooms.
- Contextual tour stops / previous-next controls.
- View/Zoom control above the hall tour bar.
- Sound, motion and quality preferences where relevant.
- A discreet route to visitor account, notice board and Contact Me.

The map shows Ground, Upper and Basement groups, current location, visited rooms, room descriptions and actual access restrictions. It supports direct navigation, keyboard interaction, focus management and a readable list alternative to any diagram. A private room label must not expose its hidden content.

Include the exterior/main gate in the map. Offer a browser-supported fullscreen control with a clear exit, while keeping the experience complete without fullscreen. Show short context-aware instructions on first use; dismiss them once learned. A discreet guide may provide the supplied room lines on request, but must not interrupt reading or obscure the view. Keep intro skip, visited-room progress and reset-visit actions functional.

Use floor-directory boards, a visitor-book desk and a correspondence desk as in-world entry points to the notice board and contact form. Provide direct HTML routes `/notice-board` and `/contact` so these functions are usable without WebGL and from shared links.

Preserve scene position while interfaces are open. Modal opening pauses camera input and relevant ambient motion. Escape closes the topmost overlay, focus returns to its trigger, and background controls cannot receive accidental input. External links use clear labels and appropriate safe navigation behaviour.

## Q. Authentication, guest visits and saved progress

Define roles **visitor**, **moderator** and **curator/admin**, with explicit server-side permissions. Guest access is unauthenticated public access. Do not make a client boolean, hidden route, date string, hardcoded password or localStorage value an authorisation mechanism.

Use secure server-managed sessions with opaque random identifiers in HttpOnly cookies, Secure in production and appropriate SameSite settings. Rotate sessions after login/privilege changes, support logout/revocation and use expiring one-time hashed verification/reset tokens. Hash passwords with an appropriate modern password-hashing implementation and measured server settings. Never store plaintext passwords or session secrets in browser storage.

Use accessible registration fields, password-manager support and clear errors without unnecessary account enumeration. Rate-limit authentication and recovery. Require verified identity for privileged actions. Bootstrap the curator through a controlled server command or deployment procedure, never by allowing a public registration payload to choose its role. Require stronger protection such as MFA for the curator workspace.

Guests may keep local visit progress with clear reset controls. Signed-in users can save visited rooms, bookmarks, chosen quality/motion settings and a last route/stop. When a guest signs in, merge progress intentionally rather than erasing their visit or accepting unauthorised fields. Do not persist arbitrary camera matrices supplied by clients; validate supported route/stop identifiers.

Provide account data access/export and deletion controls. Deleting an account must handle its public notes according to a documented policy, not silently expose retained private information.

## R. Public visitor notice board

Build a visible physical visitor notice board in the hall, using walnut framing, pinned cream cards, brass pins, a title and warm light. It must display actual approved visitor notes from the backend. Keep the number of in-world cards bounded; “Read all notes” opens a paginated accessible interface.

People can write notes about Kishore, his work or the museum. The form includes a display name, note body and optional private contact email for guests. Signed-in visitors use their account identity. Make it explicit that an approved note will be public; private messages belong in Contact Me. Do not publish email addresses, internal account IDs, IP addresses or moderation metadata.

Guest and signed-in submissions are supported. All new guest notes begin as pending. A configurable moderation policy may also hold registered-user notes. Show “Submitted for review” after a durable database write, not “Published” before approval. Only approved records appear in public queries.

Set practical validation limits, for example display names up to 60 characters and note text 20–1,000 characters. Trim and validate on the server. Render text safely; no visitor HTML, script, arbitrary embeds or file uploads. Provide server rate limits, a honeypot and an accessible challenge when abuse signals require one. Prevent duplicate submissions through idempotency or equivalent handling.

Signed-in users can view their own pending/approved notes and edit or delete their own content. Edits to published text return to moderation. Guests can submit and request removal through contact; do not falsely display an authenticated edit action to them. Moderators can approve, reject or hide notes and record a private reason. Keep an audit history. Public visitors can report inappropriate notes without being able to remove them directly.

Include real loading, empty, offline, validation, rate-limit and server-error states. Never populate the live board with invented testimonials. Development samples must be clearly marked and excluded from production seed data.

## S. Contact Me and correspondence

Create a dedicated **Contact Me** route and an in-world correspondence desk in the hall. It should resemble a refined writing desk with paper, an inkwell/quill and a brass nameplate, while the actual form uses accessible HTML controls.

The form collects name, email, subject/topic and message. Offer topics such as engineering opportunities, collaboration, project questions and museum feedback. Make login optional; prefill signed-in identity without locking users to an inappropriate reply address. Validate both client and server. Preserve text after a recoverable failure and prevent duplicate sends.

Persist the message in the database before confirming receipt. Create a transactional outbox job to notify **kishoremohan1307@gmail.com**. Show an honest state if receipt succeeded but email notification is delayed. Emails use a verified sender, escaped content and a validated reply-to address; never interpolate user text into mail headers.

Contacts are private. Only authorised curator users can read or manage them. Provide statuses such as new, read, replied and archived, with an inbox and timestamps. Do not show message contents on the public notice board or in application logs. Add pagination and a retention/deletion policy.

Offer a working direct email link, GitHub and LinkedIn links, résumé download and Chennai location as alternatives. Do not imply real-time availability or successful delivery without evidence.

## T. The curator workspace and content administration

Implement a real protected administration interface reached through the Management Room and `/admin`. Maintain the museum's typography and palette while prioritising efficient forms and tables.

Administrators can:

- Edit biography, education, experience, contacts and résumé asset.
- Create, edit, reorder, publish, unpublish and archive exhibits and rooms.
- Manage case studies, source links, dates, statuses and provenance.
- Edit skill names, categories, stars, durations, examples, logos and display ordering.
- Assign each room's final portrait, inspect its alpha/crop preview and adjust focal framing.
- Upload approved artwork and models; set alt text, source/licence and derivative settings.
- Manage Writing & Songs catalogue, credits, approved text and upcoming notices.
- Manage VIP teasers and access rules separately from private files or manuscript content.
- Moderate visitor notes and reports.
- Read and manage private contact submissions.
- Inspect background-job failures and publication activity.

Changes must persist after refresh, server restart and redeployment. Support draft preview before publication, confirmation for destructive actions and a content revision/audit trail. A live visitor should not encounter half-written content during an edit. Use transactions or versioned publishing and invalidate public caches when content is published.

Scene-layout controls must validate safe dimensions, navigation stops and clearances. Do not expose arbitrary code execution as a content field. Add preview checks when an edit changes text length, exhibit count or imagery so long labels and large collections do not break the architecture.

## U. Database and media model

Implement migrations, foreign keys, indexes, transactions and an idempotent seed. Use UUIDs or an equally safe primary-key strategy. Store timestamps consistently, with explicit date precision for content that only has a month or year.

Required entities and key fields:

| Entity | Essential responsibilities |
|---|---|
| Users | identity, email, display name, verification, account state |
| Roles / user roles | server-controlled permission assignments |
| Sessions | hashed/opaque session references, expiry, revocation |
| Auth tokens | hashed one-time verification/reset tokens and expiry |
| OAuth identities | provider/subject association; minimal authorised scope |
| Profile | biography, education/experience records, contact information |
| Rooms | slug, name, floor, ordering, theme, publication/visibility state |
| Exhibits | stable slug, title, descriptions, dates, technology, metrics, source, visibility |
| Exhibit placements | room ID, exhibit ID, order, side/bay; supports reuse across rooms |
| Exhibit presentation | approved artwork asset or diagram template, artifact preset, bounded visual configuration, caption and accessible description |
| Case studies | question, construction steps, outcome, limitations, linked exhibit |
| Skills | category, stars 1–5, duration evidence, example, logo, order |
| Media assets | storage key, MIME type, size, dimensions, alt text, licence, access classification |
| Portrait assignments | room, asset, subject/focal crop, processing version |
| Writing / songs | type, credits, publication date, authorised text/media/link, upcoming status |
| Visitor progress | user, visited rooms, bookmarks, last valid route/stop, preferences |
| Visitor notes | author or guest name, body, private guest email, moderation state, timestamps |
| Note reports | reported note, reason, processing state |
| Contact messages | private sender information, subject, body, inbox state |
| Access grants | explicit permission to selected private material, issuer, expiry if applicable |
| Content revisions | draft/published version, editor, revision data |
| Audit events | actor, action, entity, timestamp; no secrets or message bodies |
| Outbox / jobs | delivery type, reference, state, attempts, retry timing |

An exhibit such as SovereignOpt can appear in Projects and Contributions without a primary-key collision. Use a shared exhibit plus placements or explicit distinct records with relationships. Do not assume every source exhibit ID is globally unique across rooms.

Public queries return only published, permitted fields. Private contact data, auth information, moderation reasons, drafts and confidential assets must not be returned and merely hidden with CSS. Store private media outside public web directories and issue short-lived access URLs only after server authorisation.

Validate curator uploads by size, extension, MIME signature and supported format; reject dangerous active content. Preserve originals and generate optimised display derivatives. Store crops as structured metadata where possible. Public 3D assets should have documented rights and reasonable size budgets.

## V. API contract and integration behaviour

Expose a documented versioned API, for example `/api/v1`. These are required capabilities; exact paths may be adjusted consistently:

```text
GET    /public/museum                 published identity and room directory
GET    /public/rooms/:slug            published exhibits and room configuration
GET    /public/skills                 full skill catalogue
GET    /public/notes                  approved notes with cursor pagination
POST   /notes                        guest or visitor note submission
GET    /me/notes                     authenticated visitor's own notes
PATCH  /me/notes/:id                 edit own note; re-enter moderation
DELETE /me/notes/:id                 delete own note
POST   /notes/:id/reports            report a public note
POST   /contact                      private correspondence submission

POST   /auth/register
POST   /auth/verify-email
POST   /auth/login
POST   /auth/logout
GET    /auth/session
POST   /auth/forgot-password
POST   /auth/reset-password
GET    /auth/oauth/:provider/start   optional configured provider
GET    /auth/oauth/:provider/callback

GET    /me/progress
PATCH  /me/progress
GET    /me/export
DELETE /me/account

GET/POST/PATCH/DELETE /admin/rooms, /admin/exhibits, /admin/skills
GET/POST/PATCH/DELETE /admin/media, /admin/writing, /admin/portrait-assignments
POST   /admin/content/:id/publish
GET    /admin/notes                  includes pending records; authorised only
POST   /admin/notes/:id/moderate
GET    /admin/contact
PATCH  /admin/contact/:id
GET    /admin/audit
GET    /admin/jobs
GET    /health/live
GET    /health/ready
```

Every protected endpoint must enforce both role and record ownership. Validate payloads, pagination, identifiers and state transitions. Use coherent status codes and structured errors with field-level messages. Reject unexpected privileged fields, such as role or moderation status, in visitor submissions.

Use abortable requests, bounded retry behaviour and graceful loading states. Distinguish a cache of public content from authoritative writes. A cached museum can remain browsable during an outage, but do not pretend that an offline note or contact message has been stored on the server.

## W. Security, privacy and operational responsibility

Keep secrets in environment/configuration management, with a documented `.env.example` containing placeholders only. Do not commit passwords, service tokens, production email credentials or private repository access tokens.

Implement HTTPS in production, CSRF protection for cookie-authenticated mutations, explicit CORS origins, sensible security headers and Content Security Policy adapted to the application. Escape visitor content and validate links. If curator-rich text is allowed, sanitise it with an explicit safe subset. Prevent stored XSS, broken object-level authorisation, SQL injection, unsafe redirects and arbitrary file fetch/upload behaviour.

Rate-limit auth, notes, reports and contact submissions. Limit request sizes and timeouts. Do not log passwords, cookies, reset tokens, private messages or sensitive uploaded content. Any IP-derived abuse controls need short retention and appropriate minimisation. Avoid invasive fingerprinting and unnecessary tracking.

Public notes require visible publication consent. Contact emails are private. Provide a clear privacy page describing what is stored, why, who can access it and how to request deletion. Do not add analytics or marketing cookies without the appropriate explicit choice.

Use verified server-side authorisation for VIP files and administration. Private route names are not security. Never reuse the previous experimental “today's date as password” behaviour. Disable insecure demo auth in production and fail clearly when required production configuration is missing.

## X. Responsive design, accessibility and low-end performance

Design for desktop, ultrawide displays, tablets, portrait phones, landscape phones and small 320-pixel-wide screens. Test at least 320×568, 390×844, 430×932, 768×1024, 844×390, 1366×768, 1920×1080 and a large/ultrawide viewport.

Keep the 3D scene immersive, but adapt camera framing and controls to the available area. Use safe-area insets, adequate touch targets around 44 CSS pixels, readable forms, wrapping labels and an overflow-safe bottom bar. No title, modal, slider, Map button or keyboard should cover the only exit or submit action. Handle resize, rotation, browser zoom and on-screen keyboard changes.

On phones, dossiers may be bottom sheets or full-screen reading panels; book pages become readable single pages. Contact, login and notice-board forms should have ordinary document scrolling. The skill list must remain available even when moving planets are reduced. Do not capture gestures outside the 3D canvas region.

Provide semantic headings, labelled inputs, meaningful alt text, visible keyboard focus, logical tab order, focus trapping/return, Escape handling and status announcements. Every essential 3D action needs a keyboard-accessible HTML equivalent. Include a complete **Readable Catalogue / Accessible View** with all public content and services. Respect reduced motion, contrast needs and browser text zoom. Treat WCAG 2.2 AA as the implementation target and verify relevant behaviours rather than merely claiming compliance.

The experience must accommodate a **4 GB RAM computer with integrated graphics and no dedicated GPU**. Set explicit quality modes and an automatic choice based on both available device signals and observed frame timing. Hardware hints alone do not prove capability. Allow manual override and avoid rapid quality oscillation.

Low-power implementation requirements:

- Lazy-load the current room and its assets; do not mount the whole museum at once.
- Cap device pixel ratio, roughly 0.75–1.0 in low mode, and use adaptive resolution conservatively.
- Instance repetitive balusters, columns, candles and arch blocks; merge appropriate static geometry.
- Share materials and textures; use compressed textures/meshes when supported, with working fallbacks.
- Use sensible 512–1024 texture sizes in low mode and avoid unbounded 4K portrait maps.
- Prefer baked illumination and simple environment lighting; only a few real-time lights, fewer shadow casters.
- Disable expensive full-floor real-time reflections, volumetric effects, strong bloom, multisampling and dense particles in low mode.
- Keep the stars and planetary collection limited on phones, with every skill in the HTML catalogue.
- Pause offscreen animation and rendering when the tab is hidden; use demand rendering where the current scene is static.
- Dispose geometries, materials, render targets, textures and listeners correctly. Prevent duplicate WebGL contexts and per-frame object allocation.
- Keep React state updates out of the render loop unless a meaningful discrete UI state changes.
- Budget draw calls, triangle counts, texture memory and initial transfer size before adding decorative detail. A useful starting low-mode budget is around 100 draw calls and 150,000 visible triangles per scene, then measure and adjust.

Aim for stable interaction around 30 FPS on the tested low-end target and around 60 FPS on capable desktop hardware. These are measured targets, not promises inferred from a build result. Document the actual test device or emulator and its limitations.

If WebGL is unavailable, context creation fails or a scene cannot load, show an attractive static museum view and the complete readable catalogue, map, guestbook and contact options. No blank canvas, endless spinner or lost content. Forms and backend services must work independently of the 3D renderer.

## Y. Verification and acceptance criteria

Automated checks and build success are necessary, but visual inspection is also required. Run the application and examine the actual views. If the execution environment prevents browser testing, report exactly what was blocked and what remains unverified; do not label screenshots or interactions tested when they were not.

Capture and inspect desktop and phone screenshots of: exterior, arrival, statue/boards, both staircases from bottom and top, upper gallery in both directions, the large window, every arch, each room entrance seen from inside, representative left/right exhibits, every final portrait, Writing's book, Skills roof/orrery/boards, the basement entrance from several angles, basement full-turn views, map, login, notice board, contact and administration.

Mandatory geometric checks:

1. Walls and roofs enclose the building through a full turn, except intended openings.
2. Each aperture is actually empty at the correct place; frames and signs do not cover it.
3. Floor openings match stairwells and reveal the descent; no decorative mesh spans the void.
4. Both side stair flights meet their landings without gaps; camera paths clear statue, rails and walls.
5. Baluster feet and handrails meet their supporting surfaces and heights; no duplicated fence systems.
6. Window glass occupies an open wall aperture with visible surrounds and a believable outside view.
7. The chandelier hangs on the exact central axis with a ceiling connection.
8. Text and artwork planes are in front of their backing, correctly oriented and not z-fighting.
9. The full statue has coherent human proportions and an approved likeness; a generic bust is not accepted as finished.
10. Portraits contain only the intended subject, fill the panel at the inspected crop and never replace exhibit art.

Mandatory interaction checks:

- Forward/backward scroll follows the ordered route from statue through all ground galleries, the actual stairs and every upper gallery.
- Looking through 360° works at arrival and while walking in hall, ordinary rooms, Skills and Basement.
- Drag does not accidentally trigger plaque clicks; hover does not cause jitter or a camera feedback loop.
- Returning to the hall restores the prior stop; deep links and browser Back/Forward work.
- Turning back in the hall reveals the complete entrance door; its action returns to the gate. Turning back in each room reveals its working return arch.
- Zoom remains usable and does not clip the visitor through objects.
- A modal/form scroll cannot walk the camera; touch gestures have consistent direction.
- Every arch, map entry, book control, skill bubble, résumé link and correspondence control works.
- All supported viewport sizes fit without unwanted horizontal overflow; key controls remain reachable.
- Reduced motion and WebGL fallback preserve every essential function.

Mandatory content/backend checks:

- Import all supplied catalogue entries and 34 skills without silent loss or duplicate-ID collisions.
- A guest can browse public content and contact the owner without an account.
- Registration, verification, login, reset and logout use real services and secure sessions.
- A new note persists as pending; public queries do not expose it until approval.
- Ownership and role checks reject access to another visitor's notes and all unauthorised admin operations.
- Contacts persist privately; outbox retries do not create duplicate messages or claim undelivered mail is sent.
- Content/portrait/skill edits persist after process restart and redeployment.
- Drafts, private assets, session secrets and contact messages never leak through public responses or frontend bundles.
- Input validation, injection attempts, rate limits, CSRF controls and upload restrictions behave as designed.
- Database migrations, seed, backups and a restore procedure are exercised in a non-production environment.

Do not create tests that merely search for a source-code string and treat them as proof of appearance. Use actual geometry/raycast tests, service integration tests, browser interaction tests and reviewed renders where each is appropriate. Fix failures, then recheck the affected behaviour.

## Z. Implementation sequence and delivery

Work in reviewable stages:

1. Inventory the existing project, content, photos, résumé, models and licences. Record uncertainties and preserve originals.
2. Define the shared building plan, coordinate conventions, scene dimensions and camera paths. Block out every opening, staircase and landing before decoration.
3. Build the complete exterior, rotunda, central full-body statue, boards, twin stairs, rails, roof and large window. Validate geometry from all sides.
4. Implement stable scroll/drag/zoom navigation, the map and route transitions.
5. Build the reusable gallery system with actual exhibits, artifact miniatures, entrance returns and individual end portraits.
6. Build the full Skills planetarium and readable catalogue; build Writing's book; build the Basement archive.
7. Implement the backend, schema, migrations, content seed, object storage and protected administration.
8. Integrate optional login, progress, visitor notes, moderation, contact storage and email outbox.
9. Refine lighting, materials, sculpture details, typography, responsive layout and reduced-motion/fallback modes.
10. Run the acceptance checks, inspect screenshots, profile performance and correct defects before completion.

Deliver working source, lockfile, database migrations, idempotent seed, `.env.example`, API documentation, asset licences, local-development instructions, production build/deployment instructions, container configuration where appropriate, backup/restore instructions and an honest verification report.

Provide a local setup that starts the frontend, API, PostgreSQL, object storage, worker and a development mail sink. In production, configure TLS, durable volumes/storage, origin settings, mail credentials, health/readiness checks, logs without secrets, migrations and rollback. A restart must not erase user notes, messages, users, uploads or content edits. Do not deploy publicly or alter external accounts unless the owner authorises that step.

For missing email/OAuth/cloud credentials, implement and demonstrate the complete local flow with development services, then document the exact production variables needed. Do not replace the intended backend with mocked APIs to declare completion.

Final presentation should state what is implemented, how to run it, what was actually tested and any remaining missing asset or environment requirement. Do not declare “perfect” or “fully tested” solely because the compiler passed. The finished museum should be convincing, usable and complete in its smallest visible details.

---

## Content appendix — authoritative supplied seed

The following JSON is a snapshot of the owner's existing portfolio content. Import these facts and preserve their provenance. It is not an independent verification of external accounts or current statistics. Treat private-project links and confidential work according to the visibility rules above. Keep the content in the backend; publish only approved fields.

The appendix is intentionally complete so the builder can recreate the portfolio without inventing biography, project claims, skill levels or song credits.

```json
{
  "schemaVersion": 1,
  "provenance": {
    "source": "Snapshot of the supplied Museum of Kishore project; owner-supplied portfolio facts, not independent verification.",
    "files": [
      "src/data/museum.ts",
      "src/data/collection.ts",
      "src/data/skills.ts",
      "src/data/endPortraits.ts"
    ],
    "publicationRule": "This is curator import material. Publish only approved public fields; private project references and URLs require explicit visibility approval. The master prompt governs architecture and new service requirements.",
    "durations": "Project documentation years do not establish a skill start date or duration.",
    "legacyCopy": "Some original wording describes a small museum. The master prompt supersedes that scale with a large complete museum; preserve factual content."
  },
  "site": {
    "name": "Kishore M",
    "title": "The Museum of Kishore",
    "description": "A small museum of my life, work and personality. Walk in, look around, and take your time.",
    "email": "kishoremohan1307@gmail.com",
    "linkedin": "https://www.linkedin.com/in/kishore-mohan-979a0a28b/",
    "github": "https://github.com/KishoreM013",
    "location": "Chennai, India"
  },
  "profile": {
    "role": "Software engineer · AI & Data Science",
    "summary": "I am Kishore, a B.Tech Artificial Intelligence and Data Science student at Chennai Institute of Technology and a former Software Engineer Intern at Microsoft. I build machine learning systems, local AI tools and software that makes complex ideas easier to use.",
    "education": "B.Tech, Artificial Intelligence and Data Science · Chennai Institute of Technology · 2023–2027",
    "cgpa": "8.74 / 10",
    "source": "Kishore_M_Resume.pdf"
  },
  "rooms": [
    {
      "id": "skills",
      "name": "Skills",
      "path": "/skills",
      "floor": "Ground floor · Gallery 01",
      "icon": "trophy",
      "tagline": "A universe of skills",
      "guideLine": "Every skill has its own orbit. Select a planet to explore."
    },
    {
      "id": "volunteering",
      "name": "Volunteering",
      "path": "/volunteering",
      "floor": "Ground floor · Gallery 02",
      "icon": "heart",
      "tagline": "People I have taught",
      "guideLine": "The frames here are not awards. They are people."
    },
    {
      "id": "contributions",
      "name": "Contributions",
      "path": "/contributions",
      "floor": "Ground floor · Gallery 03",
      "icon": "git",
      "tagline": "Work that lives outside my résumé",
      "guideLine": "Small contributions, mostly. All of them real."
    },
    {
      "id": "writing",
      "name": "Writing & Songs",
      "path": "/writing",
      "floor": "Ground floor · Gallery 04",
      "icon": "feather",
      "tagline": "Words and music",
      "guideLine": "This room is quiet. Take your time in here."
    },
    {
      "id": "hobbies",
      "name": "Hobby & More About Me",
      "path": "/hobbies",
      "floor": "Ground floor · Gallery 05",
      "icon": "sparkles",
      "tagline": "The person behind the projects",
      "guideLine": "A room for the interests, habits and little details that make me me."
    },
    {
      "id": "projects",
      "name": "Projects",
      "path": "/projects",
      "floor": "Upper floor · Gallery 06",
      "icon": "frame",
      "tagline": "Things I built, including the failures",
      "guideLine": "One of these paintings is a lesson, not a win."
    },
    {
      "id": "accounts",
      "name": "Accounts",
      "path": "/accounts",
      "floor": "Upper floor · Gallery 07",
      "icon": "badge",
      "tagline": "Where to find me online",
      "guideLine": "Sign the visitor book before you go."
    },
    {
      "id": "achievements",
      "name": "Achievements",
      "path": "/achievements",
      "floor": "Upper floor · Central Gallery 08",
      "icon": "medal",
      "tagline": "Milestones worth remembering",
      "guideLine": "A record of competitions, badges, prizes and breakthroughs."
    },
    {
      "id": "vip",
      "name": "VIP Pass",
      "path": "/vip",
      "floor": "Upper floor · Gallery 09",
      "icon": "ticket",
      "tagline": "Experience and the next chapter",
      "guideLine": "The experiences that shaped the work, and where I hope to go next."
    },
    {
      "id": "management",
      "name": "Management Room",
      "path": "/management",
      "floor": "Upper floor · Gallery 10",
      "icon": "wrench",
      "tagline": "The curator’s study and credentials",
      "guideLine": "Every collection begins with learning. These are some of my foundations."
    },
    {
      "id": "basement",
      "name": "Failed Ideas",
      "path": "/basement",
      "floor": "Basement · Archive B1",
      "icon": "archive",
      "tagline": "Experiments, dead ends and lessons",
      "guideLine": "Not every idea became a project. That is part of the story."
    }
  ],
  "entrance": {
    "plaque": "Welcome to the Museum of Kishore",
    "hint": "Scroll to enter",
    "skip": "Skip intro",
    "enter": "Enter the museum",
    "hours": "Open daily · Always free"
  },
  "hall": {
    "title": "Welcome to Kishore's Portfolio",
    "intro": "I am Kishore, a B.Tech Artificial Intelligence and Data Science student at Chennai Institute of Technology and a former Software Engineer Intern at Microsoft. I build machine learning systems, local AI tools and software that makes complex ideas easier to use."
  },
  "guide": {
    "name": "Kishore",
    "hall": "Hi, I'm Kishore. Pick a path and I'll show you around."
  },
  "collections": {
    "projects": {
      "introduction": "Nine studies in turning an idea into something useful. Language, learning, systems, vision and automation.",
      "exhibits": [
        {
          "id": "legal",
          "title": "AI-Powered Legal Contract Review",
          "subtitle": "Making complex language more approachable",
          "year": "2025",
          "medium": "Python · RAG · Ollama",
          "metric": "7+ languages",
          "description": "A local contract analysis tool that answers questions grounded in the document and surfaces clause-level risks, benefits and insights.",
          "details": [
            "Accepts text, PDFs, web pages and images.",
            "Supports multilingual voice and text interaction.",
            "Runs on-device so contract data stays on the user’s machine."
          ]
        },
        {
          "id": "tgk",
          "title": "TGK Learning",
          "subtitle": "An interactive data structures lab",
          "year": "2025",
          "medium": "JavaScript · HTML/CSS · Replit · Netlify",
          "metric": "6 playgrounds",
          "description": "A visual learning platform for exploring the structures behind everyday algorithms.",
          "details": [
            "Interactive arrays, linked lists, trees, graphs, hash tables and heaps.",
            "Pseudocode and time and space complexity documented for all six structures.",
            "Published as a live web platform on Netlify."
          ]
        },
        {
          "id": "film",
          "title": "Temporal Image Interpolation",
          "subtitle": "Learning what happens between two frames",
          "year": "2025",
          "medium": "PyTorch · NVIDIA CUDA · Google Earth data",
          "metric": "0.832 SSIM",
          "description": "A deep frame interpolation model inspired by Google’s FILM, trained to generate intermediate satellite images from first and last frames.",
          "details": [
            "Trained on more than 10 GB of satellite imagery.",
            "Learns temporal changes across large motion gaps.",
            "Uses custom GPU-optimized PyTorch modules with CUDA acceleration."
          ]
        },
        {
          "id": "feedback",
          "title": "AI-Powered Feedback Resolution",
          "subtitle": "From customer comments to useful action",
          "year": "2025",
          "medium": "C# · .NET · Ollama",
          "metric": "40% less manual effort",
          "description": "An AI agent that classifies customer feedback and suggests improvements using application context.",
          "details": [
            "Reduced repetitive feedback handling by 35%.",
            "Generated context-aware improvements and resolution workflows.",
            "Reported a 20% increase in satisfaction scores."
          ]
        },
        {
          "id": "tgk-editor",
          "title": "TGK Editor",
          "subtitle": "A tiny multi-language IDE for Linux",
          "year": "2026",
          "medium": "C++ · Qt6 · clangd",
          "description": "A Linux desktop editor for C, C++, Java, Python and more, with one-key compile and run workflows and real C/C++ IntelliSense.",
          "details": [
            "Supports tabs, project folders, recent files and configurable language commands.",
            "Provides clangd-powered completion and compiler diagnostics.",
            "Includes themes, auto-save, smart indentation and an interactive output pane."
          ],
          "href": "https://github.com/KishoreM013/tgk-editor",
          "linkLabel": "View on GitHub"
        },
        {
          "id": "codetgk",
          "title": "Codetgk",
          "subtitle": "A provider-neutral terminal coding agent",
          "year": "2026",
          "medium": "TypeScript · OpenCode TUI · Ollama",
          "description": "A terminal-first coding agent with provider-neutral orchestration, explicit approvals and deliberate workflows for planning, implementation, testing and review.",
          "details": [
            "Supports Ollama and OpenAI-compatible chat endpoints.",
            "Provides read, write, search, shell and Git tools with approval before writes and commands.",
            "Persists sessions as JSONL and includes a research mode for multi-source comparisons."
          ],
          "href": "https://github.com/KishoreM013/codetgk-opencode",
          "linkLabel": "View on GitHub"
        },
        {
          "id": "sovereignopt",
          "title": "SovereignOpt",
          "subtitle": "Native GPU-accelerated mathematical optimization",
          "year": "2026",
          "medium": "C++20 · CUDA · Sparse optimization",
          "description": "A mathematical optimization solver built from first principles for linear, mixed-integer linear and quadratic programming, with native CUDA acceleration.",
          "details": [
            "Uses custom GPU kernels, sparse normal-equation assembly and GPU sparse Cholesky paths.",
            "Includes CPU dual revised simplex, branch-and-cut and presolve components.",
            "Audits solutions with an independent KKT verifier."
          ],
          "href": "https://github.com/KishoreM013/SovereignOpt",
          "linkLabel": "View on GitHub"
        },
        {
          "id": "smart-email",
          "title": "AI Smart Email Assistant",
          "subtitle": "Turning an inbox into an actionable workspace",
          "year": "2026",
          "medium": "Python · FastAPI · React · Gemini",
          "description": "A full-stack email workspace that connects to Gmail, classifies messages, extracts action items and deadlines, and presents summaries and analytics.",
          "details": [
            "Uses Gmail OAuth, NLP classification and Gemini-powered summaries.",
            "Scans PDF attachments with OCR and supports natural-language inbox search.",
            "Includes smart reply drafting, scheduled replies and a demo mode without credentials."
          ],
          "href": "https://github.com/KishoreM013/AI-Powered-Smart-Email-Assistent",
          "linkLabel": "View on GitHub"
        },
        {
          "id": "github-analyzer",
          "title": "GitHub Profile Analyzer",
          "subtitle": "A closer look at a developer profile",
          "year": "2026",
          "medium": "JavaScript · GitHub API",
          "description": "A JavaScript project for exploring and presenting GitHub profile information.",
          "details": [
            "Built around public GitHub profile data.",
            "A focused experiment in turning repository activity into a readable profile view."
          ],
          "href": "https://github.com/KishoreM013/github-profile-analyzer",
          "linkLabel": "View on GitHub"
        }
      ]
    },
    "volunteering": {
      "introduction": "Knowledge becomes more useful when it is shared. Teaching, organising and making room for others.",
      "exhibits": [
        {
          "id": "teaching",
          "title": "Passing It Forward",
          "subtitle": "C programming for junior students",
          "medium": "Teaching · Peer learning",
          "metric": "5 classes each week",
          "description": "Taught C programming to juniors during the semester holidays, making time for a regular month-long learning programme.",
          "details": [
            "Five classes per week for one month.",
            "Focused on C programming fundamentals."
          ]
        },
        {
          "id": "webify",
          "title": "Webify AI",
          "subtitle": "The work behind a shared experience",
          "medium": "Event organisation · Technical support",
          "description": "Helped organise Webify AI, coordinating the practical details that keep an event running.",
          "details": [
            "Logistics and event execution.",
            "Technical support for participants.",
            "Participant coordination throughout the event."
          ]
        },
        {
          "id": "predict-g",
          "title": "Predict G",
          "subtitle": "A symposium machine-learning challenge",
          "medium": "Event volunteering · Machine learning",
          "description": "Volunteered at a symposium event where participants received a dataset, built machine-learning models and competed to achieve the highest accuracy against hidden test data.",
          "details": [
            "Prepared and shared the dataset with participants.",
            "Participants trained models and submitted predictions for evaluation.",
            "The model with the highest accuracy against the test data won."
          ]
        }
      ]
    },
    "contributions": {
      "introduction": "Small models and serious systems, shared openly. Experiments released for other people to explore and build on.",
      "exhibits": [
        {
          "id": "chess",
          "title": "Two Ways to Think Ahead",
          "subtitle": "Chess engines on Hugging Face",
          "medium": "Game AI · Decision-making algorithms",
          "metric": "2 published engines",
          "description": "Published two chess engines using distinct algorithms to the Hugging Face community.",
          "details": [
            "Explores different approaches to chess decision-making.",
            "Related research surveyed more than ten engines and five decision-making algorithms."
          ]
        },
        {
          "id": "spam",
          "title": "Small Model, Clear Signal",
          "subtitle": "A lightweight spam email classifier",
          "medium": "Machine learning · Open source",
          "metric": "98.4% accuracy",
          "description": "Released a compact spam email classifier to the Hugging Face community.",
          "details": [
            "Approximately 7,000 parameters.",
            "Achieved 98.4% accuracy as reported in the résumé."
          ]
        },
        {
          "id": "sovereignopt",
          "title": "SovereignOpt",
          "subtitle": "A solver built from first principles",
          "year": "2026",
          "medium": "C++20 · CUDA · Open source",
          "metric": "LP · MILP · QP",
          "description": "An open mathematical optimization solver combining CPU algorithms with native GPU acceleration for people who want to explore serious numerical systems.",
          "details": [
            "Supports linear, mixed-integer linear and quadratic programming.",
            "Includes custom CUDA kernels, sparse paths and CPU simplex, presolve and branch-and-cut components.",
            "Audits solutions with an independent KKT verifier."
          ],
          "href": "https://github.com/KishoreM013/SovereignOpt",
          "linkLabel": "View on GitHub"
        }
      ]
    },
    "writing": {
      "introduction": "A quieter part of the museum: personal essays and original songs by Kishore, preserved as a small archive of words, memory and sound.",
      "exhibits": [
        {
          "id": "legacy-just-another-day",
          "title": "A Legacy of “Just Another Day”",
          "subtitle": "A personal essay about memory, loss and waiting to be seen",
          "year": "2026",
          "medium": "Medium · Personal writing",
          "description": "A reflective essay about the moments that shape identity, the people who leave a mark, and the hope that someone will stay.",
          "details": [
            "Published on Medium on 10 March 2026.",
            "Read the complete essay on Kishore’s Medium profile."
          ],
          "href": "https://medium.com/@kishoremohan1307/a-legacy-of-just-another-day-f3af4ac8154e",
          "linkLabel": "Read on Medium"
        },
        {
          "id": "worst-phase",
          "title": "Worst Phase of MY LIFE…",
          "subtitle": "An honest account of loneliness, resilience and finding a way forward",
          "year": "2025",
          "medium": "Medium · Personal writing",
          "description": "A candid piece about isolation, difficult memories, learning, and the small acts of kindness that can change someone’s life.",
          "details": [
            "Published on Medium on 15 November 2025.",
            "Read the complete essay on Kishore’s Medium profile."
          ],
          "href": "https://medium.com/@kishoremohan1307/worst-phase-of-my-life-92ce914c0396",
          "linkLabel": "Read on Medium"
        },
        {
          "id": "its-our-show",
          "title": "It’s our show | All between us",
          "subtitle": "Original song · lyrics by TGK · music by AI",
          "medium": "YouTube · Original song",
          "description": "An original song about happiness and the feeling of sharing a moment with someone else.",
          "details": [
            "Published on the TGK Prime YouTube channel.",
            "Lyrics by TGK; music by AI."
          ],
          "href": "https://www.youtube.com/watch?v=BjZtXkdahbY",
          "linkLabel": "Listen on YouTube"
        },
        {
          "id": "a-lifes-echoes",
          "title": "A life’s echoes (Would you…)",
          "subtitle": "Original song · lyrics by TGK · music by AI",
          "medium": "YouTube · Original song",
          "description": "A song from the All Between Us collection, shaped around echoes, questions and the feelings that remain.",
          "details": [
            "Published on the TGK Prime YouTube channel.",
            "Lyrics by TGK; music by AI."
          ],
          "href": "https://www.youtube.com/watch?v=vuD_RuT67gg",
          "linkLabel": "Listen on YouTube"
        },
        {
          "id": "unwritten-endings",
          "title": "Unwritten endings",
          "subtitle": "Original song · lyrics by TGK",
          "medium": "YouTube · Original song",
          "description": "An original song about the endings that are never fully written and the stories left open between people.",
          "details": [
            "Published on the TGK Prime YouTube channel.",
            "Lyrics by TGK."
          ],
          "href": "https://www.youtube.com/watch?v=M1AV7s1PKtw",
          "linkLabel": "Listen on YouTube"
        },
        {
          "id": "anchor-slips",
          "title": "Anchor slips",
          "subtitle": "Original song · lyrics by TGK · music by Gemini",
          "medium": "YouTube · Original song",
          "description": "An original song about losing one’s hold and trying to remain steady through uncertainty.",
          "details": [
            "Published on the TGK Prime YouTube channel.",
            "Lyrics by TGK; music by Gemini."
          ],
          "href": "https://www.youtube.com/watch?v=sDNF7rfQN2M",
          "linkLabel": "Listen on YouTube"
        }
      ]
    },
    "accounts": {
      "introduction": "The museum continues beyond these walls. Find the work, follow the practice, or start a conversation across the places where Kishore builds and shares.",
      "exhibits": [
        {
          "id": "github",
          "title": "The Code Archive",
          "subtitle": "KishoreM013",
          "medium": "GitHub",
          "description": "Source code, experiments and software projects.",
          "details": [
            "Explore repositories and public development work."
          ],
          "href": "https://github.com/KishoreM013",
          "linkLabel": "Visit GitHub"
        },
        {
          "id": "linkedin",
          "title": "The Professional Story",
          "subtitle": "Kishore Mohan",
          "medium": "LinkedIn",
          "description": "Experience, professional updates and connections.",
          "details": [
            "Connect to discuss software engineering, AI and machine learning."
          ],
          "href": "https://www.linkedin.com/in/kishore-mohan-979a0a28b/",
          "linkLabel": "Visit LinkedIn"
        },
        {
          "id": "leetcode",
          "title": "A Daily Practice",
          "subtitle": "KISHORE_M_13 · Knight",
          "medium": "LeetCode · Résumé snapshot",
          "metric": "1,000+ problems",
          "description": "A record of algorithmic practice, with a maximum rating of 1903 and a top 7.48% global standing in the résumé.",
          "details": [
            "Ten badges and Knight status.",
            "These are résumé figures, rather than live platform statistics."
          ],
          "href": "https://leetcode.com/u/KISHORE_M_13/",
          "linkLabel": "Visit LeetCode"
        },
        {
          "id": "codeforces",
          "title": "Thinking Under Pressure",
          "subtitle": "kishoremohan1307 · Pupil",
          "medium": "Codeforces · Résumé snapshot",
          "metric": "1295 maximum rating",
          "description": "Competitive programming practice with more than 70 problems solved, as recorded in the résumé.",
          "details": [
            "Pupil rank.",
            "Visit the profile for current results."
          ],
          "href": "https://codeforces.com/profile/kishoremohan1307",
          "linkLabel": "Visit Codeforces"
        },
        {
          "id": "codechef",
          "title": "The Contest Collection",
          "subtitle": "kishore_m13 · 3 Star",
          "medium": "CodeChef · Résumé snapshot",
          "metric": "1st of 191",
          "description": "Won the CodeChef Machine Learning Contest among 191 participants.",
          "details": [
            "Maximum rating 1670; 240 problems solved in the résumé.",
            "Best listed rank: 514 in Starters 172."
          ],
          "href": "https://www.codechef.com/users/kishore_m13",
          "linkLabel": "Visit CodeChef"
        },
        {
          "id": "gfg",
          "title": "The GeeksforGeeks Practice",
          "subtitle": "kishoremodai8",
          "medium": "GeeksforGeeks · Coding practice",
          "description": "A problem-solving profile for studying data structures, algorithms and computer science fundamentals.",
          "details": [
            "Profile: kishoremodai8.",
            "Visit the profile for current practice history and scores."
          ],
          "href": "https://www.geeksforgeeks.org/profile/kishoremodai8",
          "linkLabel": "Visit GeeksforGeeks"
        },
        {
          "id": "hackerrank",
          "title": "The HackerRank Record",
          "subtitle": "kishorem_aids07",
          "medium": "HackerRank · Coding practice",
          "description": "A coding-practice profile spanning programming challenges and technical skill tracks.",
          "details": [
            "Profile: kishorem_aids07.",
            "Visit the profile for current badges and challenge progress."
          ],
          "href": "https://www.hackerrank.com/profile/kishorem_aids07",
          "linkLabel": "Visit HackerRank"
        },
        {
          "id": "instagram",
          "title": "The Personal Lens",
          "subtitle": "@tgk_prime",
          "medium": "Instagram · Personal channel",
          "description": "A more personal window into the person behind the code, projects and museum.",
          "details": [
            "Follow the public profile for updates beyond the technical work."
          ],
          "href": "https://www.instagram.com/tgk_prime/",
          "linkLabel": "Visit Instagram"
        },
        {
          "id": "youtube",
          "title": "The Video Channel",
          "subtitle": "@tgkprim3",
          "medium": "YouTube · Video channel",
          "description": "A video space for sharing ideas, experiments and moments from the builder’s journey.",
          "details": [
            "Channel: @tgkprim3.",
            "Visit the channel for the latest published videos."
          ],
          "href": "https://www.youtube.com/@tgkprim3",
          "linkLabel": "Visit YouTube"
        },
        {
          "id": "kaggle",
          "title": "The Data Notebook",
          "subtitle": "kishoremohan013",
          "medium": "Kaggle · Data science",
          "description": "A data-science profile for notebooks, datasets and machine-learning exploration.",
          "details": [
            "Profile: kishoremohan013.",
            "Visit the profile for current notebooks and competitions."
          ],
          "href": "https://www.kaggle.com/kishoremohan013",
          "linkLabel": "Visit Kaggle"
        },
        {
          "id": "huggingface",
          "title": "The Model Shelf",
          "subtitle": "ki5h0r3",
          "medium": "Hugging Face · AI community",
          "description": "A public AI profile for sharing models, datasets and machine-learning experiments.",
          "details": [
            "Profile: ki5h0r3.",
            "Visit the profile for current models and community work."
          ],
          "href": "https://huggingface.co/ki5h0r3",
          "linkLabel": "Visit Hugging Face"
        },
        {
          "id": "stackoverflow",
          "title": "The Technical Margins",
          "subtitle": "Kishore Mohan · Stack Overflow",
          "medium": "Stack Overflow · Engineering knowledge",
          "description": "A record of technical questions, answers and practical engineering knowledge shared with the developer community.",
          "details": [
            "Profile ID: 23596737.",
            "Visit the profile for current questions and contributions."
          ],
          "href": "https://stackoverflow.com/users/23596737/kishore-mohan",
          "linkLabel": "Visit Stack Overflow"
        },
        {
          "id": "contact",
          "title": "Keep in Touch",
          "subtitle": "Chennai, India",
          "medium": "Correspondence",
          "description": "For engineering opportunities, collaborations and conversations about the work.",
          "details": [
            "kishoremohan1307@gmail.com",
            "The résumé is available from the gallery information panel."
          ],
          "href": "mailto:kishoremohan1307@gmail.com",
          "linkLabel": "Write an email"
        }
      ]
    },
    "achievements": {
      "introduction": "A record of competitions, badges, prizes and breakthroughs that mark the journey so far.",
      "exhibits": [
        {
          "id": "leetcode-knight",
          "title": "Knight, Now in the Archive",
          "subtitle": "LeetCode competitive programming",
          "medium": "LeetCode · Historic milestone",
          "metric": "1,000+ problems solved",
          "description": "Reached Knight level on LeetCode after building a sustained record of algorithmic practice. The Knight badge is now a historic milestone in the account, but the problems and discipline behind it remain part of the collection.",
          "details": [
            "Maximum rating: 1903.",
            "Top 7.48% globally in the résumé snapshot.",
            "Ten badges, including the Knight badge.",
            "The profile is the source for the current badge history."
          ],
          "href": "https://leetcode.com/u/KISHORE_M_13/",
          "linkLabel": "Visit LeetCode"
        },
        {
          "id": "codechef-machine-learning",
          "title": "First Place in Model Optimisation",
          "subtitle": "CodeChef Machine Learning Contest",
          "medium": "CodeChef · Machine learning competition",
          "metric": "1st of 191 participants",
          "description": "Won first place in the CodeChef Machine Learning Contest through model optimisation.",
          "details": [
            "Ranked first among 191 participants.",
            "This achievement is recorded in the résumé."
          ],
          "href": "https://www.codechef.com/users/kishore_m13",
          "linkLabel": "Visit CodeChef"
        },
        {
          "id": "kaggle-emodecode",
          "title": "EmoDecode-7000",
          "subtitle": "Kaggle competition leaderboard",
          "medium": "Kaggle · Machine learning competition",
          "metric": "1st place · 0.677 score",
          "description": "Finished first on the final leaderboard of Kaggle’s EmoDecode-7000 competition.",
          "details": [
            "Final leaderboard position: 1.",
            "Score shown in the submitted result: 0.677.",
            "The competition was completed and the leaderboard marked final.",
            "Result captured from the Kaggle leaderboard screenshot."
          ],
          "href": "https://www.kaggle.com/competitions/emo-decode-7000/leaderboard",
          "linkLabel": "View Kaggle leaderboard"
        },
        {
          "id": "vel-tech-university",
          "title": "Winning at Vel Tech University",
          "subtitle": "Coding competition",
          "medium": "Competitive programming · Competition win",
          "description": "Won a coding competition conducted at Vel Tech University.",
          "details": [
            "Competition result supplied by Kishore.",
            "The event title and date are not listed, so this exhibit keeps the description precise."
          ]
        },
        {
          "id": "vel-tech-college",
          "title": "Another Vel Tech Win",
          "subtitle": "Coding competition",
          "medium": "Competitive programming · Competition win",
          "description": "Won another coding competition at Vel Tech College.",
          "details": [
            "Competition result supplied by Kishore.",
            "The event title and date are not listed, so this exhibit keeps the description precise."
          ]
        },
        {
          "id": "iit-bombay-hackathon",
          "title": "Third Prize at IIT Bombay",
          "subtitle": "Hackathon achievement",
          "medium": "Hackathon · IIT Bombay",
          "metric": "3rd prize",
          "description": "Won third prize at an IIT Bombay hackathon.",
          "details": [
            "Placed third in the hackathon.",
            "The specific hackathon name and year are not listed, so no additional event details are inferred."
          ]
        },
        {
          "id": "shell-hackathon",
          "title": "Fuel Blending Optimisation",
          "subtitle": "Shell Hackathon",
          "medium": "AI optimisation · Hackathon",
          "metric": "85%+ accuracy",
          "description": "Reached more than 85% accuracy in AI-based fuel blending optimisation at the Shell Hackathon, placing among the top solutions.",
          "details": [
            "Achievement recorded in the résumé.",
            "The result reflects an AI-based optimisation challenge."
          ]
        }
      ]
    },
    "hobbies": {
      "introduction": "The parts of Kishore that do not fit neatly into a résumé: creative work, curiosity, movement and the small rituals behind the code.",
      "exhibits": [
        {
          "id": "write-songs",
          "title": "Writing Songs",
          "subtitle": "Turning thoughts into lyrics",
          "medium": "Creative hobby · Songwriting",
          "description": "Writing songs is a way to turn feelings, fragments and random late-night ideas into something that can be shared.",
          "details": [
            "Songwriting is one of Kishore’s self-rated skills.",
            "Original songs are preserved in the Writing & Songs gallery."
          ],
          "href": "/writing",
          "linkLabel": "Visit Writing & Songs"
        },
        {
          "id": "listen-songs",
          "title": "Listening to Songs",
          "subtitle": "A personal soundtrack for every mood",
          "medium": "Music · Listening",
          "description": "Songs are companions for coding, thinking, travelling and doing absolutely nothing.",
          "details": [
            "Music is part of the everyday archive.",
            "The museum’s original songs are collected in the Writing & Songs gallery."
          ],
          "href": "/writing",
          "linkLabel": "Visit the music archive"
        },
        {
          "id": "singing",
          "title": "Singing",
          "subtitle": "Usually with complete confidence",
          "medium": "Creative hobby · Performance",
          "description": "Singing, whether perfectly on-key or enthusiastically near it, is part of the fun.",
          "details": [
            "A low-pressure creative habit.",
            "The audience is sometimes just the room."
          ]
        },
        {
          "id": "minecraft",
          "title": "Playing Minecraft",
          "subtitle": "Building worlds one block at a time",
          "medium": "Game · Building · Exploration",
          "description": "Minecraft is a place to build, explore, experiment and occasionally lose track of time underground.",
          "details": [
            "Creative building and open-ended exploration.",
            "A different kind of systems thinking from the usual code."
          ]
        },
        {
          "id": "learning-new-things",
          "title": "Learning New Things",
          "subtitle": "There is always another rabbit hole",
          "medium": "Curiosity · Continuous learning",
          "description": "New tools, ideas and subjects keep the collection moving, from Ghidra to the next experiment.",
          "details": [
            "Recent learning includes Ghidra.",
            "The Skills and Projects rooms document the technical side of that curiosity."
          ],
          "href": "/skills",
          "linkLabel": "Visit the Skills room"
        },
        {
          "id": "chatting-with-friends",
          "title": "Chatting with Friends",
          "subtitle": "The social debugging session",
          "medium": "Friendship · Conversation",
          "description": "Good conversations, jokes and completely unnecessary debates are essential maintenance for the human operating system.",
          "details": [
            "A reminder that not every useful idea starts at a keyboard.",
            "Friends provide encouragement, perspective and excellent distractions."
          ]
        },
        {
          "id": "watching-movies",
          "title": "Watching Movies",
          "subtitle": "Funny · Rom-com · Epic",
          "medium": "Film · Personal favourites",
          "description": "Movies are a favourite escape, especially funny stories, romantic comedies and epic adventures.",
          "details": [
            "Favourite genres: funny, rom-com and epic.",
            "The best films provide both a reset and a new idea to think about."
          ]
        },
        {
          "id": "searching-the-web",
          "title": "Searching for New Things",
          "subtitle": "The web has one more tab",
          "medium": "Web exploration · Curiosity",
          "description": "Searching the web for new ideas, tools, facts and oddly specific questions is a hobby with no obvious closing time.",
          "details": [
            "Curiosity often begins with one search and ends several rabbit holes later.",
            "Some searches become projects; others become excellent trivia."
          ]
        },
        {
          "id": "overthinking",
          "title": "Overthinking",
          "subtitle": "A premium subscription to “what if?”",
          "medium": "Mental sport · Self-awareness",
          "description": "Overthinking is the unofficial background process: sometimes useful for planning, sometimes just spinning in circles.",
          "details": [
            "A playful self-observation, not a superpower.",
            "The trick is learning when to turn the process off."
          ]
        },
        {
          "id": "manipulating",
          "title": "Manipulating",
          "subtitle": "The mischievous art of moving the pieces",
          "medium": "Playful chaos · Social wit",
          "description": "A tongue-in-cheek entry for being clever with situations, conversations and harmless mischief—best used with consent and good intentions.",
          "details": [
            "Presented as self-aware humour rather than a serious life skill.",
            "The museum recommends persuasion, honesty and kindness over manipulation."
          ]
        }
      ]
    },
    "vip": {
      "introduction": "The premium collection: private experiments, unfinished stories, future music and ideas still becoming real.",
      "exhibits": [
        {
          "id": "ruins-remains",
          "title": "Ruins & Remains",
          "subtitle": "A book still being written",
          "medium": "Upcoming book · Private work",
          "description": "A forthcoming book reserved for the curator’s next chapter. Its title is here before the finished pages arrive.",
          "details": [
            "Title: Ruins & Remains.",
            "The manuscript is an upcoming personal project.",
            "Further pages will be added when the work is ready."
          ]
        },
        {
          "id": "dream-come-true",
          "title": "Dream Come True",
          "subtitle": "When a movie becomes a playable video game",
          "medium": "Private repository · AI game generation",
          "description": "A private research and design project exploring a pipeline that turns a movie into a functional, playable Godot game.",
          "details": [
            "Analyzes plot, characters, locations and story beats before designing gameplay.",
            "Plans maps, levels, quests, controls, combat, objectives and reusable assets.",
            "The architecture runs from film analysis through orchestration, validation and a playable Godot build.",
            "Status: research and design; the repository is private while the concept develops."
          ],
          "href": "https://github.com/nothing-impossible-NI/dream-come-true",
          "linkLabel": "View private project"
        },
        {
          "id": "netpilot",
          "title": "Netpilot",
          "subtitle": "Adaptive quality-of-service engineering",
          "medium": "Private repository · Go · Linux networking",
          "description": "A private systems project for adaptive QoS across mixed home-broadband traffic.",
          "details": [
            "Uses a Go control daemon and Linux tc/HTB/CAKE lab workflows.",
            "Includes header-only traffic classification and reproducible experiments.",
            "The repository is private while the system is being developed."
          ],
          "href": "https://github.com/KishoreM013/netpilot",
          "linkLabel": "View private project"
        },
        {
          "id": "upcoming-songs",
          "title": "Two Songs in the Wings",
          "subtitle": "Two new songs are on the way",
          "medium": "Upcoming music · TGK Prime",
          "description": "Two upcoming songs are being prepared for the next release in the TGK Prime music collection.",
          "details": [
            "Two new songs are currently in progress.",
            "Titles and release details will be revealed when they are ready.",
            "The existing songs live in the Writing & Songs gallery."
          ],
          "href": "https://www.youtube.com/@tgkprim3",
          "linkLabel": "Follow the music channel"
        },
        {
          "id": "patent-review",
          "title": "An Idea Under Review",
          "subtitle": "Patent application in progress",
          "medium": "Patent · Confidential work",
          "description": "A patent-related invention is currently under review. The details remain private until the review process allows them to be shared.",
          "details": [
            "Status: under review.",
            "Technical details are intentionally withheld while the application is being evaluated.",
            "This exhibit records the milestone without exposing confidential material."
          ]
        },
        {
          "id": "microsoft",
          "title": "Engineering for Reliability",
          "subtitle": "Software Engineer Intern · Microsoft",
          "year": "May–July 2026",
          "medium": "Anomaly detection · Automation · Monitoring",
          "metric": "30% faster triage",
          "description": "Built an AI-powered anomaly detection pipeline and automation workflows to improve operational reliability.",
          "details": [
            "Reduced manual incident handling by 50%, saving approximately 15 hours per week.",
            "Improved service monitoring and mean time to detect.",
            "Decreased false alarms by 25–30%."
          ]
        },
        {
          "id": "research",
          "title": "Learning to Make Decisions",
          "subtitle": "Research Intern · Chennai Institute of Technology",
          "year": "November–December 2024",
          "medium": "Voice interfaces · Chess AI · Deep learning",
          "description": "Researched a voice-controlled operating system and investigated decision-making approaches in chess engines.",
          "details": [
            "Raised voice-command response accuracy by 80%.",
            "Surveyed more than ten chess engines and five decision-making algorithms.",
            "Studied AlphaZero’s deep learning approach to chess decision-making."
          ]
        },
        {
          "id": "education",
          "title": "The Foundations",
          "subtitle": "Chennai Institute of Technology",
          "year": "2023–2027",
          "medium": "B.Tech · Artificial Intelligence and Data Science",
          "metric": "8.74 / 10 CGPA",
          "description": "An undergraduate foundation in AI, data science and software engineering.",
          "details": [
            "Generative AI and deep learning.",
            "Operating systems and software engineering.",
            "Database management systems."
          ]
        }
      ]
    },
    "management": {
      "introduction": "The curator’s study: formal learning, technical foundations and milestones behind the collection.",
      "exhibits": [
        {
          "id": "genai",
          "title": "Learning to Generate",
          "subtitle": "Google Generative AI",
          "year": "2024",
          "medium": "Certification",
          "description": "Generative AI certification listed in the résumé.",
          "details": [
            "Focused on generative artificial intelligence."
          ]
        },
        {
          "id": "systems",
          "title": "Systems at Scale",
          "subtitle": "NPTEL",
          "year": "2024–2025",
          "medium": "Cloud Computing · Parallel Computing Architecture",
          "description": "Continued learning in distributed infrastructure and parallel computation.",
          "details": [
            "Cloud Computing — 2024.",
            "Parallel Computing Architecture — 2025."
          ]
        },
        {
          "id": "networks",
          "title": "Connected Foundations",
          "subtitle": "CISCO",
          "year": "2023",
          "medium": "Cyber Security · Networking",
          "description": "Foundational certifications in networking and cybersecurity.",
          "details": [
            "Cyber Security — 2023.",
            "Networking — 2023."
          ]
        },
        {
          "id": "shell",
          "title": "Applied Intelligence",
          "subtitle": "Shell Hackathon",
          "medium": "Fuel blending optimisation",
          "metric": "85%+ accuracy",
          "description": "Applied AI to fuel blending optimisation, placing among the top solutions according to the résumé.",
          "details": [
            "Applied machine learning to an industrial optimisation problem."
          ]
        }
      ]
    },
    "basement": {
      "introduction": "The museum’s honest lower level: unfinished experiments, abandoned directions and ideas that taught something even when they did not ship.",
      "exhibits": [
        {
          "id": "solar-wind-piezo-car",
          "title": "The Infinite-Power Car",
          "subtitle": "Solar panels, wind energy and piezoelectric suspension",
          "year": "Prototype idea",
          "medium": "Failed engineering concept · Vehicle design",
          "description": "A car imagined to combine solar panels, wind energy and piezoelectric suspension to generate enough power to run itself indefinitely. The idea belongs here as an ambitious experiment: a reminder that energy losses, conversion limits and real-world constraints matter as much as an exciting concept.",
          "details": [
            "Solar panels were intended to charge the vehicle while it moved and parked.",
            "Wind energy was proposed as another onboard source of power.",
            "Piezoelectric suspension would harvest energy from movement.",
            "The prototype was not completed; it remains a documented failed idea rather than a working infinite-power system."
          ]
        },
        {
          "id": "tgk-os",
          "title": "TGK OS",
          "subtitle": "A Linux-based operating system with an AI command layer",
          "medium": "Failed systems concept · AI-native computing",
          "description": "An unfinished idea for a Linux-based operating system where an integrated AI could understand the terminal, inspect applications, run commands and take actions across the system. Every application would be designed around terminal commands so the AI could read its capabilities and operate it through a common interface.",
          "details": [
            "The AI was intended to understand application commands instead of relying only on a graphical interface.",
            "Applications would expose terminal-first actions that the assistant could inspect and run.",
            "The concept aimed to give the user broad control while keeping the system grounded in observable commands.",
            "The operating system was not completed; it remains an ambitious failed idea in the archive."
          ]
        },
        {
          "id": "mobile-one-bit-llm",
          "title": "The One-Bit LLM on Mobile",
          "subtitle": "Running a Microsoft-inspired 1-bit model on a phone",
          "medium": "Failed AI experiment · On-device inference",
          "description": "An attempt to run a Microsoft-inspired 1-bit large language model on a mobile device. The output became unreliable and messy, with hallucinated responses that showed how difficult useful on-device inference can be when model capacity, memory and runtime constraints are tightly limited.",
          "details": [
            "The experiment targeted mobile hardware rather than a desktop GPU.",
            "The aggressively compressed model was tested for practical on-device generation.",
            "The resulting output was incoherent in places and frequently hallucinated.",
            "The failure exposed the need for better model validation, quantisation support and device-aware inference limits."
          ]
        },
        {
          "id": "gan-image-generator",
          "title": "The GAN Image Generator",
          "subtitle": "A generative adversarial network limited by its hardware",
          "medium": "Failed AI project · Generative image model",
          "description": "An image-generation model built with a GAN approach. The project was explored as part of the work shared on LinkedIn, but hardware restrictions made training and iteration too constrained for the model to reach a reliable result.",
          "details": [
            "The generator and discriminator were trained as competing networks.",
            "Hardware limits reduced the practical time and scale available for training.",
            "The project could not reach the image quality and stability expected from the idea.",
            "It remains a useful record of how compute access shapes what an AI project can become."
          ]
        },
        {
          "id": "failed-projects",
          "title": "The Projects That Stayed Experiments",
          "subtitle": "Not every prototype became a product",
          "medium": "Unfinished work · Lessons",
          "description": "A place for projects that stopped before the finish line. They remain useful as records of questions asked, approaches tested and lessons learned.",
          "details": [
            "Failure is part of the engineering process.",
            "More specific projects will be added as they are documented."
          ]
        },
        {
          "id": "unbuilt-ideas",
          "title": "The Idea Graveyard",
          "subtitle": "Good ideas, wrong moment",
          "medium": "Ideas · Research notes",
          "description": "A shelf for concepts that were interesting but not ready, not practical or simply overtaken by the next idea.",
          "details": [
            "An idea can be valuable even when it is never built.",
            "This archive is intentionally a work in progress."
          ]
        },
        {
          "id": "lessons-from-failure",
          "title": "What the Dead Ends Taught",
          "subtitle": "Every wrong turn leaves a map",
          "medium": "Reflection · Engineering practice",
          "description": "The useful part of a failed attempt is the evidence it leaves behind: what to change, what to simplify and what not to repeat.",
          "details": [
            "Document the assumption.",
            "Keep the lesson.",
            "Try again with better information."
          ]
        }
      ]
    }
  },
  "caseStudies": {
    "legal": {
      "question": "How can someone explore a complex contract in their own language while keeping the document on their own device?",
      "construction": [
        "Accept four input types: text, PDF, web pages and images.",
        "Retrieve the relevant contract passages before generating a response.",
        "Use Python and Ollama for local inference, with multilingual voice and text interaction."
      ],
      "outcome": "A cross-platform, on-device review system that supports more than seven languages and surfaces risks, benefits and clause-level insights grounded in the contract."
    },
    "tgk": {
      "question": "How can data structures become something a learner can explore instead of only memorise?",
      "construction": [
        "Create visual playgrounds for arrays, linked lists, trees, graphs, hash tables and heaps.",
        "Pair every structure with pseudocode and time and space complexity explanations.",
        "Build the browser experience in JavaScript and HTML/CSS, then publish it on Netlify."
      ],
      "outcome": "Six interactive learning environments in one publicly hosted data structures lab."
    },
    "film": {
      "question": "What might the landscape look like between two satellite images separated by a large motion gap?",
      "construction": [
        "Build a deep frame interpolation model inspired by Google’s FILM.",
        "Train on more than 10 GB of satellite imagery to learn temporal change.",
        "Develop custom PyTorch modules and use NVIDIA CUDA for GPU acceleration."
      ],
      "outcome": "Generated intermediate satellite frames with a reported structural similarity score of 0.832 SSIM."
    },
    "feedback": {
      "question": "How can repeated customer comments become actionable improvements with less manual review?",
      "construction": [
        "Classify incoming customer comments and identify suggested improvements.",
        "Use C#, .NET and Ollama to combine feedback with application context.",
        "Automate classification and resolution workflows to reduce repetitive handling."
      ],
      "outcome": "The résumé reports 40% less manual review effort, 35% less repetitive handling and a 20% increase in customer satisfaction scores."
    },
    "tgk-editor": {
      "question": "What would a focused Linux editor feel like when compiling, navigating and understanding code are one continuous workflow?",
      "construction": [
        "Build a Qt6 desktop editor in modern C++ with tabs, project folders and recent files.",
        "Connect clangd for semantic C/C++ completion and live diagnostics.",
        "Add one-key compile and run, configurable language commands, themes and an interactive output pane."
      ],
      "outcome": "A compact multi-language IDE that keeps the essential edit, build and diagnose loop close at hand."
    },
    "codetgk": {
      "question": "How can a terminal coding agent make powerful tools useful without hiding what it is about to change?",
      "construction": [
        "Orchestrate provider-neutral chat through Ollama and OpenAI-compatible endpoints.",
        "Expose read, write, search, shell and Git tools behind explicit approval gates.",
        "Carry work through planning, implementation, testing and review stages with JSONL session persistence."
      ],
      "outcome": "A clean-room terminal agent designed around deliberate workflows, transparent tool use and provider flexibility."
    },
    "sovereignopt": {
      "question": "Can a mathematical optimization solver combine serious CPU algorithms with native GPU acceleration?",
      "construction": [
        "Implement C++20 solver foundations for LP, MILP and QP problems.",
        "Move sparse assembly, reductions and selected interior-point operations into custom CUDA kernels.",
        "Pair presolve and branch-and-cut components with an independent KKT solution verifier."
      ],
      "outcome": "A first-principles optimization system with CPU simplex, mixed-integer search and GPU-backed numerical paths."
    },
    "smart-email": {
      "question": "How can an inbox surface decisions, deadlines and replies instead of making every message another task to sort?",
      "construction": [
        "Connect Gmail through OAuth and classify messages with FastAPI services and Gemini.",
        "Extract meetings, action items and PDF attachment text with OCR.",
        "Present priority routing, natural-language search, analytics, smart replies and scheduled responses in a React workspace."
      ],
      "outcome": "A full-stack email operations dashboard that turns inbox management into a searchable, actionable workspace."
    },
    "github-analyzer": {
      "question": "How can public GitHub activity become a clearer picture of a developer’s work?",
      "construction": [
        "Use JavaScript to gather public GitHub profile information.",
        "Organise repository activity into a focused profile presentation.",
        "Keep the experience centred on readable project and contribution signals."
      ],
      "outcome": "A concise profile-analysis experiment built around the public GitHub API."
    }
  },
  "skillLevels": [
    {
      "name": "Expert",
      "stars": 5,
      "ringFromCentre": 1
    },
    {
      "name": "Strong",
      "stars": 4,
      "ringFromCentre": 2
    },
    {
      "name": "Comfortable",
      "stars": 3,
      "ringFromCentre": 3
    },
    {
      "name": "Learning",
      "stars": 2,
      "ringFromCentre": 4
    },
    {
      "name": "Exploring",
      "stars": 1,
      "ringFromCentre": 5
    }
  ],
  "categoryColors": {
    "Languages": "#71b4f3",
    "Core concepts": "#b294ec",
    "Tools": "#d6b777"
  },
  "skills": [
    {
      "id": "python",
      "name": "Python",
      "logo": "python",
      "category": "Languages",
      "stars": 5,
      "duration": "Project documented in 2025",
      "example": "AI-Powered Legal Contract Review System: local contract analysis with RAG and Ollama."
    },
    {
      "id": "cpp",
      "name": "C / C++",
      "logo": "cpp",
      "category": "Languages",
      "stars": 5,
      "duration": "Start date not specified in the résumé",
      "example": "Taught C programming to juniors, five classes per week over one month."
    },
    {
      "id": "csharp",
      "name": "C#",
      "logo": "csharp",
      "category": "Languages",
      "stars": 3,
      "duration": "Project documented in 2025",
      "example": "AI-Powered Feedback Resolution Agent, built with C#, .NET and Ollama."
    },
    {
      "id": "java",
      "name": "Java",
      "logo": "java",
      "category": "Languages",
      "stars": 4,
      "duration": "Start date not specified in the résumé",
      "example": "Listed as Java (basics) in the résumé."
    },
    {
      "id": "javascript",
      "name": "JavaScript",
      "logo": "javascript",
      "category": "Languages",
      "stars": 4,
      "duration": "Project documented in 2025",
      "example": "TGK Learning: six interactive data structure playgrounds."
    },
    {
      "id": "typescript",
      "name": "TypeScript",
      "logo": "typescript",
      "category": "Languages",
      "stars": 4,
      "duration": "Project documented in 2026",
      "example": "Used in the Codetgk terminal coding agent."
    },
    {
      "id": "go",
      "name": "Go",
      "logo": "go",
      "category": "Languages",
      "stars": 3,
      "duration": "Start date not specified in the résumé",
      "example": "Listed in the résumé; a specific project example has not yet been supplied."
    },
    {
      "id": "sql",
      "name": "SQL",
      "logo": "sql",
      "category": "Languages",
      "stars": 4,
      "duration": "Start date not specified in the résumé",
      "example": "Listed in the résumé; a specific project example has not yet been supplied."
    },
    {
      "id": "htmlcss",
      "name": "HTML / CSS",
      "logo": "htmlcss",
      "category": "Languages",
      "stars": 5,
      "duration": "Project documented in 2025",
      "example": "TGK Learning: browser-based visual learning platform hosted on Netlify."
    },
    {
      "id": "dart",
      "name": "Dart",
      "logo": "dart",
      "category": "Languages",
      "stars": 4,
      "duration": "Start date not specified in the résumé",
      "example": "Listed in the résumé; a specific project example has not yet been supplied."
    },
    {
      "id": "pytorch",
      "name": "PyTorch",
      "logo": "pytorch",
      "category": "Tools",
      "stars": 4,
      "duration": "Project documented in 2025",
      "example": "FILM-inspired satellite frame interpolation model; achieved 0.832 SSIM."
    },
    {
      "id": "tensorflow",
      "name": "TensorFlow",
      "logo": "tensorflow",
      "category": "Tools",
      "stars": 3,
      "duration": "Start date not specified in the résumé",
      "example": "Listed in the résumé; a specific project example has not yet been supplied."
    },
    {
      "id": "genai",
      "name": "Generative AI",
      "logo": "genai",
      "category": "Core concepts",
      "stars": 4,
      "duration": "Certification documented in 2024",
      "example": "Local AI workflows in the contract review system and feedback resolution agent."
    },
    {
      "id": "vit",
      "name": "Vision Transformers",
      "logo": "vit",
      "category": "Core concepts",
      "stars": 3,
      "duration": "Start date not specified in the résumé",
      "example": "Listed in the résumé; a specific project example has not yet been supplied."
    },
    {
      "id": "rag",
      "name": "RAG / CAG",
      "logo": "rag",
      "category": "Core concepts",
      "stars": 4,
      "duration": "Project documented in 2025",
      "example": "Contract review system: retrieval-grounded answers in 7+ languages across four input types."
    },
    {
      "id": "mcp",
      "name": "MCP",
      "logo": "mcp",
      "category": "Core concepts",
      "stars": 4,
      "duration": "Start date not specified in the résumé",
      "example": "Listed in the résumé; a specific project example has not yet been supplied."
    },
    {
      "id": "ollama",
      "name": "Ollama",
      "logo": "ollama",
      "category": "Tools",
      "stars": 3,
      "duration": "Projects documented in 2025",
      "example": "On-device inference for legal contract review and the feedback resolution agent."
    },
    {
      "id": "git",
      "name": "Git",
      "logo": "git",
      "category": "Tools",
      "stars": 5,
      "duration": "Start date not specified in the résumé",
      "example": "Listed in the résumé; a specific project example has not yet been supplied."
    },
    {
      "id": "github",
      "name": "GitHub",
      "logo": "github",
      "category": "Tools",
      "stars": 5,
      "duration": "Start date not specified in the résumé",
      "example": "Public development profile: github.com/KishoreM013."
    },
    {
      "id": "flutter",
      "name": "Flutter",
      "logo": "flutter",
      "category": "Tools",
      "stars": 4,
      "duration": "Start date not specified in the résumé",
      "example": "Listed in the résumé; a specific project example has not yet been supplied."
    },
    {
      "id": "firebase",
      "name": "Firebase",
      "logo": "firebase",
      "category": "Tools",
      "stars": 3,
      "duration": "Start date not specified in the résumé",
      "example": "Listed in the résumé; a specific project example has not yet been supplied."
    },
    {
      "id": "mongodb",
      "name": "MongoDB",
      "logo": "mongodb",
      "category": "Tools",
      "stars": 3,
      "duration": "Start date not specified in the résumé",
      "example": "Listed in the résumé; a specific project example has not yet been supplied."
    },
    {
      "id": "colab",
      "name": "Google Colab",
      "logo": "colab",
      "category": "Tools",
      "stars": 5,
      "duration": "Start date not specified in the résumé",
      "example": "Listed in the résumé; a specific project example has not yet been supplied."
    },
    {
      "id": "linux",
      "name": "Linux",
      "logo": "linux",
      "category": "Tools",
      "stars": 4,
      "duration": "Start date not specified in the résumé",
      "example": "Listed in the résumé; a specific project example has not yet been supplied."
    },
    {
      "id": "cuda",
      "name": "CUDA",
      "logo": "cuda",
      "category": "Tools",
      "stars": 3,
      "duration": "Project documented in 2025",
      "example": "GPU acceleration for custom PyTorch modules in the satellite interpolation project."
    },
    {
      "id": "ghidra",
      "name": "Ghidra",
      "logo": "ghidra",
      "category": "Tools",
      "stars": 3,
      "duration": "Recently learned",
      "example": "Recently learned for reverse engineering and binary analysis."
    },
    {
      "id": "dsa",
      "name": "Data Structures & Algorithms",
      "logo": "dsa",
      "category": "Core concepts",
      "stars": 5,
      "duration": "Start date not specified in the résumé",
      "example": "TGK Learning visualises six structures; the résumé records 1,000+ LeetCode problems solved."
    },
    {
      "id": "oop",
      "name": "Object-Oriented Programming",
      "logo": "oop",
      "category": "Core concepts",
      "stars": 5,
      "duration": "Start date not specified in the résumé",
      "example": "Listed in the résumé; a specific project example has not yet been supplied."
    },
    {
      "id": "problem-solving",
      "name": "Problem Solving",
      "logo": "problem-solving",
      "category": "Core concepts",
      "stars": 4,
      "duration": "Ongoing engineering practice",
      "example": "Turning ambiguous requirements into workable, testable solutions."
    },
    {
      "id": "debugging",
      "name": "Debugging",
      "logo": "debugging",
      "category": "Core concepts",
      "stars": 4,
      "duration": "Ongoing engineering practice",
      "example": "Finding the actual cause behind a failing build, test or feature."
    },
    {
      "id": "communication",
      "name": "Communication",
      "logo": "communication",
      "category": "Core concepts",
      "stars": 4,
      "duration": "Ongoing engineering practice",
      "example": "Explaining ideas, documenting work and collaborating clearly."
    },
    {
      "id": "teamwork",
      "name": "Teamwork",
      "logo": "teamwork",
      "category": "Core concepts",
      "stars": 5,
      "duration": "Ongoing engineering practice",
      "example": "Sharing ownership and helping a project move forward with other people."
    },
    {
      "id": "songwriting",
      "name": "Songwriting",
      "logo": "songwriting",
      "category": "Core concepts",
      "stars": 5,
      "duration": "Personal creative practice",
      "example": "Writing original lyrics and songs for the TGK Prime music collection."
    },
    {
      "id": "walking",
      "name": "Walking",
      "logo": "walking",
      "category": "Core concepts",
      "stars": 5,
      "duration": "A lifelong skill",
      "example": "Grand-tour stamina for long museum corridors, dramatic pacing and thinking walks."
    }
  ],
  "featuredSkillIds": [
    "python",
    "cpp",
    "csharp",
    "java",
    "javascript",
    "pytorch",
    "genai",
    "rag",
    "ollama",
    "cuda",
    "ghidra",
    "dsa",
    "songwriting",
    "walking"
  ],
  "endPortraits": {
    "skills": "/images/portraits/portrait-01.png",
    "volunteering": "/images/portraits/portrait-02.png",
    "contributions": "/images/portraits/portrait-03.png",
    "writing": "/images/portraits/portrait-04.png",
    "hobbies": "/images/portraits/portrait-05-clean.png",
    "projects": "/images/portraits/portrait-06-clean.png",
    "accounts": "/images/portraits/portrait-07-clean.png",
    "achievements": "/images/portraits/portrait-08.png",
    "vip": "/images/portraits/portrait-09.png",
    "management": "/images/portraits/portrait-10-clean.png",
    "basement": "/images/portraits/portrait-11.png"
  },
  "requiredSourceAssets": {
    "resume": "public/resume.pdf",
    "originalPortrait": "public/images/kishore-portrait.jpeg",
    "galleryPortraitDirectory": "public/images/portraits/",
    "portraitProcessingNotes": "docs/portrait-cleanup.md",
    "portraitFramingSource": "src/components/three/portraitFraming.ts",
    "existingSculpture": "public/models/marble_bust_01/",
    "existingSculptureCaveat": "Generic CC0 placeholder bust; this is not a full-body sculpture or a likeness of Kishore. Supply or commission an approved full-body model for the final statue."
  },
  "counts": {
    "mainGalleries": 10,
    "basementArchives": 1,
    "exhibitPlacements": 70,
    "skills": 34,
    "projectCaseStudies": 9,
    "placementsByCollection": {
      "projects": 9,
      "volunteering": 3,
      "contributions": 3,
      "writing": 6,
      "accounts": 13,
      "achievements": 7,
      "hobbies": 10,
      "vip": 8,
      "management": 4,
      "basement": 7
    }
  }
}
```

## Final instruction to the builder

Build this as one coherent, complete museum. Follow the current ten-gallery layout and the content above. Preserve the owner’s identity, portraits, project descriptions, humour and credits. Improve the physical architecture, rendering and usability while maintaining the eighteenth-century British museum character. Complete the real backend, optional guest/account entry, visitor notice board and contact workflow. Inspect the actual rendered geometry, portraits and readable content on desktop and mobile; verify durable server behaviour. Report missing assets or blocked checks honestly. Deliver the working implementation and its operational documentation.
