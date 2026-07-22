'use client'

import { ImageType } from '../types'

// DisplayProps is field-for-field identical to ImageType. Two hand-maintained copies
// will drift when one changes. Consider using ImageType directly instead.
interface DisplayProps {
  _score: number
  title: string
  image_id: string
  artist_display: string
}

const Display: React.FC<DisplayProps> = (image) => {
  const { title, image_id, artist_display } = image
  return (
    <div
      style={{
        margin: '1em',
        border: '1px solid',
        padding: '1em',
        background: '#222',
        display: 'flex',
        maxWidth: '400px',
      }}
    >
      {/* Not all artworks have image_id (some are text/archival records). The API returns null sometimes
            This will render a broken image with no fallback. Consider conditional rendering.
            Note: Only height is set, no width — causes layout shift while loading.
            Also consider using next/image instead of raw img for lazy loading and optimization.*/}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://www.artic.edu/iiif/2/${image_id}/full/843,/0/default.jpg`}
        alt={title}
        height="100"
      />
      <div style={{ marginLeft: '1em' }}>
        <h2 style={{ marginBottom: '0.5em' }}>{title}</h2>
        <p style={{ marginTop: '0.5em' }}>{artist_display}</p>
      </div>
    </div>
  )
}

type ResultsProps = {
  isLoading: boolean
  data: ImageType[]
}

// Replace with proper API classification fields or a real moderation service.
// Also produces false positives on scholarly works. Do not treat as real
// TODO(security/content): Replace with actual content moderation before relying on this.
// TODO: This is a naive placeholder. It only checks titles, not actual image content.

const filterOutNudity = (data: ImageType[]) => {
  const filteredData: ImageType[] = []
  // Consider using .filter() instead of manual for loop more idiomatic and readable
  for (let i = 0; i < data.length; i++) {
    if (!data[i].title.match(/nud(e|ity)/i)) {
      filteredData.push(data[i])
    }
  }

  return filteredData
}

const Results = ({ isLoading, data }: ResultsProps): JSX.Element => {
  if (isLoading) return <></>

  // Note: .sort() mutates the array in-place. 'data' is a prop mutating props is an
  // anti-pattern that breaks React.memo, useMemo, and any equality-based optimizations.
  // Consider spreading into a new array: [...data].sort(...)
  // Note: 'let' is unnecessary here sanitizedData is never reassigned. Use 'const'.
  let sanitizedData = filterOutNudity(
    data.sort((a: ImageType, b: ImageType) => b._score - a._score),
  )
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {/* Using array index as key is unstable when list is
      sorted/filtered.  */}
      {/* React may reuse DOM nodes for wrong items. The API already returns 'id' in
      fields */}
      {/* but it's not added to ImageType or used here. Wire it through and
      use key={image.id} */}
      {sanitizedData.map((image, i) => (
        <Display key={i} {...image} />
      ))}
    </div>
  )
}

export default Results
