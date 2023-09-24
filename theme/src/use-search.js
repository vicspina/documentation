import React from 'react'
import {useCombobox} from 'downshift'
import {navigate, graphql, useStaticQuery} from 'gatsby'
import useBreakpoint from './use-breakpoint'

function useSearch() {
  const queryRef = React.useRef()
  const workerRef = React.useRef()

  const [query, setQuery] = React.useState()
  const [items, setItems] = React.useState(null)
  const isMobile = useBreakpoint(2, 'max')

  const rawData = useStaticQuery(graphql`
    {
      allMdx {
        nodes {
          id
          frontmatter {
            title
          }
          rawBody
        }
      }
      allSitePage {
        nodes {
          path
          pageContext
        }
      }
    }
  `)

  const data = React.useMemo(() => {
    const mdxNodes = rawData.allMdx.nodes.reduce((map, obj) => {
      map[obj.id] = obj
      return map
    }, {})

    return rawData.allSitePage.nodes
      .filter(node => {
        return node.pageContext && node.pageContext.mdxId && mdxNodes[node.pageContext.mdxId] != null
      })
      .map(node => {
        const mdxNode = mdxNodes[node.pageContext.mdxId]
        return {
          path: node.path,
          title: mdxNode.frontmatter.title,
          rawBody: mdxNode.rawBody,
        }
      })
  }, [rawData])

  const handleSearchResults = React.useCallback(({data}) => {
    if (data.query && data.results && data.query === queryRef.current) {
      setItems(data.results)
    }
  }, [])

  React.useEffect(() => {
    const worker = new Worker(new URL('./search.worker.js', import.meta.url))
    workerRef.current = worker

    worker.addEventListener('message', handleSearchResults)
    worker.postMessage({data})

    return () => worker.terminate()
  }, [data, handleSearchResults])

  React.useEffect(() => {
    queryRef.current = query

    if (query) {
      workerRef.current.postMessage({query})
    } else {
      setItems(null)
    }
  }, [query])

  const combobox = useCombobox({
    items: items || [],
    onInputValueChange: ({inputValue}) => setQuery(inputValue),
    onSelectedItemChange: ({selectedItem}) => {
      if (selectedItem) {
        combobox.reset()
        navigate(selectedItem.path)
      }
    },
    itemToString: item => (item ? item.title : ''),
    stateReducer: (state, {type, changes}) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          if (!changes.inputValue) {
            // Close the menu if the input is empty.
            return {...changes, isOpen: false}
          }
          break
        case useCombobox.stateChangeTypes.InputBlur:
          if (isMobile) {
            // Don't let a blur event change the state of `inputValue` or `isOpen`.
            return {...changes, inputValue: state.inputValue, isOpen: state.isOpen}
          }
          break
      }
      return changes
    },
  })

  return {
    ...combobox,
    results: items,
  }
}

export default useSearch
