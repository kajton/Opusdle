import { useEffect, useRef, useState } from 'react'
import { LoaderCircle, Pause, Play, Volume2 } from 'lucide-react'
import { playAbc, stopAudio } from '../utils/audioPlayer'

interface AudioControlsProps {
  abc: string
  label?: string
  full?: boolean
}

export function AudioControls({ abc, label = 'Odtwórz', full = false }: AudioControlsProps) {
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [playbackError, setPlaybackError] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const requestId = useRef(0)

  useEffect(() => {
    requestId.current += 1
    if (timer.current) clearTimeout(timer.current)
    setPlaying(false)
    setPlaybackError(false)
    void stopAudio()
    return () => {
      if (timer.current) clearTimeout(timer.current)
      void stopAudio()
    }
  }, [abc])

  async function togglePlayback() {
    if (playing || loading) {
      requestId.current += 1
      if (timer.current) clearTimeout(timer.current)
      setPlaying(false)
      setLoading(false)
      await stopAudio()
      return
    }

    setLoading(true)
    setPlaybackError(false)
    const request = ++requestId.current
    try {
      const duration = await playAbc(abc)
      if (request !== requestId.current) return
      setLoading(false)
      setPlaying(true)
      timer.current = setTimeout(() => setPlaying(false), duration)
    } catch (error) {
      if (request !== requestId.current) return
      setLoading(false)
      setPlaying(false)
      setPlaybackError(true)
      console.error('Nie udało się odtworzyć dźwięku:', error)
    }
  }

  return (
    <button className={`audio-button${full ? ' audio-button--full' : ''}`} type="button" onClick={() => void togglePlayback()} aria-label={playing ? 'Zatrzymaj odtwarzanie' : playbackError ? 'Odtwarzanie niedostępne' : label}>
      {loading ? <LoaderCircle size={16} className="spin" /> : playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
      {full && <Volume2 size={16} className="audio-volume" />}
      <span>{loading ? 'Przygotowuję…' : playing ? 'Stop' : playbackError ? 'Audio niedostępne' : label}</span>
    </button>
  )
}
