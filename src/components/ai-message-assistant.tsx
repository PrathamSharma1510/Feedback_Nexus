"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Wand2, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

type MessageTone = "formal" | "casual" | "friendly" | "professional";
type MessageLength = "short" | "medium" | "long";
type MessageStyle = "direct" | "elaborate" | "persuasive";

export function AIMessageAssistant() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [message, setMessage] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [improvedContent, setImprovedContent] = useState("");
  const [tone, setTone] = useState<MessageTone>("friendly");
  const [length, setLength] = useState<MessageLength>("medium");
  const [style, setStyle] = useState<MessageStyle>("direct");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/api/ai/generate", {
        prompt,
        options: { tone, length, style },
      });
      setGeneratedContent(response.data.content);
      toast({
        title: "Success",
        description: "Message generated successfully",
      });
    } catch (error) {
      console.error("Error generating message:", error);
      toast({
        title: "Error",
        description: "Failed to generate message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImprove = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message to improve",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/api/ai/improve", {
        message,
        options: { tone, length, style },
      });
      setImprovedContent(response.data.content);
      toast({
        title: "Success",
        description: "Message improved successfully",
      });
    } catch (error) {
      console.error("Error improving message:", error);
      toast({
        title: "Error",
        description: "Failed to improve message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          AI Message Assistant
        </CardTitle>
        <CardDescription>
          Use AI to generate or improve your messages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="improve">Improve</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Prompt</label>
              <Textarea
                placeholder="Describe what you want to write a message about..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tone</label>
                <Select
                  value={tone}
                  onValueChange={(value) => setTone(value as MessageTone)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Length</label>
                <Select
                  value={length}
                  onValueChange={(value) => setLength(value as MessageLength)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Style</label>
                <Select
                  value={style}
                  onValueChange={(value) => setStyle(value as MessageStyle)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">Direct</SelectItem>
                    <SelectItem value="elaborate">Elaborate</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Message
                </>
              )}
            </Button>

            {generatedContent && (
              <div className="space-y-2 mt-4">
                <label className="text-sm font-medium">Generated Message</label>
                <div className="relative">
                  <Textarea
                    value={generatedContent}
                    readOnly
                    className="min-h-[150px] pr-10"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(generatedContent)}
                  >
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
                      className="lucide lucide-copy"
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="improve" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Message to Improve</label>
              <Textarea
                placeholder="Enter your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tone</label>
                <Select
                  value={tone}
                  onValueChange={(value) => setTone(value as MessageTone)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Length</label>
                <Select
                  value={length}
                  onValueChange={(value) => setLength(value as MessageLength)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Style</label>
                <Select
                  value={style}
                  onValueChange={(value) => setStyle(value as MessageStyle)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">Direct</SelectItem>
                    <SelectItem value="elaborate">Elaborate</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleImprove}
              disabled={isLoading || !message.trim()}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Improving...
                </>
              ) : (
                <>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Improve Message
                </>
              )}
            </Button>

            {improvedContent && (
              <div className="space-y-2 mt-4">
                <label className="text-sm font-medium">Improved Message</label>
                <div className="relative">
                  <Textarea
                    value={improvedContent}
                    readOnly
                    className="min-h-[150px] pr-10"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(improvedContent)}
                  >
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
                      className="lucide lucide-copy"
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">AI Message Assistant</p>
      </CardFooter>
    </Card>
  );
}
