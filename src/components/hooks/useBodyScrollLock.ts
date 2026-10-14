
import { useEffect } from "react";

function useBodyScrollLock(isLocked: boolean) {

    useEffect(() => {
        if (!isLocked) {
            return;
        }

        const body = document.body;
        const html = document.documentElement;

        // Preserve the current styles and scroll position.
        const previousBodyOverflow = body.style.overflow;
        const previousHtmlOverflow = html.style.overflow;
        const previousBodyPaddingRight = body.style.paddingRight;
        const scrollY = window.scrollY;

        // Prevent background scrolling without losing the current position.
        const scrollbarWidth = window.innerWidth - html.clientWidth;

        const currentPaddingRight = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;

        html.style.overflow = "hidden";
        body.style.overflow = "hidden";

        if (scrollbarWidth > 0) {
            body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`;
        }

        return () => {
            html.style.overflow = previousHtmlOverflow;
            body.style.overflow = previousBodyOverflow;
            body.style.paddingRight = previousBodyPaddingRight;

            window.scrollTo(0, scrollY);
        };
    }, [isLocked]);
}

export default useBodyScrollLock;