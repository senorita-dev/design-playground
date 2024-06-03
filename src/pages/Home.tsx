import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { User } from 'firebase/auth'
import 'src/css/Home.css'
import { ServiceContext } from 'src/services/context'
import { PartialDesignData } from 'src/services/database/DatabaseManagerService'
import NewDesignButton from 'src/components/NewDesignButton'
import { useObservable } from 'src/utils/hooks'
import LoginButton from 'src/components/LoginButton'
import LogoutButton from 'src/components/LogoutButton'

function Home() {
  const { userService } = useContext(ServiceContext)
  const user = useObservable(userService.observeUser())
  if (user === null || user === undefined) {
    return <SignedOutContent />
  }
  return <SignedInContent user={user} />
}

const SignedOutContent = () => {
  return (
    <div>
      <h1>Home</h1>
      <p>Login to see your designs</p>
      <LoginButton />
    </div>
  )
}

const SignedInContent: React.FC<{ user: User }> = ({ user }) => {
  const { databaseService } = useContext(ServiceContext)
  const designs: PartialDesignData[] = useObservable(databaseService.observeDesigns(user)) ?? []
  return (
    <div>
      <h1>Home</h1>
      <h2>
        Welcome, {user.displayName ?? 'user'} <LogoutButton />
      </h2>
      <h2>
        Designs <NewDesignButton user={user} />
      </h2>
      <ul>
        {designs.map(({ id, name }) => {
          const path = `/design/${id}`
          return (
            <li key={id}>
              <Link to={path}>{name}</Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Home
