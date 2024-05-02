import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { User } from 'firebase/auth'
import 'src/css/Home.css'
import { ServiceContext } from 'src/services/context'
import { DesignData } from 'src/services/database/DatabaseManagerService'
import NewDesignButton from 'src/components/NewDesignButton'

function Home() {
  const [user, setUser] = useState<User | null>(null)
  const { userService } = useContext(ServiceContext)
  useEffect(() => {
    const subscription = userService.observeUser().subscribe((newUser) => setUser(newUser))
    return () => {
      subscription.unsubscribe()
    }
  }, [userService])
  if (user === null) {
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
  }, [databaseService])
  return (
    <div>
      <h1>Home</h1>
      <h2>Welcome, {user.displayName ?? 'user'}</h2>
      <h2>
        Designs <NewDesignButton user={user} />
      </h2>
      <ul>
        {designs.map((design, index) => (
          <li key={index}>{design.id}</li>
        ))}
      </ul>
      <ul>
        <li>
          <Link to="/design">Design 1</Link>
        </li>
        <li>Design 2</li>
        <li>Design 3</li>
        <li>Design 4</li>
        <li>Design 5</li>
      </ul>
    </div>
  )
}

export default Home
