import { getApp, getApps, initializeApp } from "firebase/app"
import { browserLocalPersistence, getAuth } from "firebase/auth"
import { GoogleAuthProvider } from "firebase/auth"

const gAuthProvider = new GoogleAuthProvider()

const firebaseConfig = {
  apiKey: "AIzaSyBHMw-oHtFnWGA0wM1XbbC9k0p_5DM7fCg",
  authDomain: "polyquest-d44db.firebaseapp.com",
  projectId: "polyquest-d44db",
  storageBucket: "polyquest-d44db.appspot.com",
  messagingSenderId: "176393512551",
  appId: "1:176393512551:web:f12bae8c13029da88456c2"
}

const fbApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
const fbAuth = getAuth(fbApp)

fbAuth.setPersistence(browserLocalPersistence)

export { fbApp, fbAuth, gAuthProvider }

export default fbApp
