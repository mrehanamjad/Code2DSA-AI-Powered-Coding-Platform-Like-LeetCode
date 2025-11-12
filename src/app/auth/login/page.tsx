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

const Login = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const handleSubmi = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowOutput(true);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (result?.ok) {
      router.push("/");
    } else {
      toast.error("Failed to login user");

      // setIsSubmitting(false);
    }
  }

  const handleComplete = () => {
    console.log("Login successful!");
    // redirect or show message here
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono transition-colors duration-300">
      <ThemeToggle />

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-4rem)]">
          {/* Left - Terminal Form */}
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

              {!showOutput ? (
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
              ) : (
                <TerminalOutput
                  onComplete={handleComplete}
                  outputLines={[
                    { text: "> Validating user credentials...", delay: 500 },
                    { text: "> Establishing secure connection...", delay: 800 },
                    {
                      text: "> Encrypting session token (AES-256)...",
                      delay: 1200,
                    },
                    { text: "> Authenticating with mainframe...", delay: 1600 },
                    { text: "> Access privileges confirmed.", delay: 2000 },
                    {
                      text: `> ✅ Login successful! Welcome back, ${
                        formData.email.split("@")[0]
                      }!`,
                      delay: 2400,
                    },
                    { text: "> Redirecting to dashboard...", delay: 2800 },
                  ]}
                />
              )}

              {/* Footer */}
              <div className="mt-8 pt-4 border-t border-terminal-border">
                <p className="text-xs text-muted-foreground text-center">
                  <span className="text-primary">&gt;</span> codeVerse v2.1.0 —
                  Secure access mode
                </p>
              </div>
            </div>
          </div>

          {/* Right - ASCII Art */}
          <div className="order-1 lg:order-2 flex items-center justify-center animate-fade-in">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-transparent rounded-lg blur-3xl" />
              <div className="relative bg-card border-2 border-terminal-border rounded-lg p-8 terminal-glow">
                <ASCIIArt />
                <div className="mt-6 space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="text-primary terminal-glow-text">●</span>
                    <span>Instant access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-accent terminal-glow-text">●</span>
                    <span>Encrypted sessions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary terminal-glow-text">●</span>
                    <span>Developer-friendly design</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
