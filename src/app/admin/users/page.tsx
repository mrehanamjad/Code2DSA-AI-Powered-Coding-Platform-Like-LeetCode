"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  Search, 
  MoreVertical, 
  Shield, 
  User as UserIcon,
  Mail,
  Calendar,
  Loader2,
  Trash2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";

interface User {
  _id: string;
  userName: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: { url: string };
  createdAt: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/users?query=${debouncedSearch}&page=${page}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.users);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      toast.error("Could not load user list.");
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch, page]);

  const toggleRole = async (user: User) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    if (!window.confirm(`Are you sure you want to change ${user.name}'s role to ${newRole}?`)) return;

    try {
      setIsUpdating(user._id);
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, role: newRole }),
      });

      if (!res.ok) throw new Error("Failed to update role");

      toast.success(`${user.name} is now an ${newRole}.`);
      
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, role: newRole } : u));
    } catch (error) {
      toast.error("Failed to update user role.");
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage platform access and user roles.</p>
        </div>
      </div>

      <div className="rounded-2xl border bg-card shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, email, or username..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-muted/20 border-transparent focus:border-primary/20 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="py-4">Member</TableHead>
                <TableHead>Account Details</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <Loader2 className="h-8 w-8 animate-spin text-primary" />
                       <span className="text-sm text-muted-foreground">Synchronizing users...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                   <TableCell colSpan={5} className="h-64 text-center text-muted-foreground">
                      No users found matching your search.
                   </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id} className="hover:bg-muted/20 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                          <AvatarImage src={user.avatar?.url} />
                          <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">{user.name}</span>
                          <span className="text-xs text-muted-foreground">@{user.userName}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" /> {user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.role === "admin" ? "default" : "secondary"}
                        className={user.role === "admin" ? "bg-primary shadow-sm shadow-primary/20" : ""}
                      >
                        {user.role === "admin" ? (
                          <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Admin</span>
                        ) : (
                          <span className="flex items-center gap-1"><UserIcon className="h-3 w-3" /> Member</span>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {isUpdating === user._id ? (
                        <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-xl">
                            <DropdownMenuLabel className="text-xs font-bold text-muted-foreground uppercase px-2 py-1.5 tracking-wider">Management</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="rounded-lg gap-2 cursor-pointer"
                              onClick={() => toggleRole(user)}
                            >
                              <Shield className="h-4 w-4 text-blue-500" />
                              Make {user.role === "admin" ? "Member" : "Admin"}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg gap-2 text-destructive focus:bg-destructive/10 cursor-pointer">
                              <Trash2 className="h-4 w-4" />
                              Deactivate User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
