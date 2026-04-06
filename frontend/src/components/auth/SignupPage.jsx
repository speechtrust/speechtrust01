import React, { useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import api from "@/api/api";
import AuthLayout from "./AuthLayout";

const signupSchema = z.object({
  firstname: z.string().min(1, "First name is required").min(2, "First name must be at least 2 characters"),
  lastname: z.string().optional(),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
});

export default function SignupPage() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault(); // Fixed double-fire issue by removing onClick from the button
    const result = signupSchema.safeParse({ firstname, lastname, email, password });

    if (!result.success) {
      toast.warning(result.error.errors[0].message);
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/users/register", result.data);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">
            Create an account
          </CardTitle>
          <CardDescription className="text-slate-500">
            Enter your details below to get started
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstname" className="text-slate-700 font-medium">First Name</Label>
                <Input
                  id="firstname"
                  type="text"
                  value={firstname}
                  placeholder="John"
                  className="bg-slate-50 border-slate-200 text-slate-900 focus-visible:ring-[#162456]"
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lastname" className="text-slate-700 font-medium">Last Name</Label>
                <Input
                  id="lastname"
                  type="text"
                  value={lastname}
                  placeholder="Doe"
                  className="bg-slate-50 border-slate-200 text-slate-900 focus-visible:ring-[#162456]"
                  onChange={(e) => setLastname(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2 mt-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                placeholder="name@example.com"
                className="bg-slate-50 border-slate-200 text-slate-900 focus-visible:ring-[#162456]"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid gap-2 mt-2">
              <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                placeholder="••••••••"
                className="bg-slate-50 border-slate-200 text-slate-900 focus-visible:ring-[#162456]"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4" 
            >
              {!isLoading ? "Create Account" : "Signing up..."}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-slate-100 pt-6">
          <p className="text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-[#162456] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}