// Small inline icon set (original paths, stroke-based) to avoid an icon dependency.
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function Svg({ children, size = 18, ...rest }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...base} {...rest}>
      {children}
    </svg>
  )
}

export const IconPlay = (p) => (
  <Svg {...p}>
    <path d="M8 5.6v12.8l10.5-6.4z" fill="currentColor" stroke="none" />
  </Svg>
)

export const IconSearch = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.5" />
  </Svg>
)

export const IconPlus = (p) => (
  <Svg {...p}>
    <path d="M12 5.5v13M5.5 12h13" />
  </Svg>
)

export const IconCheck = (p) => (
  <Svg {...p}>
    <path d="M5 12.8l4.4 4.2L19 7" />
  </Svg>
)

export const IconStar = (p) => (
  <Svg {...p}>
    <path
      d="M12 4.2l2.4 5 5.4.7-3.9 3.8.95 5.4-4.85-2.6-4.85 2.6.95-5.4L4.2 9.9l5.4-.7z"
      fill="currentColor"
      stroke="none"
    />
  </Svg>
)

export const IconUsers = (p) => (
  <Svg {...p}>
    <circle cx="9" cy="8.5" r="3.3" />
    <path d="M3.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
    <path d="M16 5.6a3.3 3.3 0 010 5.9M17.5 14.9c2 .6 3.3 2.3 3.3 4.6" />
  </Svg>
)

export const IconArrow = (p) => (
  <Svg {...p}>
    <path d="M5 12h13M12.5 5.8L19 12l-6.5 6.2" />
  </Svg>
)

export const IconChevron = (p) => (
  <Svg {...p}>
    <path d="M9.5 5.5L16 12l-6.5 6.5" />
  </Svg>
)

export const IconClose = (p) => (
  <Svg {...p}>
    <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
  </Svg>
)

export const IconSend = (p) => (
  <Svg {...p}>
    <path d="M4 12l16-7-6 16-3.2-6.5z" />
  </Svg>
)

export const IconHome = (p) => (
  <Svg {...p}>
    <path d="M4 10.5L12 4l8 6.5V20H4z" />
    <path d="M9.5 20v-5.5h5V20" />
  </Svg>
)
