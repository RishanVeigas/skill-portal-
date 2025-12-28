import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCrvBXR0IgKNgRBtPan7LSKEsl47uhmo7c",
  authDomain: "student-skill-portal.firebaseapp.com",
  projectId: "student-skill-portal",
  storageBucket: "student-skill-portal.firebasestorage.app",
  messagingSenderId: "218234437446",
  appId: "1:218234437446:web:d021a12afb86dff9cbaf47",
  measurementId: "G-LCZ7WF2HE2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
