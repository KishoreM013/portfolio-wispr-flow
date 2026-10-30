import { ArrowUpRight, Download, X } from 'lucide-react'
import { caseStudies, profile, type Exhibit } from '../data/collection'

export function ExhibitDossier({ exhibit, index, onClose }: { exhibit: Exhibit; index: number; onClose: () => void }) {
  const study = caseStudies[exhibit.id]
  return <aside className="gallery-exhibit-card exhibit-dossier" aria-labelledby="exhibit-title">
    <button className="gallery-close-info" onClick={onClose} aria-label="Close exhibit information"><X size={18} /></button>
    <div className="gallery-exhibit-scroll" aria-live="polite">
      <p className="dossier-accession">THE KISHORE COLLECTION / {exhibit.year || 'PERSONAL ARCHIVE'}</p>
      <span className="dossier-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <h2 id="exhibit-title">{exhibit.title}</h2>
      <p className="dossier-subtitle">{exhibit.subtitle}</p>
      <p className="dossier-medium">{exhibit.medium}</p>
      {study ? <>
        <section className="dossier-chapter"><h3><span>01</span>The question</h3><p>{study.question}</p></section>
        <section className="dossier-chapter"><h3><span>02</span>The construction</h3><ol>{study.construction.map((step, i) => <li key={step}><span>{String(i + 1).padStart(2, '0')}</span>{step}</li>)}</ol></section>
        <section className="dossier-chapter"><h3><span>03</span>The result</h3>{exhibit.metric && <strong className="dossier-metric">{exhibit.metric}</strong>}<p>{study.outcome}</p></section>
      </> : <>
        <section className="dossier-chapter"><h3>In the collection</h3><p>{exhibit.description}</p></section>
        {exhibit.metric && <strong className="dossier-metric">{exhibit.metric}</strong>}
        <section className="dossier-chapter"><h3>A closer look</h3><ul>{exhibit.details.map(detail => <li key={detail}>{detail}</li>)}</ul></section>
      </>}
      {exhibit.href && <a className="dossier-link" href={exhibit.href} target={exhibit.href.startsWith('https:') ? '_blank' : undefined} rel="noreferrer">{exhibit.linkLabel}<ArrowUpRight size={15} /></a>}
      <p className="dossier-provenance">From the curator’s résumé. The wall artwork is an explanatory study of the work.</p>
    </div>
    <a className="gallery-resume-link" href="/resume.pdf" download="Kishore_M_Resume.pdf"><Download size={14} />Read the complete résumé</a>
  </aside>
}
export function CuratorDossier({ onClose }: { onClose: () => void }) {
  return <aside className="gallery-exhibit-card exhibit-dossier" aria-labelledby="curator-story-title"><button className="gallery-close-info" onClick={onClose} aria-label="Close exhibit information"><X size={18} /></button><div className="gallery-exhibit-scroll"><p className="dossier-accession">THE PERSON BEHIND THE COLLECTION</p><img className="dossier-portrait" src="/images/kishore-portrait.jpeg" alt="The curator’s portrait" /><h2 id="curator-story-title">Kishore M</h2><p className="dossier-subtitle">Software engineering. Artificial intelligence. A continuing curiosity.</p><section className="dossier-chapter"><h3>My story</h3><p>{profile.summary}</p></section><section className="dossier-chapter"><h3>The foundations</h3><p>{profile.education}</p><strong className="dossier-metric">{profile.cgpa} CGPA</strong></section><section className="dossier-chapter"><h3>Looking ahead</h3><p>Seeking a full-time Software Engineer or AI/ML Engineer role.</p></section></div><a className="gallery-resume-link" href="/resume.pdf" download="Kishore_M_Resume.pdf"><Download size={14} />Read the complete résumé</a></aside>
}
