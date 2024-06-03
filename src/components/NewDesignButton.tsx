import { User } from 'firebase/auth'
import React, { useContext } from 'react'
import { ServiceContext } from 'src/services/context'
import { useObservable } from 'src/utils/hooks'

interface NewDesignButtonProps {
  user: User
}

const NewDesignButton: React.FC<NewDesignButtonProps> = ({ user }) => {
  const { databaseService } = useContext(ServiceContext)
  const designs = useObservable(databaseService.observeDesigns(user)) ?? []
  const index = designs.length + 1
  const name = `Design ${index}`
  const handleNewDesign = async () => {
    databaseService.createDesign(user, name)
  }
  return <button onClick={handleNewDesign}>New design</button>
}

export default NewDesignButton
