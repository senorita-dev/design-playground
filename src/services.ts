import initializeFirebase from './services/initializeFirebase'
import { ServiceContextType } from './services/context'
import { FirebaseDatabaseManagerService } from './services/database/FirebaseDatabaseManagerService'
import { FirebaseUserManagerService } from './services/auth/FirebaseUserManagerService'

const { firestore, auth } = initializeFirebase()

export const services: ServiceContextType = {
  databaseService: new FirebaseDatabaseManagerService(firestore),
  userService: new FirebaseUserManagerService(auth),
}
