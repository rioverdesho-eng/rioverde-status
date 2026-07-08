import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB17t0g0atGRoLgcVLtuC0aHsKdvGrb2MII",
  authDomain: "rioverde-status.firebaseapp.com",
  databaseURL: "https://rioverde-status-default-rtdb.firebaseio.com",
  projectId: "rioverde-status",
  storageBucket: "rioverde-status.firebasestorage.app",
  messagingSenderId: "781809569992",
  appId: "1:781809569992:web:a0bb6a676b530d2b3755fd",
  measurementId: "G-6NL7R2JV1P"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
