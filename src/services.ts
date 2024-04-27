import initializeFirebase from './services/initializeFirebase'
import { ServiceContextType } from './services/context'
import { FirebaseDatabaseManagerService } from './services/database/FirebaseDatabaseManagerService'

const { firestore } = initializeFirebase()

export const services: ServiceContextType = {
  databaseService: new FirebaseDatabaseManagerService(firestore),
}
