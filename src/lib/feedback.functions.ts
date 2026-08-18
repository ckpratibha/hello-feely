import { createServerFn } from "@tanstack/react-start";

import { feedbackSchema } from "./feedback.schema";

export const submitFeedback = createServerFn({ method: "POST" })
  .validator((data) => feedbackSchema.parse(data))
  .handler(async ({ data }) => {
    const webhookUrl = process.env["N8N_WEBHOOK_URL"];

    if (!webhookUrl) {
      throw new Error("Webhook URL is not configured. Please add the N8N_WEBHOOK_URL secret.");
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        feedback: data.feedback,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send feedback: ${response.status} ${response.statusText}`);
    }

    return { success: true };
  });
