import { useEffect, useState } from 'react'
import type { Dispatch, FormEvent, SetStateAction } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Info, LockKeyhole, Plus, Trash2 } from 'lucide-react'
import type { Room } from '../data/museum'
import { ExhibitDossier, CuratorDossier } from '../components/ExhibitDossier'
import { collections } from '../data/collection'
import { endPortraits } from '../data/endPortraits'
import { skills as skillCatalogue } from '../data/skills'
import { useMuseum } from '../context/museum-context'
import { useLiteMode, usePrefersReducedMotion } from '../hooks/useDevice'
import { GalleryScene } from '../components/three/GalleryScene'
import { BasementScene } from '../components/three/BasementScene'
import '../components/gallery.css'

function GalleryRoom({ room }: { room: Room & { id: Exclude<Room['id'], 'skills'> } }) {
  const { markVisited } = useMuseum()
  const lite = useLiteMode(), reduced = usePrefersReducedMotion()
  const [selected, setSelected] = useState(0)
  const [atEnd, setAtEnd] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [navigationKey, setNavigationKey] = useState(0)
  const [upcomingOpen, setUpcomingOpen] = useState(false)
  const collection = collections[room.id]
  const exhibit = collection.exhibits[selected]
  useEffect(() => { markVisited(room.id); document.title = `${room.name} — The Museum of Kishore` }, [markVisited, room.id, room.name])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setInfoOpen(false)
      if (e.target instanceof HTMLElement && e.target.closest('button,a,[role="dialog"]')) return
      if (e.key === 'ArrowRight' && collection.exhibits.length) { e.preventDefault(); setSelected(i => Math.min(i + 1, collection.exhibits.length - 1)); setNavigationKey(k => k + 1) }
      if (e.key === 'ArrowLeft' && collection.exhibits.length) { e.preventDefault(); setSelected(i => Math.max(i - 1, 0)); setNavigationKey(k => k + 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [collection.exhibits.length])
  const select = (i: number) => { setSelected(i); setNavigationKey(k => k + 1); setInfoOpen(true) }
  const isBasement = room.id === 'basement'
  return <main className="museum-gallery" data-info-open={infoOpen}>
    <div className="museum-gallery-scene">{isBasement ? <BasementScene exhibits={collection.exhibits} selected={selected} onSelect={select} onBrowse={setSelected} lite={lite} reduced={reduced} /> : <GalleryScene endPortraitSrc={endPortraits[room.id]} exhibits={collection.exhibits} selected={selected} onSelect={select} onBrowse={setSelected} navigationKey={navigationKey} onEndChange={setAtEnd} writing={room.id === 'writing'} onBookClick={() => setUpcomingOpen(true)} lite={lite} reduced={reduced} />}</div>
    <div className="museum-gallery-shade" aria-hidden="true" />
    <nav className="museum-gallery-nav"><Link to="/hall" className="btn-quiet"><ArrowLeft size={13} />Back to Hall</Link><Link to="/" className="gallery-wordmark">The Museum of Kishore</Link><span>{room.floor}</span></nav>
    <header className="museum-gallery-title"><p className="eyebrow">{room.floor}</p><h1>{atEnd ? 'Meet the curator' : room.name}</h1><p>{atEnd ? 'Kishore M · Software engineer · AI & Data Science · Chennai' : collection.introduction}</p></header>
    {exhibit && <p className="gallery-walk-hint"><span className="desktop-instructions">Drag to look around · Scroll to walk · Select a display to read</span><span className="touch-instructions">Swipe sideways to turn · Swipe up to walk · Tap a display</span></p>}
    {exhibit && <>
      {!infoOpen && <button className="gallery-open-info btn-quiet" onClick={() => setInfoOpen(true)}><Info size={14} />{atEnd ? 'About Kishore' : 'Exhibit information'}</button>}
      {infoOpen && (atEnd ? <CuratorDossier onClose={() => setInfoOpen(false)} /> : <ExhibitDossier exhibit={exhibit} index={selected} onClose={() => setInfoOpen(false)} />)}
      <nav className="gallery-exhibit-navigation" aria-label="Browse exhibits"><button onClick={() => select(Math.max(0, selected - 1))} aria-label="Previous exhibit" disabled={selected === 0}><ArrowLeft size={16} /></button><span>{String(selected + 1).padStart(2, '0')}<i>/</i>{String(collection.exhibits.length).padStart(2, '0')}<small>{atEnd ? 'The curator’s portrait alcove' : `${selected % 2 === 0 ? 'Left wall' : 'Right wall'} · ${exhibit.title}`}</small></span><button onClick={() => select(Math.min(collection.exhibits.length - 1, selected + 1))} aria-label="Next exhibit" disabled={selected === collection.exhibits.length - 1}><ArrowRight size={16} /></button></nav>
    </>}
    {atEnd && !exhibit && room.id !== 'writing' && <button className="gallery-open-info btn-quiet" onClick={() => setInfoOpen(true)}><Info size={14} />About Kishore</button>}
    {!exhibit && infoOpen && <CuratorDossier onClose={() => setInfoOpen(false)} />}
    {room.id === 'writing' && atEnd && upcomingOpen && <aside className="gallery-exhibit-card exhibit-dossier"><button className="gallery-close-info" onClick={() => setUpcomingOpen(false)} aria-label="Close upcoming notice">×</button><div className="gallery-exhibit-scroll"><p className="dossier-accession">THE QUIET ARCHIVE</p><h2>More pages are coming</h2><p className="dossier-subtitle">The book is open, but the next chapter is still being written.</p><section className="dossier-chapter"><h3>Upcoming</h3><p>New writings and songs will be added to this room as the collection grows.</p></section></div></aside>}
    {!exhibit && <div className="gallery-empty-note"><p>{room.id === 'writing' ? 'Touch the open book to see what is coming next.' : 'Original writing and songs will be displayed here when added to the collection.'}</p><Link to="/hall">Continue exploring <ArrowRight size={13} /></Link></div>}
  </main>
}
function MaintenanceRoom() {
  const [projects, setProjects] = useState(() => collections.projects.exhibits.map(exhibit => exhibit.title))
  const [skills, setSkills] = useState(() => skillCatalogue.map(skill => skill.name))
  const [options, setOptions] = useState(['Gallery visibility', 'Featured collection', 'Museum introduction'])
  const [newProject, setNewProject] = useState('')
  const [newSkill, setNewSkill] = useState('')
  const [newOption, setNewOption] = useState('')
  const add = (value: string, setValue: (value: string) => void, setter: Dispatch<SetStateAction<string[]>>) => {
    const item = value.trim()
    if (!item) return
    setter(items => [...items, item])
    setValue('')
  }
  return <main className="museum-gallery maintenance-page">
    <nav className="museum-gallery-nav"><Link to="/hall" className="btn-quiet"><ArrowLeft size={13} />Back to Hall</Link><Link to="/" className="gallery-wordmark">The Museum of Kishore</Link><span>Private Maintenance</span></nav>
    <section className="maintenance-panel" aria-labelledby="maintenance-title">
      <p className="eyebrow">Curator workspace · No public exhibits</p>
      <h1 id="maintenance-title">Maintenance room</h1>
      <p className="maintenance-intro">Manage the museum collection from this private workspace. Changes here are local to this session until connected to a persistence layer.</p>
      <div className="maintenance-grid">
        {[
          { title: 'Projects', items: projects, value: newProject, setValue: setNewProject, setter: setProjects },
          { title: 'Skills', items: skills, value: newSkill, setValue: setNewSkill, setter: setSkills },
          { title: 'Options', items: options, value: newOption, setValue: setNewOption, setter: setOptions },
        ].map(section => <section key={section.title} className="maintenance-section">
          <h2>{section.title}</h2>
          <div className="maintenance-add"><input value={section.value} onChange={event => section.setValue(event.target.value)} placeholder={`Add ${section.title.toLowerCase()}`} aria-label={`Add ${section.title.toLowerCase()}`} /><button type="button" onClick={() => add(section.value, section.setValue, section.setter)} aria-label={`Add ${section.title.toLowerCase()}`}><Plus size={15} /></button></div>
          <ul>{section.items.map(item => <li key={item}><span>{item}</span><button type="button" onClick={() => section.setter(items => items.filter(existing => existing !== item))} aria-label={`Remove ${item}`}><Trash2 size={14} /></button></li>)}</ul>
        </section>)}
      </div>
    </section>
  </main>
}

function ManagementAccess() {
  const [unlocked, setUnlocked] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  if (unlocked) return <MaintenanceRoom />
  const submit = (event: FormEvent) => {
    event.preventDefault()
    const today = new Date().toISOString().slice(0, 10)
    if (password === today) { setUnlocked(true); setError(false) } else setError(true)
  }
  return <main className="museum-gallery access-card-page"><div className="gallery-exhibit-card exhibit-dossier access-card"><div className="gallery-exhibit-scroll"><p className="dossier-accession">CURATOR ACCESS CARD · MANAGEMENT ROOM</p><LockKeyhole size={32} /><h1>Private maintenance</h1><p className="dossier-subtitle">Enter the password to open the maintenance workspace.</p><form onSubmit={submit}><label htmlFor="access-password">Password</label><input id="access-password" type="password" autoComplete="current-password" value={password} onChange={event => { setPassword(event.target.value); setError(false) }} placeholder="Enter password" aria-invalid={error} /><button className="btn-gold" type="submit">Enter maintenance room</button>{error && <p role="alert">That password is not valid.</p>}</form><Link to="/hall" className="dossier-link">Back to Hall · Return to the Grand Rotunda <ArrowRight size={15} /></Link></div></div></main>
}
export function RoomPage({ room }: { room: Room }) {
  if (room.id === 'skills') return null
  if (room.id === 'management') return <ManagementAccess />
  return <GalleryRoom key={room.id} room={room as Room & { id: Exclude<Room['id'], 'skills'> }} />
}
