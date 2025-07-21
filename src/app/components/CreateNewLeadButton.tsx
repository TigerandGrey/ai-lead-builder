"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import { Asterisk } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetTrigger } from "@/components/ui/sheet";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { GeneratedLeadType } from "@/lib/types";
import { defaultLead } from "@/lib/constant";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  role: z.string().min(2, {
    message: "Role must be at least 2 characters.",
  }),
  company: z.string().min(2, {
    message: "Company must be at least 2 characters.",
  }),
  linkedin_url: z.string().min(2, {
    message: "LinkedIn Url must be at least 2 characters.",
  }),
});

const CreateNewLeadButton = () => {
  const [generatedMessage, setGeneratedMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultLead,
  });

  const onSubmit = async (lead: z.infer<typeof FormSchema>) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/generate-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lead),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // const result = { message: "Hi May, hope you're doing well! Saw that you're a sales star at ASD and wanted to connect. Looking forward to learning more about your experience!" };
      setGeneratedMessage(result.message);
      toast.success("Message generated!");
      setIsLoading(false);
    } catch (error) {
      toast.error("Failed to generate message");
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const formData = form.getValues();
      const generatedLead: GeneratedLeadType = {
        ...formData,
        generated_message: generatedMessage,
        status: "Draft",
        created_id: user!.id,
        updated_id: user!.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Save to DB
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(generatedLead),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save lead");
      }

      toast.success("Lead saved successfully!");

      form.reset();
      setGeneratedMessage("");
      setIsLoading(false);
    } catch (error) {
      toast.error("Failed to save lead");
      setIsLoading(false);
    }
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="w-20">New</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetDescription></SheetDescription>

        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex flex-col justify-between">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Generate LinkedIn direct messages (DMs)</h3>
              <div className="flex justify-between items-center ">
                <CardDescription>Please enter lead information below</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="ml-1 items-start gap-0">
                        Name
                        <Asterisk size={8} />
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="May" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="ml-1 items-start gap-0">
                        Role
                        <Asterisk size={8} />
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="sales manager" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="ml-1 items-start gap-0 ">
                        Company
                        <Asterisk size={8} />
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="M&M Mars Inc" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="linkedin_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="ml-1 items-start gap-0 ">
                        LinkedIn Url
                        <Asterisk size={8} />
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.linkedin.com/..." {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  Generate Message
                </Button>
              </form>
            </Form>
          </CardContent>

          {generatedMessage ? (
            <div>
              <CardContent>
                <div className="w-full">{generatedMessage}</div>
              </CardContent>
              <SheetFooter className="flex flex-row justify-center">
                <Button type="button" onClick={handleSave} className="mt-5">
                  Save
                </Button>
                <SheetClose asChild>
                  <Button variant="outline" className="mt-5">
                    Close
                  </Button>
                </SheetClose>
              </SheetFooter>
            </div>
          ) : (
            <></>
          )}
        </Card>
      </SheetContent>
    </Sheet>
  );
};

export default CreateNewLeadButton;
