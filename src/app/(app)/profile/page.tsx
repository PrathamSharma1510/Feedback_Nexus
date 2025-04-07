"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

interface UserProfile {
  username: string;
  displayName?: string;
  bio?: string;
  profilePicture?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    website?: string;
  };
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    username: session?.user?.username || "",
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await axios.get(
        `/api/profile/${session?.user?.username}`
      );
      setProfile(response.data);
      if (response.data.profilePicture) {
        setPreviewUrl(response.data.profilePicture);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    }
  }, [session?.user?.username, toast]);

  useEffect(() => {
    if (session?.user?.username) {
      fetchUserProfile();
    }
  }, [session, fetchUserProfile]);

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", profile.username);
      formData.append("displayName", profile.displayName || "");
      formData.append("bio", profile.bio || "");
      formData.append("twitter", profile.socialLinks?.twitter || "");
      formData.append("github", profile.socialLinks?.github || "");
      formData.append("website", profile.socialLinks?.website || "");

      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      await axios.post("/api/profile/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile information and profile picture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-primary/20">
                      <AvatarImage
                        src={previewUrl || ""}
                        alt={profile.username}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-4xl bg-primary/10">
                        {profile.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 right-0">
                      <Label
                        htmlFor="profilePicture"
                        className="cursor-pointer"
                      >
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="rounded-full h-8 w-8 p-0 bg-background"
                          onClick={() =>
                            document.getElementById("profilePicture")?.click()
                          }
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
                            className="lucide lucide-camera"
                          >
                            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                            <circle cx="12" cy="13" r="3" />
                          </svg>
                        </Button>
                      </Label>
                    </div>
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                    id="profilePicture"
                  />
                  <p className="text-sm text-muted-foreground">
                    Click the camera icon to change your profile picture
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profile.username}
                      disabled
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={profile.displayName || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, displayName: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, bio: e.target.value })
                      }
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>Add your social media profiles</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      value={profile.socialLinks?.twitter || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          socialLinks: {
                            ...profile.socialLinks,
                            twitter: e.target.value,
                          },
                        })
                      }
                      className="mt-1"
                      placeholder="https://twitter.com/username"
                    />
                  </div>

                  <div>
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      value={profile.socialLinks?.github || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          socialLinks: {
                            ...profile.socialLinks,
                            github: e.target.value,
                          },
                        })
                      }
                      className="mt-1"
                      placeholder="https://github.com/username"
                    />
                  </div>

                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={profile.socialLinks?.website || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          socialLinks: {
                            ...profile.socialLinks,
                            website: e.target.value,
                          },
                        })
                      }
                      className="mt-1"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
