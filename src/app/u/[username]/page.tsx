import ContributionGraph from "@/components/ContributionGraph";
import Achievements from "@/components/ProfilePageCompinents/Achievements";
import { ProfileHeader } from "@/components/ProfilePageCompinents/ProfileHeader";
import RecentActivity from "@/components/ProfilePageCompinents/RecentActivity";
import { SkillsAndLang } from "@/components/ProfilePageCompinents/SkillsAndLang";
import { StatsOverview } from "@/components/ProfilePageCompinents/StatsOverview";
import { PublicUser } from "@/lib/apiClient/types";
import { requireAuth } from "@/lib/require-auth";
import { UserStatisticI } from "@/models/userStatistic.model";
import { StatsOverviewPrompI } from "@/types/compInterfaces";
import { notFound } from "next/navigation";
import React from "react";

export async function getUserProfile(
  username: string
): Promise<PublicUser | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/user/${username}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Error fetching profile:", res.statusText);
      return null;
    }

    const data = await res.json(); 
    return data.data; //  API returns { data: publicData }
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

async function getUserStats(userid: string): Promise<UserStatisticI | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/user/statistics/${userid}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json(); // <- await here
    return data; // adjust according to API shape
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    return null;
  }
}

async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const [session, userData] = await Promise.all([
    requireAuth(),
    getUserProfile(username),
  ]);

  if (!userData) {
    notFound();
  }

  const userStats = await getUserStats(userData._id.toString());

  const createdAt = userData?.createdAt?.toString() || "";

  return (
    <div>
      <ProfileHeader
        sessionUserId={session.user.id.toString()}
        userId={userData._id.toString()}
        createdAt={createdAt as string}
        {...userData}
        languages={userStats?.languages || []}
        level={userStats?.level!}
      />
      <div className="md:grid md:grid-cols-4 gap-6 py-10 px-4 max-md:flex-col-reverse">
        <div className="md:col-span-3 mb-4">
          <StatsOverview data={{ ...userStats } as StatsOverviewPrompI} />
          <ContributionGraph
            userId={userData._id.toString()}
            userJoiningTime={userData.createdAt!}
          />
          <Achievements badges={userStats?.badge || []} />
          <RecentActivity userId={userData._id.toString()} />
        </div>
        <div className="md:col-span-1">
          <SkillsAndLang
            languages={userStats?.languages || []}
            skills={userStats?.skills || []}
          />
        </div>
      </div>
    </div>
  );
}

export default Page;
