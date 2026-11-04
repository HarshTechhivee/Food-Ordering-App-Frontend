
interface ChatbotLauncherProps {
    onClick: () => void;
}

export default function ChatbotLauncher({ onClick, }: ChatbotLauncherProps) {
    return (
        <button
            type="button"
            className="ai-chatbot-launcher"
            onClick={onClick}
            aria-label="Open FoodHub AI assistant"
            title="Chat with FoodHub AI"
        >
            <i className="bi bi-robot" />
            <span className="ai-chatbot-launcher-dot" />
        </button>
    );
}
