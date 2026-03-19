"use client"

import { useState, useEffect, ReactNode } from "react"
import { Check, Copy, Share2, Lock, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface ShareLinkDialogProps {
  title: string
  description: string
  itemName?: string
  isPublic?: boolean
  privateStateContent?: ReactNode 
  triggerText?: string
  triggerClassName?: string
  shareUrl?: string // Optional override, otherwise uses window.location.href
}

export function ShareLinkDialog({
  title,
  description,
  itemName,
  isPublic = true,
  privateStateContent,
  triggerText = "Share",
  triggerClassName = "",
  shareUrl,
}: ShareLinkDialogProps) {
  const [url, setUrl] = useState("")
  const [copied, setCopied] = useState(false)

  // Hydrate the URL safely on the client
  useEffect(() => {
    setUrl(shareUrl || window.location.href)
  }, [shareUrl])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy!", err)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={`gap-2 cursor-pointer font-['Outfit'] font-semibold border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all active:scale-95 ${triggerClassName}`}>
          <Share2 size={16} className="text-emerald-600 dark:text-[#7EE8A2]" />
          {triggerText}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-[24px] border-border bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Decorative Top Bar */}
        <div className={`absolute top-0 left-0 w-full h-1.5 ${isPublic ? 'bg-emerald-500' : 'bg-amber-500'}`} />

        <DialogHeader className="space-y-3 pt-2">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPublic ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
              {isPublic ? (
                <Globe size={18} className="text-emerald-600 dark:text-[#7EE8A2]" />
              ) : (
                <Lock size={18} className="text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <DialogTitle className="font-['Outfit'] text-2xl font-bold tracking-tight">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm font-light leading-relaxed">
            {description}
            {itemName && (
              <p className="text-sm font-semibold text-foreground mt-2 truncate">
                {itemName}
              </p>
            )}
          </DialogDescription>
        </DialogHeader>

        {isPublic ? (
          /* --- PUBLIC STATE: Share Link --- */
          <div className="flex items-center space-x-2 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">Link</Label>
              <Input
                id="link"
                value={url}
                readOnly
                className="h-11 rounded-xl bg-muted/50 border-border focus-visible:ring-emerald-500/30 font-mono text-[11px]"
              />
            </div>
            <Button
              size="icon"
              onClick={copyToClipboard}
              className={`h-11 w-11 shrink-0 rounded-xl transition-all duration-300 ${
                copied ? "bg-emerald-600 hover:bg-emerald-700" : "bg-foreground hover:bg-foreground/90"
              }`}
            >
              {copied ? (
                <Check size={18} className="text-white animate-in zoom-in" />
              ) : (
                <Copy size={18} className={copied ? "text-white" : ""} />
              )}
            </Button>
          </div>
        ) : (
          /* --- PRIVATE STATE: Render Custom Content (like the Edit Modal) --- */
          <div className="mt-4 animate-in fade-in zoom-in-95 duration-500">
            {privateStateContent}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-6 pt-4 border-t border-border/50">
          <p className="text-[10px] text-center font-bold tracking-[0.15em] uppercase text-muted-foreground/40">
            {isPublic ? "Link sharing enabled" : "Link sharing disabled"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}