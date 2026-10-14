
importScripts("https://www.gstatic.com/firebasejs/13.0.0/firebase-app-compat.js");

importScripts("https://www.gstatic.com/firebasejs/13.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyCNt8rPTknMtP6-IpleoquvM8yzwvSLhro",
    authDomain: "foodhub-825e4.firebaseapp.com",
    projectId: "foodhub-825e4",
    storageBucket: "foodhub-825e4.firebasestorage.app",
    messagingSenderId: "184856158560",
    appId: "1:184856158560:web:b79ff88392d37e1b9f7e05",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Background message:", payload);
});
