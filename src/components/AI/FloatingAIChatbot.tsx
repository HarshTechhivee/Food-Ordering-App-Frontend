
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

import ChatbotLauncher from "./ChatbotLauncher.js";
import ChatbotWindow from "./ChatbotWindow.js";
import type { ChatbotMessage } from "./ChatbotWindow.js";

import {
    getAIConversations,
    getAIConversationMessages,
    sendAIMessage,
} from "../../services/ai.service.js";

import { getMenu } from "../../services/menu.api.js";

import { addToCart } from "../../store/slices/cartSlice.js";
import { useAppDispatch, useAppSelector } from "../../store/hooks.js";

import useBodyScrollLock from "../hooks/useBodyScrollLock.js";

import type {
    AIConversation,
    AIConversationMessage,
    AIConversationMessagesResponse,
    AIRecommendedItem,
} from "../../types/ai.types.js";

import "../../styles/ai-chatbot.css";


interface FloatingAIChatbotProps {
    userKey: string;
}

const CONVERSATION_PAGE_SIZE = 10;
const MESSAGE_PAGE_SIZE = 30;


const getErrorMessage = (error: unknown): string => {

    if (axios.isAxiosError<{ message?: string }>(error)) {
        return (
            error.response?.data?.message ??
            "Something went wrong. Please try again."
        );
    }

    return error instanceof Error
        ? error.message
        : "Something went wrong. Please try again.";
};


export default function FloatingAIChatbot({
    userKey,
}: FloatingAIChatbotProps) {

    const dispatch = useAppDispatch();

    const cartItems = useAppSelector((state) => state.cart.items);

    const cartItemIds = cartItems.map((item) => item.menuItemId);


    // --------------------------------------------------
    // 1. Chatbot visibility and scroll
    // --------------------------------------------------

    const [isOpen, setIsOpen] = useState(false);

    useBodyScrollLock(isOpen);


    // --------------------------------------------------
    // 2. Conversation state
    // --------------------------------------------------

    const storageKey = `foodhub_ai_active_conversation:${userKey}`;

    const [conversations, setConversations] = useState<AIConversation[]>([]);

    const [conversationPage, setConversationPage] = useState(1);

    const [hasMoreConversations, setHasMoreConversations] =
        useState(false);

    const [activeConversationId, setActiveConversationId] =
        useState<number | null>(null);


    // --------------------------------------------------
    // 3. Message state
    // --------------------------------------------------

    const [messages, setMessages] = useState<ChatbotMessage[]>([]);

    const [messagePage, setMessagePage] = useState(1);

    const [hasMoreMessages, setHasMoreMessages] = useState(false);


    // --------------------------------------------------
    // 4. Loading and error state
    // --------------------------------------------------

    const [loadingConversations, setLoadingConversations] =
        useState(true);

    const [loadingMessages, setLoadingMessages] = useState(false);

    const [sending, setSending] = useState(false);

    const [error, setError] = useState<string | null>(null);


    // --------------------------------------------------
    // 5. Recommendation cart state
    // --------------------------------------------------

    const [addingItemIds, setAddingItemIds] = useState<number[]>([]);

    const [unavailableItemIds, setUnavailableItemIds] =
        useState<number[]>([]);

    const [addErrors, setAddErrors] = useState<Record<number, string>>({});


    // --------------------------------------------------
    // 6. Refs
    // --------------------------------------------------

    const sendingRef = useRef(false);

    const addingItemsRef = useRef<Set<number>>(new Set());

    const conversationRequestRef = useRef(0);


    // --------------------------------------------------
    // 7. Initialize chatbot and restore last conversation
    // --------------------------------------------------

    useEffect(() => {

        let cancelled = false;

        const initializeChatbot = async () => {

            const requestId = ++conversationRequestRef.current;

            setLoadingConversations(true);
            setLoadingMessages(false);

            setConversations([]);
            setMessages([]);

            setActiveConversationId(null);

            setConversationPage(1);
            setMessagePage(1);

            setHasMoreConversations(false);
            setHasMoreMessages(false);

            setError(null);

            try {

                const result = await getAIConversations(
                    1,
                    CONVERSATION_PAGE_SIZE
                );

                if (
                    cancelled ||
                    requestId !== conversationRequestRef.current
                ) {
                    return;
                }

                setConversations(result.conversations);

                setHasMoreConversations(
                    result.pagination.hasNextPage ?? false
                );


                const savedConversation = localStorage.getItem(storageKey);

                // Restore an explicitly started empty New Chat.
                if (savedConversation === "new") {

                    setActiveConversationId(null);
                    setMessages([]);

                    return;
                }


                // Restore the last selected conversation.
                // If no selection exists, use the latest conversation.

                const parsedSavedId = Number(savedConversation);

                const preferredId =
                    Number.isInteger(parsedSavedId) && parsedSavedId > 0
                        ? parsedSavedId
                        : result.conversations[0]?.id;


                if (!preferredId) {

                    setActiveConversationId(null);
                    setMessages([]);

                    localStorage.removeItem(storageKey);

                    return;
                }


                let history: AIConversationMessagesResponse;

                try {

                    history = await getAIConversationMessages(
                        preferredId,
                        1,
                        MESSAGE_PAGE_SIZE
                    );

                } catch (error) {

                    if (
                        !axios.isAxiosError(error) ||
                        error.response?.status !== 404
                    ) {
                        throw error;
                    }

                    // Fall back when the saved conversation no longer exists.

                    const latestConversationId =
                        result.conversations[0]?.id;

                    if (
                        !latestConversationId ||
                        latestConversationId === preferredId
                    ) {

                        localStorage.removeItem(storageKey);

                        setActiveConversationId(null);
                        setMessages([]);

                        return;
                    }

                    history = await getAIConversationMessages(
                        latestConversationId,
                        1,
                        MESSAGE_PAGE_SIZE
                    );
                }


                if (
                    cancelled ||
                    requestId !== conversationRequestRef.current
                ) {
                    return;
                }

                const restoredId = history.conversation.id;

                setActiveConversationId(restoredId);

                setMessages(history.messages);

                setMessagePage(1);

                setHasMoreMessages(
                    history.pagination.hasMore ?? false
                );

                localStorage.setItem(
                    storageKey,
                    String(restoredId)
                );

            } catch (error) {

                if (!cancelled) {
                    setError(getErrorMessage(error));
                }

            } finally {

                if (!cancelled) {
                    setLoadingConversations(false);
                }
            }
        };


        void initializeChatbot();

        return () => {

            cancelled = true;

            conversationRequestRef.current += 1;
        };

    }, [storageKey]);


    // --------------------------------------------------
    // 8. Start a new unsaved conversation
    // --------------------------------------------------

    const handleNewChat = () => {

        if (sendingRef.current) {
            return;
        }

        conversationRequestRef.current += 1;

        setActiveConversationId(null);

        setMessages([]);

        setMessagePage(1);

        setHasMoreMessages(false);

        setError(null);

        // Database conversation is created only after first message.
        localStorage.setItem(storageKey, "new");
    };


    // --------------------------------------------------
    // 9. Select an existing conversation
    // --------------------------------------------------

    const loadConversation = useCallback(async (conversationId: number) => {

        if (sendingRef.current) {
            return;
        }

        const requestId = ++conversationRequestRef.current;

        setLoadingMessages(true);

        setError(null);

        try {

            const result = await getAIConversationMessages(
                conversationId,
                1,
                MESSAGE_PAGE_SIZE
            );

            if (requestId !== conversationRequestRef.current) {
                return;
            }

            setActiveConversationId(conversationId);

            setMessages(result.messages);

            setMessagePage(1);

            setHasMoreMessages(
                result.pagination.hasMore ?? false
            );

            localStorage.setItem(
                storageKey,
                String(conversationId)
            );

        } catch (error) {

            if (requestId === conversationRequestRef.current) {
                setError(getErrorMessage(error));
            }

        } finally {

            if (requestId === conversationRequestRef.current) {
                setLoadingMessages(false);
            }
        }

    }, [storageKey]);


    // --------------------------------------------------
    // 10. Load more conversations
    // --------------------------------------------------

    const handleLoadMoreConversations = async () => {

        if (
            !hasMoreConversations ||
            loadingConversations
        ) {
            return;
        }

        const nextPage = conversationPage + 1;

        setLoadingConversations(true);

        try {

            const result = await getAIConversations(
                nextPage,
                CONVERSATION_PAGE_SIZE
            );

            setConversations((previous) => {

                const existingIds = new Set(
                    previous.map((conversation) => conversation.id)
                );

                return [
                    ...previous,

                    ...result.conversations.filter(
                        (conversation) => !existingIds.has(conversation.id)
                    ),
                ];
            });

            setConversationPage(nextPage);

            setHasMoreConversations(
                result.pagination.hasNextPage ?? false
            );

        } catch (error) {

            setError(getErrorMessage(error));

        } finally {

            setLoadingConversations(false);
        }
    };


    // --------------------------------------------------
    // 11. Load older messages
    // --------------------------------------------------

    const handleLoadOlderMessages = async () => {

        if (
            !activeConversationId ||
            !hasMoreMessages ||
            loadingMessages
        ) {
            return;
        }

        const conversationId = activeConversationId;

        const requestId = conversationRequestRef.current;

        const nextPage = messagePage + 1;

        setLoadingMessages(true);

        try {

            const result = await getAIConversationMessages(
                conversationId,
                nextPage,
                MESSAGE_PAGE_SIZE
            );

            if (
                requestId !== conversationRequestRef.current ||
                conversationId !== activeConversationId
            ) {
                return;
            }

            setMessages((previous) => [
                ...result.messages,
                ...previous,
            ]);

            setMessagePage(nextPage);

            setHasMoreMessages(
                result.pagination.hasMore ?? false
            );

        } catch (error) {

            setError(getErrorMessage(error));

        } finally {

            if (requestId === conversationRequestRef.current) {
                setLoadingMessages(false);
            }
        }
    };


    // --------------------------------------------------
    // 12. Send a chat message
    // --------------------------------------------------

    const handleSendMessage = async (
        message: string,
        retryMessageId?: number
    ) => {

        const normalizedMessage = message.trim();

        if (!normalizedMessage || sendingRef.current) {
            return;
        }

        sendingRef.current = true;

        setSending(true);

        setError(null);

        const conversationIdForRequest = activeConversationId;

        const localMessageId = retryMessageId ?? -Date.now();


        // Add an optimistic user message.

        if (retryMessageId === undefined) {

            const userMessage: ChatbotMessage = {
                id: localMessageId,
                role: "USER",
                content: normalizedMessage,
                metadata: null,
                createdAt: new Date().toISOString(),
                clientStatus: "sending",
            };

            setMessages((previous) => [
                ...previous,
                userMessage,
            ]);

        } else {

            setMessages((previous) =>
                previous.map((item) =>
                    item.id === retryMessageId
                        ? { ...item, clientStatus: "sending" }
                        : item
                )
            );
        }


        try {

            const response = await sendAIMessage({
                message: normalizedMessage,

                ...(conversationIdForRequest !== null
                    ? { conversationId: conversationIdForRequest }
                    : {}),
            });


            const assistantMessage: AIConversationMessage = {
                id: Date.now(),
                role: "ASSISTANT",
                content: response.reply,

                metadata: {
                    intent: response.intent,
                    recommendedItems: response.recommendedItems,
                },

                createdAt: new Date().toISOString(),
            };


            setMessages((previous) => [

                ...previous.map((item) =>
                    item.id === localMessageId
                        ? { ...item, clientStatus: undefined }
                        : item
                ),

                assistantMessage,
            ]);


            setActiveConversationId(response.conversationId);

            localStorage.setItem(
                storageKey,
                String(response.conversationId)
            );


            // Refresh sidebar independently from message success.

            try {

                const latestConversations = await getAIConversations(
                    1,
                    CONVERSATION_PAGE_SIZE
                );

                setConversations(latestConversations.conversations);

                setConversationPage(1);

                setHasMoreConversations(
                    latestConversations.pagination.hasNextPage ?? false
                );

            } catch (refreshError) {

                console.error(
                    "AI conversation list refresh failed:",
                    refreshError
                );
            }


        } catch (error) {

            setMessages((previous) =>
                previous.map((item) =>
                    item.id === localMessageId
                        ? { ...item, clientStatus: "failed" }
                        : item
                )
            );

            setError(
                "Your message couldn't be sent. Please try again."
            );

            console.error("FoodHub AI message failed:", error);

        } finally {

            sendingRef.current = false;

            setSending(false);
        }
    };


    // --------------------------------------------------
    // 13. Retry a failed message
    // --------------------------------------------------

    const handleRetryMessage = (messageId: number) => {

        const failedMessage = messages.find(
            (message) => message.id === messageId
        );

        if (
            !failedMessage ||
            failedMessage.role !== "USER" ||
            failedMessage.clientStatus !== "failed"
        ) {
            return;
        }

        void handleSendMessage(
            failedMessage.content,
            failedMessage.id
        );
    };


    // --------------------------------------------------
    // 14. Add AI recommendation to Redux cart
    // --------------------------------------------------

    const handleAddToCart = async (
        recommendedItem: AIRecommendedItem
    ) => {

        const itemId = recommendedItem.id;

        // Do not add an item that is already in the cart.

        if (
            cartItemIds.includes(itemId) ||
            addingItemsRef.current.has(itemId) ||
            unavailableItemIds.includes(itemId)
        ) {
            return;
        }

        addingItemsRef.current.add(itemId);

        setAddingItemIds((previous) => [...previous, itemId]);

        setAddErrors((previous) => {

            const updated = { ...previous };

            delete updated[itemId];

            return updated;
        });


        try {

            // Search the current menu using the existing API.

            const menuResult = await getMenu({
                page: 1,
                limit: 50,
                search: recommendedItem.name,
                category: recommendedItem.category,
                sort: "newest",
            });


            // Verify the exact item ID and current availability.

            const currentItem = menuResult.items.find(
                (item) =>
                    item.id === itemId &&
                    item.isActive &&
                    item.isAvailable
            );


            if (!currentItem) {

                setUnavailableItemIds((previous) =>
                    previous.includes(itemId)
                        ? previous
                        : [...previous, itemId]
                );

                setAddErrors((previous) => ({
                    ...previous,
                    [itemId]: "This item is no longer available.",
                }));

                return;
            }


            // Use current database details.
            // Always add exactly one quantity.

            dispatch(
                addToCart({
                    menuItemId: currentItem.id,
                    name: currentItem.name,
                    price: Number(currentItem.price),
                    image: currentItem.image,
                    quantity: 1,
                })
            );


        } catch (error) {

            console.error(
                "Failed to add AI recommendation to cart:",
                error
            );

            setAddErrors((previous) => ({
                ...previous,
                [itemId]: "Unable to add this item. Please try again.",
            }));

        } finally {

            addingItemsRef.current.delete(itemId);

            setAddingItemIds((previous) =>
                previous.filter((id) => id !== itemId)
            );
        }
    };


    // --------------------------------------------------
    // 15. Render chatbot
    // --------------------------------------------------

    return (
        <>

            {isOpen && (

                <ChatbotWindow
                    conversations={conversations}
                    messages={messages}

                    activeConversationId={activeConversationId}

                    loadingConversations={loadingConversations}
                    loadingMessages={loadingMessages}
                    sending={sending}

                    hasMoreConversations={hasMoreConversations}
                    hasMoreMessages={hasMoreMessages}

                    cartItemIds={cartItemIds}
                    addingItemIds={addingItemIds}
                    unavailableItemIds={unavailableItemIds}
                    addErrors={addErrors}

                    error={error}

                    onClose={() => setIsOpen(false)}

                    onNewChat={handleNewChat}

                    onSelectConversation={(id) => {
                        void loadConversation(id);
                    }}

                    onLoadMoreConversations={() => {
                        void handleLoadMoreConversations();
                    }}

                    onLoadOlderMessages={() => {
                        void handleLoadOlderMessages();
                    }}

                    onSendMessage={(message) => {
                        void handleSendMessage(message);
                    }}

                    onRetryMessage={handleRetryMessage}

                    onAddToCart={handleAddToCart}
                />

            )}


            <ChatbotLauncher
                onClick={() => setIsOpen((previous) => !previous)}
            />

        </>
    );
}
