import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyATPWjimgJdos3oqGVavHfgGzf9pT7RXdc",
  authDomain: "reactnativeproductmanagement.firebaseapp.com",
  projectId: "reactnativeproductmanagement",
  storageBucket: "reactnativeproductmanagement.firebasestorage.app",
  messagingSenderId: "654125263838",
  appId: "1:654125263838:web:cc67f4ffc30a3d5bb18b4f"
};

const app = initializeApp(firebaseConfig);

const auth =
  Platform.OS === "web"
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
      });

const db = getFirestore(app);

export { app, auth, db };