import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ServiceContext } from 'src/services/context'
import { useObservable } from 'src/utils/hooks'

function Login() {
  const { userService } = useContext(ServiceContext)
  async function handleLogin() {
    await userService.login()
  }
  function handleLogout() {
    userService.logout()
  }
  const user = useObservable(userService.observeUser())
  if (user === null || user === undefined) {
    return (
      <div>
        <Link to={'/'}>{'<'}Back</Link>
        <h1>Welcome, please log in</h1>
        <button onClick={handleLogin}>Login</button>
      </div>
    )
  }
  return (
    <div>
      <Link to={'/'}>{'<'}Back</Link>
      <h1>Welcome, {user.displayName}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Login
