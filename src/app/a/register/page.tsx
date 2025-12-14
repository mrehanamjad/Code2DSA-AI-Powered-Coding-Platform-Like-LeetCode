"use client";

import { useState } from "react";
import { TerminalInput } from "@/components/AuthComponents/TerminalInput";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import registerationSchema from "@/schemas/register.schema"; 
import Logo from "@/components/Logo";

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // ✅ Zod validation step
    const validation = registerationSchema.safeParse(formData);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      toast.error(firstError.message);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Registration failed");
        throw new Error(errorData.message || "Registration failed");
      }

      toast.success("Account created successfully!");
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/");
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error("Failed to register user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <div className="min-h-screen bg-background text-foreground font-mono transition-colors duration-300">

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid  items-center min-h-[calc(100vh-4rem)]">
          {/* Left side - Terminal Form */}
          <div className="order-2 lg:order-1 animate-fade-in">
            <div className="max-w-md mx-auto">
              {/*  Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <Logo size="2xl" href="#" />
                  <span className="text-primary text-3xl animate-cursor-blink">|</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  &gt; Initialize new user profile
                </p>
              </div>

                <form onSubmit={handleSubmit} className="space-y-2">
                  <TerminalInput
                    label="name"
                    value={formData.name}
                    onChange={(value) =>
                      setFormData({ ...formData, name: value })
                    }
                    placeholder="enter_name"
                  />

                  <TerminalInput
                    label="email"
                    type="email"
                    value={formData.email}
                    onChange={(value) =>
                      setFormData({ ...formData, email: value })
                    }
                    placeholder="user@example.com"
                  />

                  <TerminalInput
                    label="password"
                    type="password"
                    value={formData.password}
                    onChange={(value) =>
                      setFormData({ ...formData, password: value })
                    }
                    placeholder="••••••••"
                  />

                  <TerminalInput
                    label="confirm_password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(value) =>
                      setFormData({ ...formData, confirmPassword: value })
                    }
                    placeholder="••••••••"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-md font-bold hover:scale-105 transition-all duration-300 terminal-glow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span>EXECUTING</span>
                        <span className="animate-cursor-blink">|</span>
                      </span>
                    ) : (
                      "CREATE_ACCOUNT"
                    )}
                  </button>

                  <div className="mt-6 text-center">
                    <Link
                      href={"/a/login"}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      <span className="text-primary">&gt;</span> Already have an
                      account? <span className="underline font-bold">Log in</span>
                    </Link>
                  </div>
                </form>
              

              {/* Terminal Footer */}
              <div className="mt-8 pt-4 border-t border-terminal-border">
                <p className="text-xs text-muted-foreground text-center">
                  <span className="text-primary">&gt;</span> Powered by Code2DSA
                  v2.1.0
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Signup;
