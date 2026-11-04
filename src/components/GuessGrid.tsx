import type { Attempt, Piece } from '../types'
import { eraLabel, genreLabel, keyMatch, yearHint } from '../utils/game'

type Match = 'match' | 'close' | 'miss'
interface Cell { label: string; value: string; match: Match }

function feedback(guess: Piece, target: Piece): Cell[] {
  const yearDistance = Math.abs(guess.year - target.year)
  return [
    { label: 'Kompozytor', value: guess.composer, match: guess.composer === target.composer ? 'match' : 'miss' },
    { label: 'Epoka', value: eraLabel(guess.era), match: guess.era === target.era ? 'match' : 'miss' },
    { label: 'Forma', value: genreLabel(guess.genre), match: guess.genre === target.genre ? 'match' : 'miss' },
    { label: 'Tonacja', value: guess.key, match: keyMatch(guess.key, target.key) },
    { label: 'Rok', value: yearHint(guess.year, target.year), match: yearDistance === 0 ? 'match' : yearDistance <= 10 ? 'close' : 'miss' },
  ]
}

export function feedbackEmoji(guess: Piece, target: Piece): string {
  return feedback(guess, target).map(({ match }) => match === 'match' ? '🟩' : match === 'close' ? '🟨' : '🟥').join('')
}

interface GuessGridProps {
  attempts: Attempt[]
  pieces: Piece[]
  target: Piece
}

export function GuessGrid({ attempts, pieces, target }: GuessGridProps) {
  const guesses = attempts.flatMap((attempt) => {
    const piece = pieces.find((candidate) => candidate.id === attempt.pieceId)
    return piece ? [piece] : []
  })

  if (!guesses.length) return null

  return (
    <section className="guess-grid-section" aria-label="Dotychczasowe odpowiedzi">
      <div className="grid-heading"><span>Twoje odpowiedzi</span><span>{guesses.length} / 5</span></div>
      <div className="guess-grid">
        {guesses.map((guess, rowIndex) => (
          <div className="guess-row" key={`${guess.id}-${rowIndex}`}>
            <div className="guess-row-title"><span>{guess.composer}</span><small>{guess.title}</small></div>
            <div className="guess-cells">
              {feedback(guess, target).map((cell) => (
                <div className={`guess-cell cell--${cell.match}`} key={cell.label} title={`${cell.label}: ${cell.value}`}>
                  <span className="cell-label">{cell.label}</span>
                  <span className="cell-value">{cell.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
