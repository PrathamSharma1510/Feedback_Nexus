"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { AIMessageAssistant } from "@/components/ai-message-assistant";

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export default function FeedbackPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState("");
  const [pageDescription, setPageDescription] = useState("");
  const [isAcceptingMessages, setIsAcceptingMessages] = useState(true);
  const params = useParams();
  const slug = params.slug as string;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  useEffect(() => {
    const fetchPageDetails = async () => {
      try {
        const response = await axios.get(`/api/feedback-pages/${slug}`);
        if (response.data.success) {
          setPageTitle(response.data.data.title);
          setPageDescription(response.data.data.description);
          setIsAcceptingMessages(
            response.data.data.isAcceptingMessages === true
          );
        }
      } catch (error) {
        console.error("Error fetching page details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageDetails();
  }, [slug]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!isAcceptingMessages) {
        toast({
          title: "Error",
          description:
            "This feedback page is not accepting messages at the moment.",
          variant: "destructive",
        });
        return;
      }

      const response = await axios.post("/api/send-message", {
        content: values.message,
        feedbackPageSlug: slug,
      });

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Your message has been sent successfully!",
        });
        form.reset();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send message",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
          <p className="text-muted-foreground mt-2">{pageDescription}</p>
        </div>

        {!isAcceptingMessages ? (
          <div
            className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Not Accepting Messages</strong>
            <span className="block sm:inline">
              {" "}
              This feedback page is not accepting messages at the moment.
            </span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Type your message here..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </Form>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">
          Need help writing your message?
        </h2>
        <AIMessageAssistant />
      </div>
    </div>
  );
}
