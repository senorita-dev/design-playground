import { initializeApp, FirebaseOptions, FirebaseApp } from 'firebase/app'

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
}

function initializeFirebase(): FirebaseApp {
  const app = initializeApp(firebaseConfig)
  return app
}

export default initializeFirebase
