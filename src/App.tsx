import { useEffect, useRef, useState } from 'react'
import { ChartNoAxesColumn, FastForward, Music2, RotateCcw, Sparkles, Trophy } from 'lucide-react'
import { AudioControls } from './components/AudioControls'
import { GuessGrid } from './components/GuessGrid'
import { GuessInput } from './components/GuessInput'
import { ScoreViewer } from './components/ScoreViewer'
import { StatsModal } from './components/StatsModal'
import { pieces } from './data/pieces'
import type { GameSession, Piece } from './types'
import { dayNumber, loadDailySession, loadStats, localDateKey, recordDailyResult, saveDailySession } from './utils/game'

function randomPiece(excludeId?: string): Piece {
  const options = pieces.filter((piece) => piece.id !== excludeId)
  return options[Math.floor(Math.random() * options.length)]
}

function newPracticeSession(previousId?: string): GameSession {
  return { day: 'practice', targetId: randomPiece(previousId).id, attempts: [] }
}

type Mode = 'daily' | 'practice'

export default function App() {
  const [mode, setMode] = useState<Mode>('daily')
  const [session, setSession] = useState<GameSession>(() => loadDailySession(pieces))
  const [stats, setStats] = useState(loadStats)
  const [modalOpen, setModalOpen] = useState(false)
  const [clock, setClock] = useState(Date.now())
  const processedResult = useRef<string | null>(null)
  const target = pieces.find((piece) => piece.id === session.targetId) ?? pieces[0]
  const won = session.attempts.some((attempt) => attempt.pieceId === target.id)
  const finished = won || session.attempts.length >= 5
  const usedIds = new Set(session.attempts.flatMap((attempt) => attempt.pieceId ? [attempt.pieceId] : []))
  const visibleMeasures = Math.min(session.attempts.length + 1, 5)
  const score = finished ? target.fullScore : target.measures[visibleMeasures - 1]
  const puzzleNumber = String(dayNumber())

  useEffect(() => {
    if (mode === 'daily') saveDailySession(session)
  }, [mode, session])

  useEffect(() => {
    if (mode !== 'daily' || !finished) return
    const resultKey = `${session.day}:${session.targetId}`
    if (processedResult.current === resultKey) return
    processedResult.current = resultKey
    setStats(recordDailyResult(stats, won, session.day))
  }, [finished, mode, session.day, session.targetId, stats, won])

  useEffect(() => {
    if (finished) setModalOpen(true)
  }, [finished])

  useEffect(() => {
    const interval = window.setInterval(() => setClock(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const today = localDateKey(new Date(clock))
    if (mode === 'daily' && session.day !== today) {
      setSession(loadDailySession(pieces, new Date(clock)))
      setModalOpen(false)
    }
  }, [clock, mode, session.day])

  function switchMode(nextMode: Mode) {
    if (nextMode === mode) return
    if (nextMode === 'daily') {
      setSession(loadDailySession(pieces))
    } else {
      setSession(newPracticeSession(target.id))
      setModalOpen(false)
    }
    setMode(nextMode)
  }

  function addAttempt(pieceId: string | null) {
    if (finished) return
    setSession((current) => ({ ...current, attempts: [...current.attempts, { pieceId }] }))
  }

  function restartPractice() {
    setSession(newPracticeSession(target.id))
    setModalOpen(false)
  }

  const now = new Date(clock)
  const nextPuzzle = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  const secondsLeft = Math.max(0, Math.floor((nextPuzzle.getTime() - clock) / 1000))
  const timeLabel = `${String(Math.floor(secondsLeft / 3600)).padStart(2, '0')}:${String(Math.floor(secondsLeft % 3600 / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Opusdle, strona główna">
          <span className="brand-mark"><Music2 size={20} strokeWidth={1.8} /></span>
          <span className="brand-name">opusdle<span>.</span></span>
          <span className="brand-caption">MUZYKA NA UCHO</span>
        </a>
        <div className="topbar-right">
          <div className="daily-number"><span className="live-dot" /> {mode === 'daily' ? `ZAGADKA NR ${puzzleNumber}` : 'TRYB TRENINGOWY'}</div>
          <button className="icon-button header-stats" type="button" disabled={!finished} onClick={() => setModalOpen(true)} aria-label="Statystyki" title="Statystyki po zakończeniu rundy">
            {mode === 'daily' ? <ChartNoAxesColumn size={18} /> : <Trophy size={18} />}
          </button>
        </div>
      </header>

      <main id="top" className="main-content">
        <section className="intro-row">
          <div>
            <div className="eyebrow"><span className="eyebrow-line" /> CODZIENNA ZAGADKA MUZYCZNA</div>
            <h1>Klasyka,<br className="mobile-break" /> <em>na ucho.</em></h1>
            <p className="intro-copy">Rozpoznaj dzieło po nutach i dźwięku. Pięć prób, coraz dłuższy fragment.</p>
          </div>
          <div className="edition-stamp" aria-hidden="true"><span>VOL.</span><strong>{String(dayNumber()).padStart(3, '0')}</strong><span>{new Date(clock).getFullYear()}</span></div>
        </section>

        <div className="mode-row">
          <div className="mode-switch" role="tablist" aria-label="Tryb gry">
            <button type="button" role="tab" aria-selected={mode === 'daily'} className={mode === 'daily' ? 'mode-active' : ''} onClick={() => switchMode('daily')}>Dzisiaj <span className="mode-index">01</span></button>
            <button type="button" role="tab" aria-selected={mode === 'practice'} className={mode === 'practice' ? 'mode-active' : ''} onClick={() => switchMode('practice')}>Trening <span className="mode-index">∞</span></button>
          </div>
          <div className="attempt-counter" aria-label={`${session.attempts.length} z 5 prób`}>
            <span>PRÓBY</span>
            <div className="attempt-dots">{Array.from({ length: 5 }, (_, index) => <i key={index} className={index < session.attempts.length ? 'dot-used' : ''} />)}</div>
            <strong>{Math.max(0, 5 - session.attempts.length)}</strong>
          </div>
        </div>

        <section className="play-area" aria-label="Odgadnij utwór">
          <div className="play-area-heading">
            <div className="section-index">I</div>
            <div><h2>{mode === 'daily' ? 'Motyw dnia' : 'Motyw treningowy'}</h2><p>{finished ? 'Pełny temat został odsłonięty' : `Odsłonięto ${visibleMeasures} ${visibleMeasures === 1 ? 'takt' : 'takty'} z 5`}</p></div>
            <div className="score-counter"><span>{finished ? 'CAŁY TEMAT' : 'ZAPIS NUTOWY'}</span><Music2 size={16} /></div>
          </div>
          <div className="score-frame">
            <div className="score-frame-top"><span>♩ = 100</span><span>{finished ? 'FINALE' : `FRAGMENT 0${visibleMeasures}`}</span><span>♪</span></div>
            <ScoreViewer abc={score} />
            <div className="score-frame-bottom"><span>OPUS {mode === 'daily' ? puzzleNumber : 'TRENING'}</span><span>{finished ? 'FINALE · 8 TAKTÓW' : `ADAGIO · FRAGMENT 0${visibleMeasures}`}</span></div>
          </div>
          <div className="play-controls">
            <AudioControls abc={score} label="Odtwórz fragment" />
            <span className="play-hint"><span className="sound-wave">∿</span> Posłuchaj i wskaż kompozycję</span>
          </div>
        </section>

        <GuessGrid attempts={session.attempts} pieces={pieces} target={target} />

        <section className="answer-area">
          <div className="answer-heading">
            <div className="section-index">II</div>
            <div><h2>Jaki to utwór?</h2><p>Wpisz kompozytora lub tytuł dzieła</p></div>
          </div>
          <GuessInput pieces={pieces} usedIds={usedIds} disabled={finished} onGuess={(piece) => addAttempt(piece.id)} />
          <div className="answer-actions">
            <span className="answer-note"><Sparkles size={13} /> {finished ? won ? 'Dzisiejsza kompozycja rozpoznana' : 'Limit prób wykorzystany' : 'Każda odpowiedź odsłania kolejny takt'}</span>
            {finished ? (
              <button className="text-action" type="button" onClick={() => mode === 'practice' ? restartPractice() : setModalOpen(true)}>{mode === 'practice' ? <RotateCcw size={14} /> : <Trophy size={14} />}{mode === 'practice' ? 'Następny utwór' : 'Wynik'}</button>
            ) : (
              <button className="text-action skip-action" type="button" onClick={() => addAttempt(null)}><FastForward size={14} /> Pomiń próbę</button>
            )}
          </div>
        </section>

        <footer className="page-footer">
          <div className="footer-rule" />
          <div><span>OPUSDLE</span><span className="footer-note">KLASYKA ODKRYWANA CODZIENNIE</span><span>{mode === 'daily' ? `KOLEJNA ZA ${timeLabel}` : 'TRYB TRENINGOWY'}</span></div>
        </footer>
      </main>

      <StatsModal
        open={modalOpen}
        won={won}
        attempts={session.attempts}
        target={target}
        pieces={pieces}
        stats={stats}
        puzzleNumber={mode === 'daily' ? puzzleNumber : 'TRENING'}
        daily={mode === 'daily'}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}
