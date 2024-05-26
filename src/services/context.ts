import React from 'react'
import { MockDatabaseManagerService } from './database/MockDatabaseManagerService'
import { DatabaseManagerService } from './database/DatabaseManagerService'
import { UserManagerService } from './auth/UserManagerService'
import { MockUserManagerService } from './auth/MockUserManagerService'
import { DesignManagerService } from './design/DesignManagerService'
import { MockDesignManagerService } from './design/MockDesignManagerService'

export interface ServiceContextType {
  designService: DesignManagerService
  databaseService: DatabaseManagerService
  userService: UserManagerService
}

export const ServiceContext = React.createContext<ServiceContextType>({
  designService: new MockDesignManagerService(),
  databaseService: new MockDatabaseManagerService(),
  userService: new MockUserManagerService(),
})
