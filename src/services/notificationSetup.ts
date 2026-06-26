// services/notificationSetup.ts
import { getToken } from "firebase/messaging";
import { messaging } from "../firebase/firebase";
import { requestNotificationPermission } from "../firebase/notificationService";
import { apiPost } from "./api";

const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined;

const getFirebaseMessagingToken = async (): Promise<string | null> => {
  if (!vapidKey) {
    console.warn(
      "VITE_FIREBASE_VAPID_KEY is not set. Firebase messaging token cannot be retrieved."
    );
    return null;
  }

  try {
    return await getToken(messaging, { vapidKey });
  } catch (error) {
    console.error("Failed to get Firebase messaging token", error);
    return null;
  }
};

export const setupNotifications = async () => {
  try {
    if (Notification.permission === "granted") {
      const token = await getFirebaseMessagingToken();
      if (token) {
        await apiPost("/api/notifications/register-token", { token });
      }
      return;
    }

    const token = await requestNotificationPermission();
    if (token) {
      await apiPost("/api/notifications/register-token", { token });
    }
  } catch (error) {
    console.error("Notification setup failed", error);
  }
};