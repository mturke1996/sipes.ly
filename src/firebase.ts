import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration - SIPES Libya Project
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyCjvRiq7RJneaWxFOd90w03UivYTycZSrs",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sipesly.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sipesly",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sipesly.appspot.com",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "77002055557",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:77002055557:web:sipesly",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage
export const storage = getStorage(app);

export default app;
