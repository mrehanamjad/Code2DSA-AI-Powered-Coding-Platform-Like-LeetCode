"use client";

import { useState, useRef } from "react";
import { Camera, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse, UploadError } from "imagekitio-next/dist/types/components/IKUpload/props";
import { apiClient } from "@/lib/apiClient/apiClient";
import UserAvatar from "../UserAvatar";

interface Avatar {
  id: string;
  url: string;
}

interface AvatarSectionProps {
  avatar: Avatar;
  onAvatarChange: (newAvatar: Avatar) => void;
  name: string;
}

export function AvatarSection({ avatar, onAvatarChange, name }: AvatarSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate avatar file
  const fileValidator = (file: File) => {
    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (!validTypes.includes(file.type)) {
      toast.warning("Invalid file type", {
        description: "Allowed formats: PNG, JPG, JPEG, WEBP",
      });
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.warning("File too large", {
        description: "Image must be under 5MB",
      });
      return false;
    }

    return true;
  };

  const handleStartUpload = () => {
    setIsLoading(true);
  };

  const handleSuccess = async (res: IKUploadResponse) => {
    try {
      setPreviewUrl(res.filePath);

      const response = await apiClient.updateProfileAvatar({
        url: res.filePath,
        id: res.fileId,
      });

      if (!response.success) {
        throw new Error(response.error);
      }

      const newAvatar = {
        id: res.fileId,
        url: res.filePath,
      };

      onAvatarChange(newAvatar);

      toast.success("Avatar updated successfully");
      setIsOpen(false);
      setPreviewUrl(null);
    } catch (error) {
      toast.error("Failed to update avatar");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onError = (err: UploadError) => {
    setIsLoading(false);

    toast.error("Upload failed", {
      description: err?.message || "Something went wrong",
    });

    console.error("ImageKit Upload Error:", err);
  };

  const handleClose = () => {
    if (!isLoading) {
      setIsOpen(false);
      setPreviewUrl(null);
    }
  };

  return (
    <>
      {/* Avatar Display */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
        <div className="group relative">
          <div className="ring-primary/20 group-hover:ring-primary/40 h-full w-full overflow-hidden rounded-full ring-4 transition-all">
            <UserAvatar avatar={avatar?.url} name={name} h={24} w={24} />
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="bg-primary text-primary-foreground absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110"
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>

        <div className="text-center sm:text-left">
          <h3 className="text-foreground text-lg font-semibold">
            Profile Picture
          </h3>
          <p className="text-muted-foreground text-sm">
            Click the camera icon to update your avatar
          </p>
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
            <DialogDescription>
              Upload a new avatar (max 5MB).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Preview */}
            <div className="flex justify-center">
              <div className="ring-primary/20 relative h-32 w-32 overflow-hidden rounded-full ring-4">
                <UserAvatar avatar={previewUrl || avatar.url} name={name} />
              </div>
            </div>

            {/* Hidden Upload */}
            <IKUpload
              style={{ display: "none" }}
              ref={fileInputRef}
              fileName="avatar-image"
              useUniqueFileName={true}
              folder="code2Dsa-avatars"
              validateFile={fileValidator}
              onUploadStart={handleStartUpload}
              onSuccess={handleSuccess}
              onError={onError}
              accept="image/*"
            />

            {/* Upload Button */}
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Choose Image
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}