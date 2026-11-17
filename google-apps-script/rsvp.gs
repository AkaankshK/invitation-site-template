/**
 * RSVP receiver for the wedding site.
 *
 * Paste this into the RSVP Google Sheet (Extensions → Apps Script), then
 * Deploy → New deployment → Web app, "Execute as: Me", "Who has access:
 * Anyone". Put the web app URL in Vercel as RSVP_SHEET_URL. Full steps are in
 * README.md, "RSVP setup".
 *
 * The site's server (api/rsvp.js) has already checked each reply; this only
 * writes it down, one row per reply.
 */

const TAB = 'RSVPs'

function doPost(e) {
  const lock = LockService.getScriptLock()
  lock.waitLock(10000) // two guests replying at once still get separate rows
  try {
    const { header, row } = JSON.parse(e.postData.contents)
    const book = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = book.getSheetByName(TAB) || book.insertSheet(TAB)

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(header)
      sheet.setFrozenRows(1)
      sheet.getRange(1, 1, 1, header.length).setFontWeight('bold')
    }

    // a leading apostrophe keeps text like "=SUM(A1)" from running as a formula
    sheet.appendRow(row.map((value) => (typeof value === 'string' && /^[=+\-@]/.test(value) ? "'" + value : value)))
    return reply({ ok: true })
  } catch (error) {
    return reply({ ok: false, error: String(error) })
  } finally {
    lock.releaseLock()
  }
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON)
}
