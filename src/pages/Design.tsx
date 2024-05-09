import { User } from 'firebase/auth'
import { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ServiceContext } from 'src/services/context'
import { DesignData } from 'src/services/database/DatabaseManagerService'

function Design() {
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
      <Link to={'/'}>{'<'}Back</Link>
      <h1>Design</h1>
      <p><Link to={'/login'}>Log in</Link> to see your designs</p>
    </div>
  )
}

const SignedInContent: React.FC<{ user: User }> = ({ user }) => {
  const [design, setDesign] = useState<DesignData | null>(null)
  const { databaseService } = useContext(ServiceContext)
  const { designId } = useParams()
  useEffect(() => {
    if (designId) {
      fetchDesign(user, designId)
    }
    async function fetchDesign(user: User, designId: string) {
      const fetchedDesign = await databaseService.getDesign(user, designId)
      setDesign(fetchedDesign)
    }
  }, [databaseService, designId, user])
  return (
    <div>
      <Link to={'/'}>{'<'}Back</Link>
      <h1>Design</h1>
      <p>Design data:</p>
      <p>{design?.id}</p>
    </div>
  )
}

export default Design
