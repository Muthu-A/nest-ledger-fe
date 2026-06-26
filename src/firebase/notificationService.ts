import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined;

const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!('serviceWorker' in navigator)) return null;
  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

    // Wait until a service worker is active for the current scope.
    await navigator.serviceWorker.ready;

    const activeRegistration = registration.active || registration.installing || registration.waiting || null;
    if (!activeRegistration) {
      console.warn('No active service worker found after registration.');
      return null;
    }

    return registration;
  } catch (err) {
    console.error('Service worker registration failed:', err);
    return null;
  }
};

const getMessagingToken = async (): Promise<string | null> => {
  if (!vapidKey) {
    console.warn(
      'VITE_FIREBASE_VAPID_KEY is not set. Firebase messaging token cannot be retrieved.'
    );
    return null;
  }

  try {
    const swReg = await registerServiceWorker();
    if (!swReg) {
      console.error('Service worker is not available for FCM token retrieval.');
      return null;
    }

    return await getToken(messaging, { vapidKey, serviceWorkerRegistration: swReg });
  } catch (error) {
    console.error('Failed to get Firebase messaging token', error);
    return null;
  }
};

const shownForegroundMessages = new Set<string>();
const foregroundMessageTtlMs = 5000;

const getPayloadId = (payload: unknown): string | null => {
  if (!payload || typeof payload !== 'object') return null;
  const p = payload as Record<string, unknown>;

  if (typeof p['messageId'] === 'string') return p['messageId'] as string;

  const data = p['data'];
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>;
    if (typeof d['messageId'] === 'string') return d['messageId'] as string;
  }

  const notification = p['notification'];
  if (notification && typeof notification === 'object') {
    const n = notification as Record<string, unknown>;
    if (typeof n['tag'] === 'string') return n['tag'] as string;
    if (typeof n['title'] === 'string') {
      const body = typeof n['body'] === 'string' ? n['body'] : '';
      return `${n['title']}:${body}` as string;
    }
  }

  return null;
};

// Handle foreground messages in the window context
onMessage(messaging, (payload) => {
  // foreground payload received

  const payloadId = getPayloadId(payload);
  if (payloadId && shownForegroundMessages.has(payloadId)) {
    return;
  }

  if (payloadId) {
    shownForegroundMessages.add(payloadId);
    window.setTimeout(() => shownForegroundMessages.delete(payloadId), foregroundMessageTtlMs);
  }

  const title = payload.notification?.title || payload.data?.title;
  const body = payload.notification?.body || payload.data?.body;
  const icon = payload.notification?.icon || payload.data?.icon || '/favicon.svg';

  if (title) {
    try {
      new Notification(title, {
        body: body || '',
        icon,
      });
    } catch (e) {
      console.error('Foreground notification display failed:', e);
    }
  }
});

export const requestNotificationPermission = async (): Promise<string | null> => {
  if (Notification.permission === 'denied') {
    console.warn('Notification permission is blocked in browser settings.');
    return null;
  }

  const permission = await Notification.requestPermission();

  if (permission !== 'granted') {
    console.warn('Notification permission was not granted.', permission);
    return null;
  }

  return await getMessagingToken();
};