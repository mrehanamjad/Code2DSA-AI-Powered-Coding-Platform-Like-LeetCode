"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SettingsCard } from "@/components/settingsComp/SettingsCard";
import { AvatarSection } from "@/components/settingsComp/AvatarSection";
import { EditFieldModal } from "@/components/settingsComp/EditFieldModal";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { Types } from "mongoose";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// The Type provided in your prompt
export type PublicUser = {
  userName: string;
  name: string;
  email: string;
  avatar: {
    id: string;
    url: string;
  };
  phone: string;
  bio: string;
  _id: Types.ObjectId;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
};

export type EditableField = "userName" | "profile" | "password" | null;

const Settings = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<PublicUser | null>(null);
  const [editingField, setEditingField] = useState<EditableField>(null);

  // Fetch User Data
  useEffect(() => {
    const fetchUserData = async () => {
      // Assuming session.user has the username or we use a "me" endpoint.
      // Since your requirement is `api/user/${username}`, we need the username from session first.
      const sessionUsername = session?.user.username;

      if (status === "authenticated" && sessionUsername) {
        try {
          const res = await fetch(`/api/user/${sessionUsername}`);
          if (!res.ok) throw new Error("Failed to fetch user data");
          const data = await res.json();
          setUser(data.data); 
        } catch (error) {
          console.error(error);
          toast.error("Failed to fetch user data")
        } finally {
          setLoading(false);
        }
      } else if (status === "unauthenticated") {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [status, session]);

  // Optimistic / Post-API Update
  const handleUserUpdate = (updates: Partial<PublicUser>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
        <div className="flex h-screen items-center justify-center text-muted-foreground">
            User not found.
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="animate-slide-up space-y-8">
          
          {/* Profile Section */}
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Profile</h2>
              <Button
                onClick={() => setEditingField("profile")}
              >
                Edit Profile
              </Button>
            </div>
            
            <AvatarSection
              avatar={user.avatar}
              onAvatarChange={(newAvatar) => handleUserUpdate({ avatar: newAvatar })}
            />
            
            <Separator className="my-6" />
            
            <div className="space-y-4">
              <SettingsCard
                label="Full Name"
                value={user.name}
                description="Displayed on your profile"
                editable={false}
              />
              <SettingsCard
                label="Bio"
                value={user.bio}
                description="A short description about yourself"
                editable={false}
              />
              <SettingsCard
                label="Phone"
                value={user.phone}
                description="Your contact number"
                editable={false}
              />
            </div>
          </section>

          {/* Account Information */}
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="mb-6 text-xl font-semibold text-foreground">Account Information</h2>
            <div className="space-y-4">
              <SettingsCard
                label="Username"
                value={user.userName}
                description="Your unique identifier"
                onEdit={() => setEditingField("userName")}
              />
              <SettingsCard
                label="Email"
                value={user.email}
                description="Used for notifications and login"
                editable={false}
              />
            </div>
          </section>

          {/* Security */}
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="mb-6 text-xl font-semibold text-foreground">Security</h2>
            <SettingsCard
              label="Password"
              value="********"
              description="Secure your account"
              onEdit={() => setEditingField("password")}
              isPassword
            />
          </section>

          {/* Theme */}
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Appearance</h2>
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/50 p-4">
              <div>
                <p className="font-medium text-foreground">Theme</p>
                <p className="text-sm text-muted-foreground">Toggle between light and dark mode</p>
              </div>
              <ThemeToggle />
            </div>
          </section>
        </div>
      </main>

      {/* Edit Modal with React Hook Form */}
      {editingField && (
        <EditFieldModal
          isOpen={true}
          onClose={() => setEditingField(null)}
          field={editingField}
          currentUser={user}
          onUpdateSuccess={handleUserUpdate}
        />
      )}
    </div>
  );
};

export default Settings;