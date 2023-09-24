import React from 'react'
import {ThemeContext} from 'styled-components'

function useMatchMedia(query) {
  return React.useMemo(() => {
    if (typeof window === 'undefined') {
      const ev = new EventTarget()
      ev.matches = false
      return ev
    }
    return window.matchMedia(query)
  }, [query])
}

function useBreakpoint(index, minMax = 'min') {
  const theme = React.useContext(ThemeContext)
  const px = parseInt(theme.breakpoints[index])
  const matchMedia = useMatchMedia(`(${minMax}-width: ${px - (minMax === 'min' ? 0 : 1)}px)`)

  const [matches, setMatches] = React.useState(matchMedia.matches)
  const handleChange = React.useCallback(() => setMatches(matchMedia.matches), [matchMedia])

  React.useEffect(() => {
    matchMedia.addEventListener('change', handleChange)
    return () => matchMedia.removeEventListener('change', handleChange)
  }, [matchMedia, handleChange])

  return matches
}

export default useBreakpoint
