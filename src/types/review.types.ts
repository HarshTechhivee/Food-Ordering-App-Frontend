
export interface MenuItemReview {
    id: number;
    orderId: number;
    rating: number;
    comment: string | null;
    createdAt: string;
    updatedAt: string;
    user: {
        id: number;
        name: string;
    };
}

export interface ReviewPagination {
    page: number;
    limit: number;
    totalReviews: number;
    totalPages: number;
}

export interface MenuItemReviewResponse {
    reviews: MenuItemReview[];
    pagination: ReviewPagination;
    summary: {
        averageRating: number;
        totalReviews: number;
    };
}

export interface ReviewInput {
    rating: number;
    comment?: string | null;
}
