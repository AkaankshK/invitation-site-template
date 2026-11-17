import { couple } from '../site.js'

export default function Header({ shown }) {
  return (
    <header className="header" data-shown={shown}>
      <a className="header-brand" href="#top">
        {couple.bride} <em>&</em> {couple.groom}
      </a>
      <nav className="header-nav" aria-label="Sections">
        <a href="#schedule">Schedule</a>
        <a href="#rsvp">RSVP</a>
      </nav>
    </header>
  )
}
