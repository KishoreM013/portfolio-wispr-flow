import assert from 'node:assert/strict'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import { MuseumProvider } from '../src/context/MuseumContext'
import { EntrancePage } from '../src/pages/EntrancePage'
import { MainHallPage } from '../src/pages/MainHallPage'
import { SkillsPage } from '../src/pages/SkillsPage'
import { RoomPage } from '../src/pages/RoomPage'
import { FloatingMapButton } from '../src/components/FloatingMapButton'
import { MuseumFooter } from '../src/components/MuseumFooter'
import { TourGuide } from '../src/components/TourGuide'
import { RoomShell } from '../src/components/RoomShell'
import { SceneFallback } from '../src/components/SceneBoundary'
import { HallPaths } from '../src/components/HallPaths'
import { ExhibitDossier, CuratorDossier } from '../src/components/ExhibitDossier'
import { collections } from '../src/data/collection'
import { rooms } from '../src/data/museum'

function render(children: ReactNode) {
  return renderToString(<MemoryRouter><MuseumProvider>{children}</MuseumProvider></MemoryRouter>)
}
const entrance = render(<EntrancePage />)
assert.ok(entrance.includes('Welcome to the Museum of Kishore'))
const hall = render(<MainHallPage />)
assert.ok(hall.includes('Explore the museum'))
assert.ok(hall.includes('touch-instructions'))
assert.equal((hall.match(/dock-short-label/g) || []).length, 4)
const skills = render(<SkillsPage />)
assert.equal((skills.match(/class="skill-row"/g) || []).length, 34)
assert.ok(skills.includes('Back to Hall'))
for (const room of rooms.filter(room => room.id !== 'skills')) {
  const html = render(<RoomPage room={room} />)
  assert.ok(html.includes('Back to Hall'), room.id)
  assert.ok(html.includes('museum-gallery'), room.id)
  if (room.id !== 'writing' && room.id !== 'management') assert.ok(html.includes('Browse exhibits'), room.id)
}
const paths = render(<HallPaths />)
for (const room of rooms.filter(room => room.id !== 'basement')) assert.ok(paths.includes(`href="${room.path}"`))
assert.ok(render(<FloatingMapButton />).includes('Open the museum map'))
assert.ok(render(<MuseumFooter />).includes('mailto:'))
assert.ok(render(<TourGuide />).includes('curator-annotation'))
assert.ok(render(<RoomShell room={rooms[0]}><p>Exhibit content</p></RoomShell>).includes('Exhibit content'))
assert.ok(render(<SceneFallback />).includes('Open museum map'))
console.log('Component render checks passed: entrance, hall, planetarium catalogue, ten galleries, directory, map trigger, footer, curator note, room shell and GPU fallback.')
console.log('These are server-render smoke checks; touch, CSS layout and WebGL still require browser QA.')

for (const [index, exhibit] of collections.projects.exhibits.entries()) {
  const html = render(<ExhibitDossier exhibit={exhibit} index={index} onClose={() => {}} />)
  assert.ok(html.includes('The question') && html.includes('The construction') && html.includes('The result'))
  assert.ok(html.includes('Read the complete résumé'))
}
const portrait = render(<CuratorDossier onClose={() => {}} />)
assert.ok(portrait.includes('/images/kishore-portrait.jpeg'))
assert.ok(portrait.includes('Kishore M') && portrait.includes('8.74'))
console.log('Case-study and portrait dossier render checks passed.')
