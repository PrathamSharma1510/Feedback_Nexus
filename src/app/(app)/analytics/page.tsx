"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { generateMessageContent } from "@/lib/ai-service";
import { Loader2 } from "lucide-react";

interface Message {
  _id: string;
  content: string;
  createdAt: string;
  feedbackPage: {
    title: string;
  };
}

interface FeedbackPage {
  _id: string;
  title: string;
  isActive: boolean;
}

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [pages, setPages] = useState<FeedbackPage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState<string>("");
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastGeneratedTime, setLastGeneratedTime] = useState<number>(0);
  const DEBOUNCE_TIME = 5000; // 5 seconds debounce

  // Helper functions for data analysis
  const getMostActiveTime = useCallback((msgs: Message[]) => {
    if (msgs.length === 0) return "No data";

    const hourCounts: Record<number, number> = {};
    msgs.forEach((msg) => {
      const hour = new Date(msg.createdAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const mostActiveHour = Object.entries(hourCounts).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];

    return `${mostActiveHour}:00`;
  }, []);

  const getMostCommonPage = (msgs: Message[]) => {
    if (msgs.length === 0) return "No data";

    const pageCounts: Record<string, number> = {};
    msgs.forEach((msg) => {
      const pageTitle = msg.feedbackPage.title;
      pageCounts[pageTitle] = (pageCounts[pageTitle] || 0) + 1;
    });

    return Object.entries(pageCounts).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];
  };

  // Fetch messages and pages
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [messagesRes, pagesRes] = await Promise.all([
        axios.get("/api/getmessages"),
        axios.get("/api/feedback-pages"),
      ]);

      if (messagesRes.data.success) {
        setMessages(messagesRes.data.data || []);
      } else {
        throw new Error(messagesRes.data.message || "Failed to fetch messages");
      }

      if (pagesRes.data.success) {
        setPages(pagesRes.data.data || []);
      } else {
        throw new Error(pagesRes.data.message || "Failed to fetch pages");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch analytics data. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  }, [toast]);

  // Generate AI insights
  const generateInsights = useCallback(async () => {
    // Prevent multiple clicks within debounce time
    const now = Date.now();
    if (now - lastGeneratedTime < DEBOUNCE_TIME) {
      toast({
        title: "Please wait",
        description: "Please wait a few seconds before generating new insights",
        variant: "default",
      });
      return;
    }

    if (messages.length === 0) return;

    setIsGeneratingInsights(true);
    setError(null);
    try {
      // Calculate engagement metrics
      const todayMessages = messages.filter(
        (msg) =>
          new Date(msg.createdAt).toISOString().split("T")[0] ===
          new Date().toISOString().split("T")[0]
      ).length;

      const last7DaysMessages = messages.filter((msg) => {
        const msgDate = new Date(msg.createdAt);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return msgDate >= sevenDaysAgo;
      }).length;

      const avgMessagesPerDay = last7DaysMessages / 7;
      const messageGrowth =
        ((todayMessages - avgMessagesPerDay) / avgMessagesPerDay) * 100;

      // Group messages by page for sentiment analysis
      const pageMessages: Record<string, string[]> = {};
      messages.forEach((msg) => {
        const pageTitle = msg.feedbackPage.title;
        if (!pageMessages[pageTitle]) {
          pageMessages[pageTitle] = [];
        }
        pageMessages[pageTitle].push(msg.content);
      });

      // Prepare page-specific data for analysis
      const pageData = Object.entries(pageMessages).map(
        ([pageTitle, contents]) => {
          // Take a sample of messages if there are too many (max 10 per page)
          const sampleSize = Math.min(contents.length, 10);
          const sampledContents = contents.slice(0, sampleSize);

          return {
            pageTitle,
            messageCount: contents.length,
            sampleContents: sampledContents,
          };
        }
      );

      const prompt =
        "As an AI analyst, provide clear and structured insights based on this feedback data:\n\n" +
        "Current Metrics:\n" +
        `- Total messages: ${messages.length}\n` +
        `- Messages today: ${todayMessages}\n` +
        `- Active pages: ${pages.filter((page) => page.isActive).length}\n` +
        `- 7-day message average: ${avgMessagesPerDay.toFixed(1)}\n` +
        `- Daily growth rate: ${messageGrowth.toFixed(1)}%\n` +
        `- Peak activity time: ${getMostActiveTime(messages)}\n\n` +
        "Page-specific data:\n" +
        pageData
          .map(
            (page) =>
              `Page: ${page.pageTitle}\n` +
              `- Message count: ${page.messageCount}\n` +
              `- Sample feedback: ${page.sampleContents.join(" | ")}\n`
          )
          .join("\n") +
        "\nProvide a structured analysis in this exact format:\n\n" +
        "1. Key Trends and Patterns:\n" +
        "For each page:\n" +
        "- Sentiment Score (1-5, where 1=very negative, 5=very positive)\n" +
        "- Key themes identified (if any)\n" +
        "- User engagement level (Low/Medium/High)\n" +
        "- Notable patterns in feedback (if any)\n\n" +
        "2. Actionable Recommendations:\n" +
        "For each page:\n" +
        "- Specific improvements based on sentiment (if data is sufficient)\n" +
        "- Engagement strategies (if data is sufficient)\n" +
        "- Content suggestions (if data is sufficient)\n" +
        "- Priority level (High/Medium/Low)\n\n" +
        "CRITICAL INSTRUCTIONS:\n" +
        "- ONLY make recommendations that are DIRECTLY supported by the feedback data provided\n" +
        '- If there is insufficient data to make a specific recommendation, state "Insufficient data to make this recommendation"\n' +
        "- DO NOT make up recommendations that aren't supported by the data\n" +
        "- DO NOT add any conclusions, signatures, or additional text outside the requested format\n" +
        '- DO NOT include phrases like "In conclusion" or "Best regards"\n' +
        "- DO NOT include any personal information or signatures\n" +
        '- If you can\'t determine something with confidence, say "Not enough data to determine"\n' +
        "- Keep each section concise and data-driven\n" +
        "- ONLY include the two sections requested (Key Trends and Patterns, Actionable Recommendations)\n" +
        "- DO NOT add any additional sections or text\n" +
        "- DO NOT use any markdown formatting like asterisks (**), underscores, or other special characters\n" +
        "- DO NOT use any formatting characters at all - just plain text\n" +
        "- DO NOT use bold, italic, or any other text formatting\n" +
        "- DO NOT use any special characters for emphasis";

      const response = await axios.post("/api/ai/generate", {
        prompt,
        options: {
          tone: "professional",
          length: "medium",
          style: "structured",
        },
      });

      if (response.data.success) {
        setAiInsights(response.data.content);
        setLastGeneratedTime(now);
      } else {
        throw new Error(response.data.message || "Failed to generate insights");
      }
    } catch (error) {
      console.error("Error generating insights:", error);
      setError("Failed to generate AI insights. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to generate AI insights",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingInsights(false);
    }
  }, [messages, pages, toast, getMostActiveTime, lastGeneratedTime]);

  // Prepare data for charts
  const prepareMessageData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    return last7Days.map((date) => {
      const count = messages.filter(
        (msg) => msg.createdAt.split("T")[0] === date
      ).length;
      return { date, count };
    });
  };

  const preparePageData = () => {
    const pageCounts: Record<string, number> = {};
    messages.forEach((msg) => {
      const pageTitle = msg.feedbackPage.title;
      pageCounts[pageTitle] = (pageCounts[pageTitle] || 0) + 1;
    });

    return Object.entries(pageCounts).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  useEffect(() => {
    if (session?.user) {
      fetchData();
    }
  }, [session, fetchData]);

  if (!session?.user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div role="status">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-900 rounded-xl p-6 border border-gray-800"
              >
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
                  <div className="h-8 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-gray-900 rounded-xl p-6 border border-gray-800"
              >
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
                  <div className="h-80 bg-gray-800 rounded"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="h-40 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const messageData = prepareMessageData();
  const pageData = preparePageData();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg text-neutral-400 mb-2">Total Messages</h3>
            <p className="text-3xl font-bold">{messages.length}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg text-neutral-400 mb-2">Active Pages</h3>
            <p className="text-3xl font-bold">
              {pages.filter((p) => p.isActive).length}
            </p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg text-neutral-400 mb-2">Most Active Time</h3>
            <p className="text-3xl font-bold">{getMostActiveTime(messages)}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Message Trend Chart */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-xl font-semibold mb-4">
              Message Trend (Last 7 Days)
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={messageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ fill: "#8884d8" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Page Distribution Chart */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-xl font-semibold mb-4">Messages by Page</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => {
                      const truncatedName =
                        name.length > 15 ? `${name.substring(0, 15)}...` : name;
                      return `${truncatedName}: ${(percent * 100).toFixed(0)}%`;
                    }}
                  >
                    {pageData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      color: "#fff",
                    }}
                    formatter={(value: number, name: string) => [
                      `${name}: ${value} messages`,
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">AI-Powered Insights</h3>
            <button
              onClick={generateInsights}
              disabled={
                isGeneratingInsights ||
                Date.now() - lastGeneratedTime < DEBOUNCE_TIME
              }
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isGeneratingInsights ||
                Date.now() - lastGeneratedTime < DEBOUNCE_TIME
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isGeneratingInsights ? "Generating..." : "Refresh Insights"}
            </button>
          </div>

          {aiInsights ? (
            <div className="prose prose-invert max-w-none">
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <h4 className="text-lg font-medium text-blue-400 mb-2">
                  1. Key Trends and Patterns
                </h4>
                <div className="pl-4 border-l-2 border-blue-500">
                  {aiInsights.split("\n").map((line, index) => {
                    // Check if this line starts a new section
                    if (line.includes("2. Actionable Recommendations")) {
                      return null;
                    }
                    // Skip the section header itself
                    if (line.includes("1. Key Trends and Patterns")) {
                      return null;
                    }
                    // Only show lines that are part of the first section
                    if (line.trim() && !line.includes("2.")) {
                      return (
                        <p key={index} className="mb-2">
                          {line}
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-lg font-medium text-green-400 mb-2">
                  2. Actionable Recommendations
                </h4>
                <div className="pl-4 border-l-2 border-green-500">
                  {aiInsights.split("\n").map((line, index) => {
                    // Check if this line starts a new section
                    if (line.includes("1. Key Trends and Patterns")) {
                      return null;
                    }
                    // Skip the section header itself
                    if (line.includes("2. Actionable Recommendations")) {
                      return null;
                    }
                    // Only show lines that are part of the second section
                    if (
                      (line.trim() && line.includes("2.")) ||
                      (line.trim() &&
                        !line.includes("1.") &&
                        aiInsights.indexOf(line) >
                          aiInsights.indexOf("2. Actionable Recommendations"))
                    ) {
                      return (
                        <p key={index} className="mb-2">
                          {line}
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-40">
              <p className="text-neutral-400">No insights available yet</p>
            </div>
          )}
        </div>

        {/* Hourly Activity Chart */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-xl font-semibold mb-4">Hourly Activity</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getHourlyData(messages)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="hour" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get hourly data
function getHourlyData(messages: Message[]) {
  const hourCounts: Record<number, number> = {};

  // Initialize all hours with 0
  for (let i = 0; i < 24; i++) {
    hourCounts[i] = 0;
  }

  // Count messages by hour
  messages.forEach((msg) => {
    const hour = new Date(msg.createdAt).getHours();
    hourCounts[hour]++;
  });

  // Convert to array format for chart
  return Object.entries(hourCounts).map(([hour, count]) => ({
    hour: `${hour}:00`,
    count,
  }));
}
