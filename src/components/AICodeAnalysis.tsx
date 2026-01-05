"use client";

import React, { useState, useEffect, useRef } from "react";
import { apiClient } from "@/lib/apiClient/apiClient";
import {
  Loader2, Bug, Zap, Clock, Database, X, Sparkles, CheckCircle2, Terminal
} from "lucide-react";
import { toast } from "sonner";
import { AICodeAnalyzerResposeI } from "@/lib/apiClient/types";
import { Button } from "./ui/button";

interface AICodeAnalysisModalProps {
  problemStatement: string;
  code: string;
  language: string;
}

export default function AICodeAnalysisModal({
  problemStatement,
  code,
  language,
}: AICodeAnalysisModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AICodeAnalyzerResposeI | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && code && problemStatement) {
      handleAnalyze();
    }
    if (!isOpen) {
      setAnalysis(null);
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);


  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getAICodeAnalysis({
        problemStatement,
        code,
        language,
      });

      if (res.success && res.data) {
        setAnalysis(res.data);
      } else {
        toast.error(res.error || "Failed to analyze code.");
        setIsOpen(false);
      }
    } catch (error) {
      console.error(error)
      toast.error("An unexpected error occurred.");
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => {
          if (!code) {
             toast.error("Please write some code first.");
             return;
          }
          setIsOpen(true)
        }}
        className="cursor-pointer"
      >
        <Sparkles className="h-5 w-5 group-hover:animate-pulse" />
        <span>AI Code Analyzer</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            ref={modalRef}
            className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-950/50 shrink-0">
              <div className="flex items-center gap-3">
                 <div className="p-2.5 bg-blue-500/10 rounded-xl">
                  <Sparkles className="h-6 w-6 text-blue-400" />
                 </div>
                <div>
                  <h2 className="text-xl font-bold text-white leading-tight">AI Code Review</h2>
                  <p className="text-sm text-zinc-400">Deep insight into your solution.</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-6 py-20">
                  <div className="relative flex h-20 w-20">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-20"></span>
                    <span className="relative inline-flex rounded-full h-20 w-20 bg-zinc-900 border-2 border-blue-500/50 items-center justify-center">
                        <Loader2 className="h-10 w-10 text-blue-400 animate-spin" />
                    </span>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-medium text-white">Analyzing your code...</h3>
                    <p className="text-sm text-zinc-500">Checking for complexity, bugs, and optimizations.</p>
                  </div>
                </div>
              ) : analysis ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">

                  {/* 1. Complexity Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl flex items-center gap-5 relative overflow-hidden group">
                      <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 shrink-0">
                        <Clock className="h-8 w-8 text-purple-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-1">Time Complexity</p>
                        <p className="text-2xl font-black text-white tracking-tight break-words">{analysis.timeComplexity}</p>
                      </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl flex items-center gap-5 relative overflow-hidden group">
                      <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shrink-0">
                        <Database className="h-8 w-8 text-emerald-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Space Complexity</p>
                        <p className="text-2xl font-black text-white tracking-tight break-words">{analysis.spaceComplexity}</p>
                      </div>
                    </div>
                  </div>

                  {/* 2. Bugs & Optimizations Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Bugs Section */}
                    <div className="flex flex-col bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-5 overflow-hidden">
                      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800/50 shrink-0">
                         <div className="p-1.5 bg-red-500/10 rounded-md">
                           <Bug className="h-5 w-5 text-red-400" />
                         </div>
                        <h3 className="text-lg font-semibold text-white">Potential Bugs</h3>
                      </div>
                      
                      <div className="flex-1">
                        {analysis.bugs.length > 0 ? (
                          <ul className="space-y-3">
                            {analysis.bugs.map((bug, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                <span className="text-sm leading-relaxed text-zinc-300 break-words overflow-hidden">{bug}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <EmptyState icon={CheckCircle2} color="text-emerald-400" title="Clean Code!" description="No obvious bugs detected." />
                        )}
                      </div>
                    </div>

                     {/* Optimizations Section */}
                    <div className="flex flex-col bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-5 overflow-hidden">
                      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800/50 shrink-0">
                        <div className="p-1.5 bg-amber-500/10 rounded-md">
                           <Zap className="h-5 w-5 text-amber-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Suggested Optimizations</h3>
                      </div>
                      
                      <div className="flex-1">
                         {analysis.optimizations.length > 0 ? (
                          <ul className="space-y-3">
                            {analysis.optimizations.map((opt, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                                <span className="text-sm leading-relaxed text-zinc-300 break-words overflow-hidden">{opt}</span>
                              </li>
                            ))}
                          </ul>
                         ) : (
                          <EmptyState icon={CheckCircle2} color="text-blue-400" title="Optimized!" description="The code looks efficient." />
                         )}
                      </div>
                    </div>
                  </div>

                  {/* 3. General Feedback Section */}
                  <div className="pb-4">
                     <div className="flex items-center gap-2 mb-4">
                         <div className="p-1.5 bg-blue-500/10 rounded-md">
                            <Terminal className="h-5 w-5 text-blue-400" />
                         </div>
                         <h3 className="text-lg font-semibold text-white">AI Summary & Feedback</h3>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                           <Sparkles className="h-24 w-24 text-blue-500" />
                        </div>
                      <div className="prose prose-invert max-w-none text-sm leading-7 text-zinc-300 relative z-10 break-words whitespace-pre-wrap">
                        {analysis.feedback.split('\n').map((paragraph, idx) => (
                            paragraph.trim() && (
                              <p key={idx} className={idx > 0 ? 'mt-4' : ''}
                                 dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<b class="text-white font-semibold">$1</b>') }}
                              ></p>
                            )
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function EmptyState({ icon: Icon, color, title, description }: { icon: any , color: string, title: string, description: string }) {
    return (
        <div className="h-full min-h-[120px] flex flex-col items-center justify-center text-center p-4">
        <Icon className={`h-10 w-10 ${color} mb-3 opacity-80`} />
        <p className="text-base font-medium text-white">{title}</p>
        <p className="text-sm text-zinc-500">{description}</p>
      </div>
    )
}