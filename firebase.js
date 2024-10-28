import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyClN-ihXJnqstg4KAHbCj6mbqbjOJFckyY",
  authDomain: "tinde-fire.firebaseapp.com",
  projectId: "tinde-fire",
  storageBucket: "tinde-fire.appspot.com",
  messagingSenderId: "905192686231",
  appId: "1:905192686231:web:db5be130bae5df7a6edfd2",
  measurementId: "G-LYFM0L3Z15",
};

//initialization
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { app, auth, db };
