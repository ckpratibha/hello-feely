import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerFn } from "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Loader2, MessageSquareHeart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitFeedback } from "@/lib/feedback.functions";
import { feedbackSchema, type FeedbackFormValues } from "@/lib/feedback.schema";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Customer Support | We're here to help" },
      {
        name: "description",
        content:
          "Get in touch with our customer support team. Share your feedback or describe an issue and we'll get back to you as soon as possible.",
      },
      { property: "og:title", content: "Customer Support | We're here to help" },
      {
        property: "og:description",
        content:
          "Get in touch with our customer support team. Share your feedback or describe an issue and we'll get back to you as soon as possible.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CustomerSupportPage,
});

function CustomerSupportPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const sendFeedback = useServerFn(submitFeedback);

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      feedback: "",
    },
  });

  async function onSubmit(values: FeedbackFormValues) {
    setSubmitError(null);
    try {
      await sendFeedback({ data: values });
      setIsSuccess(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong. Please try again.",
      );
    }
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md rounded-3xl bg-card p-8 text-center shadow-xl shadow-primary/5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
            Thank you!
          </h1>
          <p className="mt-2 text-muted-foreground">
            We've received your message and will get back to you as soon as possible.
          </p>
          <Button
            className="mt-6 w-full rounded-xl"
            onClick={() => {
              setIsSuccess(false);
              form.reset();
            }}
          >
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-xl shadow-primary/5">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <MessageSquareHeart className="h-6 w-6 text-primary" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
            Customer Support
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We're here to help. Tell us what's on your mind and we'll get back to you shortly.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" className="rounded-xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="jane@example.com"
                      className="rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How can we help? Describe your issue or feedback</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your issue or feedback..."
                      className="min-h-[140px] resize-none rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {submitError && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {submitError}
              </div>
            )}

            <Button
              type="submit"
              className="w-full rounded-xl"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
