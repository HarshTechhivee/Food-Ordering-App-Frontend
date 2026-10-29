
import { useState, type FormEvent } from "react";
import ConfirmModal from "../common/ConfirmModal";
import { createOrderReview, deleteOrderReview, updateOrderReview, } from "../../services/review.api";
import type { OrderReview } from "../../types/order.types";

interface OrderReviewSectionProps {
    orderId: number;
    initialReview: OrderReview | null;
}

function OrderReviewSection({ orderId, initialReview, }: OrderReviewSectionProps) {

    const [review, setReview] = useState<OrderReview | null>(initialReview);
    const [rating, setRating] = useState(initialReview?.rating ?? 0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState(initialReview?.comment ?? "");

    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // useEffect(() => {
    //     setReview(initialReview);
    //     setRating(initialReview?.rating ?? 0);
    //     setComment(initialReview?.comment ?? "");
    //     setIsEditing(false);
    //     setError(null);
    //     setSuccessMessage(null);
    // }, [orderId, initialReview]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (rating < 1 || rating > 5 || saving) {
            return;
        }

        setSaving(true);
        setError(null);
        setSuccessMessage(null);

        const input = {
            rating,
            comment: comment.trim() || null,
        };

        try {
            const savedReview = review ? await updateOrderReview(review.id, input) : await createOrderReview(orderId, input);

            setReview(savedReview);
            setRating(savedReview.rating);
            setComment(savedReview.comment ?? "");
            setIsEditing(false);

            setSuccessMessage(review ? "Your review has been updated." : "Thank you for sharing your experience!",);

        } catch {
            setError(review ? "We couldn't update your review. Please try again." : "We couldn't submit your review. Please try again.",);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = () => {
        if (!review) {
            return;
        }

        setRating(review.rating);
        setComment(review.comment ?? "");
        setIsEditing(true);
        setError(null);
        setSuccessMessage(null);
    };

    const handleCancelEdit = () => {
        setRating(review?.rating ?? 0);
        setComment(review?.comment ?? "");
        setIsEditing(false);
        setError(null);
    };

    const handleDelete = async () => {
        if (!review || deleting) {
            return;
        }

        setDeleting(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await deleteOrderReview(review.id);

            setReview(null);
            setRating(0);
            setHoverRating(0);
            setComment("");
            setIsEditing(false);
            setShowDeleteModal(false);
            setSuccessMessage("Your review has been deleted.");
        } catch {
            setError("We couldn't delete your review. Please try again.");
            setShowDeleteModal(false);
        } finally {
            setDeleting(false);
        }
    };

    const formVisible = !review || isEditing;

    return (
        <>
            <section
                className="card border-0 shadow-sm rounded-4 order-review-section"
                aria-labelledby="order-review-heading"
            >
                <div className="card-body p-4 p-md-5">
                    <div className="d-flex align-items-start gap-3 mb-4">
                        <div className="bg-warning bg-opacity-10 text-warning rounded-3 d-flex align-items-center justify-content-center foodhub-icon--46 shrink-0">
                            <i className="bi bi-star-fill fs-5" />
                        </div>

                        <div className="grow">
                            <h5
                                id="order-review-heading"
                                className="fw-bold mb-1"
                            >
                                Rate your experience
                            </h5>

                            <p className="text-secondary small mb-0">
                                How was your order? Your feedback helps us
                                improve FoodHub.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="alert alert-danger rounded-3" role="alert">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div
                            className="alert alert-success rounded-3"
                            role="status"
                        >
                            {successMessage}
                        </div>
                    )}

                    {formVisible ? (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="form-label fw-semibold">
                                    Your rating
                                </label>

                                <div
                                    className="d-flex gap-2"
                                    onMouseLeave={() => setHoverRating(0)}
                                    role="group"
                                    aria-label="Choose a rating from 1 to 5 stars"
                                >
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            className="btn p-0 border-0 bg-transparent order-review-star"
                                            aria-label={`Rate ${star} out of 5`}
                                            aria-pressed={rating === star}
                                            onMouseEnter={() =>
                                                setHoverRating(star)
                                            }
                                            onFocus={() => setHoverRating(star)}
                                            onBlur={() => setHoverRating(0)}
                                            onClick={() => setRating(star)}
                                            disabled={saving}
                                        >
                                            <i
                                                className={`bi ${star <= (hoverRating || rating)
                                                    ? "bi-star-fill text-warning"
                                                    : "bi-star text-secondary"
                                                    }`}
                                                aria-hidden="true"
                                            />
                                        </button>
                                    ))}
                                </div>

                                <small className="text-secondary d-block mt-2">
                                    {rating === 0
                                        ? "Select a star rating."
                                        : [
                                            "",
                                            "Poor",
                                            "Fair",
                                            "Good",
                                            "Very good",
                                            "Excellent",
                                        ][rating]}
                                </small>
                            </div>

                            <div className="mb-4">
                                <label
                                    htmlFor={`order-review-comment-${orderId}`}
                                    className="form-label fw-semibold"
                                >
                                    Write a review
                                    <span className="text-secondary fw-normal">
                                        {" "}(optional)
                                    </span>
                                </label>

                                <textarea
                                    id={`order-review-comment-${orderId}`}
                                    className="form-control rounded-3 order-review-textarea"
                                    rows={4}
                                    maxLength={1000}
                                    placeholder="Tell us about your experience..."
                                    value={comment}
                                    onChange={(event) =>
                                        setComment(event.target.value)
                                    }
                                    disabled={saving}
                                />

                                <div className="text-end small text-secondary mt-1">
                                    {comment.length}/1000
                                </div>
                            </div>

                            <div className="d-flex flex-wrap justify-content-end gap-2">
                                {review && isEditing && (
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary rounded-3 px-4"
                                        onClick={handleCancelEdit}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn-primary rounded-3 px-4"
                                    disabled={saving || rating < 1}
                                >
                                    {saving ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Saving...
                                        </>
                                    ) : review ? (
                                        <>
                                            <i className="bi bi-check2 me-2" />
                                            Save changes
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-send me-2" />
                                            Submit review
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div>
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
                                <div>
                                    <div
                                        className="d-flex gap-1 text-warning fs-4"
                                        aria-label={`${review.rating} out of 5 stars`}
                                    >
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <i
                                                key={star}
                                                className={`bi ${star <= review.rating
                                                    ? "bi-star-fill"
                                                    : "bi-star"
                                                    }`}
                                                aria-hidden="true"
                                            />
                                        ))}
                                    </div>

                                    <small className="text-secondary">
                                        Your rating ·{" "}
                                        {new Date(
                                            review.updatedAt,
                                        ).toLocaleDateString()}
                                    </small>
                                </div>

                                <span className="badge rounded-pill text-bg-success">
                                    <i className="bi bi-check-circle me-1" />
                                    Review submitted
                                </span>
                            </div>

                            {review.comment ? (
                                <p className="mb-4 text-body review-comment">
                                    {review.comment}
                                </p>
                            ) : (
                                <p className="mb-4 text-secondary fst-italic">
                                    You submitted a rating without a written comment.
                                </p>
                            )}

                            <div className="d-flex flex-wrap justify-content-end gap-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary rounded-3 px-4"
                                    onClick={handleEdit}
                                >
                                    <i className="bi bi-pencil me-2" />
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-danger rounded-3 px-4"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    <i className="bi bi-trash3 me-2" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <ConfirmModal
                show={showDeleteModal}
                centered
                title="Delete your review?"
                icon="bi-trash3"
                confirmIcon="bi-trash3"
                confirmText="Yes, Delete Review"
                cancelText="Keep Review"
                loadingText="Deleting..."
                confirmButtonClassName="btn-danger rounded-3 py-2"
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
                loading={deleting}
            >
                <p className="text-secondary mb-0">
                    This will permanently delete your review for order #{orderId}.
                    You can submit a new review afterward while the order
                    remains eligible.
                </p>
            </ConfirmModal>
        </>
    );
}

export default OrderReviewSection;
