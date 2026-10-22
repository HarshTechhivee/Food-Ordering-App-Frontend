import apiClient from "./api";

import {
    getMessaging,
    isSupported,
    type Messaging,
    getToken,
    onMessage,
} from "firebase/messaging";

import firebaseApp from "../config/firebase";


let unsubscribeForegroundMessages: (() => void) | null = null;

function registerForegroundMessageListener(messaging: Messaging, serviceWorkerRegistration: ServiceWorkerRegistration,): void {

    // Prevent duplicate listeners.
    if (unsubscribeForegroundMessages) {
        return;
    }

    unsubscribeForegroundMessages = onMessage(messaging, (payload) => {
        console.log("Foreground FCM message received:", payload);
        const title = payload.notification?.title ?? "FoodHub";
        const body = payload.notification?.body ?? "";

        if (Notification.permission !== "granted") {
            console.warn(
                "Browser notification permission is not granted.",
            );
            return;
        }

        void serviceWorkerRegistration
            .showNotification(title, { body })
            .catch((error: unknown) => {
                console.error(
                    "Failed to display foreground notification:",
                    error,
                );
            });
    });
}


export async function initializeFirebaseMessaging():
    Promise<{ messaging: Messaging | null; serviceWorkerRegistration: ServiceWorkerRegistration | null; }> {

    if (!("serviceWorker" in navigator)) {
        return {
            messaging: null,
            serviceWorkerRegistration: null,
        };
    }

    const supported = await isSupported();

    if (!supported) {
        return {
            messaging: null,
            serviceWorkerRegistration: null,
        };
    }

    // Register the Firebase messaging service worker.
    await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
        {
            updateViaCache: "none",
        }
    );

    // Wait until the browser has an active service worker.
    const serviceWorkerRegistration =
        await navigator.serviceWorker.ready;

    if (
        !serviceWorkerRegistration.active ||
        serviceWorkerRegistration.active.state !== "activated" ||
        new URL(serviceWorkerRegistration.active.scriptURL).pathname !==
        "/firebase-messaging-sw.js"
    ) {
        throw new Error(
            "Firebase messaging service worker is not active."
        );
    }

    const messaging = getMessaging(firebaseApp);

    console.log("Firebase service worker is active.");

    return {
        messaging,
        serviceWorkerRegistration,
    };
}



export async function enablePushNotifications(): Promise<string | null> {

    if (!("Notification" in window)) {
        return null;
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
        return null;
    }

    const { messaging, serviceWorkerRegistration } = await initializeFirebaseMessaging();

    if (!messaging || !serviceWorkerRegistration) {
        return null;
    }

    registerForegroundMessageListener(messaging, serviceWorkerRegistration,);

    const vapidKey = process.env.FIREBASE_VAPID_KEY;

    if (!vapidKey) {
        throw new Error("Firebase VAPID key is missing.");
    }

    const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration, });

    return token || null;
}


export async function registerPushTokenWithBackend(token: string,): Promise<void> {

    await apiClient.post("/notifications/push-token", { token, });
}


