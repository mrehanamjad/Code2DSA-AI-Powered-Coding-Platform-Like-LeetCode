import { imagekit } from "../imagekitCredentials";

export async function deleteImageFromImageKit(fileId: string) {
  if (!fileId) {
    throw new Error("Image fileId is required");
  }

  return new Promise((resolve, reject) => {
    imagekit.deleteFile(fileId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}