import {BorderBox, Position} from '@primer/components'
import React from 'react'
import useSiteMetadata from '../use-site-metadata'
import DarkTextInput from './dark-text-input'
import SearchResults from './search-results'
import useSearch from '../use-search'

function Search() {
  const siteMetadata = useSiteMetadata()
  const {getComboboxProps, getInputProps, getMenuProps, isOpen, results, getItemProps, highlightedIndex} = useSearch()

  return (
    <Position {...getComboboxProps({position: 'relative'})}>
      <DarkTextInput
        {...getInputProps({
          placeholder: `Search ${siteMetadata.title}`,
          width: 240,
        })}
      />
      <Position
        {...getMenuProps({
          position: 'absolute',
          left: 0,
          right: 0,
          pt: 2,
        })}
      >
        {isOpen && results ? (
          <BorderBox minWidth={300} maxHeight="70vh" py={1} boxShadow="medium" bg="white" style={{overflow: 'auto'}}>
            <SearchResults {...{results, getItemProps, highlightedIndex}} />
          </BorderBox>
        ) : null}
      </Position>
    </Position>
  )
}

export default Search
