import React from 'react'
import { MockDatabaseManagerService } from './database/MockDatabaseManagerService'
import { DatabaseManagerService } from './database/DatabaseManagerService'

export interface ServiceContextType {
  databaseService: DatabaseManagerService
}

export const ServiceContext = React.createContext<ServiceContextType>({
  databaseService: new MockDatabaseManagerService(),
})
