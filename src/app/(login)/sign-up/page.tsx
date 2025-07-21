"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { signUpAction } from "../actions";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="flex flex-col justify-between">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Create your account</h3>
            <div className="flex justify-between items-center ">
              <CardDescription>Already have an account?</CardDescription>
              <CardAction>
                <Link href="/login" className="hover:underline text-sm">
                  Sign In
                </Link>
              </CardAction>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" type="text" placeholder="May" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-5">
              <Checkbox id="terms" required />
              <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I agree to the
                <Link href="/terms" className="text-primary hover:underline">
                  Terms & Conditions
                </Link>
              </Label>
            </div>
            <Button type="submit" formAction={signUpAction} className="w-full mt-4">
              Sign up
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
