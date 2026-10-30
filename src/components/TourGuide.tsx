import { guide } from '../data/museum'

/** A quiet curator's annotation, shared by the galleries. */
export function TourGuide({ line = guide.hall }: { line?: string }) {
  return <aside className="curator-annotation"><span className="curator-monogram" aria-hidden="true">K</span><div><p>{guide.name} · A note from the curator</p><blockquote>{line}</blockquote></div></aside>
}
