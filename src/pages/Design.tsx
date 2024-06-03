import { User } from 'firebase/auth'
import { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Grid from 'src/components/Grid'
import GridBackground from 'src/components/GridBackground'
import LeftBanner from 'src/components/LeftBanner'
import RightBanner from 'src/components/RightBanner'
import { ServiceContext } from 'src/services/context'
import { useObservable } from 'src/utils/hooks'
import styled from 'styled-components'

function Design() {
  const { userService } = useContext(ServiceContext)
  const user = useObservable(userService.observeUser())
  if (user === undefined || user === null) {
    return <p>Loading...</p>
  }
  return <SignedInContent user={user} />
}

const SignedInContent: React.FC<{ user: User }> = ({ user }) => {
  const { databaseService } = useContext(ServiceContext)
  const { designId } = useParams()
  const design = useObservable(databaseService.observeCurrentDesign())
  useEffect(() => {
    if (designId === undefined) {
      return
    }
    databaseService.setCurrentDesign(user, designId)
  }, [databaseService, user, designId])
  if (designId === undefined || design === null || design === undefined) {
    return <p>Not found</p>
  }
  return (
    <Container>
      <GridBackground />
      <LeftBanner design={design}/>
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
