"use client";
import React, {  useState } from "react";
import {  IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";


interface PropsI {
  onSuccess: (res: IKUploadResponse) => void;
  onProgress?: (res: number) => void;
  fileType?: "image" | "video";
}

export default function FileUpload({
  onSuccess,
  onProgress,
}: PropsI) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onError = (err: { message: string }) => {
    console.log("Error", err);
    setError(err.message);
    setUploading(false);
  };

  const handleSuccess = (res: IKUploadResponse) => {
    setUploading(false);
    setError(null);
    onSuccess(res);
  };

  const handleProgress = (evt: ProgressEvent) => {
    if (evt.lengthComputable && onProgress) {
      const percentCoplete = (evt.loaded / evt.total) * 100;
      onProgress(Math.round(percentCoplete));
    }
  };

  const handleStartUpload = () => {
    setUploading(true);
    setError(null);
  };

  const fileValidator = (file: File) => {
      const validTypes = ["image/png", "image/jpeg", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid file ( PNG, JPEG, or WebP) ");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should not exceed 5MB.");
        return false;
      }
    return true;
  };

  return (
    <div className="App">
      <IKUpload
        fileName={"image"}
        useUniqueFileName={true}
        validateFile={fileValidator}
        folder={"images"}
        onError={onError}
        onSuccess={handleSuccess}
        onUploadProgress={handleProgress}
        onUploadStart={handleStartUpload}
        accept={"image/*"}
        className="file-input file-input-border w-full bg-[#2e2e2e]"
      />
      {uploading && (
        <div className="flex items-center gap-2 text-sm text-primary">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Uploading...</span>
        </div>
      )}

      {error && <div className="text-error text-sm">{error}</div>}
    </div>
  );
}