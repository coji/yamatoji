import { getApps, getApp, initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

const isEmulator = () => {
  const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR
  return !!(
    useEmulator &&
    useEmulator === 'true' &&
    process.env.NODE_ENV !== 'production'
  )
}

export const config = {
  apiKey: 'AIzaSyA9rbQUyd_kdtwIKAR_TMQgTqJalzf-LLs',
  authDomain: 'yamatoji-3424c.firebaseapp.com',
  projectId: 'yamatoji-3424c',
  storageBucket: 'yamatoji-3424c.appspot.com',
  messagingSenderId: '312147418916',
  appId: '1:312147418916:web:73f1b6dc44f44d88299db1',
  measurementId: 'G-KVFX9M5ZG6'
}

const isInitializing = getApps().length === 0
const app = getApps().length ? getApp() : initializeApp(config)
const auth = getAuth(app)
const firestore = getFirestore(app)

if (isEmulator() && isInitializing) {
  connectAuthEmulator(auth, 'http://localhost:9099')
  connectFirestoreEmulator(firestore, 'localhost', 8080)
}

export { app, auth, firestore }
