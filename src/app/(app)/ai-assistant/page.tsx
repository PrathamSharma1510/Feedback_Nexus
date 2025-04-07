"use client";

import { useSession } from "next-auth/react";
import { AIMessageAssistant } from "@/components/ai-message-assistant";
import { Loader2 } from "lucide-react";

export default function AIAssistantPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">AI Message Assistant</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to use the AI Message Assistant.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          AI Message Assistant
        </h1>
        <p className="text-muted-foreground mb-8 text-center">
          Use AI to generate, improve, or get reply suggestions for your
          messages. This feature helps you create better messages with the power
          of artificial intelligence.
        </p>
        <AIMessageAssistant />
      </div>
    </div>
  );
}
