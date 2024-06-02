import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { User } from 'firebase/auth'
import 'src/css/Home.css'
import { ServiceContext } from 'src/services/context'
import { DesignData } from 'src/services/database/DatabaseManagerService'
import NewDesignButton from 'src/components/NewDesignButton'
import { useObservable } from 'src/utils/hooks'

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
      <h2>Designs</h2>
      <p>
        <Link to={'/login'}>Log in</Link> to see your designs
      </p>
    </div>
  )
}

const SignedInContent: React.FC<{ user: User }> = ({ user }) => {
  const { databaseService } = useContext(ServiceContext)
  const [designs, setDesigns] = useState<DesignData[]>([])
  useEffect(() => {
    const subscription = databaseService.observeDesigns(user).subscribe({
      next: (designs) => setDesigns(designs),
      error: (error) => console.error(error),
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [databaseService, user])
  return (
    <div>
      <h1>Home</h1>
      <h2>Welcome, {user.displayName ?? 'user'}</h2>
      <h2>
        Designs <NewDesignButton user={user} />
      </h2>
      <ul>
        {designs.map((design, index) => {
          const path = `/design/${design.id}`
          return (
            <li key={index}>
              <Link to={path}>{design.id}</Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Home
