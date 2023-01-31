import { useQuery } from '@apollo/client'
import { useEffect, useRef, useState } from 'react'
import { SEARCH_BY_GENRES } from '../queries'
import './Books.css'
const Books = (props) => {
  const [selectGenres, setSelectGenres] = useState('all')
  const [books, setBooks] = useState([])

  const resultByGenres = useQuery(SEARCH_BY_GENRES, {
    variables: { genre: selectGenres === 'all' ? null : selectGenres },
    skip: !selectGenres,
    fetchPolicy:'no-cache'
  })

  useEffect(() => {
    if (resultByGenres.data) setBooks(resultByGenres.data.allBooks)
  }, [resultByGenres.data])

  const distinctGenres = useRef([])
  if (selectGenres === 'all') {
    distinctGenres.current = Array.from(
      new Set(
        books.reduce(
          (accumulator, currentValue) => [
            ...accumulator,
            ...currentValue.genres,
          ],
          []
        )
      )
    )
  }

  if (!props.show) {
    return null
  }

  if (resultByGenres.loading) return <div>loading...</div>

  return (
    <>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div id="genres-holder">
        <select
          size="2"
          value={selectGenres}
          onChange={({ target }) => setSelectGenres(target.value)}
        >
          {distinctGenres.current.map((genres) => (
            <option key={genres} value={genres}>
              {genres}
            </option>
          ))}
          <option value="all">all genres</option>
        </select>
      </div>
    </>
  )
}

export default Books
