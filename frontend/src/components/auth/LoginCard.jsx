import { useState } from "react";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import api from "@/api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// ✅ Zod Schema (inside same file)
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export default function LoginCard() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [isloading, setisloading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const firstError = result.error.errors[0].message;
      toast.warning(firstError);
      return;
    }

    setisloading(true);

    try {
      await api.post("/users/login", result.data);
      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        const message = error.response.data?.message || "Invalid credentials";
        toast.error(message);
      } else if (error.request) {
        toast.error("Server not responding. Try again later.");
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setisloading(false);
    }
  };

  return (
    <Card
      className="
        w-full max-w-sm 
        bg-white/5 
        backdrop-blur-xl 
        border border-white/10
        shadow-2xl 
        shadow-blue-500/10
        rounded-2xl
        z-10
      "
    >
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-white">
          Login to your account
        </CardTitle>
        <CardDescription className="text-gray-400">
          Enter your email below to login
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-slate-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                placeholder="rust@example.com"
                className="
                  bg-black/40
                  border border-white/10
                  text-slate-100
                  placeholder:text-gray-400
                "
                onChange={(e) => setemail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-slate-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                placeholder="••••••••"
                className="
                  bg-black/40
                  border border-white/10
                  text-slate-100
                  placeholder:text-gray-400
                "
                onChange={(e) => setpassword(e.target.value)}
              />
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex-col gap-4">
        <Button
          disabled={isloading}
          onClick={handleLogin}
          className="w-full text-white font-medium"
        >
          {!isloading ? "Login" : "Logging in..."}
        </Button>
      </CardFooter>
    </Card>
  );
}
