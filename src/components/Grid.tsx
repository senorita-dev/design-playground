import { DesignObject } from 'src/services/database/DatabaseManagerService'
import GridBackground from './GridBackground'
import styled from 'styled-components'

interface GridProps {
  designObjects: DesignObject[]
}

const Grid: React.FC<GridProps> = ({ designObjects }) => {
  return (
    <Container>
      <GridBackground />
      <ObjectContainer>
        {designObjects.map(() => {
          return <div>rectangle</div>
        })}
      </ObjectContainer>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  height: 100%;
`

const ObjectContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`

export default Grid
