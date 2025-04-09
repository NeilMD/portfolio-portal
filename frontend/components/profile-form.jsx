import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
import api from "@/lib/api";
import { tc } from "@/lib/tc";

export function ProfileForm({ userInfo, userId, setUserInfo }) {
  const [successMessage, setSuccessMessage] = useState("");
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
    name: z.string().nonempty({
      message: "Name is required.",
    }),
    bio: z.string().nonempty({
      message: "Bio is required.",
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: userInfo?.username || "", // Default to empty if undefined
      name: userInfo?.username || "", // Default to empty if undefined
      bio: userInfo?.username || "", // Default to empty if undefined
    },
  });

  // Use useEffect to reset form values whenever userInfo changes
  useEffect(() => {
    form.reset({
      username: userInfo?.username || "",
      name: userInfo?.name || "",
      bio: userInfo?.bio || "",
    });
  }, [userInfo, form]);

  const handleSubmit = async (value) => {
    const [response, error] = await tc(() =>
      api.post("/api/user/profile/edit", { userId, ...value })
    );
    console.log(response);
    if (response.data.numCode == 0) {
      setUserInfo(response.data.objData);
      setSuccessMessage("Profile updated successfully.");
      form.clearErrors("root"); // Clear any previous root/server errors
    } else {
      setSuccessMessage(""); // clear success if there's an error
      form.setError("root", {
        type: "server",
        message: response.data.objError,
      });
    }

    console.log(response);
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="pt-10 px-4 space-y-6 sm:px-6">
            <header className="space-y-2">
              <div className="flex text-left space-x-3">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold">
                    {userInfo?.name || userInfo?.username}
                  </h1>
                </div>
              </div>
            </header>
            <div className="space-y-8">
              <Card>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Biography</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {form.formState.errors.root && (
                    <div className="text-red-500 text-sm">
                      <p>Failed Updating!</p>

                      {form.formState.errors.root.message}
                    </div>
                  )}
                  {successMessage && (
                    <div className="text-green-500 text-sm">
                      <p>{successMessage}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="pt-6">
              <Button className={"cursor-pointer"}>Save</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
