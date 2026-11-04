import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'
import type { Piece } from '../types'

interface GuessInputProps {
  pieces: Piece[]
  usedIds: Set<string>
  disabled?: boolean
  onGuess: (piece: Piece) => void
}

export function GuessInput({ pieces, usedIds, disabled = false, onGuess }: GuessInputProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const results = pieces.filter((piece) => !usedIds.has(piece.id) && `${piece.composer} ${piece.title}`.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 6)

  useEffect(() => {
    function closeOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', closeOutside)
    return () => document.removeEventListener('mousedown', closeOutside)
  }, [])

  function choose(piece: Piece) {
    onGuess(piece)
    setQuery('')
    setOpen(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((index) => Math.min(index + 1, results.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter' && query.trim() && results[activeIndex]) {
      event.preventDefault()
      choose(results[activeIndex])
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="guess-input-wrap" ref={rootRef}>
      <div className={`guess-input-box${disabled ? ' is-disabled' : ''}`}>
        <Search size={18} aria-hidden="true" />
        <input
          type="text"
          role="combobox"
          aria-label="Wyszukaj kompozytora lub utwór"
          aria-expanded={open && results.length > 0}
          aria-controls="piece-suggestions"
          autoComplete="off"
          placeholder="Wpisz kompozytora lub tytuł…"
          value={query}
          disabled={disabled}
          onChange={(event) => { setQuery(event.target.value); setOpen(true); setActiveIndex(0) }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        <ChevronDown size={16} className={open ? 'chevron-up' : ''} aria-hidden="true" />
      </div>
      {open && !disabled && query.trim() && (
        <div className="suggestions" id="piece-suggestions" role="listbox">
          {results.length ? results.map((piece, index) => (
            <button
              key={piece.id}
              className={`suggestion${activeIndex === index ? ' suggestion--active' : ''}`}
              type="button"
              role="option"
              aria-selected={activeIndex === index}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => choose(piece)}
            >
              <span className="suggestion-composer">{piece.composer}</span>
              <span className="suggestion-title">{piece.title}</span>
              <Check size={14} />
            </button>
          )) : <p className="no-suggestions">Nie znaleziono utworu</p>}
        </div>
      )}
    </div>
  )
}
