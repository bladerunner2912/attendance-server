import { z } from 'zod';

const registerSchema = z.object({
    email: z
        .string()
        .email("Valid email required"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),

    role: z
        .enum(['STUDENT', 'INSTRUCTOR'], {
            errorMap: () => ({ message: "Role must be STUDENT or INSTRUCTOR" })
        })
});

const loginSchema = z.object({
    email: z
        .string()
        .email("Valid email required"),

    password: z
        .string()
        .min(1, "Password is required")
});

export default {
    registerSchema, loginSchema
}

