import { useState, useRef } from "react";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { toast } from "sonner";

interface Avatar {
    id: string;
    url: string;
}

interface AvatarSectionProps {
  avatar: Avatar;
  onAvatarChange: (newAvatar: Avatar) => void;
}

export function AvatarSection({ avatar, onAvatarChange }: AvatarSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {

        toast.warning("File too large",{
          description: "Please select an image under 5MB.",
        })
        
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!previewUrl) return;
    
    setIsLoading(true);
    try {
      console.log(avatar)
      // 1. Upload Logic (Assuming you have an upload route)
      // const formData = new FormData();
      // formData.append("file", fileInputRef.current?.files[0]);
      // const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      // const uploadData = await uploadRes.json();
      
      // MOCK DATA for now:
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockNewAvatar = { id: "new_id_123", url: previewUrl };
      
      // 2. Update Profile with new Avatar URL/ID
      // await fetch("/api/profile/details", ... ) // Or separate avatar endpoint

      onAvatarChange(mockNewAvatar);
      
      toast.success("Profile picture updated",{
        description: "Your profile picture has been updated.",
      });
      setIsOpen(false);
      setPreviewUrl(null);
    } catch (error) {
      toast.error("Failed to update profile picture",{
        description: "Something went wrong. Please try again.",
      });
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
        <div className="relative group">
          <div className="h-24 w-24 overflow-hidden rounded-full ring-4 ring-primary/20 transition-all group-hover:ring-primary/40">
            <Image
            //   src={avatar.url || "/default-avatar.png"}
                          src={"/problemsPg.png"}
              alt="Profile avatar"
              className="h-full w-full object-cover"
              width={200}
              height={200}
            />
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110"
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-semibold text-foreground">Profile Picture</h3>
          <p className="text-sm text-muted-foreground">
            Click the camera icon to update your avatar
          </p>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="animate-scale-in sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
            <DialogDescription>
              Upload a new profile picture. Max size 5MB.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex justify-center">
              <div className="relative h-32 w-32 overflow-hidden rounded-full ring-4 ring-primary/20">
                <Image
                //   src={previewUrl || avatar.url || "/default-avatar.png"}
              src={"/problemsPg.png"}

                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                  width={200}
                  height={200}
                />
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" />
                Choose Image
              </Button>
              {previewUrl && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPreviewUrl(null)}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setIsOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleSave}
                disabled={!previewUrl || isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}