import styled from 'styled-components'
import { DesignDataMetadata } from 'src/services/database/DatabaseManagerService'

interface LeftBannerProps {
  design: DesignDataMetadata
}

const LeftBanner: React.FC<LeftBannerProps> = ({ design }) => {
  const { name, createdAt } = design
  return (
    <Container>
      <h1>{name}</h1>
      <p>created at {createdAt.toLocaleString()}</p>
    </Container>
  )
}

const Container = styled.div`
  width: 20%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  background-color: var(--off-white);
  text-align: center;
`

export default LeftBanner
