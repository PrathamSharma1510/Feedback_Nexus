"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { signUpSchema } from "@/schemas/signUpSchema";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import debounce from "debounce";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ToastAction } from "@/components/ui/toast";
const formSchema = signUpSchema;
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Spotlight } from "@/components/ui/spotlight";
import { Loader2 } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [usernameMessage, setUsernameMessage] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkUsername = useCallback(async (username: string) => {
    try {
      setIsChecking(true);
      const response = await axios.get(
        `/api/verifyusername?username=${username}`
      );
      const message = response.data.message;
      setUsernameMessage(message);
      setIsUsernameTaken(message.includes("already exists"));
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      setUsernameMessage(
        axiosError.response?.data?.message || "Error checking username."
      );
      setIsUsernameTaken(true);
    } finally {
      setIsChecking(false);
    }
  }, []);

  const debouncedCheckUsername = useCallback(
    (username: string) => {
      const debouncedFn = debounce((value: string) => {
        checkUsername(value);
      }, 500);
      debouncedFn(username);
    },
    [checkUsername]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "username" && value.username) {
        debouncedCheckUsername(value.username);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, debouncedCheckUsername]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await axios.post("/api/sign-up", values);

      toast({
        title: "Success!",
        description: "Sign-up successful. Please verify your email.",
      });
      router.replace(`/verify/${values.username}`);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message = axiosError.response?.data.message;
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: message,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-center min-h-screen h-screen overflow-hidden bg-black/[0.96] antialiased bg-grid-white/[0.02] relative">
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
            Create Account
          </h1>
          <p className="text-neutral-400 mb-3 md:mb-4">
            Back to{" "}
            <Link
              className="text-purple-500 hover:text-purple-400 transition-colors"
              href={"/"}
            >
              Home
            </Link>
          </p>
        </div>
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 md:space-y-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-200">Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    {isChecking && (
                      <div className="text-neutral-400 text-xs">
                        Checking availability...
                      </div>
                    )}
                    {usernameMessage && (
                      <FormMessage
                        className={
                          isUsernameTaken ? "text-red-400" : "text-green-400"
                        }
                      >
                        {usernameMessage}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-200">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500"
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-200">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white transition-all duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
              <div className="text-center mt-3">
                <div className="text-sm text-neutral-400">
                  Already registered?{" "}
                  <Link
                    className="text-purple-500 hover:text-purple-400 transition-colors"
                    href="/sign-in"
                  >
                    Sign In
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
