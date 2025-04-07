"use client";

import { useToast } from "@/components/ui/use-toast";
import { useCallback, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  Loader2,
  ArrowLeft,
  Trash2,
  Link as LinkIcon,
  Copy,
  Check,
} from "lucide-react";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { Button } from "@/components/ui/button";
import { Switch } from "@headlessui/react";
import { useCopyToClipboard } from "usehooks-ts";
import { CheckIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";

interface Message {
  _id: string;
  content: string;
  createdAt: string;
}

interface FeedbackPage {
  title: string;
  description: string;
  slug: string;
  isAcceptingMessages: boolean;
}

export default function FeedbackPageMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState("");
  const [pageDescription, setPageDescription] = useState("");
  const [isAcceptingMessages, setIsAcceptingMessages] = useState(true);
  const [copied, setCopied] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(
    null
  );
  const [isToggling, setIsToggling] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      setPageUrl(`${baseUrl}/feedback/${slug}`);
    }
  }, [slug]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    toast({
      title: "URL Copied!",
      description: "Page URL has been copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const deleteMessage = async (messageId: string) => {
    try {
      setDeletingMessageId(messageId);
      const response = await axios.delete(
        `/api/feedback-pages/${slug}/messages/${messageId}`
      );

      if (response.data.success) {
        setMessages(messages.filter((message) => message._id !== messageId));
        toast({
          title: "Success",
          description: "Message deleted successfully",
        });
      } else {
        throw new Error(response.data.message || "Failed to delete message");
      }
    } catch (error: any) {
      console.error("Error deleting message:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete message",
        variant: "destructive",
      });
    } finally {
      setDeletingMessageId(null);
    }
  };

  const toggleMessageAcceptance = async () => {
    try {
      setIsToggling(true);

      // Optimistically update the UI
      const newState = !isAcceptingMessages;
      setIsAcceptingMessages(newState);

      const response = await axios.post(
        `/api/feedback-pages/${slug}/toggle-messages`,
        {},
        {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      );

      if (response.data.success) {
        // Update with the server response
        setIsAcceptingMessages(response.data.isAcceptingMessages);
        toast({
          title: "Success",
          description: response.data.message,
        });
      } else {
        // Revert on failure
        setIsAcceptingMessages(!newState);
        throw new Error(
          response.data.message || "Failed to toggle message acceptance"
        );
      }
    } catch (error: any) {
      console.error("Error toggling message acceptance:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to toggle message acceptance",
        variant: "destructive",
      });
    } finally {
      setIsToggling(false);
    }
  };

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/feedback-pages/${slug}/messages`, {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });
      if (response.data.success) {
        setMessages(response.data.data || []);
        setPageTitle(response.data.pageTitle);
        setPageDescription(response.data.pageDescription);
        setIsAcceptingMessages(response.data.isAcceptingMessages === true);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  }, [slug, toast]);

  const fetchPageDetails = useCallback(async () => {
    try {
      const response = await axios.get(`/api/feedback-pages/${slug}`, {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });
      if (response.data.success) {
        setPageTitle(response.data.data.title);
        setPageDescription(response.data.data.description);
        setIsAcceptingMessages(response.data.data.isAcceptingMessages === true);
      }
    } catch (error) {
      console.error("Error fetching page details:", error);
    }
  }, [slug]);

  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();
    fetchPageDetails();
  }, [session, fetchMessages, fetchPageDetails]);

  if (!session || !session.user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div role="status">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Button
              variant="ghost"
              className="mb-4 text-neutral-400 hover:text-white"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold mb-2">{pageTitle}</h1>
            <p className="text-neutral-400">{pageDescription}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={toggleMessageAcceptance}
              disabled={isToggling}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isAcceptingMessages
                  ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30"
                  : "bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/30"
              }`}
            >
              {isToggling ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isAcceptingMessages ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-ban"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                  </svg>
                  Stop Accepting
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-check-circle"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Start Accepting
                </>
              )}
            </Button>
            <Button
              onClick={copyToClipboard}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 border border-indigo-500/30 transition-all duration-200"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Messages Section */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Messages</h2>
            <p className="text-neutral-400">Total: {messages.length}</p>
          </div>

          {isInitialLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                >
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-10 text-neutral-400">
              <p>No messages yet.</p>
              <p className="mt-2">
                Share your feedback page to start receiving messages.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-white mb-2">{message.content}</p>
                      <p className="text-sm text-neutral-400">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      onClick={() => deleteMessage(message._id)}
                      disabled={deletingMessageId === message._id}
                    >
                      {deletingMessageId === message._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
