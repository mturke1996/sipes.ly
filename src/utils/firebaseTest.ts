import { db, auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// Test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log("Testing Firebase connection...");

    // Test Firestore connection
    const testCollection = collection(db, "test");
    const snapshot = await getDocs(testCollection);
    console.log("✅ Firestore connection successful");

    // Test Auth connection
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        console.log("✅ Auth connection successful");
        resolve(true);
      });
    });
  } catch (error) {
    console.error("❌ Firebase connection failed:", error);
    return false;
  }
};

// Test function to be called from components
export const initializeFirebase = async () => {
  const isConnected = await testFirebaseConnection();
  if (isConnected) {
    console.log("🎉 Firebase is ready for SIPES Libya!");
  }
  return isConnected;
};
