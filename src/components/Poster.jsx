import { useState } from 'react'

/**
 * Renders real artwork when the catalog provides it. When there is no image
 * (offline sample data, or a TMDB entry with no poster) it falls back to a
 * neutral "no artwork" tile rather than inventing a picture.
 */
export default function Poster({ item, src, className = '', sizes }) {
  const url = src ?? item?.poster ?? null
  const [failed, setFailed] = useState(false)

  if (!url || failed) {
    return (
      <div
        className={`flex h-full w-full flex-col justify-end bg-base-800 p-2 ${className}`}
        role="img"
        aria-label={item?.title ? `${item.title} — no artwork` : 'No artwork'}
      >
        <span className="line-clamp-3 text-2xs leading-tight text-fg-mute">{item?.title}</span>
        <span className="mt-1 block h-px w-4 bg-white/15" />
      </div>
    )
  }

  return (
    <img
      src={url}
      alt={item?.title ? `${item.title} poster` : ''}
      loading="lazy"
      decoding="async"
      sizes={sizes}
      onError={() => setFailed(true)}
      className={`h-full w-full bg-base-800 object-cover ${className}`}
    />
  )
}
