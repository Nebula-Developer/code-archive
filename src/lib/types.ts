

/**
 * Represents metadata for an uploaded profile picture.
 */
export type UploadMetadata = {
    /** Unique file ID from storage */
    fileId: string;

    /** ID of the user who uploaded the image */
    uploaderId: string;

    /** Array of tags associated with the image */
    tags?: string[];

    /** Source where the image came from (e.g. "original", "pinterest") */
    source?: string;

    /** Width of the image in pixels */
    width: number;

    /** Height of the image in pixels */
    height: number;

    /** Array of dominant colors extracted from the image */
    colors?: string[];

    /** Category of the image (e.g. "nature", "people") */
    category: string;

    /** Whether the image is animated (e.g. gif, animated webp) */
    animated: boolean;

    /** What type of content it is */
    type: "avatar" | "banner" | "other";

    /** Whether the image contains NSFW content */
    nsfw: boolean;
};
