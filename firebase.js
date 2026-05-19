import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAR0Zji-W9ZnggQMWsEcqnQzU9n7MqxOYc",
  authDomain: "study-self-management-app.firebaseapp.com",
  projectId: "study-self-management-app",
  storageBucket: "study-self-management-app.firebasestorage.app",
  messagingSenderId: "522304038106",
  appId: "1:522304038106:web:d1be0ea1c5e85035ae71e3",
  measurementId: "G-PKKJG6Y71Z"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);