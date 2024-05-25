import { DesignData, DesignObject } from 'src/services/database/DatabaseManagerService'
import GridBackground from './GridBackground'
import styled from 'styled-components'
import { assertNever } from 'src/utils/utils'
import { useContext, useEffect, useRef, useState } from 'react'
import { ServiceContext } from 'src/services/context'
import { User } from 'firebase/auth'

interface GridProps {
  user: User
  design: DesignData | null
}

interface Position {
  x: number
  y: number
}

const Grid: React.FC<GridProps> = ({ user, design }) => {
  const gridRef = useRef<HTMLDivElement>(null)
  const [cursorPosition, setCursorPosition] = useState<Position>({ x: 0, y: 0 })
  const { databaseService } = useContext(ServiceContext)
  useEffect(() => {
    const grid = gridRef.current
    if (grid === null) {
      return
    }
    grid.focus()
    grid.addEventListener('mousemove', handleMouseMove)
    return () => grid.removeEventListener('mousemove', handleMouseMove)
  }, [gridRef.current])
  useEffect(() => {
    const grid = gridRef.current
    if (grid === null) {
      return
    }
    grid.addEventListener('keydown', handleKeydown)
    return () => grid.removeEventListener('keydown', handleKeydown)
  }, [gridRef.current, cursorPosition])
  async function handleKeydown(event: KeyboardEvent) {
    if (event.repeat) {
      return null
    }
    if (design?.id === undefined) {
      return null
    }
    switch (event.code) {
      case 'KeyR':
        const { x, y } = cursorPosition
        const designObject: DesignObject = { type: 'rectangle', x, y }
        await databaseService.createDesignObject(user, design.id, designObject)
        break
      default:
        break
    }
  }
  function handleMouseMove(event: MouseEvent) {
    setCursorPosition({ x: event.clientX, y: event.clientY })
  }
  const designObjects = design?.objects ?? []
  return (
    <Container ref={gridRef} tabIndex={0}>
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
