import { DesignData, DesignObject } from 'src/services/database/DatabaseManagerService'
import GridBackground from './GridBackground'
import styled from 'styled-components'
import { assertNever } from 'src/utils/utils'
import { useContext, useEffect } from 'react'
import { ServiceContext } from 'src/services/context'
import { User } from 'firebase/auth'

interface GridProps {
  user: User
  design: DesignData | null
}

const Grid: React.FC<GridProps> = ({ user, design }) => {
  const { databaseService } = useContext(ServiceContext)
  useEffect(() => {
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [])
  async function handleKeydown(this: Window, event: KeyboardEvent) {
    if (event.repeat) {
      return null
    }
    if (design?.id === undefined) {
      return null
    }
    switch (event.code) {
      case 'KeyR':
        const designObject: DesignObject = {
          type: 'rectangle',
          x: 100,
          y: 100,
        }
        await databaseService.createDesignObject(user, design.id, designObject)
        break
      default:
        break
    }
  }
  const designObjects = design?.objects ?? []
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
