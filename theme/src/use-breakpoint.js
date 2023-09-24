import React from 'react'
import {ThemeContext} from 'styled-components'

function useBreakpoint(index, minMax = 'min') {
  const theme = React.useContext(ThemeContext)

  const matchMedia = React.useMemo(() => {
    const px = parseInt(theme.breakpoints[index])
    return window.matchMedia(`(${minMax}-width: ${px - (minMax === 'min' ? 0 : 1)}px)`)
  }, [theme, index, minMax])

  const [matches, setMatches] = React.useState(matchMedia.matches)
  const handleChange = React.useCallback(() => setMatches(matchMedia.matches), [matchMedia])

  React.useEffect(() => {
    matchMedia.addEventListener('change', handleChange)
    return () => matchMedia.removeEventListener('change', handleChange)
  }, [matchMedia, handleChange])

  return matches
}

export default useBreakpoint
