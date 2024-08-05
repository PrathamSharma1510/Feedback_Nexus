"use client";

import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/User";
import { useCallback, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { Switch } from "@headlessui/react";
import dayjs from "dayjs";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
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
    if (typeof window !== "undefined" && session?.user.username) {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
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
    <div>
      <HeroHighlight>
        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className="mb-5 text-2xl px-4 md:text-4xl lg:text-3xl font-bold text-neutral-700 dark:text-white max-w-3xl leading-relaxed lg:leading-snug mx-auto "
        >
          Your Link{" "}
          <div className="cursor-pointer" onClick={() => copyToClipboard()}>
            <Highlight className="text-black dark:text-white">
              {profileUrl}
            </Highlight>
          </div>
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 p-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-100">
            Click to Copy
          </div>
        </motion.h1>
        <div className="flex justify-evenly mt-5">
          {value ? (
            <>
              <p className="text-4xl font-bold  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
                Accepting message
              </p>
            </>
          ) : (
            <p className="text-3xl font-bold  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
              Not Accepting message
            </p>
          )}
          <Switch
            checked={value}
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
      </HeroHighlight>
      <div className="max-w-5xl mx-auto px-8">
        <p className="text-4xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 mt-5">
          Number of messages :- {messages.length}
        </p>
        <HoverEffect items={messages} onDeleteMessage={DeleteMessage} />
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
