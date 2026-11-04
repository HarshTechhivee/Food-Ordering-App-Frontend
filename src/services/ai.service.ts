
import apiClient from "./api.js";

import type { AIChatRequest, AIChatResult, AIConversationsResponse, AIConversationMessagesResponse, } from "../types/ai.types.js";

interface APIResponse<T> {
    success: boolean;
    data: T;
}

// --------------------------------------------------
// Send a message to FoodHub AI
// --------------------------------------------------

export const sendAIMessage = async (payload: AIChatRequest): Promise<AIChatResult> => {

    const response = await apiClient.post<APIResponse<AIChatResult>>("/ai/chat", payload);

    return response.data.data;
};

// --------------------------------------------------
// Get conversations
// --------------------------------------------------

export const getAIConversations = async (page = 1, limit = 10): Promise<AIConversationsResponse> => {

    const response = await apiClient.get<APIResponse<AIConversationsResponse>>("/ai/conversations", { params: { page, limit }, });

    return response.data.data;
};

// --------------------------------------------------
// Get messages from a conversation
// --------------------------------------------------

export const getAIConversationMessages = async (conversationId: number, page = 1, limit = 30): Promise<AIConversationMessagesResponse> => {

    const response = await apiClient.get<APIResponse<AIConversationMessagesResponse>>(
        `/ai/conversations/${conversationId}/messages`,
        {
            params: { page, limit },
        }
    );

    return response.data.data;
};
