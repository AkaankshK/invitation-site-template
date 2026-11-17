import { useEffect, useRef, useState } from 'react'
import { contact, events, rsvp } from '../site.js'
import { normalise, validate } from '../rsvpReply.js'

const ENDPOINT = import.meta.env.VITE_RSVP_ENDPOINT || '/api/rsvp'
// For builds with no server behind them (e.g. a hosted preview): pretend to save.
const PREVIEW = import.meta.env.VITE_RSVP_PREVIEW === '1'

const blank = { name: '', email: '', attending: '', guests: '1', answers: {}, website: '' }

// A yes/no question as two pill-shaped radio buttons.
function Choice({ id, legend, eyebrow, yes, no, value, onChange, error, large }) {
  return (
    <fieldset
      className="rsvp-choice"
      data-large={large ? 'true' : 'false'}
      aria-describedby={error ? `${id}-error` : undefined}
      aria-invalid={error ? 'true' : undefined}
    >
      <legend>
        {eyebrow && <span className="rsvp-eyebrow">{eyebrow}</span>}
        {legend}
      </legend>
      <div className="rsvp-pills">
        {[
          ['yes', yes],
          ['no', no],
        ].map(([option, label]) => (
          <label className="rsvp-pill" key={option}>
            <input
              type="radio"
              id={`rsvp-${id}-${option}`}
              name={`rsvp-${id}`}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p className="rsvp-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </fieldset>
  )
}

function Field({ id, label, error, children }) {
  return (
    <div className="rsvp-field">
      <label htmlFor={`rsvp-${id}`}>{label}</label>
      {children}
      {error && (
        <p className="rsvp-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}

export default function Rsvp() {
  const [values, setValues] = useState(blank)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle · sending · sent · failed
  const thanks = useRef(null)

  useEffect(() => {
    if (status === 'sent') thanks.current?.focus()
  }, [status])

  const set = (field, value) => {
    setValues((v) => ({ ...v, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }
  const answer = (id, value) => {
    setValues((v) => ({ ...v, answers: { ...v.answers, [id]: value } }))
    setErrors((e) => ({ ...e, [id]: undefined, attending: undefined }))
  }

  const submit = async (e) => {
    e.preventDefault()
    const reply = normalise(values)
    const found = validate(reply)
    if (Object.keys(found).length) {
      setErrors(found)
      // take the guest to the first thing that needs an answer
      const first = ['name', 'email', 'attending', 'guests', ...events.map((ev) => ev.id)].find((f) => found[f])
      document.querySelector(`#rsvp-${first}, [name="rsvp-${first}"]`)?.focus()
      return
    }

    setStatus('sending')
    try {
      if (PREVIEW) {
        await new Promise((r) => setTimeout(r, 600))
      } else {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ ...reply, website: values.website }),
        })
        if (res.status === 400) {
          const body = await res.json().catch(() => ({}))
          if (body.errors) {
            setErrors(body.errors)
            setStatus('idle')
            return
          }
        }
        if (!res.ok) throw new Error(`RSVP failed with ${res.status}`)
      }
      setStatus('sent')
    } catch {
      setStatus('failed')
    }
  }

  const reply = normalise(values)
  const firstName = reply.name.split(/\s+/)[0]
  const coming = events.filter((ev) => reply.answers[ev.id] === 'yes')
  const hasErrors = Object.values(errors).some(Boolean)

  return (
    <section className="section rsvp" id="rsvp">
      <div className="wrap">
        <p className="rsvp-kicker">Kindly respond</p>
        <h2 className="section-title">RSVP</h2>
        <p className="section-lede">{rsvp.lede}</p>

        {status === 'sent' ? (
          <div className="rsvp-card rsvp-thanks" role="status">
            <h3 ref={thanks} tabIndex={-1}>
              Thank you, {firstName}.
            </h3>
            {reply.attending === 'yes' ? (
              <>
                <p>
                  We've saved your reply for {reply.guests} {reply.guests === 1 ? 'guest' : 'guests'}. We'll
                  see you at:
                </p>
                <ul>
                  {coming.map((ev) => (
                    <li key={ev.id}>
                      <span>{ev.name}</span> · {ev.day}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p>We'll miss you, and we're grateful you let us know.</p>
            )}
            {PREVIEW && <p className="rsvp-note">Preview only — this reply wasn't saved anywhere.</p>}
            <button type="button" className="rsvp-link" onClick={() => setStatus('idle')}>
              Change my reply
            </button>
          </div>
        ) : (
          <form className="rsvp-card rsvp-form" onSubmit={submit} noValidate>
            <Field id="name" label="Your name" error={errors.name}>
              <input
                id="rsvp-name"
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={(e) => set('name', e.target.value)}
                aria-invalid={errors.name ? 'true' : undefined}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
            </Field>

            <Field id="email" label="Email" error={errors.email}>
              <input
                id="rsvp-email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={values.email}
                onChange={(e) => set('email', e.target.value)}
                aria-invalid={errors.email ? 'true' : undefined}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
            </Field>

            {/* hidden from people; bots fill it in and get quietly ignored */}
            <div className="rsvp-trap" aria-hidden="true">
              <label htmlFor="rsvp-website">Website</label>
              <input
                id="rsvp-website"
                tabIndex={-1}
                autoComplete="off"
                value={values.website}
                onChange={(e) => set('website', e.target.value)}
              />
            </div>

            <Choice
              id="attending"
              large
              legend={rsvp.question}
              yes={rsvp.accept}
              no={rsvp.decline}
              value={values.attending}
              onChange={(v) => set('attending', v)}
              error={errors.attending}
            />

            {values.attending === 'yes' && (
              <>
                <Field id="guests" label="How many guests, including you?" error={errors.guests}>
                  <select
                    id="rsvp-guests"
                    value={values.guests}
                    onChange={(e) => set('guests', e.target.value)}
                  >
                    {Array.from({ length: rsvp.maxGuests }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="rsvp-events">
                  {events.map((ev) => (
                    <Choice
                      key={ev.id}
                      id={ev.id}
                      eyebrow={`${ev.name} · ${ev.day}`}
                      legend={ev.rsvp.question}
                      yes={ev.rsvp.yes}
                      no={rsvp.eventDecline}
                      value={values.answers[ev.id]}
                      onChange={(v) => answer(ev.id, v)}
                      error={errors[ev.id]}
                    />
                  ))}
                </div>
              </>
            )}

            {status === 'failed' && (
              <p className="rsvp-error rsvp-banner" role="alert">
                Your reply didn't go through. Check your connection and try again, or email us at{' '}
                <a href={`mailto:${contact.email}`}>{contact.email}</a>.
              </p>
            )}
            {hasErrors && (
              <p className="rsvp-error rsvp-banner" role="alert">
                A few answers still need your attention.
              </p>
            )}

            <button className="rsvp-send" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send RSVP'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
