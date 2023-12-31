import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyDY_dATQ02uPAgAYKvbOLsF_rDqGGjPV_o",
  authDomain: "books-management-275ca.firebaseapp.com",
  projectId: "books-management-275ca",
  storageBucket: "books-management-275ca.appspot.com",
  messagingSenderId: "220588650165",
  appId: "1:220588650165:web:6c4214668b02f3b892d8fc",
  measurementId: "G-ZPSKWQLG22",
};

initializeApp(firebaseConfig);

const db = getFirestore();

export default db;