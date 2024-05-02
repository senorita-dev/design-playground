import { User } from 'firebase/auth'
import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ServiceContext } from 'src/services/context'

function Login() {
  const [user, setUser] = useState<User | null>(null)
  const { userService } = useContext(ServiceContext)
  async function handleLogin() {
    await userService.login()
  }
  function handleLogout() {
    userService.logout()
  }
  useEffect(() => {
    const subscription = userService.observeUser().subscribe((newUser) => setUser(newUser))
    return () => {
      subscription.unsubscribe()
    }
  }, [userService])
  if (user === null) {
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
