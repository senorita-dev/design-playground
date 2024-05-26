import { DesignObject } from 'src/services/database/DatabaseManagerService'
import styled from 'styled-components'
import { assertNever } from 'src/utils/utils'
import { useContext, useEffect, useRef, useState } from 'react'
import { ServiceContext } from 'src/services/context'
import { User } from 'firebase/auth'
import Rectangle from './design/Rectangle'

interface GridProps {
  user: User
  designId?: string
}

interface Position {
  x: number
  y: number
}

const Grid: React.FC<GridProps> = ({ user, designId }) => {
  const gridRef = useRef<HTMLDivElement>(null)
  const [designObjects, setDesignObjects] = useState<DesignObject[]>([])
  const [cursorPosition, setCursorPosition] = useState<Position>({ x: 0, y: 0 })
  const { databaseService } = useContext(ServiceContext)
  useEffect(() => {
    if (designId === undefined) {
      return
    }
    const subscription = databaseService.observeDesignObjects(user, designId).subscribe({
      next: (designObjects) => setDesignObjects(designObjects),
      error: (error) => console.error(error),
    })
    return () => subscription.unsubscribe()
  }, [databaseService, designId])
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
    if (designId === undefined) {
      return null
    }
    if (event.ctrlKey) {
      return null
    }
    switch (event.code) {
      case 'KeyR':
        const { x, y } = cursorPosition
        const designObject: DesignObject = { type: 'rectangle', x, y }
        await databaseService.createDesignObject(user, designId, designObject)
        break
      default:
        break
    }
  }
  function handleMouseMove(event: MouseEvent) {
    setCursorPosition({ x: event.clientX, y: event.clientY })
  }
  return (
    <Container ref={gridRef} tabIndex={0}>
      {designObjects.map((designObject, index) => {
        const { x, y } = designObject
        switch (designObject.type) {
          case 'rectangle':
            return <Rectangle key={index} x={x} y={y} />
          default:
            assertNever(designObject.type)
        }
      })}
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`

export default Grid
