import { z } from "zod";

export const registerSchema =
  z.object({

    email:
      z.string().email(),

    password:
      z.string().min(6),

    fullName:
      z.string().min(2)

  });

export const loginSchema =
  z.object({

    email:
      z.string().email(),

    password:
      z.string()

  });

  export const forgotPasswordSchema = z.object({

    email: z
        .string()
        .email()

});

export const resetPasswordSchema = z.object({

    email: z
        .string()
        .email(),

    otp: z
        .string()
        .length(6),

    newPassword: z
        .string()
        .min(6)

});