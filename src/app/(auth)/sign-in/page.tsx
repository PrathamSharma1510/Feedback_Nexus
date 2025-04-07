"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { signInSchema } from "@/schemas/signInSchema";
import Link from "next/link";
import { Spotlight } from "@/components/ui/spotlight";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = signInSchema;

const Page = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
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
      if (result?.url) {
        router.replace("/dashboard");
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen h-screen overflow-hidden bg-black/[0.96] antialiased bg-grid-white/[0.02] relative">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-grid-white/[0.2]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-purple-500/10"></div>
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="p-4 md:p-6 rounded-lg w-full max-w-md relative z-10">
        <div className="text-center mb-4 md:mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight lg:text-5xl mb-3 md:mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-300">
            Welcome Back
          </h1>
          <p className="text-neutral-400 mb-3 md:mb-4">
            Back to{" "}
            <Link
              className="text-purple-500 hover:text-purple-400 transition-colors"
              href={"/"}
            >
              Home
            </Link>{" "}
            for Demo Login
          </p>
        </div>
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 md:space-y-5"
            >
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-200">
                      Username/Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-200">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              <div className="text-center mt-3">
                <div className="text-sm text-neutral-400">
                  Not registered?{" "}
                  <Link
                    className="text-purple-500 hover:text-purple-400 transition-colors"
                    href="/sign-up"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Page;
