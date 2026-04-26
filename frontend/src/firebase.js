// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIEI2swQGrQyfgVuEtMR53OXPMlFfV4vg",
  authDomain: "telemedicine-prescrenner.firebaseapp.com",
  projectId: "telemedicine-prescrenner",
  storageBucket: "telemedicine-prescrenner.firebasestorage.app",
  messagingSenderId: "314572964936",
  appId: "1:314572964936:web:cc0fb22dddb1070412447d",
  measurementId: "G-WX7JEKTHDL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Analytics may fail in local dev or when blocked; make it safe
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch {
  // analytics not available
}

export { app, auth, analytics };
