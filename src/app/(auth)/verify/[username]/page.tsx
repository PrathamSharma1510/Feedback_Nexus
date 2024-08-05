"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

// Define the form schema
const formSchema = z.object({
  VerificationCode: z.string().min(1, "Verification Code is required"),
});

const Page = () => {
  // Initialize the form with react-hook-form and zodResolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      VerificationCode: "",
    },
  });

  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();

  // Define the onSubmit function
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      console.log(data.VerificationCode);
      const response = await axios.post("/api/verifycode", {
        username: params.username,
        code: data.VerificationCode,
      });
      console.log(response.data);
      toast({
        title: "Success!",
        description: "Verification successful.",
      });
      router.replace("/sign-in");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Verification failed.",
        });
      } else {
        console.error(error);
        toast({
          variant: "destructive",
          title: "An unexpected error occurred.",
          description: "Please try again later.",
        });
      }
    }
  };

  return (
    <div className="flex w-full items-center justify-center min-h-screen">
      <div className=" p-8 rounded-lg shadow-md w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="VerificationCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="secondary" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
