import firebase from 'firebase/app'
import 'firebase/firestore'; // If using Firebase database
import 'firebase/storage'; // If using Firebase database

import 'firebase/auth'; // If using Firebase database

var config = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID
};


const app = firebase.initializeApp(config);
const base = app.firestore();
const storage = app.storage();
const facebookProvider = new firebase.auth.FacebookAuthProvider();
const googleProvider = new firebase.auth.GoogleAuthProvider();


export { base, app, storage, facebookProvider, googleProvider }