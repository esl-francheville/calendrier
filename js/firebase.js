const firebaseConfig = {
  apiKey: "AIzaSyAf34FT3GcnXjgFgDSRgjEhyqFY2RHF_mU",
  authDomain: "calendrier-esl.firebaseapp.com",
  projectId: "calendrier-esl",
  storageBucket: "calendrier-esl.firebasestorage.app",
  messagingSenderId: "143570734082",
  appId: "1:143570734082:web:10d90298d356f61bb86b1b"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

console.log("✅ Firebase initialisé avec succès");