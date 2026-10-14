
import type { ReactNode } from "react";
import useBodyScrollLock from "../hooks/useBodyScrollLock";

interface ConfirmModalProps {
    show: boolean;
    title: string;
    message?: string;
    children?: ReactNode;

    confirmText?: string;
    cancelText?: string;
    loadingText?: string;

    icon?: string;
    confirmButtonClassName?: string;
    showCancelButton?: boolean;
    showCloseButton?: boolean;

    centered?: boolean;
    confirmIcon?: string;

    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
    confirmDisabled?: boolean;
}

function ConfirmModal({
    show,
    title,
    message,
    children,
    confirmText = "Confirm",
    cancelText = "Cancel",
    loadingText = "Processing...",
    icon = "bi-trash3",
    confirmButtonClassName = "btn-danger",
    showCancelButton = true,
    showCloseButton = true,
    centered = false,
    confirmIcon = "bi-trash3",
    onConfirm,
    onCancel,
    loading = false,
    confirmDisabled = false,
}: ConfirmModalProps) {

    useBodyScrollLock(show);

    if (!show) {
        return null;
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="modal-backdrop fade show confirm-modal-backdrop"
                onClick={() => {
                    if (!loading) {
                        onCancel();
                    }
                }}
            />

            {/* Modal */}
            <div
                className="modal fade show d-block confirm-modal"
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-label={title}
            >
                <div className="modal-dialog modal-dialog-centered confirm-modal-dialog">
                    <div className="modal-content border-0 rounded-4 shadow">
                        {/* Header */}
                        <div className={`modal-header border-0 p-4 pb-2 ${centered ? "justify-content-center text-center" : ""}`} >
                            <div className="d-flex align-items-center gap-3 min-w-0">
                                <div
                                    className={`bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center foodhub-icon--44 flex-shrink-0 ${centered ? "mx-auto" : ""
                                        }`}
                                >
                                    <i className={`bi ${icon}`} aria-hidden="true" />
                                </div>

                                <h5
                                    className={`modal-title fw-bold mb-0 ${centered ? "text-center" : ""
                                        }`}
                                >
                                    {title}
                                </h5>
                            </div>

                            {showCloseButton && (
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={onCancel}
                                    disabled={loading}
                                    aria-label="Close"
                                />
                            )}
                        </div>

                        {/* Body */}
                        <div className="modal-body px-4 py-3 confirm-modal-body">
                            {message && (
                                <p className="text-secondary mb-3">
                                    {message}
                                </p>
                            )}

                            {children}
                        </div>

                        {/* Footer */}
                        <div className="modal-footer border-0 p-4 pt-3">
                            {showCancelButton && (
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={onCancel}
                                    disabled={loading}
                                >
                                    {cancelText}
                                </button>
                            )}

                            <button
                                type="button"
                                className={`btn ${confirmButtonClassName}`}
                                onClick={onConfirm}
                                disabled={loading || confirmDisabled}
                            >
                                {loading ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            aria-hidden="true"
                                        />
                                        {loadingText}
                                    </>
                                ) : (
                                    <>
                                        <i className={`bi ${confirmIcon} me-2`} aria-hidden="true" />
                                        {confirmText}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ConfirmModal;