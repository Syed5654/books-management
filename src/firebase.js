import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.Auth_Domain,
  projectId: process.env.Project_Id,
  storageBucket: process.env.Storage_Bucket,
  messagingSenderId: process.env.Messaging_SenderId,
  appId: process.env.App_Id,
  measurementId: process.env.Mesurement_Id,
};

initializeApp(firebaseConfig);

const db = getFirestore();

export default db;