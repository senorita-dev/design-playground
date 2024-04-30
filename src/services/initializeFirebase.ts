import { initializeApp, FirebaseOptions, FirebaseApp } from 'firebase/app'
import { connectAuthEmulator, getAuth, Auth } from 'firebase/auth'
import {
  getFirestore,
  connectFirestoreEmulator,
  Firestore,
} from 'firebase/firestore'

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
}

interface InitializeFirebaseResult {
  firebaseApp: FirebaseApp
  firestore: Firestore
  auth: Auth
}

function initializeFirebase(): InitializeFirebaseResult {
  const firebaseApp = initializeApp(firebaseConfig)
  const firestore = getFirestore()
  const auth = getAuth()
  if (import.meta.env.DEV) {
    connectFirestoreEmulator(firestore, '127.0.0.1', 8080)
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  }
  return { firebaseApp, firestore, auth }
}

export default initializeFirebase
