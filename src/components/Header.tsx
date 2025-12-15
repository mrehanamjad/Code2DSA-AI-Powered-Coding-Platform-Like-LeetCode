"use client";

import { useState } from "react";
import {
  TrendingUp,
  User,
  Menu,
  X,
  LogOut,
  Settings,
  Loader2,
  Home,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react"; // Import signOut
// 1. Import Dropdown components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import Container from "./Container";
import Logo from "./Logo";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  if (pathname.split("/").length > 2 && pathname.includes("problems/") ) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className=" flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium transition-smooth hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/problems?page=1&sort=oldest"
              className="text-sm font-medium transition-smooth hover:text-primary"
            >
              Problems
            </Link>
            <Link
              href={`/code`}
              className="text-sm font-medium transition-smooth hover:text-primary"
            >
              Editor
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex rounded-full hover:bg-secondary/80 transition-colors"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-80 p-0 overflow-hidden"
                >
                  {/* Header with gradient background */}
                  <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background p-4 pb-3">
                    <DropdownMenuLabel className="font-normal p-0">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-primary/30">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        {/* User Info */}
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold leading-none mb-1">
                            My Account
                          </p>
                          {session.user?.username && (
                            <p className="text-xs text-muted-foreground">
                              @{session.user.username}
                            </p>
                          )}
                        </div>
                      </div>
                    </DropdownMenuLabel>
                  </div>

                  {/* Navigation Cards Grid */}
                  <div className="grid grid-cols-3 gap-2 p-3">
                    {/* Profile Card */}
                    <Link
                      href={`/u/${session.user?.username}`}
                      className="group"
                    >
                      <DropdownMenuItem className="flex flex-col items-center justify-center gap-2 py-5 cursor-pointer text-center border border-border/50 rounded-lg hover:border-primary/50 hover:bg-primary/5 focus:bg-primary/5 transition-all duration-200 hover:shadow-sm">
                        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                          <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-xs font-medium">Profile</span>
                      </DropdownMenuItem>
                    </Link>

                    {/* Progress Card */}
                    <Link href="/progress" className="group">
                      <DropdownMenuItem className="flex flex-col items-center justify-center gap-2 py-5 cursor-pointer text-center border border-border/50 rounded-lg hover:border-green-500/50 hover:bg-green-500/5 focus:bg-green-500/5 transition-all duration-200 hover:shadow-sm">
                        <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                          <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-xs font-medium">Progress</span>
                      </DropdownMenuItem>
                    </Link>

                    {/* Settings Card */}
                    <Link href="/profile" className="group">
                      <DropdownMenuItem className="flex flex-col items-center justify-center gap-2 py-5 cursor-pointer text-center border border-border/50 rounded-lg hover:border-purple-500/50 hover:bg-purple-500/5 focus:bg-purple-500/5 transition-all duration-200 hover:shadow-sm">
                        <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                          <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-xs font-medium">Settings</span>
                      </DropdownMenuItem>
                    </Link>
                  </div>

                  <DropdownMenuSeparator className="my-1" />

                  {/* Logout Button */}
                  <div className="p-2">
                    <DropdownMenuItem
                      className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/50 cursor-pointer py-2.5 rounded-md font-medium hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                      onClick={() => {
                        signOut();
                        router.push("/login");
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : status === "loading" ? (
              <Button disabled>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Checking...
              </Button>
            ) : (
              <Link href={"/login"}>
                <Button className="hidden md:flex">Sign In</Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

{/* Mobile Navigation */}
{isMenuOpen && (
  <div className="md:hidden border-t bg-background/95 backdrop-blur-sm">
    <nav className="flex flex-col p-4 pb-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
      {/* Main Navigation Links */}
      <div className="flex flex-col gap-1 mb-3">
        <Link
          href="/"
          onClick={() => setIsMenuOpen(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary active:scale-[0.98]"
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>
        
        <Link
          href="/problems?page=1&sort=oldest"
          onClick={() => setIsMenuOpen(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary active:scale-[0.98]"
        >
          <Code className="h-5 w-5" />
          <span>Problems</span>
        </Link>
        
        <Link
          href={"/code"}
          onClick={() => setIsMenuOpen(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary active:scale-[0.98]"
        >
          <User className="h-5 w-5" />
          <span>Editor</span>
        </Link>
      </div>

      {session?.user ? (
        <>
          {/* User Info Card */}
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-lg p-4 mb-3 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-primary/30">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-semibold">
                  {session.user.name || "User"}
                </p>
                {session.user.username && (
                  <p className="text-xs text-muted-foreground">
                    @{session.user.username}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="flex flex-col gap-1">
            <div className="text-xs font-semibold text-muted-foreground px-4 py-2">
              ACCOUNT
            </div>
            
            <Link
              href={`/u/${session.user.username}`}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all hover:bg-blue-500/10 hover:text-blue-600 active:scale-[0.98]"
            >
              <User className="h-5 w-5" />
              <span>View Profile</span>
            </Link>

            <Link
              href="/progress"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all hover:bg-green-500/10 hover:text-green-600 active:scale-[0.98]"
            >
              <TrendingUp className="h-5 w-5" />
              <span>Progress</span>
            </Link>
            
            <Link
              href="/profile"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all hover:bg-purple-500/10 hover:text-purple-600 active:scale-[0.98]"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>

            {/* Divider */}
            <div className="my-2 border-t" />
            
            {/* Logout Button */}
            <button
              onClick={() => {
                signOut();
                setIsMenuOpen(false);
                router.push("/login");
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 transition-all hover:bg-red-50 dark:hover:bg-red-950/50 active:scale-[0.98]"
            >
              <LogOut className="h-5 w-5" />
              <span>Log out</span>
            </button>
          </div>
        </>
      ) : (
        /* Sign In Button for logged out users */
        <div className="mt-auto pt-4">
          <Button 
            className="w-full h-12 text-base font-medium shadow-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            Sign In
          </Button>
        </div>
      )}
    </nav>
  </div>
)}
      </Container>
    </header>
  );
};

export default Header;
