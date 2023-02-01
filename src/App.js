import { useEffect, useState } from 'react'

import { useSubscription, useApolloClient } from '@apollo/client'

import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import { SEARCH_BY_GENRES, BOOK_ADDED } from './queries'

export const uniqBooksByTitle = (a) => {
  let seen = new Set()
  return a.filter((item) => {
    let k = item.title
    return seen.has(k) ? false : seen.add(k)
  })
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)

  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded

      // console.log(`${addedBook.title} added`)

      client.cache.updateQuery(
        { query: SEARCH_BY_GENRES, variables: { genre: null } },
        (data) => {
          if (!data) return null
          return {
            allBooks: uniqBooksByTitle(data.allBooks.concat(addedBook)),
          }
        }
      )
    },
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
  }

  useEffect(() => {
    const savedToken = localStorage.getItem('library-user-token')
    setToken(savedToken)
  }, [])

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button
          style={{ display: token ? 'none' : 'inline-block' }}
          onClick={() => setPage('login')}
        >
          login
        </button>
        <button
          style={{ display: token ? 'inline-block' : 'none' }}
          onClick={() => setPage('addbook')}
        >
          add book
        </button>
        <button
          style={{ display: token ? 'inline-block' : 'none' }}
          onClick={logout}
        >
          logout
        </button>
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <LoginForm show={page === 'login'} setToken={setToken} token={token} />

      <NewBook show={page === 'addbook'} />
    </div>
  )
}

export default App
