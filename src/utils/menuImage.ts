const SERVER_URL = process.env.SERVER_URL;

export const getMenuImageSrc = (    image: string | null | undefined,): string | null => {
    
    if (!image) {
        return null;
    }

    // S3 presigned URLs are already complete URLs.
    if (/^https?:\/\//i.test(image)) {
        return image;
    }

    // Legacy images are served from the backend.
    return `${SERVER_URL}${image.startsWith("/") ? image : `/${image}`}`;
};