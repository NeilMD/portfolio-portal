import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/context/AuthProvider"; // Adjust the path if needed
import { tc } from "@/lib/tc";
import { useNavigate } from "react-router";

export function SignupForm({ className, ...props }) {
  const navigate = useNavigate();
  const { signup } = useAuth(); // Use the login function from the AuthContext
  const formSchema = z.object({
    username: z
      .string()
      .email()
      .min(2, {
        message: "Username must be at least 2 characters.",
      })
      .nonempty({
        message: "Username is required.",
      }),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .nonempty({
        message: "Password is required.",
      }),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = async (value) => {
    const [data, error] = await tc(() => signup(value)); // Use login function to authenticate
    if (data.success) {
      navigate("/home");
    } else {
      form.setError("root", {
        type: "server",
        message: data.error,
      });
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className={"text-center"}>
          <CardTitle>Signup</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="username"
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
                </div>
                <div className="grid gap-3">
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
                </div>
                {form.formState.errors.root && (
                  <div className="grid text-red-500 text-sm">
                    <p>Registration Failed!</p>

                    {form.formState.errors.root.message}
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    Create an account
                  </Button>
                  <Button variant="outline" className="w-full">
                    Sign up with Google
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
