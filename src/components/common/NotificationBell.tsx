import { useState } from "react";

import { markAllAsRead, markAsRead, clearNotifications, } from "../../store/slices/notificationSlice.js";

import { useAppDispatch, useAppSelector } from "../../store/hooks.js";

function NotificationBell() {
    
    const dispatch = useAppDispatch();

    const notifications = useAppSelector((state) => state.notifications.notifications);

    const [open, setOpen] = useState(false);

    const unreadCount = notifications.filter((notification) => !notification.read).length;

    const handleNotificationClick = (id: string) => {
        dispatch(markAsRead(id));
    };

    return (
        <div className="position-relative">
            <button
                type="button"
                className="btn btn-light position-relative"
                onClick={() => setOpen((previous) => !previous)}
            >
                <i className="bi bi-bell fs-5"></i>

                {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div
                    className="position-absolute end-0 mt-2 bg-white border rounded shadow"
                    style={{
                        width: "350px",
                        zIndex: 1050,
                    }}
                >
                    <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                        <h6 className="mb-0">Notifications</h6>

                        {notifications.length > 0 && (
                            <button
                                type="button"
                                className="btn btn-sm btn-link text-decoration-none"
                                onClick={() => dispatch(markAllAsRead())}
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                        {notifications.length === 0 ? (
                            <div className="text-center text-muted p-4">
                                No notifications
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-3 border-bottom ${notification.read ? "bg-white" : "bg-light"
                                        }`}
                                    onClick={() =>
                                        handleNotificationClick(notification.id)
                                    }
                                    role="button"
                                >
                                    <div className="d-flex justify-content-between">
                                        <strong>{notification.title}</strong>

                                        {!notification.read && (
                                            <span className="badge bg-primary">
                                                New
                                            </span>
                                        )}
                                    </div>

                                    <div className="small text-muted mt-1">
                                        {notification.message}
                                    </div>

                                    <div className="small text-secondary mt-2">
                                        {new Date(
                                            notification.createdAt
                                        ).toLocaleTimeString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="p-2 border-top text-center">
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => dispatch(clearNotifications())}
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default NotificationBell;