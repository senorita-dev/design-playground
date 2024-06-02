import React from 'react'
import { MockDatabaseManagerService } from './database/MockDatabaseManagerService'
import { DatabaseManagerService } from './database/DatabaseManagerService'
import { UserManagerService } from './auth/UserManagerService'
import { MockUserManagerService } from './auth/MockUserManagerService'

export interface ServiceContextType {
  databaseService: DatabaseManagerService
  userService: UserManagerService
}

export const ServiceContext = React.createContext<ServiceContextType>({
  databaseService: new MockDatabaseManagerService(),
  userService: new MockUserManagerService(),
})
