import { DesignObject } from 'src/services/design/DesignManagerService'
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
  const { databaseService, designService } = useContext(ServiceContext)
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null)
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
    grid.addEventListener('click', handleMouseClick)
    return () => {
      grid.removeEventListener('mousemove', handleMouseMove)
      grid.removeEventListener('click', handleMouseClick)
    }
  }, [gridRef.current])
  useEffect(() => {
    if (selectedDesignId === null) {
      designService.clearCurrentObject()
      return
    }
    const designObject = designObjects.at(parseInt(selectedDesignId))
    if (designObject === undefined) {
      designService.clearCurrentObject()
      return
    }
    designService.setCurrentObject(designObject)
  }, [selectedDesignId, designObjects])
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
  function handleMouseClick(event: MouseEvent) {
    const target = event.target
    if (target === null || target === gridRef.current) {
      setSelectedDesignId(null)
      return
    }
    if (!(target instanceof HTMLElement)) {
      return
    }
    const id = target.dataset.id ?? null
    setSelectedDesignId(id)
  }
  return (
    <Container ref={gridRef} tabIndex={0}>
      {designObjects.map((designObject, index) => {
        const { x, y } = designObject
        switch (designObject.type) {
          case 'rectangle':
            const id = index.toString()
            return <Rectangle key={index} x={x} y={y} id={id} selected={selectedDesignId === id} />
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
