import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyArg9yg8jYf6IjayH8cuHWcK67nundYpi8",
  authDomain: "gallery-app-96.firebaseapp.com",
  projectId: "gallery-app-96",
  storageBucket: "gallery-app-96.appspot.com",
  messagingSenderId: "544992313282",
  appId: "1:544992313282:web:8e927a1ad0abb2686d205b"
}

const firebaseApp = firebase.apps.length
                    ? firebase.app()
                    : firebase.initializeApp(firebaseConfig)

const db = firebaseApp.firestore()
const bucket = firebase.storage()
const provider = new firebase.auth.GoogleAuthProvider()
const auth = firebase.auth()

export { db, bucket, provider, auth }