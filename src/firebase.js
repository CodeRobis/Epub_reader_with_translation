import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged  } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCs-WHwuFu-oIVFj1-ExiqNyOhf96jUzf0",
  authDomain: "epub-reader-3ed06.firebaseapp.com",
  projectId: "epub-reader-3ed06",
  storageBucket: "epub-reader-3ed06.appspot.com",
  messagingSenderId: "655077126447",
  appId: "1:655077126447:web:22f1e2f2bc60924be0b1da",
  measurementId: "G-NPZ4QCT46R"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const storage = getStorage();

export { app, analytics, auth, storage, onAuthStateChanged };
