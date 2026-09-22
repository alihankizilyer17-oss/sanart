import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCH_7lFir47sb0ugTXIeT4NI7qBXBoAd1M",
  authDomain: "sanart012026.firebaseapp.com",
  projectId: "sanart012026",
  storageBucket: "sanart012026.firebasestorage.app",
  messagingSenderId: "347783826123",
  appId: "1:347783826123:web:b41ed118472d0e267ae94e",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
