'use client'

import { useEffect, useState } from 'react'
import { ImageType } from '../types'
import Results from '../Components/Results'
import { artFetcher } from '../getArt'

const Search = () => {
  // Two pieces of state for the same input. 'search' tracks what was submitted,
  // 'searchInputValue' tracks what's in the box. Naming doesn't make intent obvious.
  // Consider extracting a useArtSearch hook so data-fetching logic isn't mixed with UI state.
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')

  // Note: 'error' is only set to true, never reset to false. If a search fails then
  // the user searches again successfully, the error banner stays permanently.
  const [searchInputValue, setSearchInputValue] = useState('')
  const [data, setData] = useState([] as ImageType[])
  const [isLoading, setIsLoading] = useState(true)

  // Effect runs on mount with search='' fires a request before user types anything.
  // Depending on API behavior, this may be a wasted or expensive request. Consider skipping
  // when search is empty, or document if browsing everything by default is intentional.
  // No cleanup function or stale-response guard. If user types "cat" then "dog" quickly,
  // the "cat" response may arrive after "dog" and overwrite correct results. Add an ignore flag
  // or AbortController to handle race conditions.
  useEffect(() => {
    // set the state as loading
    setIsLoading(true)
    // Reset error at the start of each request. Add setError(false)
    // fetch the art
    artFetcher(search)
      .then((data) => {
        setIsLoading(false)
        setData(data)
      })
      // This catch will never fire for 4xx/5xx because fetch() doesn't reject on
      // non-OK responses. The component will crash instead when .sort() is called on undefined.
      .catch((e) => {
        setIsLoading(false)
        setError(true)
      })
  }, [search])

  return (
    <div style={{ margin: '1em' }}>
      <div>
        {/* No <label> or aria-label on this input. Screen reader users get an unlabeled text box */}
        <input
          value={searchInputValue}
          onChange={(e) => setSearchInputValue(e.currentTarget.value)}
          // Inconsistent pattern: Enter reads from e.currentTarget.value while
          // the button reads from searchInputValue state. Pick one pattern and stick to it.
          onKeyDown={(e) =>
            e.key == 'Enter' && setSearch(e.currentTarget.value)
          }
        />
        <button onClick={() => setSearch(searchInputValue)}>Search</button>
      </div>
      <p>&nbsp;</p>
      {/* Three independent booleans (error, isLoading, data) instead of one state machine */}
      {/* Use a single state machine */}
      {/* Suggestion: Model status as a union type: status: 'idle' | 'loading' | 'error' | 'success' */}
      {error && 'There was an error fetching the art.'}
      {isLoading ? 'Loading ...' : !data.length && 'No results.'}
      <Results isLoading={isLoading} data={data} />
    </div>
  )
}

export default Search
