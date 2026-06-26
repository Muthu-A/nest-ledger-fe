importScripts(
  "https://www.gstatic.com/firebasejs/12.15.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.15.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCnwddlplydlqbYUzhrF05tZkZHNNCBHk4",
  authDomain: "nestledger-7d0a0.firebaseapp.com",
  projectId: "nestledger-7d0a0",
  storageBucket: "nestledger-7d0a0.appspot.com",
  messagingSenderId: "819155537161",
  appId: "1:819155537161:web:df8dab72fd84e703b217d8",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {

  const dataPayload = payload.data || {};
  self.registration.showNotification(
    dataPayload.title || "NestLedger",
    {
      body: dataPayload.body || "",
      icon: "/favicon.svg",
      badge: "/favicon.svg",
      tag: dataPayload.tag || payload.messageId,
      data: dataPayload,
      requireInteraction: true,
    }
  );
});

self.addEventListener('push', (event) => {
  const payload = event.data?.json?.() || {};

  // If FCM already contains a notification payload, skip manual display to avoid duplicates.
  if (payload.notification?.title || payload.notification?.body) {
    return;
  }

  const dataPayload = payload.data || {};
  const title = dataPayload.title || 'NestLedger';
  const body = dataPayload.body || '';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: dataPayload.tag || payload.messageId || 'nestledger-background',
      data: dataPayload,
    })
  );
});

// Note: foreground message handling must run in the window context
// (e.g. in your React app). Do not import modular Firebase APIs here.

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const clickAction = event.notification.data?.clickAction || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if app is already open
      for (let client of clientList) {
        if (client.url === clickAction && 'focus' in client) {
          return client.focus();
        }
      }

      // App not open, open new window
      if (clients.openWindow) {
        return clients.openWindow(clickAction);
      }
    })
  );
});