import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAGcxJv9JAvN7fE56bitCyQOexsP-h7AuU",
  authDomain: "appif-ae840.firebaseapp.com",
  databaseURL: "https://appif-ae840-default-rtdb.firebaseio.com",
  projectId: "appif-ae840",
  storageBucket: "appif-ae840.firebasestorage.app",
  messagingSenderId: "12822829950",
  appId: "1:12822829950:web:9974f2ba998d3d9c35b12f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);