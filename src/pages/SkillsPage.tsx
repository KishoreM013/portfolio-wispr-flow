import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BookOpen, Pause, Play, RotateCcw, X } from 'lucide-react'
import { PlanetariumScene, SkillLogo } from '../components/three/PlanetariumScene'
import { skills, levels, categoryColors, type Skill } from '../data/skills'
import { useLiteMode, useMediaQuery, usePrefersReducedMotion } from '../hooks/useDevice'
import { useMuseum } from '../context/museum-context'
import '../components/gallery.css'
import '../components/planetarium.css'
import '../components/skills-room.css'

export function SkillsPage() {
  const { markVisited } = useMuseum()
  const reduced = usePrefersReducedMotion(), lite = useLiteMode()
  const mobile = useMediaQuery('(max-width: 639px)')
  const [manualPause, setManualPause] = useState(false)
  const [selected, setSelected] = useState<Skill | null>(null)
  const [hovered, setHovered] = useState<Skill | null>(null)
  const [catalogueOpen, setCatalogueOpen] = useState(false)
  const [filter, setFilter] = useState('All skills')
  const [centreKey, setCentreKey] = useState(0)
  const [step, setStep] = useState(0)
  const panelRef = useRef<HTMLElement>(null), closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => { document.title = 'Skills · The Planetarium — The Museum of Kishore'; markVisited('skills') }, [markVisited])
  useEffect(() => {
    const escape = (e: KeyboardEvent) => { if (e.key === 'Escape') { setSelected(null); setHovered(null); setCatalogueOpen(false) } }
    window.addEventListener('keydown', escape); return () => window.removeEventListener('keydown', escape)
  }, [])
  useEffect(() => {
    if (!catalogueOpen) return
    const previous = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const trap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !panelRef.current) return
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>('button:not([disabled]),a[href]'))
      const first = items[0], last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    window.addEventListener('keydown', trap); return () => { window.removeEventListener('keydown', trap); previous?.focus() }
  }, [catalogueOpen])
  const active = selected || hovered
  const select = (skill: Skill) => { setSelected(skill); setHovered(null); setCatalogueOpen(false) }
  return <main className="museum-gallery skills-room" data-info-open={!!active}>
    <div className="museum-gallery-scene skills-room-scene"><PlanetariumScene paused={manualPause || !!active || catalogueOpen} mobile={mobile} lite={lite} reduced={reduced} step={step} centreKey={centreKey} selectedId={selected?.id} onSelect={select} onHover={setHovered} onOpenCatalogue={() => setCatalogueOpen(true)} /></div>
    <div className="museum-gallery-shade" aria-hidden="true" />
    <nav className="museum-gallery-nav"><Link to="/hall" className="btn-quiet"><ArrowLeft size={13} />Back to Hall</Link><Link to="/" className="gallery-wordmark">The Museum of Kishore</Link><span>Ground floor · Gallery 01</span></nav>
    <header className="museum-gallery-title"><p className="eyebrow">The circular planetarium</p><h1>Skills</h1><p>A room of practice. Each planet is a skill; its orbit and stars show my level of proficiency — including a few important human skills and one suspiciously well-rated walking skill.</p></header>
    <div className="skills-rating-key" aria-label="Skill proficiency scale, from the innermost orbit outward">{levels.map((level, i) => <span key={level}><strong>{5 - i} ★</strong>{level}</span>)}</div>
    {active && <aside className="gallery-exhibit-card exhibit-dossier skills-detail-panel" role="region" aria-label={`${active.name} details`} aria-live="polite"><button className="gallery-close-info" aria-label="Close skill details" onClick={() => { setSelected(null); setHovered(null) }}><X size={18} /></button><div className="gallery-exhibit-scroll"><p className="dossier-accession">THE SKILLS COLLECTION / {active.category.toUpperCase()}</p><span className="skills-detail-logo" style={{ color: categoryColors[active.category] }}><SkillLogo skill={active} /></span><h2>{active.name}</h2><div className="skills-proficiency"><strong>{active.stars}<small>/ 5</small></strong><span>{'★'.repeat(active.stars)}{'☆'.repeat(5 - active.stars)}<em>{levels[5 - active.stars]}</em></span></div><section className="dossier-chapter"><h3>Time in practice</h3><p>{active.duration}</p></section><section className="dossier-chapter"><h3>Used in the collection</h3><p>{active.example}</p></section>{active.provisional && <p className="dossier-provenance">Provisional self-rating. The résumé verifies this skill, but does not specify a star level.</p>}</div></aside>}
    <div className="skills-room-controls"><p className="gallery-walk-hint"><span className="desktop-instructions">Scroll to walk around the room · Drag to look · Select a planet</span><span className="touch-instructions">Swipe up to walk around · Swipe sideways to turn · Tap a planet</span></p><nav className="gallery-exhibit-navigation skills-navigation" aria-label="Explore the skills room"><button aria-label="Walk left around the room" onClick={() => setStep(s => s - 1)}><ArrowLeft size={17} /></button><button aria-label="Face the centre of the planetarium" onClick={() => setCentreKey(k => k + 1)}><RotateCcw size={16} /><span>Centre</span></button><button aria-expanded={catalogueOpen} aria-controls="skills-catalogue" onClick={() => setCatalogueOpen(true)}><BookOpen size={16} /><span>Skill catalogue</span></button><button disabled={reduced} aria-pressed={manualPause || reduced} onClick={() => setManualPause(p => !p)} aria-label={reduced ? 'Motion reduced' : manualPause ? 'Resume orbits' : 'Pause orbits'}>{manualPause || reduced ? <Play size={15} /> : <Pause size={15} />}<span>{reduced ? 'Static' : manualPause ? 'Play' : 'Pause'}</span></button><button aria-label="Walk right around the room" onClick={() => setStep(s => s + 1)}><ArrowRight size={17} /></button></nav></div>
    <div className="skills-catalogue-backdrop" hidden={!catalogueOpen} onClick={() => setCatalogueOpen(false)}>
      <section ref={panelRef} id="skills-catalogue" className="skills-catalogue-panel" role="dialog" aria-modal="true" aria-labelledby="skills-catalogue-title" onClick={e => e.stopPropagation()}><header><div><p className="eyebrow">The complete collection</p><h2 id="skills-catalogue-title">Skill catalogue</h2></div><button ref={closeRef} onClick={() => setCatalogueOpen(false)} aria-label="Close skill catalogue"><X size={20} /></button></header><div className="skills-catalogue-body"><div className="category-legend">{Object.entries(categoryColors).map(([name, color]) => <span key={name}><i style={{ background: color }} />{name}</span>)}</div><div className="skill-filters" aria-label="Filter skills">{['All skills', ...Object.keys(categoryColors)].map(f => <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>{f}{f === 'All skills' && <small>{skills.length}</small>}</button>)}</div><div className="skill-catalogue">{skills.filter(s => filter === 'All skills' || s.category === filter).map(s => <button key={s.id} className="skill-row" onClick={() => select(s)}><span className="catalogue-logo" style={{ color: categoryColors[s.category] }}><SkillLogo skill={s} /></span><span><strong>{s.name}</strong><small>{s.category}</small></span><span className="catalogue-level">{levels[5 - s.stars]}<small>{'★'.repeat(s.stars)}{'☆'.repeat(5 - s.stars)}</small></span></button>)}</div><p className="catalogue-note">Star ratings are self-ratings. On phones, a smaller, static planetary collection keeps the room clear; every skill is available here.</p></div></section>
    </div>
  </main>
}
