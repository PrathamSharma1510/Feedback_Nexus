"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Plus,
  Trash2,
  Edit2,
  Link as LinkIcon,
  MessageSquare,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import axios from "axios";

interface FeedbackPage {
  _id: string;
  title: string;
  description: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
}

export default function FeedbackPages() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [feedbackPages, setFeedbackPages] = useState<FeedbackPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPage, setNewPage] = useState({ title: "", description: "" });
  const [isRefiningTitle, setIsRefiningTitle] = useState(false);
  const [isRefiningDescription, setIsRefiningDescription] = useState(false);
  const [showAiPrompt, setShowAiPrompt] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    } else if (status === "authenticated") {
      fetchFeedbackPages();
    }
  }, [status, router]);

  const fetchFeedbackPages = async () => {
    try {
      const response = await fetch("/api/feedback-pages");
      const data = await response.json();
      if (data.success) {
        setFeedbackPages(data.data);
      }
    } catch (error) {
      console.error("Error fetching feedback pages:", error);
      toast({
        title: "Error",
        description: "Failed to fetch feedback pages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that both title and description are provided
    if (!newPage.title.trim() || !newPage.description.trim()) {
      toast({
        title: "Error",
        description: "Both title and description are required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/feedback-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPage),
      });
      const data = await response.json();
      if (data.success) {
        setFeedbackPages([data.data, ...feedbackPages]);
        setNewPage({ title: "", description: "" });
        setShowCreateForm(false);
        toast({
          title: "Success",
          description: "Feedback page created successfully",
        });
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating feedback page:", error);
      toast({
        title: "Error",
        description: "Failed to create feedback page",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePage = async (slug: string) => {
    setPageToDelete(slug);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!pageToDelete) return;

    try {
      const response = await fetch(`/api/feedback-pages/${pageToDelete}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setFeedbackPages(
          feedbackPages.filter((page) => page.slug !== pageToDelete)
        );
        toast({
          title: "Success",
          description: "Feedback page deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting feedback page:", error);
      toast({
        title: "Error",
        description: "Failed to delete feedback page",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setPageToDelete(null);
    }
  };

  const refineTitle = async () => {
    if (!newPage.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title to refine",
        variant: "destructive",
      });
      return;
    }

    setIsRefiningTitle(true);
    try {
      const response = await axios.post("/api/ai/improve", {
        message: newPage.title,
        options: { tone: "professional", length: "short", style: "direct" },
      });

      setNewPage({ ...newPage, title: response.data.content });
      toast({
        title: "Success",
        description: "Title refined successfully",
      });
    } catch (error) {
      console.error("Error refining title:", error);
      toast({
        title: "Error",
        description: "Failed to refine title",
        variant: "destructive",
      });
    } finally {
      setIsRefiningTitle(false);
    }
  };

  const refineDescription = async () => {
    if (!newPage.description.trim()) {
      toast({
        title: "Error",
        description: "Please enter a description to refine",
        variant: "destructive",
      });
      return;
    }

    setIsRefiningDescription(true);
    try {
      const response = await axios.post("/api/ai/improve", {
        message: newPage.description,
        options: { tone: "professional", length: "medium", style: "elaborate" },
      });

      setNewPage({ ...newPage, description: response.data.content });
      toast({
        title: "Success",
        description: "Description refined successfully",
      });
    } catch (error) {
      console.error("Error refining description:", error);
      toast({
        title: "Error",
        description: "Failed to refine description",
        variant: "destructive",
      });
    } finally {
      setIsRefiningDescription(false);
    }
  };

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to generate content",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await axios.post("/api/ai/generate", {
        prompt: `Create a feedback page with the following details: ${aiPrompt}. 
        Provide the response in this exact format:
        TITLE: [Your title here]
        DESCRIPTION: [Your description here]`,
        options: { tone: "professional", length: "medium", style: "direct" },
      });

      const content = response.data.content;

      // Extract title and description from the response
      const titleMatch = content.match(/TITLE:\s*(.*?)(?:\n|$)/);
      const descriptionMatch = content.match(/DESCRIPTION:\s*(.*?)(?:\n|$)/);

      if (titleMatch && descriptionMatch) {
        setNewPage({
          title: titleMatch[1].trim(),
          description: descriptionMatch[1].trim(),
        });
        setShowAiPrompt(false);
        toast({
          title: "Success",
          description: "Page content generated successfully",
        });
      } else {
        throw new Error("Failed to parse AI response");
      }
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Error",
        description: "Failed to generate page content",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Feedback Pages</h1>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Page
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Feedback Page</CardTitle>
            <CardDescription>
              Create a new page to collect anonymous feedback
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleCreatePage}>
            <CardContent className="space-y-4">
              {!showAiPrompt ? (
                <div className="flex justify-end mb-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAiPrompt(true)}
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate with AI
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 mb-4 p-4 border rounded-md bg-muted/20">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">AI Generation</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAiPrompt(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="aiPrompt" className="text-sm font-medium">
                      Describe your feedback page
                    </label>
                    <Textarea
                      id="aiPrompt"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="E.g., A feedback page for my new mobile app about fitness tracking"
                      className="min-h-[100px]"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={generateWithAI}
                    disabled={isGenerating || !aiPrompt.trim()}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={refineTitle}
                    disabled={isRefiningTitle || !newPage.title.trim()}
                  >
                    {isRefiningTitle ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Refining...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-3 w-3 mr-1" />
                        Refine
                      </>
                    )}
                  </Button>
                </div>
                <Input
                  id="title"
                  value={newPage.title}
                  onChange={(e) =>
                    setNewPage({ ...newPage, title: e.target.value })
                  }
                  placeholder="Enter page title"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={refineDescription}
                    disabled={
                      isRefiningDescription || !newPage.description.trim()
                    }
                  >
                    {isRefiningDescription ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Refining...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-3 w-3 mr-1" />
                        Refine
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  id="description"
                  value={newPage.description}
                  onChange={(e) =>
                    setNewPage({ ...newPage, description: e.target.value })
                  }
                  placeholder="Enter page description"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Page"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feedbackPages.map((page) => (
          <Card key={page._id}>
            <CardHeader>
              <CardTitle>{page.title}</CardTitle>
              <CardDescription>{page.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Created: {new Date(page.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(
                      `/feedback/${page.slug}`,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  View Page
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(`/feedback-pages/${page.slug}/messages`)
                  }
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Messages
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeletePage(page.slug)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Feedback Page"
        description="Are you sure you want to delete this feedback page? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
