import { ImageType, Response } from "./types"

const fields = [
    'id',
    '_score',
    'image_id',
    'title',
    'artist_display'
]

export const artFetcher = async (search: string = '') => {
    // Note: Currently using string interpolation. Consider URLSearchParams for proper encoding
    // to prevent special characters (&, #, +) from breaking the query string
    return fetch(`https://api.artic.edu/api/v1/artworks/search?q=${search}&fields=${fields.join(',')}`)
        // fetch() does not reject on 4xx/5xx. Add a check for res.ok before parsing
        .then(r => r.json())
        // Casting with 'as' is a compile-time-only assertion. No runtime validation
        // that the API actually returns this shape. Consider a lightweight schema check.
        .then(({ data }: Response) => data as ImageType[])
}
