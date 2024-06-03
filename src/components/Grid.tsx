import { DesignObject, DesignObjectProps } from 'src/services/database/DatabaseManagerService'
import styled from 'styled-components'
import { assertNever } from 'src/utils/utils'
import { useContext, useEffect, useRef, useState } from 'react'
import { ServiceContext } from 'src/services/context'
import { User } from 'firebase/auth'
import Rectangle from './design/Rectangle'
import { useObservable } from 'src/utils/hooks'

interface GridProps {
  user: User
  designId: string
}

interface Position {
  x: number
  y: number
}

const Grid: React.FC<GridProps> = ({ user, designId }) => {
  const { databaseService } = useContext(ServiceContext)
  const gridRef = useRef<HTMLDivElement>(null)
  const [cursorPosition, setCursorPosition] = useState<Position>({ x: 0, y: 0 })
  const [dragStartPosition, setDragStartPosition] = useState<Position>({ x: 0, y: 0 })
  const selectedObject = useObservable(databaseService.observeSelectedDesignObject())
  const designObjects = useObservable(databaseService.observeCurrentDesignObjects()) ?? []
  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      setCursorPosition({ x: event.clientX, y: event.clientY })
    }
    function handleMouseDown(event: MouseEvent) {
      const target = event.target
      if (target === null || target === gridRef.current) {
        databaseService.clearSelectedDesignObject()
        return
      }
      if (!(target instanceof HTMLElement)) {
        databaseService.clearSelectedDesignObject()
        return
      }
      const id = target.dataset.id ?? null
      if (id === null) {
        databaseService.clearSelectedDesignObject()
        return
      }
      databaseService.setSelectedDesignObject(id)
      setDragStartPosition({ x: event.clientX, y: event.clientY })
      event.preventDefault()
    }
    function handleMouseUp() {
      if (selectedObject === null || selectedObject === undefined) {
        return
      }
      const x = selectedObject.x + (cursorPosition.x - dragStartPosition.x)
      const y = selectedObject.y + (cursorPosition.y - dragStartPosition.y)
      const updatedDesignObject: DesignObject = { ...selectedObject, x, y }
      databaseService.editDesignObject(user, designId, updatedDesignObject)
    }
    const grid = gridRef.current
    if (grid === null) {
      return
    }
    grid.focus()
    grid.addEventListener('mousemove', handleMouseMove)
    grid.addEventListener('mousedown', handleMouseDown)
    grid.addEventListener('mouseup', handleMouseUp)
    return () => {
      grid.removeEventListener('mousemove', handleMouseMove)
      grid.removeEventListener('mousedown', handleMouseDown)
      grid.removeEventListener('mouseup', handleMouseUp)
    }
  }, [databaseService, user, gridRef, designId, selectedObject, cursorPosition, dragStartPosition])
  useEffect(() => {
    async function handleKeydown(event: KeyboardEvent) {
      if (event.repeat) {
        return null
      }
      if (event.ctrlKey) {
        return null
      }
      switch (event.code) {
        case 'KeyR': {
          const { x, y } = cursorPosition
          const designObject: DesignObjectProps = { type: 'rectangle', x, y }
          await databaseService.createDesignObject(user, designId, designObject)
          break
        }
        case 'Delete': {
          if (selectedObject === null || selectedObject === undefined) {
            return
          }
          await databaseService.deleteDesignObject(user, designId, selectedObject.id)
          break
        }
        default:
          break
      }
    }
    const grid = gridRef.current
    if (grid === null) {
      return
    }
    grid.addEventListener('keydown', handleKeydown)
    return () => grid.removeEventListener('keydown', handleKeydown)
  }, [databaseService, designId, user, gridRef, cursorPosition, selectedObject])
  return (
    <Container ref={gridRef} tabIndex={0}>
      {designObjects.map((designObject) => {
        const { id, x, y } = designObject
        switch (designObject.type) {
          case 'rectangle':
            return <Rectangle key={id} x={x} y={y} id={id} selected={selectedObject?.id === id} />
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
