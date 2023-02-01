import _ from 'lodash'
import { useLazyQuery, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { ALL_BOOKS } from '../queries'
import './Books.css'
const Books = (props) => {
  const allbooksResult = useQuery(ALL_BOOKS)
  const [genreBooks, genreBooksResult] = useLazyQuery(ALL_BOOKS)

  const [genre, setGenre] = useState(null)
  const [genres, setGenres] = useState([])
  const [books, setBooks] = useState([])

  useEffect(() => {
    if (allbooksResult.data && allbooksResult.data.allBooks && !genre) {
      const books = allbooksResult.data.allBooks
      setBooks(books)
      const genres = _.uniq(books.flatMap((b) => b.genres))
      setGenres(genres)
    }
  }, [allbooksResult.data, genre])

  useEffect(() => {
    if (genreBooksResult.data) {
      setBooks(genreBooksResult.data.allBooks)
    }
  }, [genreBooksResult.data])

  if (!props.show || !books) {
    return null
  }

  const onGenreClick = (newGenre) => {
    setGenre(newGenre)
    genreBooks({
      variables: {
        genre: newGenre,
      },
    })
  }

  if (allbooksResult.loading) return <div>loading...</div>

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

      <div>
        {genres.map((g) => (
          <button key={g} onClick={() => onGenreClick(g)}>
            {g}
          </button>
        ))}
        <button onClick={() => onGenreClick(null)}>all genres</button>
      </div>
    </>
  )
}

export default Books
