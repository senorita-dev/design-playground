import { useContext } from 'react'
import { ServiceContext } from 'src/services/context'

const NewDesignButton = () => {
  const { databaseService } = useContext(ServiceContext)
  const handleNewDesign = async () => {
    databaseService.addDesign()
  }
  return <button onClick={handleNewDesign}>New design</button>
}

export default NewDesignButton
