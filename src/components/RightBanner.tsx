import { useContext } from 'react'
import { ServiceContext } from 'src/services/context'
import { useObservable } from 'src/utils/hooks'
import styled from 'styled-components'

const RightBanner: React.FC = () => {
  const { databaseService } = useContext(ServiceContext)
  const currentObject = useObservable(databaseService.observeSelectedDesignObject())
  if (currentObject === null || currentObject === undefined) {
    return <Container></Container>
  }
  const { type, x, y } = currentObject
  return (
    <Container>
      <h1>{type}</h1>
      <p>x: {x}</p>
      <p>y: {y}</p>
    </Container>
  )
}

const Container = styled.div`
  width: 20%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: var(--off-white);
  text-align: center;
`

export default RightBanner
