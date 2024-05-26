import styled from 'styled-components'

interface RectangleProps {
  x: number
  y: number
  id: string
  selected: boolean
}

const Rectangle: React.FC<RectangleProps> = ({ x, y, id, selected }) => {
  const className = selected ? 'selected' : ''
  return <UiRectangle x={x} y={y} data-id={id} className={className}></UiRectangle>
}

interface UiRectangleProps {
  x: number
  y: number
}

const UiRectangle = styled.div<UiRectangleProps>`
  position: absolute;
  top: ${(props) => props.y}px;
  left: ${(props) => props.x}px;
  width: 200px;
  height: 100px;
  background-color: var(--off-white);
  border: 1px solid black;
  cursor: pointer;

  &.selected {
    border: 3px solid var(--selected);
  }
`

export default Rectangle
