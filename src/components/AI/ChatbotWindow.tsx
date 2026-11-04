
import { useState, type FormEvent, type KeyboardEvent } from "react";

import type {
    AIConversation,
    AIRecommendedItem,
    AIConversationMessage
} from "../../types/ai.types.js";

import RecommendationGrid from "./RecommendationGrid.js";

export type ChatbotMessage = AIConversationMessage & {
    clientStatus?: "sending" | "failed";
};

interface ChatbotWindowProps {
    conversations: AIConversation[];
    messages: ChatbotMessage[];

    activeConversationId: number | null;

    loadingConversations: boolean;
    loadingMessages: boolean;
    sending: boolean;

    hasMoreConversations: boolean;
    hasMoreMessages: boolean;

    cartItemIds: number[];
    addingItemIds: number[];
    unavailableItemIds: number[];
    addErrors: Record<number, string>;

    error: string | null;

    onClose: () => void;
    onNewChat: () => void;
    onSelectConversation: (id: number) => void;
    onLoadMoreConversations: () => void;
    onLoadOlderMessages: () => void;
    onSendMessage: (message: string) => void;
    onRetryMessage: (messageId: number) => void;
    onAddToCart: (item: AIRecommendedItem) => void;
}


const suggestedPrompts = [
    "Find food under ₹300",
    "Recommend popular burgers",
    "Show me spicy food",
    "Compare two dishes",
];


const formatConversationDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
    });
};


// --------------------------------------------------
// 1. Conversation sidebar (Desktop)
// --------------------------------------------------

interface ConversationSidebarProps {
    conversations: AIConversation[];
    activeConversationId: number | null;
    loading: boolean;
    hasMore: boolean;

    onNewChat: () => void;
    onSelectConversation: (id: number) => void;
    onLoadMore: () => void;
}


function ConversationSidebar({
    conversations,
    activeConversationId,
    loading,
    hasMore,
    onNewChat,
    onSelectConversation,
    onLoadMore,
}: ConversationSidebarProps) {

    return (
        <aside className="ai-chatbot-sidebar">

            <div className="ai-chatbot-sidebar-heading">
                <div className="ai-chatbot-sidebar-title">
                    <i className="bi bi-clock-history" />
                    <span>Chat History</span>
                </div>
            </div>


            <button
                type="button"
                className="ai-chatbot-new-chat"
                onClick={onNewChat}
            >
                <i className="bi bi-plus-lg" />
                <span>New Chat</span>
            </button>


            <div className="ai-chatbot-history-section">

                <div className="ai-chatbot-history-label">
                    Recent Conversations
                </div>

                <div className="ai-chatbot-history-list">

                    {conversations.map((conversation) => (

                        <button
                            type="button"
                            key={conversation.id}
                            className={`ai-chatbot-history-item ${activeConversationId === conversation.id
                                ? "active"
                                : ""
                                }`}
                            onClick={() =>
                                onSelectConversation(conversation.id)
                            }
                        >

                            <span className="ai-chatbot-history-title">
                                {conversation.title || "FoodHub conversation"}
                            </span>

                            <span className="ai-chatbot-history-date">
                                {formatConversationDate(
                                    conversation.updatedAt
                                )}
                            </span>

                        </button>

                    ))}


                    {!loading && conversations.length === 0 && (
                        <p className="ai-chatbot-history-empty">
                            Your previous conversations will appear here.
                        </p>
                    )}


                    {loading && (
                        <p className="ai-chatbot-history-empty">
                            Loading conversations...
                        </p>
                    )}


                    {hasMore && (
                        <button
                            type="button"
                            className="ai-chatbot-show-more"
                            onClick={onLoadMore}
                        >
                            Show more
                            <i className="bi bi-chevron-down" />
                        </button>
                    )}

                </div>
            </div>

        </aside>
    );
}


// --------------------------------------------------
// 2. Conversation messages and recommendation grids
// --------------------------------------------------

interface ChatMessagesProps {
    messages: ChatbotMessage[];
    loading: boolean;
    hasMore: boolean;

    cartItemIds: number[];
    addingItemIds: number[];
    unavailableItemIds: number[];
    addErrors: Record<number, string>;

    onLoadOlder: () => void;
    onRetry: (messageId: number) => void;
    onAddToCart: (item: AIRecommendedItem) => void;
}


function ChatMessages({
    messages,
    loading,
    hasMore,

    cartItemIds,
    addingItemIds,
    unavailableItemIds,
    addErrors,

    onLoadOlder,
    onRetry,
    onAddToCart,
}: ChatMessagesProps) {

    return (
        <div className="ai-chatbot-messages">

            {hasMore && (
                <button
                    type="button"
                    className="ai-chatbot-load-older"
                    onClick={onLoadOlder}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Load older messages"}
                </button>
            )}


            {loading && messages.length === 0 && (
                <div className="ai-chatbot-loading">
                    <span className="spinner-border spinner-border-sm" />
                    Loading conversation...
                </div>
            )}


            {messages.map((message) => (

                <div
                    key={message.id}
                    className={`ai-chatbot-message-row ${message.role === "USER" ? "user" : "assistant"
                        }`}
                >

                    {message.role === "ASSISTANT" && (
                        <div className="ai-chatbot-avatar">
                            <i className="bi bi-robot" />
                        </div>
                    )}


                    <div className="ai-chatbot-message-content">

                        <div
                            className={`ai-chatbot-bubble ${message.role === "USER"
                                ? "user"
                                : "assistant"
                                }`}
                        >
                            {message.content}
                        </div>


                        {message.clientStatus === "sending" && (
                            <small className="ai-chatbot-message-status">
                                Sending...
                            </small>
                        )}


                        {message.clientStatus === "failed" && (
                            <div className="ai-chatbot-failed">

                                <small>Message not sent.</small>

                                <button
                                    type="button"
                                    onClick={() => onRetry(message.id)}
                                >
                                    Retry
                                </button>

                            </div>
                        )}


                        {/* Each assistant response gets its own grid. */}

                        {message.role === "ASSISTANT" &&
                            message.metadata?.recommendedItems &&
                            message.metadata.recommendedItems.length > 0 && (

                                <RecommendationGrid
                                    items={message.metadata.recommendedItems}

                                    cartItemIds={cartItemIds}
                                    addingItemIds={addingItemIds}
                                    unavailableItemIds={unavailableItemIds}

                                    addErrors={addErrors}

                                    onAddToCart={onAddToCart}
                                />

                            )}

                    </div>

                </div>

            ))}

        </div>
    );
}


// --------------------------------------------------
// 3. Welcome screen
// --------------------------------------------------

interface WelcomeScreenProps {
    onSelectPrompt: (prompt: string) => void;
}


function WelcomeScreen({ onSelectPrompt }: WelcomeScreenProps) {

    return (
        <div className="ai-chatbot-welcome">

            <div className="ai-chatbot-welcome-icon">
                <i className="bi bi-robot" />
            </div>

            <h5>Hey there! 👋 Welcome to FoodHub!</h5>

            <p>
                I'm your personal food assistant. I can help you discover
                delicious meals, compare dishes, and find food within your
                budget.
            </p>

            <span className="ai-chatbot-suggestions-title">
                Try asking me
            </span>

            <div className="ai-chatbot-suggestions">

                {suggestedPrompts.map((prompt) => (

                    <button
                        type="button"
                        key={prompt}
                        onClick={() => onSelectPrompt(prompt)}
                    >
                        {prompt}
                        <i className="bi bi-arrow-up-right" />
                    </button>

                ))}

            </div>

        </div>
    );
}


// --------------------------------------------------
// 4. Mobile conversation history screen
// --------------------------------------------------

interface MobileHistoryProps {
    conversations: AIConversation[];
    activeConversationId: number | null;

    loading: boolean;
    hasMore: boolean;

    onBack: () => void;
    onClose: () => void;
    onNewChat: () => void;
    onSelectConversation: (id: number) => void;
    onLoadMore: () => void;
}


function MobileHistory({
    conversations,
    activeConversationId,
    loading,
    hasMore,
    onBack,
    onClose,
    onNewChat,
    onSelectConversation,
    onLoadMore,
}: MobileHistoryProps) {

    return (
        <section className="ai-chatbot-mobile-history">

            {/* Mobile history header */}

            <header className="ai-mobile-history-header">

                <button
                    type="button"
                    className="ai-mobile-back-button"
                    onClick={onBack}
                    aria-label="Back to chat"
                >
                    <i className="bi bi-arrow-left" />
                </button>

                <div className="ai-mobile-history-heading">
                    <i className="bi bi-clock-history" />
                    <span>Chat History</span>
                </div>

                <button
                    type="button"
                    className="ai-chatbot-mobile-close-button"
                    onClick={onClose}
                    aria-label="Close FoodHub AI"
                    title="Close FoodHub AI"
                >
                    <i className="bi bi-x-lg" />
                </button>

            </header>


            {/* New Chat */}

            <div className="ai-mobile-history-actions">

                <button
                    type="button"
                    className="ai-chatbot-new-chat"
                    onClick={onNewChat}
                >
                    <i className="bi bi-plus-lg" />
                    <span>New Chat</span>
                </button>

            </div>


            {/* Conversation list */}

            <div className="ai-mobile-history-content">

                <h6>Recent Conversations</h6>

                {conversations.map((conversation) => (

                    <button
                        type="button"
                        key={conversation.id}
                        className={`ai-mobile-history-item ${activeConversationId === conversation.id
                            ? "active"
                            : ""
                            }`}
                        onClick={() =>
                            onSelectConversation(conversation.id)
                        }
                    >

                        <span className="ai-mobile-history-item-icon">
                            <i className="bi bi-chat-left-text" />
                        </span>

                        <span className="ai-mobile-history-item-content">

                            <strong>
                                {conversation.title || "FoodHub conversation"}
                            </strong>

                            <small>
                                {formatConversationDate(
                                    conversation.updatedAt
                                )}
                            </small>

                        </span>

                        <i className="bi bi-chevron-right ai-mobile-history-chevron" />

                    </button>

                ))}


                {!loading && conversations.length === 0 && (
                    <p className="ai-chatbot-history-empty">
                        No previous conversations yet. Start a new chat!
                    </p>
                )}


                {loading && (
                    <p className="ai-chatbot-history-empty">
                        Loading conversations...
                    </p>
                )}


                {hasMore && (
                    <button
                        type="button"
                        className="ai-chatbot-show-more"
                        onClick={onLoadMore}
                        disabled={loading}
                    >
                        Show more
                        <i className="bi bi-chevron-down" />
                    </button>
                )}

            </div>

        </section>
    );
}


// --------------------------------------------------
// 5. Main chatbot window
// --------------------------------------------------

export default function ChatbotWindow({
    conversations,
    messages,

    activeConversationId,

    loadingConversations,
    loadingMessages,
    sending,

    hasMoreConversations,
    hasMoreMessages,

    cartItemIds,
    addingItemIds,
    unavailableItemIds,
    addErrors,

    error,

    onClose,
    onNewChat,
    onSelectConversation,
    onLoadMoreConversations,
    onLoadOlderMessages,
    onSendMessage,
    onRetryMessage,
    onAddToCart,
}: ChatbotWindowProps) {

    const [draft, setDraft] = useState("");

    const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);


    const submitMessage = (message: string) => {

        const normalizedMessage = message.trim();

        if (!normalizedMessage || sending) {
            return;
        }

        onSendMessage(normalizedMessage);

        setDraft("");
    };


    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        submitMessage(draft);
    };


    const handleKeyDown = (
        event: KeyboardEvent<HTMLTextAreaElement>
    ) => {

        if (event.key === "Enter" && !event.shiftKey) {

            event.preventDefault();

            submitMessage(draft);
        }
    };


    const handleNewChat = () => {

        onNewChat();

        // Return to the chat screen after starting a new chat.
        setMobileHistoryOpen(false);
    };


    const handleSelectConversation = (id: number) => {

        onSelectConversation(id);

        // Selecting a conversation returns to the chat screen.
        setMobileHistoryOpen(false);
    };


    return (
        <section
            className={`ai-chatbot-window ${mobileHistoryOpen ? "mobile-history-open" : ""
                }`}
            aria-label="FoodHub AI assistant"
        >

            <div className="ai-chatbot-body">

                {/* Desktop sidebar */}
                <ConversationSidebar
                    conversations={conversations}
                    activeConversationId={activeConversationId}
                    loading={loadingConversations}
                    hasMore={hasMoreConversations}
                    onNewChat={handleNewChat}
                    onSelectConversation={onSelectConversation}
                    onLoadMore={onLoadMoreConversations}
                />


                {/* Main chat panel */}
                <main className="ai-chatbot-main">

                    <header className="ai-chatbot-main-header">

                        <div className="ai-chatbot-header-brand">

                            <div className="ai-chatbot-header-icon">
                                <i className="bi bi-robot" />
                            </div>

                            <div className="ai-chatbot-header-info">

                                <h6>FoodHub AI</h6>

                                <span>
                                    <span className="ai-chatbot-online-dot" />
                                    Your personal food assistant
                                </span>

                            </div>

                        </div>


                        <div className="ai-chatbot-header-actions">

                            {/* Desktop header actions */}

                            <span className="ai-chatbot-online-badge ai-desktop-header-action">
                                <span className="ai-chatbot-online-dot" />
                                Online
                            </span>

                            <button
                                type="button"
                                className="ai-chatbot-header-button ai-desktop-header-action"
                                onClick={onClose}
                                title="Close chatbot"
                                aria-label="Close chatbot"
                            >
                                <i className="bi bi-x-lg" />
                            </button>


                            {/* Mobile header actions */}

                            <button
                                type="button"
                                className="ai-chatbot-mobile-history-button"
                                onClick={() => setMobileHistoryOpen(true)}
                                title="Chat history"
                                aria-label="Open chat history"
                            >
                                <i className="bi bi-clock-history" />
                            </button>

                            <button
                                type="button"
                                className="ai-chatbot-mobile-close-button"
                                onClick={onClose}
                                title="Close FoodHub AI"
                                aria-label="Close FoodHub AI"
                            >
                                <i className="bi bi-x-lg" />
                            </button>

                        </div>

                    </header>


                    {/* Welcome screen or messages */}

                    {messages.length === 0 && !loadingMessages ? (

                        <WelcomeScreen
                            onSelectPrompt={onSendMessage}
                        />

                    ) : (

                        <ChatMessages
                            messages={messages}
                            loading={loadingMessages}
                            hasMore={hasMoreMessages}

                            cartItemIds={cartItemIds}
                            addingItemIds={addingItemIds}
                            unavailableItemIds={unavailableItemIds}
                            addErrors={addErrors}

                            onLoadOlder={onLoadOlderMessages}
                            onRetry={onRetryMessage}
                            onAddToCart={onAddToCart}
                        />

                    )}


                    {/* Thinking indicator */}

                    {sending && (
                        <div className="ai-chatbot-thinking">

                            <span className="ai-chatbot-thinking-dots">
                                <span />
                                <span />
                                <span />
                            </span>

                            FoodHub AI is thinking...

                        </div>
                    )}


                    {/* Error */}

                    {error && (
                        <div
                            className="ai-chatbot-error"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}


                    {/* Fixed message composer */}

                    <form
                        className="ai-chatbot-composer"
                        onSubmit={handleSubmit}
                    >

                        <textarea
                            value={draft}
                            onChange={(event) =>
                                setDraft(event.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            placeholder="Ask FoodHub AI anything..."
                            rows={1}
                            maxLength={2000}
                            disabled={sending}
                        />

                        <button
                            type="submit"
                            disabled={!draft.trim() || sending}
                            aria-label="Send message"
                        >
                            <i className="bi bi-send-fill" />
                        </button>

                    </form>


                    <p className="ai-chatbot-disclaimer">
                        FoodHub AI can make mistakes. Please verify important
                        food information with the restaurant.
                    </p>

                </main>


                {/* Mobile full-screen history */}
                {mobileHistoryOpen && (
                    <MobileHistory
                        conversations={conversations}
                        activeConversationId={activeConversationId}

                        loading={loadingConversations}
                        hasMore={hasMoreConversations}

                        onBack={() => setMobileHistoryOpen(false)}
                        onClose={onClose}
                        onNewChat={handleNewChat}
                        onSelectConversation={handleSelectConversation}
                        onLoadMore={onLoadMoreConversations}
                    />
                )}

            </div>

        </section>
    );
}
