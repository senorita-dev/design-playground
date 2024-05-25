import { User } from 'firebase/auth'
import { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Grid from 'src/components/Grid'
import { ServiceContext } from 'src/services/context'
import { DesignData, DesignObject } from 'src/services/database/DatabaseManagerService'
import { useObservable } from 'src/utils/hooks'
import styled from 'styled-components'

function Design() {
  const { userService } = useContext(ServiceContext)
  const user = useObservable(userService.observeUser())
  if (user === null || user === undefined) {
    return <SignedOutContent />
  }
  return <SignedInContent user={user} />
}

const SignedOutContent = () => {
  return (
    <Container>
      <Link to={'/'}>{'<'}Back</Link>
      <h1>Design</h1>
      <p>
        <Link to={'/login'}>Log in</Link> to see your designs
      </p>
    </Container>
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
  useEffect(() => {
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [])
  async function handleKeydown(this: Window, event: KeyboardEvent) {
    if (event.repeat) {
      return null
    }
    if (designId === undefined) {
      return null
    }
    switch (event.code) {
      case 'KeyR':
        const designObject: DesignObject = {
          type: 'rectangle',
          x: 100,
          y: 100,
        }
        await databaseService.createDesignObject(user, designId, designObject)
        break
      default:
        break
    }
  }
  const designObjects = design?.objects ?? []
  return (
    <Container>
      <Grid designObjects={designObjects} />
    </Container>
  )
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`

export default Design
