# Wedding invitation site

A three-day wedding invitation site: a short film that opens the invitation,
a photo of the couple, an illustrated schedule split across two venues, and an
RSVP form that writes replies to a Google Sheet.

Vite + React, no UI framework, no CSS library. The production build is about
52 KB gzipped plus media; the page makes one JS request, one CSS request, one
font request and one video request.

All names, venues, addresses, phone numbers and media in this repo are
placeholders.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
```

## Deploy to Vercel

Import the repo at vercel.com. Vercel detects Vite on its own — framework
preset "Vite", build `npm run build`, output `dist`. Or from this folder:

```bash
npx vercel        # preview
npx vercel --prod # live
```

`vercel.json` sets a one-year immutable cache on `/media/*`, so the video is
fetched once per guest and then served from their browser cache.

## Project layout

```
index.html              fonts, meta/OG tags, no-JS fallback
vercel.json             cache headers for /media
src/site.js             all editable content: couple, venues, events, RSVP copy
src/rsvpReply.js        normalise / validate / sheet row for one RSVP (shared by form and server)
src/styles.css          design tokens and every style, organised by section
src/components/         Header, Hero, Couple, Schedule, Motifs, Rsvp, Footer, MusicToggle, Petals
api/rsvp.js             Vercel function: POST /api/rsvp → validate → forward row to the sheet
google-apps-script/     rsvp.gs, pasted into the Google Sheet's Apps Script editor
public/media/           film, poster, OG image, couple photo, background music
```

## Editing content

Everything guests read lives in **`src/site.js`** — names, the date line, the
venues, the five events with their times, Telugu names and notes, and the RSVP
questions. Nothing else needs touching to change copy.

## Media

| File | Used for |
| --- | --- |
| `venue-intro-1080.mp4` | hero film, tablet and desktop |
| `venue-intro-720.mp4` | hero film, phones (chosen in `Hero.jsx`) |
| `venue-poster.jpg` | first frame, shown before the film plays |
| `og-image.jpg` | link previews |
| `music.mp3` | background music, plays once, `MusicToggle.jsx` |
| `couple.jpg` | the couple's photo, `Couple.jsx` (489 × 653) |

If you replace `couple.jpg`, update `couple.photo.width/height` in `site.js`
to match the new file.

The event silhouettes, the thoranam garland and the drifting petals are all
inline SVG/CSS, so none of them cost an extra request.

The film waits for a tap on "Play the invitation" — it does not autoplay —
then plays once and rests on its last frame with a "Play again" control. That
first tap is also what starts the background music, since browsers require a
real interaction before audio can play.

## RSVP setup (Google Sheet)

The form at `#rsvp` asks for name, email, an overall yes/no, then the number
of guests and a yes/no for each event. Each reply goes to `api/rsvp.js`, a
Vercel function that validates it again and passes it to a small **Google Apps
Script attached to your sheet**, which adds one row. No Google Cloud project,
service account or keys are needed.

1. **Create a Google Sheet** in the account that should own the replies.
2. Open **Extensions → Apps Script**, replace the sample code with
   `google-apps-script/rsvp.gs`, and click **Save**.
3. **Deploy → New deployment → Web app**, with **Execute as: Me** and
   **Who has access: Anyone**. Authorize it when prompted.
4. Copy the **Web app URL** (ending in `/exec`) and set it as
   **`RSVP_SHEET_URL`** in Vercel → Project → Settings → Environment Variables.
5. Redeploy and send a test reply. An **RSVPs** tab appears with a header row
   and your reply under it.

Notes:

- **Keep the web app URL private.** Anyone who has it can add rows. It's only
  read on the server, so it never reaches the browser.
- A Google sign-in page instead of JSON means *Who has access* isn't
  **Anyone**.
- When editing the script later, use **Manage deployments → New version** to
  keep the same URL.
- Replies are only ever appended. If a guest changes their answer, a new row
  appears; treat the latest row per email as their answer.
- The header is written on the first reply only. If you add or rename events
  afterwards, update row 1 by hand.
- A hidden "website" field catches simple spam bots. Text starting with `=`
  is stored as plain text, never run as a formula.
- To try it locally, put `RSVP_SHEET_URL` in `.env.local` and run
  `npx vercel dev` (plain `npm run dev` doesn't run `api/`).
- For a static preview with no server, build with `VITE_RSVP_PREVIEW=1`. The
  form then shows the thank-you screen without saving anything.

## Making it lighter

React is about 49 KB gzipped of the bundle. Aliasing `react` and `react-dom`
to `preact/compat` in `vite.config.js` would bring that down to roughly 12 KB.
