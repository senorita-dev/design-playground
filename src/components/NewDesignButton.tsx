import { User } from 'firebase/auth'
import React, { useContext } from 'react'
import { ServiceContext } from 'src/services/context'

interface NewDesignButtonProps {
  user: User
}

const NewDesignButton: React.FC<NewDesignButtonProps> = ({ user }) => {
  const { databaseService } = useContext(ServiceContext)
  const handleNewDesign = async () => {
    databaseService.addDesign(user)
  }
  return <button onClick={handleNewDesign}>New design</button>
}

export default NewDesignButton
