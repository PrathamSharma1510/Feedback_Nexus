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

const formSchema = signUpSchema;
import { useRouter } from "next/navigation";
const Page = () => {
  const router = useRouter();
  const [usernameMessage, setUsernameMessage] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);

  const checkUsername = async (username: string) => {
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
  };
  const debouncedCheckUsername = useCallback(
    debounce((username: string) => {
      checkUsername(username);
    }, 500),
    []
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "username" && value.username) {
        debouncedCheckUsername(value.username);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, debouncedCheckUsername]);
  // Initialize the form with react-hook-form and zodResolver
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/sign-up", values);
      router.replace(`/verify`);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "There was a problem with your sign-up. Please try again.";
      console.error(errorMessage);
      // Display the error message to the user, e.g., using a toast notification
    }
  };
  return (
    <div className="flex w-full items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  {isChecking && <p>Checking...</p>}
                  {usernameMessage && (
                    <FormMessage
                      className={
                        isUsernameTaken ? "text-red-500" : "text-green-500"
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
            <div className="text-center mt-4">
              <p className="text-sm">
                Already registered?{" "}
                <Link className="text-blue-500 hover:underline" href="/sign-in">
                  SIGN IN
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
