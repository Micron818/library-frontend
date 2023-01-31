import { useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { LOGIN } from '../queries'

const LoginForm = ({ show, setToken, token }) => {
  const [username, setUsername] = useState('demo1')
  const [password, setPassword] = useState('secret')
  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error)
    },
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.token
      setToken(token)
      localStorage.setItem('library-user-token', token)
    }
  }, [result.data])

  if (!show) return null

  const submit = async (event) => {
    event.preventDefault()
    await login({ variables: { username, password } })
  }

  return token ? (
    <>logined with {username}</>
  ) : (
    <form onSubmit={submit}>
      <div>
        name{' '}
        <input
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password{' '}
        <input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm
