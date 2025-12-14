"use client";
import { useEffect, useState } from "react";
import {  useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PublicUser, EditableField } from "@/app/profile/page";
import {
  detailsSchema,
  usernameSchema,
  passwordSchema,
  UnifiedFormValues,
  CombinedFormValues,
} from "@/lib/schemas";
import { useSession } from "next-auth/react";
import z from "zod";
import { toast } from "sonner";

interface EditFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: EditableField;
  currentUser: PublicUser;
  onUpdateSuccess: (updates: Partial<PublicUser>) => void;
}

const fieldConfig = {
  userName: {
    title: "Edit Username",
    description: "Your username is visible to other users.",
  },
  profile: {
    title: "Edit Profile",
    description: "Update your personal details.",
  },
  password: {
    title: "Change Password",
    description: "Ensure your account is secure. Current password is required.",
  },
};

export function EditFieldModal({
  isOpen,
  onClose,
  field,
  currentUser,
  onUpdateSuccess,
}: EditFieldModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { data: session, update } = useSession();

  // Determine which schema and default values to use
  // @ts-ignore
  let schema: z.ZodType<UnifiedFormValues, any, any>;
  let defaultValues: UnifiedFormValues;

  if (field === "userName") {
    schema = usernameSchema;
    defaultValues = {
      userName: currentUser.userName,
    };
  } else if (field === "password") {
    schema = passwordSchema;
    defaultValues = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
  } else {
    schema = detailsSchema;
    defaultValues = {
      name: currentUser.name,
      bio: currentUser.bio || "",
      phone: currentUser.phone || "",
    };
  }

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as CombinedFormValues,
    mode: "onChange",
  });

  // Reset form when modal opens or field changes
  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
    }
  }, [isOpen, field, currentUser, reset]);

  const onSubmit = async (data: CombinedFormValues) => {
    try {
      let endpoint = "";
      let body = {};
      let successMessage = "";

      if (field === "profile") {
        endpoint = "/api/profile/details";
        body = { name: data.name, bio: data.bio, phone: data.phone };
        successMessage = "Profile updated successfully";
      } else if (field === "userName") {
        endpoint = "/api/profile/username";
        body = { userName: data.userName };
        successMessage = "Username updated successfully";
      } else if (field === "password") {
        endpoint = "/api/profile/password";
        body = {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        };
        successMessage = "Password changed successfully";
      }

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      toast.success(successMessage);

      // Update parent state
      if (field === "profile") {
        onUpdateSuccess({ name: data.name, bio: data.bio, phone: data.phone });
      } else if (field === "userName") {
        onUpdateSuccess({ userName: data.userName });
        // If username changed, update the NextAuth session

        await update({
          ...session,
          user: {
            ...session?.user,
            username: data.userName, // Make sure this key matches your session type
          },
        });
        // trigger a refresh to ensure server components get new data if needed
        // router.refresh();
      }

      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";

      toast.error(message);
    }
  };

  if (!field) return null;

  const config = fieldConfig[field];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="animate-scale-in sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* PROFILE FORM FIELDS */}
          {field === "profile" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...register("name")} />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" rows={3} {...register("bio")} />
                {errors.bio && (
                  <p className="text-sm text-destructive">
                    {errors.bio.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" {...register("phone")} />
                {errors.phone && (
                  <p className="text-sm text-destructive">
                    {errors.phone.message as string}
                  </p>
                )}
              </div>
            </>
          )}

          {/* USERNAME FORM FIELDS */}
          {field === "userName" && (
            <div className="space-y-2">
              <Label htmlFor="userName">Username</Label>
              <Input id="userName" {...register("userName")} />
              {errors.userName && (
                <p className="text-sm text-destructive">
                  {errors.userName.message as string}
                </p>
              )}
            </div>
          )}

          {/* PASSWORD FORM FIELDS */}
          {field === "password" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    {...register("currentPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-sm text-destructive">
                    {errors.currentPassword.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  {...register("newPassword")}
                />
                {errors.newPassword && (
                  <p className="text-sm text-destructive">
                    {errors.newPassword.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword.message as string}
                  </p>
                )}
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
