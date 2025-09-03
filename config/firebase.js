import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDGPshkbz_6rFT6G-9r5XvjL5I0YUf0uuY",
  authDomain: "wedding-planner-9fe6c.firebaseapp.com",
  projectId: "wedding-planner-9fe6c",
  storageBucket: "wedding-planner-9fe6c.firebasestorage.app",
  messagingSenderId: "115779087647",
  appId: "1:115779087647:web:03535dec93b93fea70d42a",
  measurementId: "G-R9JKV1EBGM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with React Native persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore
export const db = getFirestore(app);
