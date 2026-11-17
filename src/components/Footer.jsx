import { couple, farm, music, venue } from '../site.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-row">
        <p className="footer-names">
          {couple.bride} <em>&</em> {couple.groom}
        </p>
        <p>
          {couple.dateLine} · {farm.name} & {venue.name}
        </p>
      </div>
      <p className="footer-credit">Now playing: “{music.title}”</p>
    </footer>
  )
}
