"use client";

import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import * as z from "zod";
import { ApiResponse } from "../../../../types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageSchema } from "@/schemas/messageSchema";
import { AIMessageAssistant } from "@/components/ai-message-assistant";

const specialChar = "||";

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [isAcceptingMessages, setIsAcceptingMessages] = useState<
    boolean | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  useEffect(() => {
    const checkAcceptingMessages = async () => {
      try {
        const response = await axios.get(
          `/api/check-accepting-messages?username=${username}`
        );
        setIsAcceptingMessages(response.data.isAcceptingMessages);
      } catch (error) {
        console.error("Error checking message acceptance status:", error);
        setIsAcceptingMessages(false);
      }
    };

    checkAcceptingMessages();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: "default",
      });
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isAcceptingMessages === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAcceptingMessages) {
    return (
      <div className="container mx-auto my-8 p-6 bg-white rounded-lg shadow-lg max-w-3xl dark:bg-gray-900">
        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
          @{username} is not accepting messages
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400">
          This user has disabled message reception. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-8 space-y-8">
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-3xl mx-auto dark:bg-gray-900">
        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
          Send Anonymous Message to @{username}
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    Your Message
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message here..."
                      className="resize-none mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              {isLoading ? (
                <Button disabled className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading || !messageContent}>
                  Send It
                </Button>
              )}
            </div>
          </form>
        </Form>

        <Separator className="my-8 dark:border-gray-700" />
        <div className="text-center">
          <div className="mb-4 text-lg text-gray-600 dark:text-gray-400">
            Want your own Message Board?
          </div>
          <Link href={"/sign-up"}>
            <Button>Create Your Account</Button>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-white">
          Need help crafting your message?
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          Use our AI Message Assistant to help you write the perfect message
        </p>
        <AIMessageAssistant />
      </div>
    </div>
  );
}
