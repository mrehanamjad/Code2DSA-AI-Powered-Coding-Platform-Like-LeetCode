import React from 'react';

const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#0E0E10] p-6 text-white font-sans">
      <div className="max-w-[1400px] mx-auto space-y-6 animate-pulse">
        
        {/* --- Hero Section --- */}
        <div className="w-full bg-[#18181B] border border-[#27272A] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar Skeleton */}
          <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-[#27272A] flex-shrink-0" />
          
          {/* User Info Skeleton */}
          <div className="flex-1 space-y-4 w-full text-center sm:text-left">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-[#27272A] rounded mx-auto sm:mx-0" />
              <div className="h-4 w-24 bg-[#27272A] rounded mx-auto sm:mx-0" />
            </div>
            
            {/* Bio */}
            <div className="h-4 w-3/4 max-w-md bg-[#27272A] rounded mx-auto sm:mx-0" />
            
            {/* Contact/Details */}
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start justify-center sm:justify-start pt-2">
              <div className="h-4 w-32 bg-[#27272A] rounded" />
              <div className="h-4 w-32 bg-[#27272A] rounded" />
            </div>

            {/* Tags */}
            <div className="flex gap-2 justify-center sm:justify-start pt-2">
              <div className="h-8 w-20 bg-[#27272A] rounded-full" />
              <div className="h-8 w-24 bg-[#27272A] rounded-full" />
            </div>
          </div>

          {/* Edit Button Skeleton (Top Right) */}
          <div className="h-10 w-32 bg-[#27272A] rounded-lg flex-shrink-0" />
        </div>

        {/* --- Main Grid Layout --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Column (Stats & Charts) - Spans 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Top Row Stats (4 cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#18181B] border border-[#27272A] rounded-2xl p-5 flex flex-col justify-between h-32">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="h-3 w-20 bg-[#27272A] rounded" />
                      <div className="h-8 w-12 bg-[#27272A] rounded" />
                    </div>
                    <div className="h-10 w-10 rounded-full bg-[#27272A]" />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Section (Mixed Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              
              {/* Column 1: Small Stats Stack */}
              <div className="space-y-6">
                <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-5 h-40 relative">
                   <div className="space-y-3">
                      <div className="h-3 w-24 bg-[#27272A] rounded" />
                      <div className="h-8 w-10 bg-[#27272A] rounded" />
                   </div>
                   <div className="absolute right-5 top-1/2 -translate-y-1/2 h-12 w-12 rounded-lg bg-[#27272A]" />
                </div>
                <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-5 h-40 relative">
                    <div className="space-y-3">
                      <div className="h-3 w-24 bg-[#27272A] rounded" />
                      <div className="h-8 w-10 bg-[#27272A] rounded" />
                   </div>
                </div>
              </div>

               {/* Column 2: Small Stats Stack */}
               <div className="space-y-6">
                <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-5 h-40 relative">
                    <div className="space-y-3">
                      <div className="h-3 w-16 bg-[#27272A] rounded" />
                      <div className="h-8 w-14 bg-[#27272A] rounded" />
                   </div>
                   <div className="absolute right-5 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-[#27272A]" />
                </div>
                <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-5 h-40">
                   <div className="space-y-3">
                      <div className="h-3 w-20 bg-[#27272A] rounded" />
                      <div className="h-8 w-12 bg-[#27272A] rounded" />
                   </div>
                </div>
              </div>

              {/* Column 3: Solved Difficulty (Tall Card) */}
              <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 flex flex-col items-center justify-center h-auto min-h-[340px] xl:col-span-1 md:col-span-2 xl:row-span-1">
                <div className="w-full h-4 bg-[#27272A] rounded mb-8 self-start " />
                {/* Donut Chart Skeleton */}
                <div className="relative h-40 w-40 rounded-full border-8 border-[#27272A] flex items-center justify-center">
                   <div className="h-8 w-8 bg-[#27272A] rounded" />
                </div>
              </div>

            </div>
          </div>

          {/* Right Column (Sidebar) - Spans 1 column */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Languages Card */}
            <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 h-64">
              <div className="h-5 w-24 bg-[#27272A] rounded mb-6" />
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <div className="h-8 w-20 bg-[#27272A] rounded-full" />
                   <div className="h-3 w-16 bg-[#27272A] rounded" />
                </div>
                <div className="flex justify-between items-center">
                   <div className="h-8 w-24 bg-[#27272A] rounded-full" />
                   <div className="h-3 w-16 bg-[#27272A] rounded" />
                </div>
              </div>
            </div>

            {/* Skills Card */}
            <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 h-64">
               <div className="h-5 w-24 bg-[#27272A] rounded mb-6" />
               <div className="space-y-2">
                 <div className="h-3 w-20 bg-[#27272A] rounded mb-2" />
                 <div className="flex flex-wrap gap-2">
                   <div className="h-6 w-24 bg-[#27272A] rounded-full" />
                   <div className="h-6 w-16 bg-[#27272A] rounded-full" />
                   <div className="h-6 w-20 bg-[#27272A] rounded-full" />
                 </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;