import { useRef, useState } from 'react'

// Browsers ignore the `media` attribute on a <video> <source>, so the file has
// to be chosen here: phones get the 720p cut, everyone else the 1080p one.
const filmSrc = window.matchMedia('(max-width: 700px)').matches
  ? '/media/venue-intro-720.mp4'
  : '/media/venue-intro-1080.mp4'

export default function Hero() {
  const video = useRef(null)
  const [started, setStarted] = useState(false)
  const [ended, setEnded] = useState(false)

  // No autoplay: the guest opens the invitation with a tap, the same way
  // you'd open a physical one. That tap is also the user gesture that lets
  // MusicToggle's click-anywhere listener start the music at the same moment.
  const play = () => {
    setStarted(true)
    setEnded(false)
    const el = video.current
    if (!el) return
    el.currentTime = 0
    el.play()
  }

  return (
    <section className="hero" id="top">
      <div className="hero-film">
        <video
          ref={video}
          src={filmSrc}
          poster="/media/venue-poster.jpg"
          preload="auto"
          muted
          playsInline
          onEnded={() => setEnded(true)}
          aria-label="A short film ending with the wedding invitation"
        />

        {!started && (
          <button className="hero-play" onClick={play}>
            <span>Play the invitation</span>
          </button>
        )}

        <div className="hero-thread" data-shown={ended} aria-hidden="true">
          <i />
        </div>

        {started && (
          <button className="hero-replay" data-shown={ended} onClick={play}>
            Play again
          </button>
        )}
      </div>
    </section>
  )
}
