// POST /api/rsvp — checks one reply and adds it as a row in the RSVP sheet.
// The row is written by a small Google Apps Script attached to the sheet
// (google-apps-script/rsvp.gs); setup is in README.md, "RSVP setup".

import { normalise, sheetHeader, toRow, validate } from '../src/rsvpReply.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Replies are sent with POST.' })
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      return res.status(400).json({ error: 'The reply could not be read.' })
    }
  }

  // a hidden field people never see; bots fill it in
  if (body?.website) return res.status(200).json({ ok: true })

  const reply = normalise(body)
  const errors = validate(reply)
  if (Object.keys(errors).length) return res.status(400).json({ errors })

  // The Apps Script web app URL. It's set as an environment variable so it
  // never reaches guests' browsers or the repo.
  const sheetUrl = process.env.RSVP_SHEET_URL
  if (!sheetUrl) {
    console.error('RSVP: RSVP_SHEET_URL is not set')
    return res.status(500).json({ error: 'Replies are not being collected yet.' })
  }

  try {
    // text/plain is what Apps Script web apps expect; it follows a redirect to reply
    const sheet = await fetch(sheetUrl, {
      method: 'POST',
      headers: { 'content-type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ header: sheetHeader, row: toRow(reply) }),
      redirect: 'follow',
    })
    const text = await sheet.text()
    let result = null
    try {
      result = JSON.parse(text)
    } catch {
      // a Google sign-in page instead of JSON means the web app isn't open to "Anyone"
    }
    if (!sheet.ok || !result?.ok) {
      throw new Error(`sheet replied ${sheet.status}: ${result?.error ?? text.slice(0, 200)}`)
    }
  } catch (error) {
    console.error('RSVP: could not save reply', error)
    return res.status(502).json({ error: 'Your reply could not be saved.' })
  }

  return res.status(200).json({ ok: true })
}
