
export type AIIntent =
    | "menu_question"
    | "budget_recommendation"
    | "food_preference"
    | "dish_comparison"
    | "other";

export type AIMessageRole = "USER" | "ASSISTANT";

export interface AIChatRequest {
    message: string;
    conversationId?: number;
}

export interface AIRecommendedItem {
    id: number;
    name: string;
    description: string;
    category: string;
    price: number;
    image: string | null;
}

export interface AIChatResult {
    conversationId: number;
    intent: AIIntent;
    reply: string;
    recommendedItems: AIRecommendedItem[];
}

export interface AIConversationPreview {
    role: AIMessageRole;
    content: string;
    createdAt: string;
}

export interface AIConversation {
    id: number;
    title: string | null;
    createdAt: string;
    updatedAt: string;
    messageCount: number;
    lastMessage: AIConversationPreview | null;
}

export interface AIPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    hasMore?: boolean;
}

export interface AIConversationsResponse {
    conversations: AIConversation[];
    pagination: AIPagination;
}

export interface AIMessageMetadata {
    intent?: AIIntent;
    recommendedItems?: AIRecommendedItem[];
}

export interface AIConversationMessage {
    id: number;
    role: AIMessageRole;
    content: string;
    metadata: AIMessageMetadata | null;
    createdAt: string;
}

export interface AIConversationMessagesResponse {
    conversation: {
        id: number;
        title: string | null;
        createdAt: string;
        updatedAt: string;
    };
    messages: AIConversationMessage[];
    pagination: AIPagination;
}
