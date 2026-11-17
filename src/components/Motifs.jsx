// Silhouettes for the events themselves, drawn as small inline SVGs so they
// take their colours from styles.css (.m-* classes). Each scene is 400 × 240
// and stands on a soft ground line at the bottom edge.

const leafPath = (len, w) =>
  `M0 0 Q${w} ${len * 0.45} 0 ${len} Q${-w} ${len * 0.45} 0 0 Z`

// A leaf hanging from (x, y); angle 0 points straight down.
function Leaf({ x, y, angle = 0, len = 60, w = 12, className = 'm-soft' }) {
  return (
    <path
      className={className}
      d={leafPath(len, w)}
      transform={`translate(${x} ${y}) rotate(${angle})`}
    />
  )
}

function Marigold({ cx, cy, r, className = 'm-marigold' }) {
  const petals = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2
    return (
      <circle
        key={i}
        cx={cx + Math.cos(a) * r * 0.6}
        cy={cy + Math.sin(a) * r * 0.6}
        r={r * 0.42}
      />
    )
  })
  return (
    <g className={className}>
      {petals}
      <circle cx={cx} cy={cy} r={r * 0.5} className="m-marigold-heart" />
    </g>
  )
}

function Ground() {
  return <path className="m-soft" d="M0 224 Q200 212 400 224 V240 H0 Z" />
}

function Scene({ label, children }) {
  return (
    <svg className="motif" viewBox="0 0 400 240" role="img" aria-label={label}>
      {children}
    </svg>
  )
}

/* ---------- mehendi: two hennaed palms and a cone ---------- */

// fingers as [centre x, width, length, tilt] measured from the top of the palm
const FINGERS = [
  [-25, 17, 78, -6],
  [-6, 18, 92, -1],
  [13, 17, 84, 4],
  [29, 14, 64, 10],
]

function Hand({ x, y, angle, mirror }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${mirror ? -1 : 1} 1)`}>
      <g className="m-dark">
        <rect x="-36" y="-34" width="72" height="84" rx="28" />
        <path d="M-28 30 L-24 150 H24 L28 30 Z" />
        {FINGERS.map(([cx, w, h, a]) => (
          <rect
            key={cx}
            x={cx - w / 2}
            y={-28 - h}
            width={w}
            height={h + 14}
            rx={w / 2}
            transform={`rotate(${a} ${cx} -28)`}
          />
        ))}
        <rect x="-9" y="-58" width="18" height="62" rx="9" transform="translate(-30 14) rotate(-24)" />
      </g>

      {/* the henna */}
      <g className="m-light">
        {FINGERS.map(([cx, w, h, a]) => (
          <g key={cx} transform={`rotate(${a} ${cx} -28)`}>
            <rect x={cx - w / 2 + 2} y={-26 - h} width={w - 4} height="14" rx={(w - 4) / 2} />
            <circle cx={cx} cy={-28 - h * 0.42} r="1.7" />
            <circle cx={cx} cy={-28 - h * 0.28} r="1.7" />
          </g>
        ))}
        <circle cx="0" cy="4" r="6" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2
          return <circle key={i} cx={Math.cos(a) * 29} cy={4 + Math.sin(a) * 29} r="1.6" />
        })}
      </g>
      <g className="m-line">
        <circle cx="0" cy="4" r="14" />
        {Array.from({ length: 8 }, (_, i) => (
          <ellipse key={i} cx="0" cy="-17" rx="3.5" ry="6.5" transform={`rotate(${i * 45} 0 4)`} />
        ))}
        <polyline points="-27,62 -20,56 -13,62 -6,56 1,62 8,56 15,62 22,56 27,61" />
        <path d="M-26 72 H26" strokeDasharray="1 5" />
        <path d="M-25 82 Q0 92 25 82" />
      </g>
    </g>
  )
}

export function MehendiMotif() {
  return (
    <Scene label="Two hands raised, patterned with henna, beside a henna cone">
      <Ground />
      <Hand x={150} y={150} angle={-9} />
      <Hand x={252} y={150} angle={9} mirror />
      <g transform="translate(318 214) rotate(-24)">
        <path className="m-dark" d="M0 0 L54 -9 L54 9 Z" />
        <path className="m-dark" d="M54 -7 Q64 -4 66 -12 Q70 0 66 12 Q64 4 54 7 Z" />
        <path className="m-line" d="M18 -3 L20 3 M32 -5 L34 5" />
      </g>
      <Leaf x={52} y={222} angle={-118} len={40} w={9} />
      <Leaf x={52} y={222} angle={-78} len={32} w={8} className="m-dark" />
    </Scene>
  )
}

/* ---------- haldi: a brass uruli of turmeric paste ---------- */

export function HaldiMotif() {
  return (
    <Scene label="A wide brass bowl heaped with turmeric paste, with marigolds and mango leaves">
      <Ground />
      {[-38, -14, 12, 36].map((a) => (
        <Leaf key={a} x={200} y={146} angle={180 + a} len={72} w={14} />
      ))}
      <g className="m-dark">
        <path d="M90 150 Q96 214 200 216 Q304 214 310 150 Z" />
        <path d="M170 212 L160 228 H240 L230 212 Z" />
        <ellipse cx="200" cy="150" rx="112" ry="15" />
      </g>
      <g className="m-handle">
        <circle cx="82" cy="158" r="9" />
        <circle cx="318" cy="158" r="9" />
      </g>
      <path className="m-turmeric" d="M104 150 Q150 114 200 108 Q252 114 296 150 Q200 164 104 150 Z" />
      <g className="m-turmeric-deep">
        <circle cx="150" cy="138" r="2" />
        <circle cx="236" cy="130" r="2" />
        <circle cx="262" cy="142" r="2" />
        <circle cx="186" cy="124" r="2" />
      </g>
      <path className="m-line" d="M106 176 Q200 204 294 176" />
      <path className="m-line" d="M118 190 Q200 214 282 190" strokeDasharray="1 6" />
      <Marigold cx={206} cy={126} r={12} />
      <Marigold cx={176} cy={138} r={8} className="m-kumkum" />
      <Marigold cx={60} cy={214} r={14} />
      <Marigold cx={36} cy={226} r={9} className="m-kumkum" />
      <g transform="translate(350 220)">
        <path className="m-dark" d="M-22 -4 Q-20 12 0 13 Q20 12 22 -4 Z" />
        <path className="m-kumkum" d="M-18 -4 Q0 -16 18 -4 Z" />
      </g>
    </Scene>
  )
}

/* ---------- pelli kuthuru & pelli koduku: kalasam between two lamps ---------- */

function Lamp({ x }) {
  return (
    <g transform={`translate(${x} 224)`}>
      <g className="m-dark">
        <ellipse cx="0" cy="0" rx="30" ry="6" />
        <path d="M-26 0 Q-20 -18 0 -20 Q20 -18 26 0 Z" />
        <path d="M-5 -18 L-3 -110 H3 L5 -18 Z" />
        <ellipse cx="0" cy="-56" rx="9" ry="5" />
        <ellipse cx="0" cy="-86" rx="7" ry="4" />
        <path d="M-32 -112 Q0 -94 32 -112 Z" />
        <ellipse cx="0" cy="-112" rx="32" ry="4" />
        <path d="M-6 -114 Q0 -142 6 -114 Z" />
      </g>
      {[-23, 23].map((fx) => (
        <g key={fx} transform={`translate(${fx} -115)`}>
          <circle className="m-glow" cx="0" cy="-9" r="8" />
          <path className="m-flame" d="M0 0 Q-6 -8 0 -22 Q6 -8 0 0 Z" />
        </g>
      ))}
    </g>
  )
}

export function PelliKuthuruMotif() {
  return (
    <Scene label="A kalasam crowned with a coconut and mango leaves, between two lit brass lamps">
      <Ground />
      <Lamp x={82} />
      <Lamp x={318} />
      {[-72, -44, -16, 16, 44, 72].map((a) => (
        <Leaf key={a} x={200} y={118} angle={180 + a} len={58} w={12} />
      ))}
      <g className="m-dark">
        <circle cx="200" cy="172" r="46" />
        <path d="M176 212 L170 224 H230 L224 212 Z" />
        <rect x="184" y="114" width="32" height="18" />
        <ellipse cx="200" cy="118" rx="25" ry="6" />
        <ellipse cx="200" cy="94" rx="21" ry="25" />
        <path d="M195 72 L200 58 L205 72 Z" />
      </g>
      <path className="m-line" d="M156 164 Q200 182 244 164" />
      <path className="m-line" d="M158 186 Q200 204 242 186" strokeDasharray="1 6" />
      <circle className="m-kumkum" cx="200" cy="148" r="4.5" />
      <circle className="m-turmeric" cx="184" cy="150" r="3" />
      <circle className="m-turmeric" cx="216" cy="150" r="3" />
      <Marigold cx={146} cy={222} r={10} />
      <Marigold cx={254} cy={222} r={10} />
    </Scene>
  )
}

/* ---------- thoranam: the mango-leaf garland over the farm days ---------- */

export function Thoranam() {
  const swags = 10
  const span = 1000 / swags
  const rope = Array.from({ length: swags }, (_, i) => {
    const x0 = i * span
    return `M${x0} 8 Q${x0 + span / 2} 30 ${x0 + span} 8`
  }).join(' ')

  return (
    <svg
      className="thoranam"
      viewBox="0 0 1000 80"
      preserveAspectRatio="xMidYMin slice"
      aria-hidden="true"
    >
      <path className="m-rope" d={rope} />
      {Array.from({ length: swags }, (_, i) => {
        const x0 = i * span
        return (
          <g key={i}>
            {[0.22, 0.4, 0.6, 0.78].map((t, j) => {
              // sit each leaf on the swag's curve
              const x = x0 + span * t
              const y = 8 + 4 * 22 * t * (1 - t)
              return (
                <Leaf
                  key={j}
                  x={x}
                  y={y}
                  angle={(t - 0.5) * 30}
                  len={j === 1 || j === 2 ? 46 : 36}
                  w={9}
                  className={j % 2 ? 'm-dark' : 'm-soft'}
                />
              )
            })}
            <Marigold cx={x0} cy={10} r={9} />
          </g>
        )
      })}
      <Marigold cx={1000} cy={10} r={9} />
    </svg>
  )
}

/* ---------- the wedding: a mandapam between banana plants ---------- */

// points along a quadratic curve, for strings of marigolds
function alongCurve(x0, y0, cx, cy, x1, y1, n) {
  return Array.from({ length: n }, (_, i) => {
    const t = (i + 0.5) / n
    const u = 1 - t
    return [u * u * x0 + 2 * u * t * cx + t * t * x1, u * u * y0 + 2 * u * t * cy + t * t * y1]
  })
}

function BananaPlant({ x }) {
  return (
    <g>
      <path className="m-dark" d={`M${x - 5} 224 L${x - 3} 120 H${x + 3} L${x + 5} 224 Z`} />
      {[-62, -30, 0, 30, 62].map((a) => (
        <Leaf key={a} x={x} y={124} angle={180 + a} len={a === 0 ? 70 : 62} w={15} className={Math.abs(a) === 30 ? 'm-dark' : 'm-soft'} />
      ))}
    </g>
  )
}

export function MandapamMotif() {
  const swag = alongCurve(112, 98, 200, 142, 288, 98, 11)
  return (
    <Scene label="A wedding mandapam hung with marigold garlands, a small sacred fire beneath it, banana plants on either side">
      <Ground />
      <BananaPlant x={42} />
      <BananaPlant x={358} />

      {/* back pillars, then the platform and front pillars */}
      <g className="m-soft">
        <rect x="146" y="98" width="10" height="108" />
        <rect x="244" y="98" width="10" height="108" />
      </g>
      <g className="m-dark">
        <rect x="64" y="216" width="272" height="8" />
        <rect x="80" y="206" width="240" height="11" />
        {[104, 282].map((px) => (
          <g key={px}>
            <rect x={px} y="96" width="14" height="112" />
            <rect x={px - 4} y="196" width="22" height="10" />
            <rect x={px - 4} y="94" width="22" height="8" />
          </g>
        ))}
        <rect x="82" y="86" width="236" height="10" />
        <path d="M86 86 L112 64 Q200 30 288 64 L314 86 Z" />
        <circle cx="200" cy="34" r="9" />
        <path d="M196 26 L200 12 L204 26 Z" />
      </g>
      <path
        className="m-motif-fringe"
        d={Array.from({ length: 17 }, (_, i) => {
          const x = 90 + i * 13.75
          return `M${x} 96 a6.5 6 0 0 0 13 0`
        }).join(' ')}
      />
      <g className="m-light">
        <circle cx="200" cy="58" r="4" />
        <circle cx="178" cy="62" r="2.5" />
        <circle cx="222" cy="62" r="2.5" />
      </g>

      {swag.map(([mx, my], i) => (
        <Marigold key={i} cx={mx} cy={my} r={5.5} className={i % 3 === 1 ? 'm-kumkum' : 'm-marigold'} />
      ))}
      {[111, 289].map((gx) =>
        [112, 126, 140, 154].map((gy) => <Marigold key={`${gx}-${gy}`} cx={gx} cy={gy} r={5} />)
      )}

      {/* the homam at the centre of the platform */}
      <g className="m-dark">
        <path d="M180 206 V196 H220 V206 Z" />
        <path d="M186 196 V190 H214 V196 Z" />
      </g>
      <circle className="m-glow" cx="200" cy="178" r="12" />
      <path className="m-flame" d="M200 190 Q190 178 200 160 Q203 172 208 168 Q212 182 200 190 Z" />
    </Scene>
  )
}

/* ---------- the reception: the estate villa, lit for the evening ---------- */

// an arched window or door, flat-bottomed, w wide, h tall, top-left at (x, y)
const arch = (x, y, w, h) =>
  `M${x} ${y + h} V${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} V${y + h} Z`

function Cypress({ x, h }) {
  return <path className="m-soft" d={`M${x} 224 Q${x - 13} ${224 - h * 0.4} ${x} ${224 - h} Q${x + 13} ${224 - h * 0.4} ${x} 224 Z`} />
}

export function VillaMotif() {
  return (
    <Scene label="A stone villa with a central tower and terracotta roofs, its arched windows lit, between cypress trees">
      <Ground />
      <Cypress x={40} h={112} />
      <Cypress x={62} h={84} />
      <Cypress x={340} h={100} />
      <Cypress x={362} h={124} />

      <g className="m-deep">
        <path d="M60 152 L118 132 L176 152 Z" />
        <path d="M224 152 L282 132 L340 152 Z" />
        <path d="M150 122 L200 102 L250 122 Z" />
        <path d="M170 64 L200 44 L230 64 Z" />
      </g>
      <g className="m-dark">
        <rect x="70" y="150" width="104" height="74" />
        <rect x="226" y="150" width="104" height="74" />
        <rect x="160" y="120" width="80" height="104" />
        <rect x="178" y="62" width="44" height="60" />
        <rect x="174" y="98" width="52" height="5" />
      </g>

      {/* the lit windows */}
      <g className="m-window">
        <path d={arch(190, 70, 20, 24)} />
        {[84, 110, 136, 238, 264, 290].map((wx) => (
          <path key={wx} d={arch(wx + 3, 166, 13, 22)} />
        ))}
        {[84, 110, 136, 238, 264, 290].map((wx) => (
          <path key={`l${wx}`} d={arch(wx + 3, 196, 13, 18)} />
        ))}
        <path d={arch(172, 132, 14, 22)} />
        <path d={arch(214, 132, 14, 22)} />
        <path d={arch(187, 180, 26, 44)} />
      </g>

      {/* a string of lights across the front */}
      <path className="m-rope-thin" d="M70 150 Q122 176 174 150 M226 150 Q278 176 330 150" />
      {[
        ...alongCurve(70, 150, 122, 176, 174, 150, 7),
        ...alongCurve(226, 150, 278, 176, 330, 150, 7),
      ].map(([lx, ly], i) => (
        <circle key={i} className="m-bulb" cx={lx} cy={ly + 2} r="2.4" />
      ))}

    </Scene>
  )
}
