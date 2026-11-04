import abcjs from 'abcjs'

let activeSynth: InstanceType<typeof abcjs.synth.CreateSynth> | null = null
let stopTimer: ReturnType<typeof setTimeout> | null = null
let playbackGeneration = 0
let audioContext: AudioContext | null = null

export async function stopAudio(): Promise<void> {
  playbackGeneration += 1
  if (stopTimer) clearTimeout(stopTimer)
  stopTimer = null
  const synth = activeSynth
  activeSynth = null
  if (synth) {
    try {
      await synth.stop()
    } catch {
      // A synth may already be stopped by the browser audio context.
    }
  }
}

export async function playAbc(abc: string): Promise<number> {
  const AudioContextConstructor = window.AudioContext
    ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!audioContext) {
    if (!AudioContextConstructor) throw new Error('Ta przeglądarka nie obsługuje dźwięku.')
    audioContext = new AudioContextConstructor()
  }
  const resumeAudio = audioContext.resume()
  await stopAudio()
  const generation = ++playbackGeneration
  const host = document.createElement('div')
  const visual = abcjs.renderAbc(host, abc, { add_classes: false, staffwidth: 800 })[0]
  if (!visual) throw new Error('Nie udało się przygotować zapisu nutowego.')
  const synth = new abcjs.synth.CreateSynth()
  activeSynth = synth
  await resumeAudio
  await synth.init({ visualObj: visual, audioContext })
  if (generation !== playbackGeneration) {
    await synth.stop()
    return 0
  }
  await synth.prime()
  if (generation !== playbackGeneration) {
    await synth.stop()
    return 0
  }
  await synth.start()
  if (generation !== playbackGeneration) {
    await synth.stop()
    return 0
  }
  const bars = Math.max(1, abc.match(/\|/g)?.length ?? 1)
  const duration = bars * 2500 + 500
  stopTimer = setTimeout(() => { void stopAudio() }, duration)
  return duration
}
