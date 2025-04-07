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
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

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
    "Intelligent",
    "AI-Powered",
    "Transformative",
    "Innovative",
    "Effective",
  ];
  const words2 = [
    "Analytics",
    "Insights",
    "Feedback",
    "Learning",
    "Solutions",
    "Intelligence",
  ];
  {
  }
  const features = [
    {
      quote: `
        🎓 Education Excellence
        • AI-powered analysis of student feedback patterns
        • Anonymous course evaluations and suggestions
        • Automated insights for curriculum improvement
        • Real-time student engagement tracking`,
      title: "Education & Learning",
    },
    {
      quote: `
        💼 Workplace Innovation
        • Smart employee satisfaction monitoring
        • AI-driven workplace culture analysis
        • Anonymous feedback channels for teams
        • Performance review automation`,
      title: "Corporate Solutions",
    },
    {
      quote: `
        🔍 Smart Analytics
        • Sentiment analysis for customer feedback
        • Trend identification and pattern recognition
        • Automated categorization of responses
        • Custom report generation with AI insights`,
      title: "Data Intelligence",
    },
    {
      quote: `
        🛡️ Trust & Security
        • End-to-end encrypted feedback channels
        • Anonymous submission guarantees
        • GDPR and FERPA compliant systems
        • Secure data storage and handling`,
      title: "Privacy Protection",
    },
    {
      quote: `
        🌐 Global Reach
        • Multi-language support with AI translation
        • Cultural context awareness in analysis
        • Region-specific compliance adherence
        • Global feedback aggregation`,
      title: "International Scale",
    },
    {
      quote: `
        ⚡ Actionable Insights
        • Real-time feedback processing
        • AI-suggested improvement actions
        • Customizable response workflows
        • Impact tracking and measurement`,
      title: "Practical Impact",
    },
  ];

  const testimonials = [
    {
      quote:
        "Feedback Nexus transformed how we gather student feedback. The AI insights are invaluable.",
      author: "Dr. Sarah Chen",
      role: "University Professor",
    },
    {
      quote:
        "The anonymous feedback feature helped us build a more open and honest workplace culture.",
      author: "Michael Rodriguez",
      role: "HR Director",
    },
    {
      quote:
        "Simple yet powerful. Perfect for collecting customer insights and improving our services.",
      author: "Emma Thompson",
      role: "Product Manager",
    },
  ];

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) {
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
    <>
      <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-grid-white/[0.2]"></div>

        {/* Hero Section */}
        <div className="h-auto md:h-[40rem] w-full rounded-md flex flex-col items-center justify-center relative overflow-hidden mx-auto py-10 md:py-0">
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-purple-500/10"></div>
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="white"
          />
          <div className="p-4 relative z-10 w-full text-center">
            <div className="mt-4 mx-auto md:mt-0 text-3xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-300 relative">
              Feedback Nexus: <FlipWords words={words1} /> <br />{" "}
              <FlipWords words={words2} /> <br />
              <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-purple-600/20 via-blue-500/20 to-violet-600/20 -z-10"></div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 blur-xl bg-gradient-to-b from-purple-500/20 via-transparent to-transparent -z-10"></div>
              <p className="mt-4 font-normal text-base md:text-lg text-neutral-200 max-w-2xl mx-auto backdrop-blur-sm bg-black/20 rounded-xl p-4 border border-white/10">
                Welcome to Feedback Nexus, where AI-powered innovation meets
                feedback excellence. Our platform leverages advanced machine
                learning to transform feedback collection and analysis. With
                intelligent sentiment analysis, automated insights, and secure
                anonymous feedback channels, we&apos;re revolutionizing how
                organizations understand and act on feedback, driving continuous
                improvement through AI-enhanced learning.
              </p>
            </div>
            <div className="mt-10 flex gap-4 justify-center relative">
              <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-purple-500/30 via-transparent to-purple-500/30 -z-10"></div>
              {!session && (
                <>
                  <button
                    onClick={demosigin}
                    className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 hover:scale-105 transition-transform"
                  >
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                      Try Demo
                    </span>
                  </button>
                  <Link
                    href="/sign-up"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm px-6 py-1 text-sm font-medium text-white hover:bg-white/20 transition-colors hover:scale-105 transition-transform border border-white/20"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* AI Features Section */}
        <div className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
              AI-Powered Feedback Revolution
            </h2>
            <p className="text-neutral-400 text-center max-w-2xl mx-auto mb-12">
              Experience the future of feedback with our advanced AI
              capabilities, designed to transform raw feedback into actionable
              insights.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-neutral-900/50 rounded-xl p-6 backdrop-blur-sm border border-neutral-800">
                <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                  <svg
                    className="h-6 w-6 text-purple-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Smart Analysis
                </h3>
                <p className="text-neutral-400">
                  Advanced AI algorithms analyze feedback patterns and sentiment
                  to provide deeper insights.
                </p>
              </div>
              <div className="bg-neutral-900/50 rounded-xl p-6 backdrop-blur-sm border border-neutral-800">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                  <svg
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Enhanced Privacy
                </h3>
                <p className="text-neutral-400">
                  State-of-the-art encryption and anonymity features ensure
                  secure feedback collection.
                </p>
              </div>
              <div className="bg-neutral-900/50 rounded-xl p-6 backdrop-blur-sm border border-neutral-800">
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                  <svg
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Real-time Insights
                </h3>
                <p className="text-neutral-400">
                  Instant analysis and visualization of feedback data for quick
                  decision making.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Showcase */}
        <div className="py-20 w-full relative">
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 to-transparent opacity-20"></div>
          <div className="max-w-7xl mx-auto px-4">
            <div className="relative z-10 text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
                AI-Powered Solutions for Real-World Impact
              </h2>
              <p className="text-neutral-400 max-w-2xl mx-auto px-4">
                Combining cutting-edge AI technology with practical applications
                to transform how organizations gather and utilize feedback
                across different sectors.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-purple-500/10 blur-3xl -z-10"></div>
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-neutral-900/50 backdrop-blur-sm rounded-xl p-6 border border-neutral-800 hover:border-purple-500/50 transition-colors group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex flex-col h-full relative">
                    <div className="flex items-start mb-4">
                      <span className="text-2xl mr-3">
                        {feature.quote.split("\n")[1].trim().split(" ")[0]}
                      </span>
                      <h3 className="text-xl font-semibold text-white">
                        {feature.title}
                      </h3>
                    </div>
                    <div className="text-neutral-400 space-y-2">
                      {feature.quote
                        .split("\n")
                        .slice(2)
                        .map((point, i) => point.trim())
                        .filter((point) => point.startsWith("•"))
                        .map((point, i) => (
                          <p
                            key={i}
                            className="flex items-start group-hover:text-neutral-300 transition-colors"
                          >
                            <span className="text-purple-500 mr-2">•</span>
                            {point.substring(2)}
                          </p>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
              Trusted by Professionals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-neutral-900/50 rounded-xl p-6 backdrop-blur-sm border border-neutral-800"
                >
                  <p className="text-neutral-300 mb-4">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div>
                    <p className="text-white font-semibold">
                      {testimonial.author}
                    </p>
                    <p className="text-neutral-400 text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="relative w-full overflow-hidden flex items-center justify-center">
          <WavyBackgroundcontent />
        </div>

        {/* Footer */}
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
      </main>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50">
          <div role="status">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
    </>
  );
}
