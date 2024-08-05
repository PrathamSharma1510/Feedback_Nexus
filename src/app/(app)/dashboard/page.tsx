"use client";

import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/User";
import { useCallback, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { Switch } from "@headlessui/react";
import dayjs from "dayjs";
import { HoverEffect } from "@/components/ui/card-hover-effect";

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState<boolean>(false); // Changed initial state to false
  const { toast } = useToast();
  const { data: session } = useSession();

  const DeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
    toast({
      title: "Success",
      description: "Message was deleted successfully",
    });
    Deletefullmessage(messageId, session?.user.username);
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
  }, [toast]);

  const Deletefullmessage = async (messageId: string, username: string) => {
    try {
      await axios.post("/api/delete-message", {
        messageId,
        username,
      });
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/getmessages");
      console.log(response.data);
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
  }, [session, fetchAcceptMessage, fetchMessages]);

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

  const [profileUrl, setProfileUrl] = useState("");

  useEffect(() => {
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    if (session?.user.username) {
      setProfileUrl(`${baseUrl}/u/${session?.user.username}`);
    }
  }, [session]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard.",
    });
  };

  if (!session || !session.user) {
    return (
      <div className="flex justify-center items-center h-screen">
        Please log in
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Messages</h1>
        <Switch
          checked={value} // Added checked prop
          onChange={toggleAcceptMessages}
          className={`${value ? "bg-blue-500" : "bg-gray-300"}
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
        >
          <span
            className={`${value ? "translate-x-6" : "translate-x-1"}
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded-md flex items-center space-x-2"
        onClick={() => copyToClipboard()}
      >
        <div>{profileUrl}</div>
        <span>Copy Link</span>
      </button>
      <div className="max-w-5xl mx-auto px-8">
        <HoverEffect items={messages} />
      </div>
      {/* <div className="grid gap-4 mt-4">
        {messages.map((message) => (
          <div
            className="p-4 bg-white shadow-md rounded-lg flex justify-between items-start"
            key={message._id}
          >
            <div>
              <p className="text-lg font-semibold">{message.content}</p>
              <p className="text-sm text-gray-500">
                {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="bg-red-500 text-white px-3 py-1 rounded-md"
                onClick={() => DeleteMessage(message._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div> */}
      {isLoading && (
        <div className="flex justify-center items-center mt-4">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
}
