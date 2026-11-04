
import type { AIRecommendedItem } from "../../types/ai.types.js";

import RecommendationCard from "./RecommendationCard.js";


interface RecommendationGridProps {
    items: AIRecommendedItem[];

    cartItemIds: number[];
    addingItemIds: number[];
    unavailableItemIds: number[];

    addErrors: Record<number, string>;

    onAddToCart: (item: AIRecommendedItem) => void;
}


export default function RecommendationGrid({
    items,
    cartItemIds,
    addingItemIds,
    unavailableItemIds,
    addErrors,
    onAddToCart,
}: RecommendationGridProps) {

    if (items.length === 0) {
        return null;
    }

    return (
        <section className="ai-recommendation-section">

            <div className="ai-recommendation-section-heading">
                Recommended for you
            </div>

            <div className="ai-recommendation-grid">

                {items.map((item) => (

                    <div
                        className="ai-recommendation-grid-item"
                        key={item.id}
                    >
                        <RecommendationCard
                            item={item}

                            isAdded={cartItemIds.includes(item.id)}
                            isAdding={addingItemIds.includes(item.id)}
                            isUnavailable={unavailableItemIds.includes(item.id)}

                            error={addErrors[item.id] ?? null}

                            onAddToCart={onAddToCart}
                        />
                    </div>

                ))}

            </div>

        </section>
    );
}
