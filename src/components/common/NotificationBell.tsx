
import { useEffect, useRef, useState } from "react";

import {
    markAllAsRead,
    markAsRead,
    clearNotifications,
} from "../../store/slices/notificationSlice.js";

import {
    useAppDispatch,
    useAppSelector,
} from "../../store/hooks.js";

function NotificationBell() {
    const dispatch = useAppDispatch();

    const notifications = useAppSelector(
        (state) => state.notifications.notifications
    );

    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length;

    useEffect(() => {
        if (!open) return;

        const handleOutsideClick = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [open]);


    const handleNotificationClick = (id: string) => {
        dispatch(markAsRead(id));
    };

    return (
        <div
            ref={containerRef}
            className="position-relative notification-container"
        >
            <button
                type="button"
                className="btn notification-bell-button position-relative"
                onClick={() => setOpen((previous) => !previous)}
                aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
                aria-expanded={open}
                aria-haspopup="dialog"
            >
                <i className="bi bi-bell fs-5" />

                {unreadCount > 0 && (
                    <span className="notification-count">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <section
                    className="notification-dropdown"
                    role="dialog"
                    aria-label="Notifications"
                >
                    <div className="notification-header">
                        <div>
                            <h6 className="mb-1 fw-bold">Notifications</h6>
                            <small className="text-secondary">
                                {unreadCount > 0
                                    ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
                                    : "You're all caught up"}
                            </small>
                        </div>

                        {notifications.length > 0 && (
                            <div className="notification-toolbar">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-link text-decoration-none p-0"
                                    disabled={unreadCount === 0}
                                    onClick={() => dispatch(markAllAsRead())}
                                >
                                    Mark all as read
                                </button>
                            </div>
                        )}

                        <button
                            type="button"
                            className="btn-close flex-shrink-0"
                            aria-label="Close notifications"
                            onClick={() => setOpen(false)}
                        />
                    </div>

                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <div className="notification-empty">
                                <div className="notification-empty-icon">
                                    <i className="bi bi-bell-slash" />
                                </div>
                                <h6 className="fw-semibold mb-1">
                                    No notifications yet
                                </h6>
                                <p className="text-secondary small mb-0">
                                    Updates will appear here.
                                </p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <button
                                    key={notification.id}
                                    type="button"
                                    className={`notification-item ${notification.read ? "" : "unread"
                                        }`}
                                    onClick={() =>
                                        handleNotificationClick(notification.id)
                                    }
                                >
                                    <span
                                        className={`notification-item-icon ${notification.read
                                            ? "read"
                                            : "unread"
                                            }`}
                                    >
                                        <i className="bi bi-bell" />
                                    </span>

                                    <span className="notification-item-content">
                                        <span className="d-flex justify-content-between align-items-start gap-2">
                                            <strong className="notification-item-title">
                                                {notification.title}
                                            </strong>

                                            {!notification.read && (
                                                <span className="notification-unread-dot" />
                                            )}
                                        </span>

                                        <span className="notification-message">
                                            {notification.message}
                                        </span>

                                        <span className="notification-time">
                                            {new Date(
                                                notification.createdAt
                                            ).toLocaleString()}
                                        </span>
                                    </span>
                                </button>
                            ))
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="notification-footer">
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                    dispatch(clearNotifications())
                                }
                            >
                                <i className="bi bi-trash3 me-2" />
                                Clear all
                            </button>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}

export default NotificationBell;
