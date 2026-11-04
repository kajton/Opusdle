export type Era = 'Baroque' | 'Classical' | 'Romantic' | '20th Century'
export type Genre = 'Symphony' | 'Concerto' | 'Piano Solo' | 'Chamber' | 'Opera'

export interface Piece {
  id: string
  title: string
  composer: string
  era: Era
  genre: Genre
  key: string
  year: number
  measures: string[]
  fullScore: string
}

export interface Attempt {
  pieceId: string | null
}

export interface GameSession {
  day: string
  targetId: string
  attempts: Attempt[]
}

export interface Stats {
  currentStreak: number
  maxStreak: number
  played: number
  wins: number
  lastWonDate: string | null
}
