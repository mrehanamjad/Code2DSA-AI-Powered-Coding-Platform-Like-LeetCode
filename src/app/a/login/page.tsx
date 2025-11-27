"use client";
import { useState } from "react";
import { TerminalInput } from "@/components/AuthComponents/TerminalInput";
import { TerminalOutput } from "@/components/AuthComponents/TerminalOutput";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ASCIIArt } from "@/components/AuthComponents/ASCIIArt";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import loginSchema from "@/schemas/login.schema";

const Login = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      toast.error(firstError.message);
      return;
    }
    
    setIsSubmitting(true);
    setShowOutput(true);

    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });
    
    setIsSubmitting(true);
    if (result?.ok) {
      router.push("/");
    } else {
      toast.error("Failed to login user");

      // setIsSubmitting(false);
    }
  }

  return (
    <div 
     className="min-h-screen   text-foreground font-mono transition-colors duration-300">

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className=" lg:gap-12 h-full pt-18 max-sm:pt-10">
          <div className="order-2 lg:order-1 animate-fade-in">
            <div className="max-w-md mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-primary text-3xl font-bold terminal-glow-text">
                    codeVerse_
                  </span>
                  <span className="text-primary text-3xl animate-cursor-blink">
                    |
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  &gt; Authenticate user credentials
                </p>
              </div>

                <form onSubmit={handleSubmit} className="space-y-2">
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

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-md font-bold hover:scale-105 transition-all duration-300 terminal-glow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span>VERIFYING</span>
                        <span className="animate-cursor-blink">|</span>
                      </span>
                    ) : (
                      "LOGIN"
                    )}
                  </button>

                  <div className="mt-6 text-center">
                    <Link
                      href={"/signup"}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      <span className="text-primary">&gt;</span> Don’t have an
                      account?{" "}
                      <span className="underline font-bold">Sign up</span>
                    </Link>
                  </div>
                </form>

              {/* Footer */}
              <div className="mt-8 pt-4 border-t border-terminal-border">
                <p className="text-xs text-muted-foreground text-center">
                  <span className="text-primary">&gt;</span> codeVerse v2.1.0 —
                  Secure access mode
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

