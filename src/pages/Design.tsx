import { User } from 'firebase/auth'
import { useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import Grid from 'src/components/Grid'
import GridBackground from 'src/components/GridBackground'
import RightBanner from 'src/components/RightBanner'
import { ServiceContext } from 'src/services/context'
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
  const { databaseService } = useContext(ServiceContext)
  const { designId } = useParams()
  const design = useObservable(databaseService.observeCurrentDesign())
  if (designId === undefined) {
    return
  }
  databaseService.setCurrentDesign(user, designId)
  if (design === null || design === undefined) {
    return <p>Not found</p>
  }
  return (
    <Container>
      <GridBackground />
      <Grid user={user} designId={designId} />
      <RightBanner />
    </Container>
  )
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`

export default Design
