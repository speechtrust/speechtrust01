import React, { useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import api from "@/api/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import AuthLayout from "./AuthLayout"; // Import the wrapper

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission refresh
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      toast.warning(result.error.errors[0].message);
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/users/login", result.data);
      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data?.message || "Invalid credentials");
      } else if (error.request) {
        toast.error("Server not responding. Try again later.");
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription className="text-slate-500">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="grid gap-2">
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

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                {/* Optional: Add a forgot password link here in the future */}
              </div>
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
              className="w-full mt-2" 
            >
              {!isLoading ? "Sign In" : "Signing in..."}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-slate-100 pt-6">
          <p className="text-sm text-slate-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#162456] font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}