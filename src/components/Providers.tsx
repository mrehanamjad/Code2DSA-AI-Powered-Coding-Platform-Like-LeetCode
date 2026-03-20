"use client";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { useRef } from 'react'
import { Provider as StoreProvider } from 'react-redux'
import { makeStore, AppStore } from '@/lib/redux/store'
import { ImageKitProvider } from "imagekitio-next";

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

export default function Providers({ children }: { children: React.ReactNode }) {
  
  const authenticator = async () => {
    try {
      const response = await fetch("/api/imagekit/imagekit-auth");

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (error) {
      console.log(error);
      throw new Error(`Imagekit authentication request failed`);
    }
  };

// for redux toolkit store provider:
const storeRef = useRef<AppStore>(undefined)
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }

  return (
    <SessionProvider>
      <ImageKitProvider
        urlEndpoint={urlEndpoint}
        publicKey={publicKey}
        authenticator={authenticator}
      >

        <StoreProvider store={storeRef.current}>{children}</StoreProvider>
    <Toaster position="top-right"  richColors={true}  />

      </ImageKitProvider>
    </SessionProvider>
  );
}