import { useEffect, useRef, useState } from 'react'

// Background music, playing once, with a button to turn it off so it's
// always in the guest's control.
export default function MusicToggle() {
  const audio = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const el = audio.current
    if (!el) return

    el.volume = 0.2

    // The track doesn't loop, so reset the button when it finishes.
    const onEnded = () => setPlaying(false)
    el.addEventListener('ended', onEnded)

    let unlock
    // Guests who've asked their system for less motion get less surprise too:
    // the track waits for a tap rather than starting on its own.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduced) {
      // Never call play() on mount. Some browsers (Safari, depending on the
      // visitor's per-site setting) let a bare play() succeed, which would
      // start the music before the invitation is opened. Waiting for a real
      // interaction keeps behaviour the same everywhere.
      unlock = () => el.play().then(() => setPlaying(true))
      window.addEventListener('pointerdown', unlock, { once: true })
      window.addEventListener('touchstart', unlock, { once: true })
      window.addEventListener('keydown', unlock, { once: true })
    }

    return () => {
      el.removeEventListener('ended', onEnded)
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('touchstart', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [])

  const toggle = () => {
    const el = audio.current
    if (!el) return
    if (playing) {
      el.pause()
      setPlaying(false)
    } else {
      // if the track already finished, "play" starts it over
      if (el.ended || el.currentTime >= el.duration - 0.05) el.currentTime = 0
      el.play().then(() => setPlaying(true))
    }
  }

  return (
    <>
      <audio ref={audio} src="/media/music.mp3" preload="auto" />
      <button
        type="button"
        className="music-toggle"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? 'Mute background music' : 'Play background music'}
      >
        {playing ? (
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              fill="currentColor"
              d="M4 9v6h4l5 5V4L8 9H4Zm11.5 3a4.5 4.5 0 0 0-2.3-3.93v7.86A4.5 4.5 0 0 0 15.5 12Z"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              fill="currentColor"
              d="M4 9v6h4l5 5V4L8 9H4Zm12.7-2.29-1.41 1.41L17.59 10.5l-2.3 2.3 1.41 1.41 2.3-2.3 2.29 2.29 1.41-1.41-2.29-2.29 2.29-2.29-1.41-1.41-2.29 2.29Z"
            />
          </svg>
        )}
      </button>
    </>
  )
}
