// "use client";

// import { useState } from "react";
// import { Code2, User, Menu, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { ThemeToggle } from "./ThemeToggle";
// import Link from "next/link";
// import { useSession } from "next-auth/react";

// const Header = () => {
//   const { data: session } = useSession()
//   console.log(session)
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

//   return (
//     <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="container flex h-16 items-center justify-between px-4">
//         {/* Logo */}
//         <Link
//           href="/"
//           className="flex items-center gap-2 transition-smooth hover:opacity-80"
//         >
//           <Code2 className="h-6 w-6 text-primary" />
//           <span className="text-xl font-bold tracking-tight">CodeArena</span>
//         </Link>

//         {/* Desktop Navigation */}
//         <nav className="hidden md:flex items-center gap-6">
//           <Link href="/" className="text-sm font-medium transition-smooth hover:text-primary">
//             Problems
//           </Link>
//           <Link href="/contests" className="text-sm font-medium transition-smooth hover:text-primary">
//             Contests
//           </Link>
//           <Link href="/discuss" className="text-sm font-medium transition-smooth hover:text-primary">
//             Discuss
//           </Link>
//         </nav>

//         {/* Actions */}
//         <div className="flex items-center gap-3">
//           <ThemeToggle />
//           { session?.user.id ? (<Button variant="ghost" size="icon" className="hidden md:flex">
//             <User className="h-5 w-5" />
//           </Button>) :
//           (<Button className="hidden md:flex">Sign In</Button>)}
//           <Button
//             variant="ghost"
//             size="icon"
//             className="md:hidden"
//             onClick={toggleMenu}
//           >
//             {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//           </Button>
//         </div>
//       </div>

//       {/* Mobile Navigation */}
//       {isMenuOpen && (
//         <div className="md:hidden border-t bg-background">
//           <nav className="flex flex-col items-start gap-2 p-4">
//             <Link
//               href="/"
//               onClick={() => setIsMenuOpen(false)}
//               className="w-full text-sm font-medium transition-smooth hover:text-primary"
//             >
//               Problems
//             </Link>
//             <Link
//               href="/contests"
//               onClick={() => setIsMenuOpen(false)}
//               className="w-full text-sm font-medium transition-smooth hover:text-primary"
//             >
//               Contests
//             </Link>
//             <Link
//               href="/discuss"
//               onClick={() => setIsMenuOpen(false)}
//               className="w-full text-sm font-medium transition-smooth hover:text-primary"
//             >
//               Discuss
//             </Link>
//             <div className="flex w-full items-center justify-between mt-2">
//               {session?.user.id ? (<Button variant="ghost" size="icon">
//                 <User className="h-5 w-5" />
//               </Button>):(
//               <Button>Sign In</Button>)}
//             </div>
//           </nav>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;



"use client";

import { useState } from "react";
import { Code2, User, Menu, X, LogOut, Settings } from "lucide-react";
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

const Header = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-smooth hover:opacity-80"
        >
          <Code2 className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">CodeArena</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/problems" className="text-sm font-medium transition-smooth hover:text-primary">
            Problems
          </Link>
          <Link href="/contests" className="text-sm font-medium transition-smooth hover:text-primary">
            Contests
          </Link>
          <Link href="/discuss" className="text-sm font-medium transition-smooth hover:text-primary">
            Discuss
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {session?.user ? (
            // 2. Replaced the simple Button with DropdownMenu
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                {session.user.name && (
                  <span className="block px-2 text-xs text-muted-foreground mb-2">
                    {session.user.name}
                  </span>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem color="red" onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href={"/a/login"}>
            <Button className="hidden md:flex">Sign In</Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="flex flex-col items-start gap-2 p-4">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="w-full text-sm font-medium transition-smooth hover:text-primary"
            >
              Problems
            </Link>
            <Link
              href="/contests"
              onClick={() => setIsMenuOpen(false)}
              className="w-full text-sm font-medium transition-smooth hover:text-primary"
            >
              Contests
            </Link>
            <Link
              href="/discuss"
              onClick={() => setIsMenuOpen(false)}
              className="w-full text-sm font-medium transition-smooth hover:text-primary"
            >
              Discuss
            </Link>
            <div className="flex w-full items-center justify-between mt-2">
              {session?.user ? (
                // Mobile view: Usually better to list links directly than use a dropdown
                <div className="flex flex-col w-full gap-2 mt-2 pt-2 border-t">
                   <div className="text-sm font-medium text-muted-foreground mb-1">
                      {session.user.name || "Account"}
                   </div>
                   <Button variant="ghost" className="justify-start px-0 h-auto">Profile</Button>
                   <Button variant="ghost" className="justify-start px-0 h-auto">Settings</Button>
                   <Button 
                     variant="ghost" 
                     className="justify-start px-0 h-auto text-red-500 hover:text-red-600"
                     onClick={() => signOut()}
                   >
                     Log out
                   </Button>
                </div>
              ) : (
                <Button className="w-full">Sign In</Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;