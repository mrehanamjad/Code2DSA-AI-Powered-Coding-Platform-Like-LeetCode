// "use client";
// import { useState } from "react";
// import { TerminalInput } from "@/components/AuthComponents/TerminalInput";
// import { TerminalOutput } from "@/components/AuthComponents/TerminalOutput";
// import { ThemeToggle } from "@/components/ThemeToggle";
// import { ASCIIArt } from "@/components/AuthComponents/ASCIIArt";
// import Link from "next/link";
// import { toast } from "sonner"
// import { useRouter } from "next/navigation";
// import { signIn } from "next-auth/react";

// const Signup = () => {
//   const router = useRouter()
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showOutput, setShowOutput] = useState(false);
//   const [loading, setLoading] = useState(false);


//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       toast.error("Passwords do not match")
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: formData.email,
//           password: formData.password,
//           name: formData.name
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         toast.error("Failed to register user!");
//         throw new Error(errorData.message || "Registration failed");
//       }
//       console.log("signup response", response);
//       if (response.ok) {
//         const result = await signIn("credentials", {
//           email:formData.email,
//           password:formData.password,
//           redirect: false,
//         });
        
//         if (result?.ok) {
//           router.push("/");
//         } else {
//           router.push("/login");
//         }
//       }
//     } catch (error) {
//       console.log("Catch", error);
//       console.error("Error registering user:", error);
//       console.log(
//         error instanceof Error
//           ? error.message
//           : "Failed to register user. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }



//   const handleComplete = () => {
//     // Redirect or show success message
//     console.log("Signup complete!");

//   };

//   return (
//     <div className="min-h-screen bg-background text-foreground font-mono transition-colors duration-300">
//       <ThemeToggle />

//       <div className="container mx-auto px-4 py-8 lg:py-12">
//         <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-4rem)]">
//           {/* Left side - Terminal Form */}
//           <div className="order-2 lg:order-1 animate-fade-in">
//             <div className="max-w-md mx-auto">
//               {/* Terminal Header */}
//               <div className="mb-8">
//                 <div className="flex items-center gap-2 mb-2">
//                   <span className="text-primary text-3xl font-bold terminal-glow-text">
//                     codeVerse_
//                   </span>
//                   <span className="text-primary text-3xl animate-cursor-blink">
//                     |
//                   </span>
//                 </div>
//                 <p className="text-muted-foreground text-sm">
//                   &gt; Initialize new user profile
//                 </p>
//               </div>

//               {!showOutput ? (
//                 <form onSubmit={handleSubmit} className="space-y-2">
//                   <TerminalInput
//                     label="name"
//                     value={formData.name}
//                     onChange={(value) =>
//                       setFormData({ ...formData, name: value })
//                     }
//                     placeholder="enter_name"
//                   />

//                   <TerminalInput
//                     label="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={(value) =>
//                       setFormData({ ...formData, email: value })
//                     }
//                     placeholder="user@example.com"
//                   />

//                   <TerminalInput
//                     label="password"
//                     type="password"
//                     value={formData.password}
//                     onChange={(value) =>
//                       setFormData({ ...formData, password: value })
//                     }
//                     placeholder="••••••••"
//                   />

//                   <TerminalInput
//                     label="confirm_password"
//                     type="password"
//                     value={formData.confirmPassword}
//                     onChange={(value) =>
//                       setFormData({ ...formData, confirmPassword: value })
//                     }
//                     placeholder="••••••••"
//                   />

//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="w-full mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-md font-bold hover:scale-105 transition-all duration-300 terminal-glow disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {isSubmitting ? (
//                       <span className="flex items-center justify-center gap-2">
//                         <span>EXECUTING</span>
//                         <span className="animate-cursor-blink">|</span>
//                       </span>
//                     ) : (
//                       "CREATE_ACCOUNT"
//                     )}
//                   </button>

//                   <div className="mt-6 text-center">
//                     <Link
//                       href={"/login"}
//                       className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
//                     >
//                       <span className="text-primary">&gt;</span> Already have an
//                       account?{" "}
//                       <span className="underline font-bold">Log in</span>
//                     </Link>
//                   </div>
//                 </form>
//               ) : (
//                 <TerminalOutput
//                   onComplete={handleComplete}
//                   outputLines={[
//                     { text: "> Validating credentials...", delay: 500 },
//                     {
//                       text: "> Encrypting password with SHA-256...",
//                       delay: 800,
//                     },
//                     { text: "> Connecting to mainframe...", delay: 1200 },
//                     { text: "> Allocating user space...", delay: 1600 },
//                     { text: "> Initializing user profile...", delay: 2000 },
//                     { text: "> ✅ Account created successfully!", delay: 2400 },
//                     { text: "> Redirecting to dashboard...", delay: 2800 },
//                   ]}
//                 />
//               )}

//               {/* Terminal Footer */}
//               <div className="mt-8 pt-4 border-t border-terminal-border">
//                 <p className="text-xs text-muted-foreground text-center">
//                   <span className="text-primary">&gt;</span> Powered by
//                   codeVerse v2.1.0
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Right side - ASCII Art / Visual */}
//           <div className="order-1 lg:order-2 flex items-center justify-center animate-fade-in">
//             <div className="relative w-full max-w-md">
//               {/* Gradient background */}
//               <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-transparent rounded-lg blur-3xl" />

//               {/* ASCII Art Container */}
//               <div className="relative bg-card border-2 border-terminal-border rounded-lg p-8 terminal-glow">
//                 <ASCIIArt />

//                 {/* Decorative elements */}
//                 <div className="mt-6 space-y-2 text-xs text-muted-foreground">
//                   <div className="flex items-center gap-2">
//                     <span className="text-primary terminal-glow-text">●</span>
//                     <span>Secure authentication</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="text-accent terminal-glow-text">●</span>
//                     <span>End-to-end encryption</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="text-primary terminal-glow-text">●</span>
//                     <span>Developer-first platform</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;





"use client";

import { useState } from "react";
import { TerminalInput } from "@/components/AuthComponents/TerminalInput";
import { TerminalOutput } from "@/components/AuthComponents/TerminalOutput";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ASCIIArt } from "@/components/AuthComponents/ASCIIArt";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import registerationSchema from "@/schemas/register.schema"; 

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // ✅ Zod validation step
    const validation = registerationSchema.safeParse(formData);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      toast.error(firstError.message);
      return;
    }

    setLoading(true);
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
      setLoading(false);
      setIsSubmitting(false);
    }
  }

  const handleComplete = () => {
    console.log("Signup complete!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono transition-colors duration-300">
      <ThemeToggle />

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-4rem)]">
          {/* Left side - Terminal Form */}
          <div className="order-2 lg:order-1 animate-fade-in">
            <div className="max-w-md mx-auto">
              {/* Terminal Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-primary text-3xl font-bold terminal-glow-text">
                    codeVerse_
                  </span>
                  <span className="text-primary text-3xl animate-cursor-blink">|</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  &gt; Initialize new user profile
                </p>
              </div>

              {!showOutput ? (
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
                      href={"/login"}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      <span className="text-primary">&gt;</span> Already have an
                      account? <span className="underline font-bold">Log in</span>
                    </Link>
                  </div>
                </form>
              ) : (
                <TerminalOutput
                  onComplete={handleComplete}
                  outputLines={[
                    { text: "> Validating credentials...", delay: 500 },
                    { text: "> Encrypting password with SHA-256...", delay: 800 },
                    { text: "> Connecting to mainframe...", delay: 1200 },
                    { text: "> Allocating user space...", delay: 1600 },
                    { text: "> Initializing user profile...", delay: 2000 },
                    { text: "> ✅ Account created successfully!", delay: 2400 },
                    { text: "> Redirecting to dashboard...", delay: 2800 },
                  ]}
                />
              )}

              {/* Terminal Footer */}
              <div className="mt-8 pt-4 border-t border-terminal-border">
                <p className="text-xs text-muted-foreground text-center">
                  <span className="text-primary">&gt;</span> Powered by codeVerse
                  v2.1.0
                </p>
              </div>
            </div>
          </div>

          {/* Right side - ASCII Art */}
          <div className="order-1 lg:order-2 flex items-center justify-center animate-fade-in">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-transparent rounded-lg blur-3xl" />
              <div className="relative bg-card border-2 border-terminal-border rounded-lg p-8 terminal-glow">
                <ASCIIArt />
                <div className="mt-6 space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="text-primary terminal-glow-text">●</span>
                    <span>Secure authentication</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-accent terminal-glow-text">●</span>
                    <span>End-to-end encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary terminal-glow-text">●</span>
                    <span>Developer-first platform</span>
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

export default Signup;
