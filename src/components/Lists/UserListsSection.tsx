"use client";

import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/apiClient/apiClient";
import { ProblemListI } from "@/models/problemList.model";
import ListCard from "@/components/Lists/ListCard";
import CreateListModal from "@/components/Lists/CreateListModal";
import { FolderOpen, Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import Link from "next/link";

interface UserListsSectionProps {
    listPage?: boolean;
    userId?: string;
}

export default function UserListsSection({
    listPage = true,
    userId,
}: UserListsSectionProps) {
    const { status } = useSession();
    const [lists, setLists] = useState<ProblemListI[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLists = useCallback(async () => {
        if (listPage && status !== "authenticated") {
            setLoading(false);
            return;
        }

        try {
            const res = await apiClient.getLists(userId);
            if (res.success && res.data?.lists) {
                setLists(res.data.lists);
            }
        } catch (error) {
            console.error("Failed to fetch lists", error);
        } finally {
            setLoading(false);
        }
    }, [listPage, userId, status]);

    useEffect(() => {
        fetchLists();
    }, [fetchLists]);

    if (loading || status === "loading") {
        return (
            <div className="animate-pulse space-y-8 w-full">
                {listPage && (<div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <div className="h-8 w-48 bg-muted rounded-md" />
                        <div className="h-4 w-64 bg-muted/60 rounded-md" />
                    </div>
                </div>)}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-40 bg-muted/40 rounded-xl border border-border" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Header Section */}
            {listPage && <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        My Problem Lists
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Organize & track your coding progress with custom lists.
                    </p>
                </div>
                {status === "authenticated" && <CreateListModal onSuccess={fetchLists} />}
            </div>}

            {/* Content Section */}
            {lists.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center border rounded-2xl bg-muted/10 border-dashed border-border/60">
                    <div className="h-14 w-14 bg-muted/50 rounded-full flex items-center justify-center mb-4 text-muted-foreground">
                        {status === "unauthenticated" ? <Lock className="h-7 w-7" /> : <FolderOpen className="h-7 w-7" />}
                    </div>
                    <h3 className="text-lg font-semibold mb-1 text-foreground">
                        {listPage  ? (status === "unauthenticated" ? "Sign in required" : "No lists created yet"): "No Public List" }
                    </h3>
                    {listPage && <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                        {status === "unauthenticated" ? "You need to be logged in to create, manage, and view your personal problem lists." : "Create your first problem list to organize your study plan."}
                    </p>}
                    {!listPage && status === "authenticated" ? (
                        <CreateListModal onSuccess={fetchLists} />
                    ) : (
                        <Link href="/login">
                            <Button >
                                Sign In to Continue
                            </Button>
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lists.map((list, idx) => (
                        <ListCard
                            key={list._id ? String(list._id) : idx}
                            list={list}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}