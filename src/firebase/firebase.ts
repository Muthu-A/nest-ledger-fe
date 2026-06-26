// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnwddlplydlqbYUzhrF05tZkZHNNCBHk4",
  authDomain: "nestledger-7d0a0.firebaseapp.com",
  projectId: "nestledger-7d0a0",
  storageBucket: "nestledger-7d0a0.firebasestorage.app",
  messagingSenderId: "819155537161",
  appId: "1:819155537161:web:df8dab72fd84e703b217d8",
  measurementId: "G-YFMEXCV6E8",
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const messaging = getMessaging(app);
