import { couple } from '../site.js'

// A short section between the film and the schedule with a photo of the couple.
export default function Couple() {
  return (
    <section className="section couple" id="couple">
      <div className="wrap couple-wrap">
        <div className="couple-text">
          <p className="couple-kicker">Together</p>
          <h2 className="section-title">With love</h2>
        </div>

        <figure className="couple-frame">
          <span className="couple-corner couple-corner-tl" aria-hidden="true" />
          <span className="couple-corner couple-corner-tr" aria-hidden="true" />
          <span className="couple-corner couple-corner-bl" aria-hidden="true" />
          <span className="couple-corner couple-corner-br" aria-hidden="true" />
          <img
            src={couple.photo.src}
            alt={couple.photo.alt}
            width={couple.photo.width}
            height={couple.photo.height}
            loading="lazy"
            decoding="async"
          />
        </figure>
      </div>
    </section>
  )
}
