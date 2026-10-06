import { useEffect } from "react";

interface ToastProps {
    message: string;
    show: boolean;
    onClose: () => void;
    type?: "success" | "danger" | "warning" | "info";
    duration?: number;
}

function Toast({ message, show, onClose, type = "info", duration = 3000, }: ToastProps) {

    useEffect(() => {
        if (!show) return;

        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => {
            clearTimeout(timer);
        };

    }, [show, duration, onClose]);

    if (!show) {
        return null;
    }

    return (
        <div
            className="toast-container position-fixed top-0 end-0 p-3"
            style={{ zIndex: 1080 }}
        >
            <div
                className={`toast show border-0 shadow ${type === "success"
                        ? "text-bg-success"
                        : type === "danger"
                            ? "text-bg-danger"
                            : type === "warning"
                                ? "text-bg-warning"
                                : "text-bg-info"
                    }`}
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
            >
                <div className="d-flex align-items-center">
                    <div className="toast-body d-flex align-items-center gap-3">
                        <i
                            className={`bi ${type === "success"
                                    ? "bi-check-circle-fill"
                                    : type === "danger"
                                        ? "bi-exclamation-circle-fill"
                                        : type === "warning"
                                            ? "bi-exclamation-triangle-fill"
                                            : "bi-info-circle-fill"
                                }`}
                        ></i> 

                        <span style={{textTransform:'capitalize',letterSpacing:'1px'}}>{message}</span>
                    </div>

                    <button
                        type="button"
                        className="btn-close btn-close-white me-2"
                        aria-label="Close"
                        onClick={onClose}
                    ></button>
                </div>
            </div>
        </div>
    );
}

export default Toast;