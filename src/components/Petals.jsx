import { useMemo } from 'react'

// A handful of small flowers, drifting down behind the page — the film's own
// invitation stays undisturbed; this only starts once you've scrolled past
// it (`shown`, tied to the same `pastHero` flag the header uses). Positions
// and timings are derived from the index, not Math.random(), so they're
// stable across re-renders without needing state.
const COUNT = 12

function petal(i) {
  return {
    left: (i * 37 + 4) % 100, // percent across the width
    size: 12 + ((i * 17) % 12), // 12–24px
    duration: 16 + ((i * 11) % 14), // 16–30s to fall the height of the screen
    delay: -((i * 23) % 26), // negative: already mid-fall when it appears
    drift: ((i * 31) % 36) - 18, // ±18px sideways sway
    spin: (i * 53) % 360,
    spinDir: i % 2 ? -1 : 1,
    kind: ['marigold', 'kumkum', 'gold'][i % 3],
  }
}

// A simple five-petal blossom, viewBox 0 0 24 24.
function Flower() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <g transform="translate(12 12)">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="0" cy="-6" rx="3.4" ry="6" transform={`rotate(${a})`} />
        ))}
        <circle className="petal-heart" r="2.2" />
      </g>
    </svg>
  )
}

export default function Petals({ shown }) {
  const petals = useMemo(() => Array.from({ length: COUNT }, (_, i) => petal(i)), [])

  return (
    <div className="petals" data-shown={shown} aria-hidden="true">
      {petals.map((p, i) => (
        <span
          className="petal"
          data-kind={p.kind}
          key={i}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            '--duration': `${p.duration}s`,
            '--delay': `${p.delay}s`,
            '--drift': `${p.drift}px`,
            '--spin': `${p.spin * p.spinDir}deg`,
          }}
        >
          <Flower />
        </span>
      ))}
    </div>
  )
}
