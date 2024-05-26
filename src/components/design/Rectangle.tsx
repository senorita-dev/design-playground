import styled from "styled-components"

interface RectangleProps {
  x: number
  y: number
}

const Rectangle: React.FC<RectangleProps> = ({ x, y }) => {
  return <UiRectangle x={x} y={y}></UiRectangle>
}

const UiRectangle = styled.div<RectangleProps>`
  position: absolute;
  top: ${(props) => props.y}px;
  left: ${(props) => props.x}px;
  width: 200px;
  height: 100px;
  background-color: var(--off-white);
  border: 1px solid black;
`

export default Rectangle
