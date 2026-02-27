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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/api/api";

// ✅ Zod Schema
const signupSchema = z.object({
  firstname: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters"),

  lastname: z
    .string()
    .optional(),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export default function SignupCard() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [isloading, setIsloading] = useState(false)

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // ✅ Validate using Zod
    const result = signupSchema.safeParse({
      firstname,
      lastname,
      email,
      password,
    });

    if (!result.success) {
      const firstError = result.error.errors[0].message;
      toast.warning(firstError);
      return;
    }

    setIsloading(true)

    try {
      await api.post("/users/register", result.data);

      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.log("Signup Failed", error);
      toast.error("Something went wrong.");
    } finally {
      setIsloading(false)
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
      "
    >
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-white">
          Create your account
        </CardTitle>
        <CardDescription className="text-gray-400">
          Enter your details below to sign up
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSignup}>
          <div className="flex flex-col gap-6">
            {/* First Name */}
            <div className="grid gap-2">
              <Label htmlFor="firstname" className="text-white">
                First Name
              </Label>
              <Input
                id="firstname"
                type="text"
                value={firstname}
                placeholder="John"
                className="bg-black/40 border border-white/10 text-slate-100"
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>

            {/* Last Name */}
            <div className="grid gap-2">
              <Label htmlFor="lastname" className="text-white">
                Last Name
              </Label>
              <Input
                id="lastname"
                type="text"
                value={lastname}
                placeholder="Doe"
                className="bg-black/40 border border-white/10 text-slate-100"
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                placeholder="rust@example.com"
                className="bg-black/40 border border-white/10 text-slate-100"
                onChange={(e) => setemail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                placeholder="••••••••"
                className="bg-black/40 border border-white/10 text-slate-100"
                onChange={(e) => setpassword(e.target.value)}
              />
            </div>
          </div>

          <CardFooter className="flex-col gap-4 px-0 pt-6">
            <Button
              type="submit"
              disabled={isloading}
              className="w-full text-white font-medium" 
              onClick={handleSignup}
            >
             { !isloading ? "Signup" : "Signing up..."}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}