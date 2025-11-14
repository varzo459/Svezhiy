// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBGqmjY0e7SeaRS1hgAFtp05158mvkGPe8",
  authDomain: "svezhiy.firebaseapp.com",
  projectId: "svezhiy",
  storageBucket: "svezhiy.firebasestorage.app",
  messagingSenderId: "783827411442",
  appId: "1:783827411442:web:56c95adc735a3ce19ecb6b",
  measurementId: "G-MJMVMVL2Z5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore автоматически использует кэш по умолчанию
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
