
import { useCallback, useEffect, useState } from "react";
import { socket } from "../../services/socket.js";
import { getMenuItemReviews } from "../../services/review.api";
import type { MenuItem } from "../../types/menu.types";
import type { MenuItemReviewResponse } from "../../types/review.types";
import type { MenuRatingUpdate } from "../../types/menu.types";
import useBodyScrollLock from "../hooks/useBodyScrollLock.js";

interface MenuReviewsModalProps {
    menuItem: MenuItem | null;
    onClose: () => void;
}

const REVIEWS_PER_PAGE = 5;

function MenuReviewsModal({ menuItem, onClose, }: MenuReviewsModalProps) {

    const menuItemId = menuItem?.id;

    const [result, setResult] = useState<MenuItemReviewResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useBodyScrollLock(menuItem !== null);

    const loadReviews = useCallback(
        async (page: number, append: boolean) => {
            if (menuItemId === undefined) {
                return;
            }

            if (append) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            setError(null);

            try {
                const response = await getMenuItemReviews(
                    menuItemId,
                    page,
                    REVIEWS_PER_PAGE,
                );

                setResult((current) => ({
                    ...response,
                    reviews:
                        append && current
                            ? [...current.reviews, ...response.reviews]
                            : response.reviews,
                }));
            } catch {
                setError(
                    "We couldn't load the reviews. Please try again.",
                );
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        [menuItemId],
    );

    useEffect(() => {
        if (menuItemId === undefined) {
            setResult(null);
            setError(null);
            return;
        }

        setResult(null);
        void loadReviews(1, false);
    }, [menuItemId, loadReviews]);

    // Refresh the open modal if a review changes in another session.
    useEffect(() => {
        if (menuItemId === undefined) {
            return;
        }

        const handleRatingUpdated = (data: { items: MenuRatingUpdate[]; }) => {

            if (data.items?.some((item) => item.menuItemId === menuItemId,)) {
                void loadReviews(1, false);
            }
        };

        socket.on("menu:rating-updated", handleRatingUpdated);

        return () => {
            socket.off("menu:rating-updated", handleRatingUpdated);
        };
    }, [menuItemId, loadReviews]);

    // Allow keyboard users to close the modal with Escape.
    useEffect(() => {
        if (!menuItem) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [menuItem, onClose]);

    if (!menuItem) {
        return null;
    }

    const summary = result?.summary;
    const reviews = result?.reviews ?? [];
    const pagination = result?.pagination;

    return (
        <>
            <div
                className="modal-backdrop fade show"
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                className="modal fade show d-block"
                role="dialog"
                aria-modal="true"
                aria-labelledby="menu-reviews-title"
                tabIndex={-1}
                onMouseDown={(event) => {
                    if (event.target === event.currentTarget) {
                        onClose();
                    }
                }}
            >
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div className="modal-content border-0 rounded-4 shadow">
                        <div className="modal-header border-0 px-4 pt-4 pb-2">
                            <div>
                                <span className="badge text-bg-primary mb-2">
                                    CUSTOMER REVIEWS
                                </span>

                                <h5
                                    id="menu-reviews-title"
                                    className="modal-title fw-bold"
                                >
                                    Reviews for {menuItem.name}
                                </h5>

                                <p className="text-secondary small mb-0 mt-1">
                                    See what customers think about this item.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                                aria-label="Close reviews"
                            />
                        </div>

                        <div
                            className="modal-body px-4 pb-4 d-flex flex-column"
                            style={{
                                overflow: "hidden",
                                minHeight: 0,
                            }}
                        >
                            {loading && !result && (
                                <div
                                    className="text-center py-5"
                                    role="status"
                                >
                                    <div className="spinner-border text-primary mb-3" />
                                    <p className="text-secondary mb-0">
                                        Loading reviews...
                                    </p>
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-warning rounded-3">
                                    <p className="mb-2">{error}</p>

                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() =>
                                            void loadReviews(1, false)
                                        }
                                        disabled={loading}
                                    >
                                        Try again
                                    </button>
                                </div>
                            )}

                            {result && (
                                <>
                                    <div className="bg-light rounded-4 p-4 mb-4 flex-shrink-0">
                                        <div className="row align-items-center g-3">
                                            <div className="col-auto text-center">
                                                {summary &&
                                                    summary.totalReviews > 0 ? (
                                                    <>
                                                        <div className="display-5 fw-bold">
                                                            {summary.averageRating.toFixed(1)}
                                                        </div>

                                                        <div className="text-warning mb-1"
                                                            aria-label={`${summary.averageRating} out of 5 stars`}
                                                        >
                                                            {Array.from({ length: 5 }, (_, index) => (
                                                                <i key={index} className={`bi 
                                                                    ${index < Math.round(summary.averageRating,) ?
                                                                        "bi-star-fill" : "bi-star"} me-1`} />
                                                            ),)}
                                                        </div>

                                                        <small className="text-secondary">
                                                            {summary.totalReviews}{" "}
                                                            {summary.totalReviews === 1 ? "review" : "reviews"}
                                                        </small>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="display-6 fw-bold text-secondary">
                                                            —
                                                        </div>
                                                        <small className="text-secondary">
                                                            No ratings yet
                                                        </small>
                                                    </>
                                                )}
                                            </div>

                                            <div className="col">
                                                <h6 className="fw-bold mb-1">
                                                    Overall rating
                                                </h6>
                                                <p className="text-secondary small mb-0">
                                                    Ratings come from delivered
                                                    orders containing this item.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <h6 className="fw-bold mb-0">
                                            Customer experiences
                                        </h6>

                                        <span className="text-secondary small">
                                            {summary?.totalReviews ?? 0} total
                                        </span>
                                    </div>

                                    {/* Only this section scrolls */}
                                    <div
                                        className="flex-grow-1"
                                        style={{ minHeight: 0, overflowY: "auto", overscrollBehavior: "contain", }}
                                    >

                                        {reviews.length === 0 && !loading && (
                                            <div className="text-center py-4">
                                                <div className="rounded-circle bg-light d-inline-flex align-items-center 
                                                                justify-content-center mb-3 foodhub-icon--46">
                                                    <i className="bi bi-chat-square-text fs-4 text-secondary" />
                                                </div>

                                                <h6 className="fw-bold">
                                                    No reviews yet
                                                </h6>

                                                <p className="text-secondary small mb-0">
                                                    Customer reviews will appear here
                                                    after a delivered order is reviewed.
                                                </p>
                                            </div>
                                        )}

                                        <div className="d-flex flex-column gap-3">
                                            {reviews.map((review) => (
                                                <article
                                                    key={review.id}
                                                    className="border rounded-4 p-3"
                                                >
                                                    <div className="d-flex align-items-start gap-3">
                                                        <div className="rounded-circle bg-primary bg-opacity-10 text-primary 
                                                                        d-flex align-items-center justify-content-center 
                                                                        flex-shrink-0 foodhub-icon--46">
                                                            <i className="bi bi-person fs-5" />
                                                        </div>

                                                        <div className="flex-grow-1 min-w-0">
                                                            <div className="d-flex flex-wrap align-items-center 
                                                                            justify-content-between gap-2">
                                                                <strong>
                                                                    {review.user.name}
                                                                </strong>

                                                                <small className="text-secondary">
                                                                    {new Date(review.createdAt,).toLocaleDateString()}
                                                                </small>
                                                            </div>

                                                            <div
                                                                className="text-warning small my-2"
                                                                aria-label={`${review.rating} out of 5 stars`}
                                                            >
                                                                {Array.from({ length: 5 }, (_, index) => (
                                                                    <i key={index}
                                                                        className={`bi ${index < review.rating ?
                                                                            "bi-star-fill" : "bi-star"} me-1`}
                                                                    />
                                                                ),)}
                                                            </div>

                                                            {review.comment ? (
                                                                <p className="mb-0 text-secondary review-comment">
                                                                    {review.comment}
                                                                </p>
                                                            ) : (
                                                                <p className="mb-0 text-secondary small fst-italic">
                                                                    Rating only; no written comment.
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </article>
                                            ))}
                                        </div>

                                        {pagination &&
                                            pagination.page <
                                            pagination.totalPages && (
                                                <div className="text-center mt-4">
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-primary rounded-3 px-4"
                                                        onClick={() => void loadReviews(pagination.page + 1, true,)}
                                                        disabled={loadingMore}
                                                    >
                                                        {loadingMore ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-2" />
                                                                Loading...
                                                            </>
                                                        ) : (
                                                            "Load more reviews"
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MenuReviewsModal;
