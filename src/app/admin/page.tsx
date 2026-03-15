"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  FileCode, 
  Activity, 
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Loader2,
  Clock,
  PlusCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
import Link from "next/link";
import { toast } from "sonner";

interface Stats {
  totalUsers: number;
  totalProblems: number;
  totalSubmissions: number;
  successRate: string;
}

interface RecentSubmission {
  _id: string;
  userId: {
    userName: string;
    name: string;
    avatar?: { url: string };
  };
  problemId: {
    title: string;
    difficulty: string;
  };
  status: string;
  language: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/admin/stats");
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const data = await res.json();
        setStats(data.stats);
        setRecentActivity(data.recentSubmissions);
      } catch (error) {
        toast.error("Could not load dashboard information.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    { 
      title: "Total Users", 
      value: stats?.totalUsers || 0, 
      icon: Users, 
      color: "text-blue-500", 
      bg: "bg-blue-500/10" 
    },
    { 
      title: "Active Problems", 
      value: stats?.totalProblems || 0, 
      icon: FileCode, 
      color: "text-purple-500", 
      bg: "bg-purple-500/10" 
    },
    { 
      title: "Submissions", 
      value: stats?.totalSubmissions || 0, 
      icon: Activity, 
      color: "text-amber-500", 
      bg: "bg-amber-500/10" 
    },
    { 
      title: "Success Rate", 
      value: `${stats?.successRate || 0}%`, 
      icon: CheckCircle2, 
      color: "text-emerald-500", 
      bg: "bg-emerald-500/10" 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-1">Platform performance and live metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <div key={i} className="rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className={stat.bg + " p-2.5 rounded-xl"}>
                <stat.icon className={"h-5 w-5 " + stat.color} />
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground/30" />
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-2xl border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Recent Submissions
            </h3>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/submissions" className="text-xs group">
                View All <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="py-4">User</TableHead>
                  <TableHead>Problem</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((sub) => (
                  <TableRow key={sub._id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border">
                          <AvatarImage src={sub.userId.avatar?.url} />
                          <AvatarFallback>{sub.userId.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium leading-none">{sub.userId.name}</span>
                          <span className="text-[10px] text-muted-foreground">@{sub.userId.userName}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{sub.problemId?.title || "Unknown"}</span>
                        <Badge variant="outline" className="w-fit text-[10px] h-4 mt-1">
                          {sub.problemId?.difficulty || "N/A"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={sub.status === "accepted" ? "default" : "destructive"} 
                        className={sub.status === "accepted" ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                      >
                        {sub.status === "accepted" ? "Passed" : "Failed"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground uppercase">
                      {sub.language}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                  </TableRow>
                ))}
                {recentActivity.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No recent activity found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Quick Actions / System Status */}
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h3 className="font-semibold mb-4 text-lg">System Health</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">API Status</span>
                <Badge className="bg-emerald-500">Operational</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Judge Service</span>
                <Badge className="bg-emerald-500">Online</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Database</span>
                <Badge className="bg-emerald-500">Connected</Badge>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t flex flex-col gap-2">
               <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Quick Links</h4>
               <Button variant="outline" className="justify-start" asChild>
                 <Link href="/admin/problems/add"><PlusCircle className="mr-2 h-4 w-4" /> Create Problem</Link>
               </Button>
               <Button variant="outline" className="justify-start" asChild>
                 <Link href="/admin/users"><Users className="mr-2 h-4 w-4" /> Manage Users</Link>
               </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
