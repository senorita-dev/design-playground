import { useContext } from 'react'
import { ServiceContext } from 'src/services/context'

const LogoutButton = () => {
  const { userService } = useContext(ServiceContext)
  function handleLogout() {
    userService.logout()
  }
  return <button onClick={handleLogout}>Logout</button>
}

export default LogoutButton
