import { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)

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
