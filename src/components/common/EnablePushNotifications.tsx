
import { useState } from "react";
import { enablePushNotifications } from "../../services/firebaseMessaging";

function EnablePushNotifications() {

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleEnableNotifications = async () => {

        try {

            setLoading(true);
            setMessage("");

            const token = await enablePushNotifications();

            if (!token) {
                setMessage("Notifications were not enabled.");
                return;
            }

            setMessage("Browser notifications enabled!");

        } catch (error) {

            console.error("Failed to enable push notifications:", error);

            setMessage("Could not enable notifications. Please try again.");

        } finally {

            setLoading(false);

        }
    };

    return (
        <div>
            <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleEnableNotifications}
                disabled={loading}
            >
                {loading ? "Enabling..." : "Enable Notifications"}
            </button>

            {message && (
                <p className="mt-2 mb-0" role="status">
                    {message}
                </p>
            )}
        </div>
    );
}

export default EnablePushNotifications;
