
import type { AIRecommendedItem } from "../../types/ai.types.js";

import { getMenuImageSrc } from "../../utils/menuImage.js";

interface RecommendationCardProps {
    item: AIRecommendedItem;
    isAdded: boolean;
    isAdding: boolean;
    isUnavailable: boolean;
    error: string | null;
    onAddToCart: (item: AIRecommendedItem) => void;
}

export default function RecommendationCard({ item, isAdded, isAdding, isUnavailable, error, onAddToCart, }: RecommendationCardProps) {

    const formatPrice = (price: number) => `₹${price.toLocaleString("en-IN")}`;

    // const imageSrc = getMenuImageSrc(item.image);

    return (
        <article className="ai-recommendation-card">


            <div className="ai-recommendation-image-wrapper">
                {getMenuImageSrc(item.image) ? (
                    <img
                        src={getMenuImageSrc(item.image)!}
                        alt={item.name}
                        className="ai-recommendation-image"
                        loading="lazy"
                        onError={(event) => {
                            event.currentTarget.style.display = "none";
                        }}
                    />
                ) : (
                    <div className="ai-recommendation-image-fallback">
                        <i className="bi bi-egg-fried" />
                    </div>
                )}
            </div>

            <div className="ai-recommendation-details">

                <span className="ai-recommendation-category">
                    {item.category}
                </span>

                <h6 title={item.name}>
                    {item.name}
                </h6>

                <p title={item.description}>
                    {item.description}
                </p>

                <div className="ai-recommendation-price">
                    {formatPrice(item.price)}
                </div>

                <button
                    type="button"
                    className={`ai-recommendation-add-button ${isAdded ? "added" : ""
                        }`}
                    disabled={isAdded || isAdding || isUnavailable}
                    onClick={() => onAddToCart(item)}
                >
                    {isAdding ? (
                        <>
                            <span className="spinner-border spinner-border-sm" />
                            Adding...
                        </>
                    ) : isAdded ? (
                        <>
                            <i className="bi bi-check-lg" />
                            Added
                        </>
                    ) : isUnavailable ? (
                        <>
                            <i className="bi bi-x-circle" />
                            Unavailable
                        </>
                    ) : (
                        <>
                            <i className="bi bi-cart-plus" />
                            Add to Cart
                        </>
                    )}
                </button>

                {error && (
                    <small className="ai-recommendation-error">
                        {error}
                    </small>
                )}

            </div>

        </article>
    );
}
