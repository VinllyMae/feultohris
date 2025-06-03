// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
 apiKey: "AIzaSyCnXGIWRWTRvyutxlFHiuSFZ_qawYLvAmw",
  authDomain: "feu-tech001.firebaseapp.com",
  databaseURL: "https://feu-tech001-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "feu-tech001",
  storageBucket: "feu-tech001.firebasestorage.app",
  messagingSenderId: "563901359956",
  appId: "1:563901359956:web:2a944120806cd922848ac1",
  measurementId: "G-369QPLHT5J"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

