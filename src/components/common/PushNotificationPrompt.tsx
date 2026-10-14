import { useEffect } from "react";
import { enablePushNotifications, registerPushTokenWithBackend, } from "../../services/firebaseMessaging";


interface PushNotificationPromptProps {
    userKey?: string;
}

function PushNotificationPrompt({ userKey, }: PushNotificationPromptProps) {

    useEffect(() => {
        if (!userKey || !("Notification" in window)) {
            return;
        }

        const permission = Notification.permission;

        // Permission was previously blocked.
        if (permission === "denied") {
            return;
        }

        // If already allowed, initialize Firebase and get the token.
        // If undecided, ask the browser for permission.
        const sessionKey = `foodhub-push-prompted:${userKey}`;

        if (permission === "default" && sessionStorage.getItem(sessionKey)) {
            return;
        }

        if (permission === "default") {
            sessionStorage.setItem(sessionKey, "true");
        }

        void enablePushNotifications()
            .then(async (token) => {
                if (!token) {
                    return;
                }

                await registerPushTokenWithBackend(token);
                console.log("Push token registered with FoodHub.");
            })
            .catch((error: unknown) => {
                console.error("Could not register browser notifications:", error);
            });

    }, [userKey]);

    return null;
}

export default PushNotificationPrompt;
