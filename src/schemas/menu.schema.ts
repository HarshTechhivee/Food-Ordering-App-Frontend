import { z } from "zod";

export const menuItemSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    price: z.string(),
    image: z.string().nullable(),
    category: z.string(),
    isAvailable: z.boolean(),
    isActive: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const menuResponseSchema = z.object({
    items: z.array(menuItemSchema),

    pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalPages: z.number(),
    }),
});

export const createMenuItemSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name cannot exceed 100 characters"),

    description: z
        .string()
        .trim()
        .min(2, "Description is required")
        .max(500, "Description cannot exceed 500 characters"),

    price: z
        .number()
        .positive("Price must be greater than 0"),

    category: z
        .string()
        .trim()
        .min(2, "Category is required")
        .max(50, "Category cannot exceed 50 characters"),

    isAvailable: z.boolean(),

    image: z
        .instanceof(FileList)
        .refine(
            (files) => files.length > 0,
            "Menu image is required"
        )
        .refine(
            (files) =>
                files.length === 0 ||
                ["image/jpeg", "image/png", "image/webp"].includes(
                    files[0]?.type
                ),
            "Only JPG, PNG and WebP images are allowed"
        )
        .refine(
            (files) =>
                files.length === 0 ||
                files[0]?.size <= 5 * 1024 * 1024,
            "Image must be smaller than 5MB"
        ),
});

export type CreateMenuItemFormData = z.infer<
    typeof createMenuItemSchema
>;


export const updateMenuItemFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(100),

    description: z
        .string()
        .trim()
        .min(2, "Description is required")
        .max(500),

    price: z
        .number()
        .positive("Price must be greater than 0"),

    category: z
        .string()
        .trim()
        .min(2, "Category is required")
        .max(50),

    isAvailable: z.boolean(),

    image: z
        .instanceof(FileList)
        .refine(
            (files) =>
                files.length === 0 ||
                ["image/jpeg", "image/png", "image/webp"].includes(
                    files[0]?.type
                ),
            "Only JPG, PNG and WebP images are allowed"
        )
        .refine(
            (files) =>
                files.length === 0 ||
                files[0]?.size <= 5 * 1024 * 1024,
            "Image must be smaller than 5MB"
        ),
});

export type UpdateMenuItemFormData = z.infer<
    typeof updateMenuItemFormSchema
>;