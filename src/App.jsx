import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Couple from './components/Couple.jsx'
import Schedule from './components/Schedule.jsx'
import Rsvp from './components/Rsvp.jsx'
import Footer from './components/Footer.jsx'
import MusicToggle from './components/MusicToggle.jsx'
import Petals from './components/Petals.jsx'

export default function App() {
  const [pastHero, setPastHero] = useState(false)

  // The header stays out of the way until the film is behind you.
  useEffect(() => {
    const onScroll = () =>
      setPastHero(window.scrollY > window.innerHeight * 0.75)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <a className="skip" href="#schedule">
        Skip to the schedule
      </a>
      <Header shown={pastHero} />
      <main>
        <Hero />
        <Couple />
        <Schedule />
        <Rsvp />
      </main>
      <Footer />
      <MusicToggle />
      <Petals shown={pastHero} />
    </>
  )
}
