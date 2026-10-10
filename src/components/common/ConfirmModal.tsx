interface ConfirmModalProps {
    show: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

function ConfirmModal({ show, title, message, confirmText = "Confirm", cancelText = "Cancel", onConfirm, onCancel, loading = false, }

    : ConfirmModalProps) {

    if (!show) {
        return null;
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="modal-backdrop fade show confirm-modal-backdrop"
            />

            {/* Modal */}
            <div
                className="modal fade show d-block confirm-modal"
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 rounded-4 shadow">

                        {/* Header */}
                        <div className="modal-header border-0 p-4 pb-2">
                            <div className="d-flex align-items-center gap-3">

                                <div
                                    className="bg-danger-subtle text-danger rounded-circle d-flex align-items-center justify-content-center foodhub-icon--44"
                                >
                                    <i className="bi bi-trash3-fill"></i>
                                </div>

                                <h5 className="modal-title fw-bold mb-0">
                                    {title}
                                </h5>

                            </div>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={onCancel}
                                disabled={loading}
                                aria-label="Close"
                            />
                        </div>

                        {/* Body */}
                        <div className="modal-body px-4 py-3">
                            <p className="text-secondary mb-0">
                                {message}
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="modal-footer border-0 p-4 pt-3">

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                {cancelText}
                            </button>

                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={onConfirm}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            aria-hidden="true"
                                        />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-trash3 me-2" />
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