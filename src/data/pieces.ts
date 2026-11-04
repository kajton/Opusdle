import type { Era, Genre, Piece } from '../types'

type PieceSource = Omit<Piece, 'measures' | 'fullScore'> & { bars: string[]; meter?: string }

function makePiece(source: PieceSource): Piece {
  const meter = source.meter ?? '4/4'
  const body = source.bars.join(' | ')
  const abcKeys: Record<string, string> = {
    'C minor': 'Cm', 'G major': 'G', 'E major': 'E', 'D minor': 'Dm',
    'E-flat major': 'Eb', 'B minor': 'Bm', 'C major': 'C', 'A minor': 'Am',
    'G minor': 'Gm', 'D-flat major': 'Db',
  }
  const header = () => `X:1\nM:${meter}\nL:1/8\nQ:1/4=100\nK:${abcKeys[source.key]}\n`
  return {
    id: source.id,
    title: source.title,
    composer: source.composer,
    era: source.era,
    genre: source.genre,
    key: source.key,
    year: source.year,
    measures: Array.from({ length: 5 }, (_, index) => `${header()}\n${source.bars.slice(0, index + 1).join(' | ')} |]`),
    fullScore: `${header()}\n${body} |]`,
  }
}

export const pieces: Piece[] = [
  makePiece({
    id: 'beethoven-5', title: 'Symphony No. 5 in C minor, Op. 67', composer: 'Ludwig van Beethoven',
    era: 'Classical', genre: 'Symphony', key: 'C minor', year: 1808, meter: '2/4',
    bars: ['G/G/G/E/', 'F/F/F/D/', 'G/G/G/E/', 'F/F/F/D/', 'c/c/c/A/', 'B/B/B/G/', 'c/c/c/A/', 'B/B/B/G/'],
  }),
  makePiece({
    id: 'mozart-eine-kleine', title: 'Eine kleine Nachtmusik, K. 525', composer: 'Wolfgang Amadeus Mozart',
    era: 'Classical', genre: 'Chamber', key: 'G major', year: 1787,
    bars: ['d2 B2 G2 B2', 'd4 g4 b4 d4', 'c2 A2 F2 A2', 'c4 f4 a4 c4', 'B2 G2 D2 G2', 'B4 d4 g4 b4', 'a2 F2 D2 F2', 'A4 d4 f4 a4'],
  }),
  makePiece({
    id: 'vivaldi-spring', title: 'The Four Seasons: Spring, RV 269', composer: 'Antonio Vivaldi',
    era: 'Baroque', genre: 'Concerto', key: 'E major', year: 1725,
    bars: ['B2 e2 e2 e2', 'B2 e2 e2 e2', 'B2 e2 e2 e2', 'd2 c2 B2 A2', 'G2 B2 e2 G2', 'F2 A2 d2 F2', 'E2 G2 c2 E2', 'B,2 E2 G2 B2'],
  }),
  makePiece({
    id: 'bach-toccata', title: 'Toccata and Fugue in D minor, BWV 565', composer: 'Johann Sebastian Bach',
    era: 'Baroque', genre: 'Piano Solo', key: 'D minor', year: 1708,
    bars: ['A2 G2 A2 E2', 'A2 G2 A2 E2', 'A2 G2 A2 E2', 'A4 G4 F4 E4', 'D4 A4 d4 f4', 'e4 d4 c4 B,4', 'A,4 E4 A4 c4', 'd2 A2 d2 A2'],
  }),
  makePiece({
    id: 'chopin-nocturne', title: 'Nocturne in E-flat major, Op. 9 No. 2', composer: 'Frédéric Chopin',
    era: 'Romantic', genre: 'Piano Solo', key: 'E-flat major', year: 1832, meter: '12/8',
    bars: ['G2 B2 e2 g2', 'f2 e2 B2 G2', 'F2 A2 d2 f2', 'e2 d2 A2 F2', 'G2 B2 e2 g2', 'a2 g2 f2 e2', 'B2 d2 g2 b2', 'g2 f2 e2 B2'],
  }),
  makePiece({
    id: 'tchaikovsky-swan', title: 'Swan Lake: Main Theme, Op. 20', composer: 'Pyotr Ilyich Tchaikovsky',
    era: 'Romantic', genre: 'Symphony', key: 'B minor', year: 1876,
    bars: ['F2 A2 B2 d2', 'c2 B2 A2 F2', 'E2 G2 A2 c2', 'B2 A2 G2 E2', 'F2 A2 B2 d2', 'e2 d2 c2 B2', 'A2 F2 E2 D2', 'B,2 F2 B2 d2'],
  }),
  makePiece({
    id: 'grieg-mountain', title: 'In the Hall of the Mountain King, Op. 23', composer: 'Edvard Grieg',
    era: 'Romantic', genre: 'Symphony', key: 'B minor', year: 1875, meter: '2/4',
    bars: ['B,2 d2 e2 f2', 'B,2 d2 e2 f2', 'B,2 d2 e2 f2', 'e2 d2 B,2 A,2', 'G,2 B,2 d2 e2', 'G,2 B,2 d2 e2', 'B,2 d2 e2 f2', 'e2 d2 B,2 A,2'],
  }),
  makePiece({
    id: 'ravel-bolero', title: 'Boléro', composer: 'Maurice Ravel',
    era: '20th Century', genre: 'Symphony', key: 'C major', year: 1928, meter: '3/4',
    bars: ['C E G E C E G E', 'D F A F D F A F', 'E G B G E G B G', 'C E G E C E G E', 'D F A F D F A F', 'E G B G E G B G', 'F A c A F A c A', 'G B d B G B d B'],
  }),
  makePiece({
    id: 'mozart-turkish', title: 'Piano Sonata No. 11: Rondo alla turca, K. 331', composer: 'Wolfgang Amadeus Mozart',
    era: 'Classical', genre: 'Piano Solo', key: 'A minor', year: 1783,
    bars: ['c2 B2 A2 G2', 'A2 E2 A2 c2', 'e2 d2 c2 B2', 'A2 E2 A2 c2', 'a2 g2 f2 e2', 'f2 e2 d2 c2', 'B2 c2 d2 e2', 'A2 G2 A4'],
  }),
  makePiece({
    id: 'brahms-hungarian', title: 'Hungarian Dance No. 5 in G minor', composer: 'Johannes Brahms',
    era: 'Romantic', genre: 'Chamber', key: 'G minor', year: 1869,
    bars: ['d2 G2 B2 d2', 'c2 B2 A2 G2', 'F2 A2 d2 f2', 'e2 d2 c2 B2', 'd2 G2 B2 d2', 'g2 f2 e2 d2', 'c2 A2 F2 A2', 'G2 B2 d2 G2'],
  }),
  makePiece({
    id: 'debussy-clair', title: 'Clair de lune, Suite bergamasque', composer: 'Claude Debussy',
    era: '20th Century', genre: 'Piano Solo', key: 'D-flat major', year: 1905,
    bars: ['F2 A2 d2 f2', 'e2 d2 A2 F2', 'E2 G2 c2 e2', 'd2 c2 G2 E2', 'F2 A2 d2 f2', 'g2 f2 e2 d2', 'A2 c2 f2 a2', 'f2 e2 d2 A2'],
  }),
]

export const eras: Era[] = ['Baroque', 'Classical', 'Romantic', '20th Century']
export const genres: Genre[] = ['Symphony', 'Concerto', 'Piano Solo', 'Chamber', 'Opera']
