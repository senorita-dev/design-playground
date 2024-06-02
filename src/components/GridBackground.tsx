import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

type Dimensions = {
  width: number
  height: number
}
function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 })
  const scaling = window.devicePixelRatio || 1
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      const canvasElement = canvasRef.current
      if (canvasElement === null) {
        return
      }
      const { width, height } = canvasElement.getBoundingClientRect()
      setDimensions({ width, height })
    })
    if (canvasRef.current) {
      resizeObserver.observe(canvasRef.current)
    }
    return () => resizeObserver.disconnect()
  }, [])
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
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.scale(scaling, scaling)
  }, [dimensions, scaling])
  const { width, height } = dimensions
  return <Canvas ref={canvasRef} width={width * scaling} height={height * scaling} />
}

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
`

function drawGrid(ctx: CanvasRenderingContext2D) {
  const size = 50
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
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'
  ctx.lineWidth = 0.5
  ctx.stroke()
}

export default GridBackground
