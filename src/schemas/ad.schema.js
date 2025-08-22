import { z } from "zod"

export const adModalSchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be at most 50 characters"),

    adTitle: z.string()
        .min(3, "Ad Title must be at least 3 characters")
        .max(100, "Ad Title must be at most 100 characters"),

    websiteUrl: z.string()
        .url("Please enter a valid URL"),

    telegramContact: z.string()
        .optional()
        .refine(val => !val || val.startsWith("@"), {
            message: "Telegram contact must start with @"
        }),

    referredBy: z.string()
        .max(50, "Referred By must be at most 50 characters")
        .optional()

});
