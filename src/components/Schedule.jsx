import { chapters } from '../site.js'
import {
  HaldiMotif,
  MandapamMotif,
  MehendiMotif,
  PelliKuthuruMotif,
  Thoranam,
  VillaMotif,
} from './Motifs.jsx'

const MOTIFS = {
  mehendi: MehendiMotif,
  haldi: HaldiMotif,
  pellikuthuru: PelliKuthuruMotif,
  mandapam: MandapamMotif,
  villa: VillaMotif,
}

function Place({ place }) {
  return (
    <p className="chapter-place">
      {place.street ? `${place.street}, ${place.city}` : place.city}
      <span aria-hidden="true"> · </span>
      <a href={place.mapsUrl} target="_blank" rel="noreferrer">
        Open in Maps
      </a>
    </p>
  )
}

function EventCard({ event }) {
  const Motif = MOTIFS[event.motif]
  return (
    <article
      className="scene-card"
      data-sky={event.sky}
      data-peak={event.peak ? 'true' : 'false'}
    >
      <div className="scene-card-text">
        <p className="event-time">
          {event.time}
          <span className="event-day"> · {event.day}</span>
        </p>
        <h4 className="event-name">{event.name}</h4>
        <p className="event-telugu" lang="te">
          {event.telugu}
        </p>
        <p className="event-note">{event.note}</p>
      </div>
      <div className="scene-card-sky">
        <Motif />
      </div>
    </article>
  )
}

export default function Schedule() {
  return (
    <section className="section schedule" id="schedule">
      <div className="wrap">
        <h2 className="section-title">Three days, five celebrations</h2>
        <p className="section-lede">
          Two places, a short drive apart: the first two days at the farm, the
          wedding day at the estate. Times are Central.
        </p>

        {/* the farm days hang a thoranam; the estate's frame takes its arch */}
        {chapters.map((chapter) => (
          <div className={`chapter chapter-${chapter.id}`} key={chapter.id}>
            {chapter.id === 'farm' && <Thoranam />}
            <header className="chapter-head">
              <p className="chapter-when">{chapter.when}</p>
              <h3 className="chapter-name">{chapter.place.name}</h3>
              <Place place={chapter.place} />
            </header>

            <div className="scene-cards" data-count={chapter.events.length}>
              {chapter.events.map((event) => (
                <EventCard event={event} key={event.id} />
              ))}
            </div>
          </div>
        ))}

        <p className="schedule-foot">
          Start times for the mehendi, haldi and pelli kuthuru will be confirmed
          closer to the date.
        </p>
      </div>
    </section>
  )
}
