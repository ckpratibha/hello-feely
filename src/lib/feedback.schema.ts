import { z } from "zod";

export const feedbackSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(1, "Please enter your name")
    .max(100, "Name must be less than 100 characters"),
  customerEmail: z
    .string()
    .trim()
    .min(1, "Please enter your email")
    .email("Please enter a valid email")
    .max(255, "Email must be less than 255 characters"),
  feedback: z
    .string()
    .trim()
    .min(1, "Please describe your issue or feedback")
    .max(1000, "Message must be less than 1000 characters"),
});

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;
