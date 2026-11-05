import { useEffect, useState } from "react";

interface LoadedPreview {
    file: File;
    dataUrl: string;
}

export function useMenuImagePreview(file: File | undefined, fallback: string | null = null) {
    const [loadedPreview, setLoadedPreview] = useState<LoadedPreview | null>(null);

    useEffect(() => {
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") {
                setLoadedPreview({ file, dataUrl: reader.result });
            }
        };
        reader.readAsDataURL(file);

        return () => {
            if (reader.readyState === FileReader.LOADING) {
                reader.abort();
            }
        };
    }, [file]);

    if (!file) {
        return fallback;
    }

    return loadedPreview?.file === file ? loadedPreview.dataUrl : null;
}
