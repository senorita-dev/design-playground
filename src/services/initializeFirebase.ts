import { initializeApp, FirebaseOptions, FirebaseApp } from 'firebase/app'
import {
  getFirestore,
  connectFirestoreEmulator,
  Firestore,
} from 'firebase/firestore'

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
}

interface InitializeFirebaseResult {
  firebaseApp: FirebaseApp
  firestore: Firestore
}

function initializeFirebase(): InitializeFirebaseResult {
  const firebaseApp = initializeApp(firebaseConfig)
  const firestore = getFirestore()
  if (import.meta.env.DEV) {
    connectFirestoreEmulator(firestore, '127.0.0.1', 8080)
  }
  return { firebaseApp, firestore }
}

export default initializeFirebase
