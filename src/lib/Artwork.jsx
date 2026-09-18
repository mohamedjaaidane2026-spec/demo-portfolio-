// Deterministic, code-generated cover art. Every title gets a unique abstract
// composition derived from its id, so the app needs no external image assets.

function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function rng(seed) {
  let s = seed || 1
  return () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    s >>>= 0
    return s / 4294967296
  }
}

/**
 * Abstract "landscape under a light source" composition: a graded sky, a set of
 * ridge silhouettes, a glowing body, and drifting particles. Shape, placement
 * and density all derive from the title id.
 *
 * @param {object} props
 * @param {{id:string,title:string,palette:string[]}} props.item
 * @param {'portrait'|'wide'} [props.variant]
 */
export default function Artwork({ item, variant = 'portrait', className = '' }) {
  const wide = variant === 'wide'
  const w = wide ? 960 : 400
  const h = wide ? 540 : 600
  const rand = rng(hash(item.id))
  const [deep, mid, accent] = item.palette
  const uid = `art-${item.id}-${variant}`

  // Light source.
  const sunX = w * (0.3 + rand() * 0.45)
  const sunY = h * (0.2 + rand() * 0.2)
  const sunR = (wide ? 62 : 46) * (0.75 + rand() * 0.6)

  // Ridge silhouettes, back to front.
  const ridges = Array.from({ length: 4 }, (_, i) => {
    const baseY = h * (0.46 + i * 0.13)
    const amp = h * (0.07 + rand() * 0.06) * (1 - i * 0.12)
    const peaks = 3 + Math.floor(rand() * 3)
    const step = w / peaks
    let d = `M 0 ${baseY + amp * 0.4}`
    for (let p = 0; p < peaks; p += 1) {
      const cx = step * p + step * (0.2 + rand() * 0.6)
      const cy = baseY - amp * (0.5 + rand())
      const x2 = step * (p + 1)
      const y2 = baseY + amp * (rand() * 0.5 - 0.1)
      d += ` Q ${cx} ${cy} ${x2} ${y2}`
    }
    d += ` L ${w} ${h} L 0 ${h} Z`
    return { d, shade: i }
  })

  // Drifting particles.
  const motes = Array.from({ length: wide ? 30 : 20 }, () => ({
    x: rand() * w,
    y: rand() * h * 0.78,
    r: 0.6 + rand() * 1.9,
    o: 0.15 + rand() * 0.5,
  }))

  // Light streaks across the sky.
  const streaks = Array.from({ length: 3 }, (_, i) => ({
    y: h * (0.1 + i * 0.1) + rand() * 24,
    o: 0.05 + rand() * 0.08,
  }))

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      role="img"
      aria-label={`Cover art for ${item.title}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor={mid} />
          <stop offset="45%" stopColor={deep} />
          <stop offset="100%" stopColor="#04060d" />
        </linearGradient>

        <radialGradient id={`${uid}-halo`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.85" />
          <stop offset="35%" stopColor={accent} stopOpacity="0.3" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>

        <linearGradient id={`${uid}-rim`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={accent} stopOpacity="0" />
          <stop offset="50%" stopColor={accent} stopOpacity="0.75" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>

        <linearGradient id={`${uid}-base`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#04060d" stopOpacity="0" />
          <stop offset="100%" stopColor="#04060d" stopOpacity={wide ? '0.55' : '0.8'} />
        </linearGradient>
      </defs>

      <rect width={w} height={h} fill={`url(#${uid}-sky)`} />

      {streaks.map((s, i) => (
        <rect
          key={`s${i}`}
          x="0"
          y={s.y}
          width={w}
          height={wide ? 3 : 2}
          fill={accent}
          opacity={wide ? s.o * 1.8 : s.o}
        />
      ))}

      {motes.map((m, i) => (
        <circle key={`m${i}`} cx={m.x} cy={m.y} r={m.r} fill={accent} opacity={m.o} />
      ))}

      {/* Light source: broad halo, then a crisp disc. */}
      <circle cx={sunX} cy={sunY} r={sunR * 5.5} fill={`url(#${uid}-halo)`} opacity={wide ? 1.15 : 1} />
      <circle cx={sunX} cy={sunY} r={sunR} fill={accent} opacity="0.92" />
      <circle cx={sunX} cy={sunY} r={sunR * 1.5} fill="none" stroke={accent} strokeWidth="1" opacity="0.4" />

      {/* Ridges: each layer darker and more opaque than the one behind it. */}
      {ridges.map((r, i) => (
        <g key={`r${i}`}>
          <path d={r.d} fill="#04060d" opacity={0.42 + i * 0.17} />
          <path d={r.d} fill="none" stroke={accent} strokeWidth={wide ? 1.6 : 1.2} opacity={0.34 - i * 0.07} />
        </g>
      ))}

      {/* Horizon rim light. */}
      <rect x="0" y={h * 0.455} width={w} height={wide ? 2.5 : 2} fill={`url(#${uid}-rim)`} />

      <rect width={w} height={h} fill={`url(#${uid}-base)`} />
    </svg>
  )
}
