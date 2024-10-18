
importScripts('https://www.gstatic.com/firebasejs/10.4.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.4.0/firebase-messaging-compat.js')


const firebaseConfig = {
    apiKey: "AIzaSyBRxGXjdHMYSssRJn2Y8BmPBMcT59akgt8",
    authDomain: "master-of-prediction-384d0.firebaseapp.com",
    projectId: "master-of-prediction-384d0",
    storageBucket: "master-of-prediction-384d0.appspot.com",
    messagingSenderId: "989843402526",
    appId: "1:989843402526:web:1da513d205c118dacb630f",
    measurementId: "G-3CZK9Z9LVB"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();


console.log("firebase-worker")

//백그라운드 서비스워커 설정
messaging.onBackgroundMessage(messaging, (payload) => {
    console.log(
        "[firebase-messaging-sw.js] Received background message ",
        payload
    );

    console.log('Message received. ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "/icon/icon-512x512.png",
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

