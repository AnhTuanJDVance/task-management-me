import { z } from "zod";

export const updateProfileSchema = z.object({

  fullName: z
    .string()
    .min(2)
    .max(100),

  phone: z
    .string()
    .optional(),

  avatar: z
    .string()
    .url()
    .optional()

});