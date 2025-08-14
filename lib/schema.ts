// app/schema/onboardSchema.ts
import { z } from "zod";

export const OnboardSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Full name must be under 80 characters")
    .regex(/^[A-Za-z][A-Za-z '\-]*$/, "Only letters, spaces, ' and - are allowed"),

  email: z.string().email("Invalid email address"),

  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be under 100 characters"),

  services: z
    .array(z.enum(["UI/UX", "Branding", "Web Dev", "Mobile App"]))
    .min(1, "Select at least one service"),

  budgetUsd: z
    .number()
    .int("Budget must be an integer")
    .min(100, "Minimum budget is 100")
    .max(1_000_000, "Maximum budget is 1,000,000")
    .optional(),

  projectStartDate: z
    .string()
    .refine((val) => new Date(val) >= new Date(new Date().toDateString()), {
      message: "Date must be today or later",
    }),

  acceptTerms: z.boolean().refine(
  (val) => val === true,
  { message: "You must accept the terms." }
)
});

export type OnboardFormData = z.infer<typeof OnboardSchema>;
