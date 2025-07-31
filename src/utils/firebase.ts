// src/firebase.ts
import { initializeApp } from "firebase/app";

export { messaging, getToken, onMessage };
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// 🔐 Replace with your actual Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyB07m9C64SABk-tu7d4uMuYjBhR7lcxovA",
    authDomain: "duuittvendorapp.firebaseapp.com",
    projectId: "duuittvendorapp",
    storageBucket: "duuittvendorapp.firebasestorage.app",
    messagingSenderId: "331597982949",
    appId: "1:331597982949:web:234ef01a7d4f668447f80c",
    measurementId: "G-JRGF1V1XZ0"
};

const firebaseApp = initializeApp(firebaseConfig);

const messaging = getMessaging(firebaseApp);



import axiosInstance from "../api/apiInstance";

export const requestNotificationPermissionAndSendToken = async (appUser: any, deviceId: string) => {
    try {
      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const currentToken = await getToken(messaging, {
          vapidKey: "BFm-H7aqWWLpZG1khZWf1m7j3l0E7wL3SOzrhYXV5dV5Kpfkdo2n3-saZrY9uC0IBVbxkbsDEM3eDJuC8n94O5I",
          serviceWorkerRegistration: registration,
        });
  
        if (currentToken) {
          const requestData = {
            vendor_id: appUser?._id ?? appUser?.vendor?._id,
            device_id: deviceId,
            fcm_token: currentToken,
          };
  
          await axiosInstance("post", "vendor/save-vendor-fcm-token", requestData);
          console.log("✅ Token sent to backend");
        } else {
          console.warn("⚠️ No registration token available.");
        }
      } else {
        console.warn("🔒 Permission not granted for notifications.");
      }
    } catch (error) {
      console.error("❌ Error getting FCM token:", error);
    }
  };
  

