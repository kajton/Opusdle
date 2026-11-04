import { useState } from 'react'
import { Check, Copy, X } from 'lucide-react'
import type { Attempt, Piece, Stats } from '../types'
import { feedbackEmoji } from './GuessGrid'
import { AudioControls } from './AudioControls'
import { ScoreViewer } from './ScoreViewer'

interface StatsModalProps {
  open: boolean
  won: boolean
  attempts: Attempt[]
  target: Piece
  pieces: Piece[]
  stats: Stats
  puzzleNumber: string
  daily: boolean
  onClose: () => void
}

export function StatsModal({ open, won, attempts, target, pieces, stats, puzzleNumber, daily, onClose }: StatsModalProps) {
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  if (!open) return null

  const rows = attempts.map((attempt) => {
    if (!attempt.pieceId) return '⬛⬛⬛⬛⬛'
    const guess = pieces.find((piece) => piece.id === attempt.pieceId)
    return guess ? feedbackEmoji(guess, target) : '⬛⬛⬛⬛⬛'
  })
  const result = `Opusdle #${puzzleNumber} ${won ? attempts.length : 'X'}/5\n${rows.join('\n')}`

  async function copyResult() {
    setCopyError(false)
    try {
      await navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
      setCopyError(true)
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="stats-modal" role="dialog" aria-modal="true" aria-labelledby="result-title">
        <button className="icon-button modal-close" type="button" onClick={onClose} aria-label="Zamknij"><X size={18} /></button>
        <div className="modal-kicker">OPUSDLE #{puzzleNumber}</div>
        <div className={`result-mark${won ? ' result-mark--win' : ''}`}>{won ? '♪' : '—'}</div>
        <h2 id="result-title">{won ? 'Pięknie zagrane.' : 'Koniec prób.'}</h2>
        <p className="result-subtitle">{won ? `Rozpoznano po ${attempts.length} ${attempts.length === 1 ? 'próbie' : 'próbach'}.` : daily ? 'Jutrzejsza zagadka czeka.' : 'Spróbuj odgadnąć kolejny utwór.'}</p>
        <div className="stats-strip">
          <div><strong>{stats.played}</strong><span>Rozegrane</span></div>
          <div><strong>{stats.played ? Math.round(stats.wins / stats.played * 100) : 0}%</strong><span>Skuteczność</span></div>
          <div><strong>{stats.currentStreak}</strong><span>Seria</span></div>
          <div><strong>{stats.maxStreak}</strong><span>Rekord</span></div>
        </div>
        <div className="answer-reveal">
          <div className="answer-meta">{daily ? 'DZISIEJSZE DZIEŁO' : 'UTWÓR TRENINGOWY'}</div>
          <h3>{target.title}</h3>
          <p>{target.composer} <span>·</span> {target.year}</p>
          <ScoreViewer abc={target.fullScore} compact />
          <AudioControls abc={target.fullScore} label="Odsłuchaj cały temat" full />
        </div>
        <button className="share-button" type="button" onClick={() => void copyResult()}>
          {copied ? <Check size={17} /> : <Copy size={17} />}
          {copied ? 'Skopiowano wynik' : 'Kopiuj wynik'}
        </button>
        {copyError && <p className="copy-error" role="status">Nie udało się skopiować wyniku. Sprawdź uprawnienia schowka w przeglądarce.</p>}
      </section>
    </div>
  )
}
