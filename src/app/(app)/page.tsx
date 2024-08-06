"use client";
import Image from "next/image";
import { FlipWords } from "../../../src/components/ui/flip-words";
import { Spotlight } from "@/components/ui/spotlight";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { WavyBackgroundcontent } from "@/components/wavy";
import { features } from "process";
import { Boxes } from "@/components/ui/background-boxes";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useState } from "react";
export default function Home() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Manage loading state

  const demosigin = async () => {
    setLoading(true); // Start loader

    const result = await signIn("credentials", {
      redirect: false,
      identifier: "Demo_user",
      password: "123456",
    });
    if (result?.error) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Sign-in failed",
        description: result.error,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } else if (result?.url) {
      toast({
        title: "Success!",
        description: "Sign-in successful.",
      });

      // Redirect to dashboard
      router.replace("/dashboard");
      setLoading(false);
    }
  };

  const words1 = [
    "Better",
    "Insightful",
    "Transformative",
    "Impactful",
    "Effective",
  ];
  const words2 = [
    "Conversations",
    "Connections",
    "Feedback",
    "Insights",
    "Interactions",
    "Engagement",
  ];
  {
  }
  const features = [
    {
      quote: `
        User-Friendly Interface: A sleek, intuitive design that makes navigation a breeze.
        Unique Feedback Links: Generate personalized URLs to share with your audience, ensuring a private and tailored experience.
        Real-time Updates: Receive feedback instantly and stay informed with live updates.`,
      title: "Personalized Dashboard",
    },
    {
      quote: `
        Confidentiality Ensured: Gather honest opinions with complete anonymity for feedback providers.
        Customizable Surveys: Create tailored questionnaires to suit various domains, from education to corporate training.
        Multi-Domain Utility: Perfect for educators, HR professionals, event organizers, and more.`,
      title: "Anonymous Feedback",
    },
    {
      quote: `
        Versatile Feedback Collection: Ideal for teachers seeking class feedback, professors conducting end-of-course surveys, and professionals gathering client insights.
        Industry Adaptability: Perfect for HR evaluations, customer satisfaction surveys, and event feedback.
        Flexible Reporting: Generate insightful reports and visualizations tailored to various fields and needs.`,
      title: "Feedback Analytics",
    },
    {
      quote: `
        Secure Storage: All feedback is stored securely with advanced encryption protocols.
        User Management: Manage and organize your feedback with tags, folders, and custom categories.`,
      title: "Additional Features",
    },
  ];
  return (
    <>
      <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02]">
        <div className="h-auto md:h-[40rem] w-full rounded-md flex flex-col items-center justify-center relative overflow-hidden mx-auto py-10 md:py-0">
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="white"
          />
          <div className="p-4 relative z-10 w-full text-center">
            <div className="mt-4 mx-auto md:mt-0 text-3xl md:text-6xl font-bold bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400">
              Feedback Nexus: <FlipWords words={words1} /> <br />{" "}
              <FlipWords words={words2} /> <br />
            </div>
            <p className="mt-4 font-normal text-base md:text-lg text-neutral-300 max-w-2xl mx-auto">
              Welcome to Feedback Nexus, a platform revolutionizing feedback
              collection. Perfect for educators and professionals, our tool
              enables anonymous feedback, ensuring honest and constructive
              responses. With personalized dashboards and unique sharing links,
              Feedback Nexus offers a seamless, secure way to engage with your
              audience, enhancing growth and learning.
            </p>
            <div className="mt-10">
              {!session && (
                <>
                  <button
                    onClick={demosigin}
                    className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                  >
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                      Demo Sign-in
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="h-[40rem] w-full dark:bg-black dark:bg-grid-white/[0.2] relative flex flex-col items-center justify-center overflow-hidden">
          <h2 className="text-3xl font-bold text-center mb-8 z-10">
            Elevate Your Experience: Explore Our Features
          </h2>
          <div className="w-full max-w-6xl">
            <InfiniteMovingCards
              items={features}
              direction="right"
              speed="slow"
            />
          </div>
        </div>
        <div className="relative w-full overflow-hidden flex items-center justify-center">
          <WavyBackgroundcontent />
        </div>

        <footer className="w-full px-4 py-6 bg-slate-900">
          <div className="relative h-48 md:h-64 w-full overflow-hidden bg-slate-900 flex items-center justify-center rounded-lg">
            <div className="absolute inset-0 w-full h-full bg-slate-900 z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
            <Boxes />
            <div className="text-center relative z-20">
              <h1 className="text-2xl md:text-4xl text-white">
                Feedback Nexus
              </h1>
              <p className="mt-2 text-xs md:text-sm text-gray-300">
                © 2024 Feedback Nexus. All rights reserved. Built with ❤️ by
                Pratham.
              </p>
            </div>
          </div>
        </footer>
        {loading && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50">
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
        )}
      </main>
    </>
  );
}
