// One RSVP reply: how it's cleaned up, checked, and laid out as a sheet row.
// Shared by the form (components/Rsvp.jsx) and the server (api/rsvp.js), so a
// reply is judged the same way on both sides.

import { events, rsvp } from './site.js'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Coerce whatever arrived into the shape we store, dropping anything unknown.
export function normalise(input = {}) {
  const attending = input.attending === 'yes' || input.attending === 'no' ? input.attending : ''
  const answers = {}
  for (const event of events) {
    const answer = input.answers?.[event.id]
    // someone who declines overall is declining every event
    answers[event.id] = attending === 'no' ? 'no' : answer === 'yes' || answer === 'no' ? answer : ''
  }
  const guests = Number.parseInt(input.guests, 10)

  return {
    name: String(input.name ?? '').trim().slice(0, 120),
    email: String(input.email ?? '').trim().toLowerCase().slice(0, 254),
    attending,
    guests: attending === 'yes' && Number.isFinite(guests) ? guests : 0,
    answers,
  }
}

// Returns { field: message } for everything that needs fixing; empty when fine.
export function validate(reply) {
  const errors = {}

  if (!reply.name) errors.name = 'Please tell us your name.'
  if (!reply.email) errors.email = 'Please add your email, so we can reach you with updates.'
  else if (!EMAIL.test(reply.email)) errors.email = 'That email address looks incomplete.'

  if (!reply.attending) {
    errors.attending = 'Please let us know whether you can join us.'
    return errors
  }
  if (reply.attending === 'no') return errors

  if (!(reply.guests >= 1 && reply.guests <= rsvp.maxGuests)) {
    errors.guests = `Choose between 1 and ${rsvp.maxGuests} guests.`
  }
  for (const event of events) {
    if (!reply.answers[event.id]) errors[event.id] = `Please answer for the ${event.name}.`
  }
  const answeredAll = events.every((event) => reply.answers[event.id])
  if (answeredAll && !events.some((event) => reply.answers[event.id] === 'yes')) {
    errors.attending = "You've said no to every celebration — choose “Regretfully decline” above instead."
  }
  return errors
}

// The header row the Google Sheet should start with, and one reply as a row.
export const sheetHeader = ['Received', 'Name', 'Email', 'Reply', 'Guests', ...events.map((e) => e.name)]

export function toRow(reply, received = new Date()) {
  return [
    received.toISOString(),
    reply.name,
    reply.email,
    reply.attending === 'yes' ? 'Attending' : 'Declined',
    reply.guests,
    ...events.map((event) => (reply.answers[event.id] === 'yes' ? 'Yes' : 'No')),
  ]
}
