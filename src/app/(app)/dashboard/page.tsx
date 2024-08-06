"use client";

import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/User";
import { useCallback, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { Switch } from "@headlessui/react";
import { Loader, Placeholder } from "rsuite";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { motion } from "framer-motion";
import { IconButton } from "@material-tailwind/react";
import { useCopyToClipboard } from "usehooks-ts";
import { CheckIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
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
      if (axiosError.response?.data?.message != "No message found") {
        toast({
          title: "Error",
          description:
            axiosError.response?.data?.message ?? "Failed to fetch messages",
        });
      }
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

  const [valuec, copy] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);
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
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
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
          className="mb-5 text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold text-neutral-700 dark:text-white max-w-3xl leading-relaxed lg:leading-snug mx-auto px-2 sm:px-4"
        >
          Your Link{" "}
          <div
            className="cursor-pointer inline-block"
            onClick={() => copyToClipboard()}
          >
            <Highlight className="text-black dark:text-white break-all">
              {profileUrl}
            </Highlight>
          </div>
          <IconButton
            onMouseLeave={() => setCopied(false)}
            onClick={() => {
              copyToClipboard();
              setCopied(true);
            }}
            className="ml-2"
          >
            {copied ? (
              <CheckIcon className="h-5 w-5 text-white" />
            ) : (
              <DocumentDuplicateIcon className="h-5 w-5 text-white" />
            )}
          </IconButton>
        </motion.h1>

        <div className="flex flex-col sm:flex-row items-center justify-evenly mt-5 space-y-3 sm:space-y-0">
          {value ? (
            <p className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
              Accepting messages
            </p>
          ) : (
            <p className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
              Not Accepting messages
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

      <div className="max-w-5xl mx-auto">
        <p className="text-2xl sm:text-4xl md:text-4xl lg:text-5xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 mt-3 sm:mt-4 md:mt-5 lg:mt-6 text-center">
          Number of messages: {messages.length}
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
          <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-slate-700 h-10 w-10"></div>
              <div className="flex-1 space-y-6 py-1">
                <div className="h-2 bg-slate-700 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-slate-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
