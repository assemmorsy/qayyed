import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import "firebase/compat/auth"

const firebaseConfig = {
    apiKey: "AIzaSyC8hY92bl_KhFdAc6t_Bj-1Ao1mJpL61hU",
    authDomain: "qayyed-9cfb3.firebaseapp.com",
    projectId: "qayyed-9cfb3",
    storageBucket: "qayyed-9cfb3.appspot.com",
    messagingSenderId: "204570336663",
    appId: "1:204570336663:web:d454fef6d11e3618f278d2"
};



firebase.initializeApp(firebaseConfig)

const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()
const timestamp = firebase.firestore.FieldValue.serverTimestamp

export { projectAuth, projectFirestore, timestamp }