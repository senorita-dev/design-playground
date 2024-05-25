import { DesignObject } from 'src/services/database/DatabaseManagerService'
import GridBackground from './GridBackground'
import styled from 'styled-components'
import { assertNever } from 'src/utils/utils'

interface GridProps {
  designObjects: DesignObject[]
}

const Grid: React.FC<GridProps> = ({ designObjects }) => {
  return (
    <Container>
      <GridBackground />
      <ObjectContainer>
        {designObjects.map((designObject, index) => {
          const { x, y } = designObject
          switch (designObject.type) {
            case 'rectangle':
              return (
                <Rectangle key={index} x={x} y={y}>
                  rectangle
                </Rectangle>
              )
            default:
              assertNever(designObject.type)
          }
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

interface RectangleProps {
  x: number
  y: number
}

const Rectangle = styled.div<RectangleProps>`
  position: absolute;
  top: ${(props) => props.y}px;
  left: ${(props) => props.x}px;
  width: 200px;
  height: 100px;
  background-color: var(--off-white);
`

export default Grid
