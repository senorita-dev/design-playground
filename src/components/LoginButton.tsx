import { useContext } from 'react'
import { ServiceContext } from 'src/services/context'

const LoginButton = () => {
  const { userService } = useContext(ServiceContext)
  async function handleLogin() {
    await userService.login()
  }
  return <button onClick={handleLogin}>Login</button>
}

export default LoginButton
