"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { loginAction } from "../actions";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="flex flex-col justify-between">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Login to your account</h3>
            <div className="flex justify-between items-center ">
              <CardDescription>Do not have an account?</CardDescription>
              <CardAction>
                <Link href="/sign-up" className="hover:underline text-sm">
                  Sign Up
                </Link>
              </CardAction>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a href="/update-password" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-5">
              <Checkbox id="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </div>

            <Button type="submit" formAction={loginAction} className="w-full mt-4">
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
