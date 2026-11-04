import { useEffect, useRef } from 'react'
import abcjs from 'abcjs'

interface ScoreViewerProps {
  abc: string
  compact?: boolean
}

export function ScoreViewer({ abc, compact = false }: ScoreViewerProps) {
  const scoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!scoreRef.current) return
    scoreRef.current.replaceChildren()
    abcjs.renderAbc(scoreRef.current, abc, {
      responsive: 'resize',
      staffwidth: compact ? 680 : 960,
      paddingtop: 8,
      paddingbottom: 8,
      paddingleft: 12,
      paddingright: 12,
      add_classes: true,
      scale: compact ? 0.92 : 1,
    })
  }, [abc, compact])

  return <div className={`score-viewer${compact ? ' score-viewer--compact' : ''}`} ref={scoreRef} aria-label="Zapis nutowy ukrytego utworu" />
}
