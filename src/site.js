// Everything editable about the site lives here.
// Change a string, redeploy, done.

export const couple = {
  bride: 'Asha',
  groom: 'Rohan',
  dateLine: '12 – 14 March 2027',
  photo: {
    src: '/media/couple.jpg',
    width: 489,
    height: 653,
    alt: 'Asha and Rohan together',
  },
}

export const venue = {
  name: 'Willow Creek Estate',
  street: '88 Vineyard Way',
  city: 'Riverton, TX 75000',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=88+Vineyard+Way%2C+Riverton%2C+TX+75000',
  siteUrl: 'https://example.com/',
  phone: '(555) 010-0100',
}

// Friday and Saturday are at the farm.
export const farm = {
  name: 'Marigold Meadows Farm',
  street: '1200 Meadowlark Lane',
  city: 'Riverton, TX 75000',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=1200+Meadowlark+Lane%2C+Riverton%2C+TX+75000',
  siteUrl: 'https://example.org/',
}

// The schedule is told in two chapters, one per venue. Each event has:
//   id      stable key — used by the RSVP form and as the Google Sheet column
//   motif   its silhouette (components/Motifs.jsx)
//   sky     the colour of the light behind it (styles.css)
//   rsvp    the question the RSVP form asks about it, and the "yes" answer
export const chapters = [
  {
    id: 'farm',
    place: farm,
    when: 'Friday & Saturday · 12–13 March',
    events: [
      {
        id: 'mehendi',
        name: 'Mehendi',
        telugu: 'మెహందీ',
        day: 'Friday 12 March',
        time: 'Afternoon',
        note: 'Henna, music and a slow start to the weekend. Come as you are — the design takes a while to dry, so keep your hands free.',
        motif: 'mehendi',
        sky: 'afternoon',
        rsvp: {
          question: 'Will you join us for an afternoon of henna and music at the Mehendi?',
          yes: "Yes, we'll be there!",
        },
      },
      {
        id: 'haldi',
        name: 'Haldi',
        telugu: 'పసుపు',
        day: 'Saturday 13 March',
        time: 'Morning',
        note: 'Turmeric is blessed onto the bride and groom by the family. Wear something you would not mind staining yellow.',
        motif: 'haldi',
        sky: 'morning',
        rsvp: {
          question: 'Will you be there for the turmeric and blessings at the Haldi?',
          yes: 'Yes, count us in!',
        },
      },
      {
        id: 'pellikuthuru',
        name: 'Pelli Kuthuru & Pelli Koduku',
        telugu: 'పెళ్లికూతురు & పెళ్లికొడుకు',
        day: 'Saturday 13 March',
        time: 'Afternoon onwards',
        note: 'The ceremonies in which Asha becomes a bride and Rohan becomes a groom, followed by an evening together.',
        motif: 'pellikuthuru',
        sky: 'dusk',
        rsvp: {
          question: 'Will you be with us for the Pelli Kuthuru & Pelli Koduku?',
          yes: "Yes, we wouldn't miss it!",
        },
      },
    ],
  },
  {
    id: 'estate',
    place: venue,
    when: 'Sunday · 14 March',
    events: [
      {
        id: 'wedding',
        name: 'The Wedding',
        telugu: 'ముహూర్తం',
        day: 'Sunday 14 March',
        time: 'Muhurtam 9:48 am',
        note: 'The vows fall at the muhurtam itself, so please be seated well before 9:48. Rituals begin earlier in the morning.',
        peak: true,
        motif: 'mandapam',
        sky: 'muhurtam',
        rsvp: {
          question: 'Will you be present to bless our wedding at the muhurtam?',
          yes: 'Yes, we would be honored.',
        },
      },
      {
        id: 'reception',
        name: 'Reception',
        telugu: 'విందు',
        day: 'Sunday 14 March',
        time: '7:00 pm onwards',
        note: 'Drinks, dinner and dancing to close the weekend.',
        motif: 'villa',
        sky: 'evening',
        rsvp: {
          question: 'Will you join us for cocktails, dinner and dancing at the Reception?',
          yes: "Yes, let's celebrate!",
        },
      },
    ],
  },
]

// Every event in order — the RSVP form asks about each one.
export const events = chapters.flatMap((chapter) => chapter.events)

export const rsvp = {
  lede: "Let us know which celebrations you'll be joining. One reply covers everyone in your party.",
  question: 'We would be so happy to have you with us. Will you be joining the celebrations?',
  accept: 'Joyfully accept',
  decline: 'Regretfully decline',
  eventDecline: "Sadly, we can't make this one.",
  maxGuests: 10,
}

export const contact = {
  // TODO: replace with the address guests should actually write to.
  email: 'hello@example.com',
}

// Shown in the footer while the background track is available.
export const music = {
  title: 'Placeholder track',
}
