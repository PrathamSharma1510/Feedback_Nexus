"use client";

import { useToast } from "@/components/ui/use-toast";
import { useCallback, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { motion } from "framer-motion";
import {
  UserCircleIcon,
  PlusIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { Button } from "@/components/ui/moving-border";
import Link from "next/link";
import { MessageList } from "@/components/ui/message-list";
import { Loader2 } from "lucide-react";

interface Message {
  _id: string;
  content: string;
  createdAt: string;
  feedbackPage: {
    title: string;
  };
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const [todayMessages, setTodayMessages] = useState(0);
  const [activePages, setActivePages] = useState(0);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/getmessages");
      if (response.data.success) {
        setMessages(response.data.data || []);
        // Calculate today's messages
        const today = new Date().toISOString().split("T")[0];
        const todayCount = (response.data.data || []).filter(
          (msg: Message) =>
            new Date(msg.createdAt).toISOString().split("T")[0] === today
        ).length;
        setTodayMessages(todayCount);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message !== "No message found") {
        toast({
          title: "Error",
          description:
            axiosError.response?.data?.message ?? "Failed to fetch messages",
        });
      }
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  }, [toast]);

  // Fetch active pages count
  const fetchActivePages = useCallback(async () => {
    try {
      const response = await axios.get("/api/feedback-pages");
      if (response.data.success) {
        const pages = response.data.data || [];
        const activePagesCount = pages.filter(
          (page: any) => page.isActive
        ).length;
        setActivePages(activePagesCount);
      }
    } catch (error) {
      console.error("Error fetching active pages:", error);
      toast({
        title: "Error",
        description: "Failed to fetch active pages",
      });
    }
  }, [toast]);

  useEffect(() => {
    if (!session || !session.user) return;

    // Fetch initial data
    fetchMessages();
    fetchActivePages();

    // Set up periodic refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchMessages();
      fetchActivePages();
    }, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(refreshInterval);
  }, [session, fetchMessages, fetchActivePages]);

  if (status === "loading" || !session || !session.user) {
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
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back
              {session?.user?.username ? `, ${session.user.username}` : ""}!
            </h1>
            <p className="text-neutral-400">
              Manage your feedback and messages
            </p>
          </div>
          <Link
            href="/profile"
            className="flex items-center space-x-2 text-neutral-300 hover:text-white transition-colors"
          >
            <UserCircleIcon className="h-8 w-8" />
            <span className="hidden sm:inline">Profile</span>
          </Link>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg text-neutral-400 mb-2">Total Messages</h3>
            <p className="text-3xl font-bold text-white">{messages.length}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg text-neutral-400 mb-2">
              Today&apos;s Messages
            </h3>
            <p className="text-3xl font-bold text-white">{todayMessages}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg text-neutral-400 mb-2">Active Pages</h3>
            <p className="text-3xl font-bold text-white">{activePages}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/feedback-pages"
            className="bg-[#7C3AED] hover:bg-[#6D28D9] p-4 rounded-xl text-white text-center transition-colors duration-200"
          >
            <PlusIcon className="h-6 w-6 mx-auto mb-2" />
            <span>New Page</span>
          </Link>
          <Link
            href="/settings"
            className="bg-[#3B82F6] hover:bg-[#2563EB] p-4 rounded-xl text-white text-center transition-colors duration-200"
          >
            <Cog6ToothIcon className="h-6 w-6 mx-auto mb-2" />
            <span>Settings</span>
          </Link>
          <Link
            href="/analytics"
            className="bg-[#10B981] hover:bg-[#059669] p-4 rounded-xl text-white text-center transition-colors duration-200"
          >
            <ChartBarIcon className="h-6 w-6 mx-auto mb-2" />
            <span>Analytics</span>
          </Link>
        </div>

        {/* Messages Section */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Messages</h2>
            <p className="text-neutral-400">Total: {messages.length}</p>
          </div>
          {isInitialLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-10 text-neutral-400">
              <p>
                No messages yet. Create a feedback page to start receiving
                messages.
              </p>
            </div>
          ) : (
            <MessageList items={messages} />
          )}
        </div>
      </div>
    </div>
  );
}
