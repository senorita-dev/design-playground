import initializeFirebase from './services/initializeFirebase'
import { ServiceContextType } from './services/context'
import { FirebaseDatabaseManagerService } from './services/database/FirebaseDatabaseManagerService'

const firebaseApp = initializeFirebase()

export const services: ServiceContextType = {
  databaseService: new FirebaseDatabaseManagerService(firebaseApp),
}
