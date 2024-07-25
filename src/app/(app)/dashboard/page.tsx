"use client";

import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/User";
import { useCallback, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";

export default function page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState<boolean | null>(null);
  const { toast } = useToast();
  const { data: session } = useSession();

  const DeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const fetchAcceptMessage = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/acceptmessage");
      setValue(response.data.message); // Assuming the response has { success: true, message: boolean }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data?.message ?? "Failed to fetch message",
      });
    } finally {
      setIsLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/fetch-messages");
      setMessages(response.data.messages || []);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data?.message ?? "Failed to fetch messages",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!session || !session.user) return;

    fetchAcceptMessage();
    fetchMessages();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);
  const toggleAcceptMessages = useCallback(async () => {
    if (value === null) return; // Ensure value is not null

    setIsLoading(true);
    try {
      const response = await axios.post("/api/acceptmessage", {
        acceptMessage: !value,
      });
      setValue(!value); // Toggle the current value
      toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data?.message ?? "Failed to update status",
      });
    } finally {
      setIsLoading(false);
    }
  }, [value, toast]);

  if (!session || !session.user) {
    return <div>login plz</div>;
  }
  return <div></div>;
}
