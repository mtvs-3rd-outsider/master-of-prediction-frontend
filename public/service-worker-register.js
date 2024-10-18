// service-worker-register.js
if ('serviceWorker' in navigator  && 'PushManager' in window) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
            askPermission();

        })
        .catch((err) => {
            console.error('Service Worker registration failed:', err);
        });
}
function askPermission() {
    return new Promise(function(resolve, reject) {
        const permissionResult = Notification.requestPermission(function(result) {
            resolve(result);
        });

        if (permissionResult) {
            permissionResult.then(resolve, reject);
        }
    })
        .then(function(permissionResult) {
            if (permissionResult !== 'granted') {
                throw new Error('푸시 알림 권한이 거부되었습니다.');
            } else {
            }
        });
}