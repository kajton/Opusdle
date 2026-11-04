import type { Era, GameSession, Genre, Piece, Stats } from '../types'

export const emptyStats: Stats = { currentStreak: 0, maxStreak: 0, played: 0, wins: 0, lastWonDate: null }
const SESSION_KEY = 'opusdle:daily-session'
const STATS_KEY = 'opusdle:stats'

export function localDateKey(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function dayNumber(date = new Date()): number {
  const start = new Date(2024, 0, 1)
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.floor((today.getTime() - start.getTime()) / 86_400_000) + 1
}

export function dailyPiece(pieces: Piece[], date = new Date()): Piece {
  const key = localDateKey(date)
  let hash = 2166136261
  for (const char of key) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619)
  return pieces[(hash >>> 0) % pieces.length]
}

export function loadDailySession(pieces: Piece[], date = new Date()): GameSession {
  const day = localDateKey(date)
  try {
    const stored = localStorage.getItem(SESSION_KEY)
    if (stored) {
      const session = JSON.parse(stored) as GameSession
      if (session.day === day && pieces.some((piece) => piece.id === session.targetId)) return session
    }
  } catch {
    localStorage.removeItem(SESSION_KEY)
  }
  return { day, targetId: dailyPiece(pieces, date).id, attempts: [] }
}

export function saveDailySession(session: GameSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function loadStats(): Stats {
  try {
    return { ...emptyStats, ...JSON.parse(localStorage.getItem(STATS_KEY) ?? '{}') as Partial<Stats> }
  } catch {
    return emptyStats
  }
}

export function saveStats(stats: Stats): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats))
}

export function recordDailyResult(stats: Stats, won: boolean, date: string): Stats {
  const alreadyCounted = stats.lastWonDate === date || localStorage.getItem(`opusdle:played:${date}`) === '1'
  if (alreadyCounted) return stats
  localStorage.setItem(`opusdle:played:${date}`, '1')
  const previous = new Date(`${stats.lastWonDate ?? ''}T00:00:00`)
  const current = new Date(`${date}T00:00:00`)
  const consecutive = stats.lastWonDate !== null && Math.round((current.getTime() - previous.getTime()) / 86_400_000) === 1
  const next: Stats = {
    ...stats,
    played: stats.played + 1,
    wins: stats.wins + Number(won),
    currentStreak: won ? (consecutive ? stats.currentStreak + 1 : 1) : 0,
    maxStreak: won ? Math.max(stats.maxStreak, consecutive ? stats.currentStreak + 1 : 1) : stats.maxStreak,
    lastWonDate: won ? date : stats.lastWonDate,
  }
  saveStats(next)
  return next
}

const fifths = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'Ab', 'Eb', 'Bb', 'F']
function keyParts(value: string): { root: string; mode: 'major' | 'minor' } {
  const normalized = value.replace(' major', '').replace(' minor', '').replace('-flat', 'b').replace('-sharp', '#')
  const root = normalized.replace(/m$/i, '')
  return { root: root === 'Db' ? 'C#' : root, mode: /minor|m$/i.test(value) ? 'minor' : 'major' }
}

export function keyMatch(guess: string, target: string): 'match' | 'close' | 'miss' {
  if (guess === target) return 'match'
  const first = keyParts(guess)
  const second = keyParts(target)
  const a = fifths.indexOf(first.root)
  const b = fifths.indexOf(second.root)
  const adjacent = a !== -1 && b !== -1 && Math.min((a - b + 12) % 12, (b - a + 12) % 12) <= 1
  return first.mode === second.mode || adjacent ? 'close' : 'miss'
}

export function eraLabel(era: Era): string {
  return ({ Baroque: 'Barok', Classical: 'Klasycyzm', Romantic: 'Romantyzm', '20th Century': 'XX wiek' })[era]
}

export function genreLabel(genre: Genre): string {
  return ({ Symphony: 'Symfonia', Concerto: 'Koncert', 'Piano Solo': 'Solo fortepianowe', Chamber: 'Kameralistyka', Opera: 'Opera' } as Record<string, string>)[genre] ?? genre
}

export function yearHint(guess: number, target: number): string {
  if (guess === target) return `${guess}`
  return `${guess} ${guess < target ? '↑' : '↓'}`
}
