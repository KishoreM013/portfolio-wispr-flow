import { Component, type ReactNode } from 'react'
import { Map } from 'lucide-react'
import { useMuseum } from '../context/museum-context'

export function SceneFallback() {
  const { openMap } = useMuseum()
  return <div className="scene-fallback" role="status"><p className="eyebrow">The museum is still open</p><h2>Explore the collection</h2><p>This device couldn’t open the 3D view. Use the map to visit the rooms and read the exhibits.</p><button className="btn-quiet" onClick={openMap}><Map size={15} />Open museum map</button></div>
}
/** A failed GPU context must not take down the museum's accessible navigation. */
export class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <SceneFallback /> : this.props.children }
}
