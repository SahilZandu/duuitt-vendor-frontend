// public/firebase-messaging-sw.js

importScripts("https://www.gstatic.com/firebasejs/10.11.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyB07m9C64SABk-tu7d4uMuYjBhR7lcxovA",
  authDomain: "duuittvendorapp.firebaseapp.com",
  projectId: "duuittvendorapp",
  storageBucket: "duuittvendorapp.firebasestorage.app",
  messagingSenderId: "331597982949",
  appId: "1:331597982949:web:234ef01a7d4f668447f80c",
  measurementId: "G-JRGF1V1XZ0"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png" // optional icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
