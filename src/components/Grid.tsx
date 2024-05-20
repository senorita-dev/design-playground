import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

type Dimensions = {
  width: number
  height: number
}
function Grid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 })
  const resizeObserver = new ResizeObserver(() => {
    const canvasElement = canvasRef.current
    if (canvasElement === null) {
      return
    }
    const { width, height } = canvasElement.getBoundingClientRect()
    setDimensions({ width, height })
  })
  useEffect(() => {
    if (canvasRef.current) {
      resizeObserver.observe(canvasRef.current)
    }
    return () => resizeObserver.disconnect()
  }, [canvasRef.current])
  useEffect(() => {
    const canvasElement = canvasRef.current
    if (canvasElement === null) {
      return
    }
    const ctx = canvasElement.getContext('2d')
    if (ctx === null) {
      return
    }
    drawGrid(ctx)
  }, [canvasRef.current, dimensions])
  const { width, height } = dimensions
  return <Canvas ref={canvasRef} width={width} height={height} />
}

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
`

function drawGrid(ctx: CanvasRenderingContext2D) {
  const size = 50 // Adjust this value to change the size of the grid cells
  const width = ctx.canvas.width
  const height = ctx.canvas.height

  ctx.clearRect(0, 0, width, height)

  ctx.beginPath()
  for (let x = 0; x <= width; x += size) {
    for (let y = 0; y <= height; y += size) {
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)

      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
    }
  }
  ctx.strokeStyle = 'rgba(0,0,0,0.5)' // Grid line color
  ctx.lineWidth = 0.5
  ctx.stroke()

  console.log('draw grid')
}

export default Grid
