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
      if (response.status === 404) {
        throw new Error(
          "The webhook isn't listening right now. If you're using the n8n test URL, click \"Listen for test event\" and try again — or activate the workflow and use its production URL.",
        );
      }
      throw new Error(`Failed to send feedback: ${response.status} ${response.statusText}`);
    }

    return { success: true };
  });
