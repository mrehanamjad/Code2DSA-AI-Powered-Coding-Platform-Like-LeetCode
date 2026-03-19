import ContributionGraph from "@/components/ContributionGraph";
import Achievements from "@/components/ProfilePageCompinents/Achievements";
import { ProfileHeader } from "@/components/ProfilePageCompinents/ProfileHeader";
import RecentActivity from "@/components/ProfilePageCompinents/RecentActivity";
import { SkillsAndLang } from "@/components/ProfilePageCompinents/SkillsAndLang";
import { StatsOverview } from "@/components/ProfilePageCompinents/StatsOverview";
import { PublicUser } from "@/lib/apiClient/types";
import { serverSession } from "@/lib/require-auth";
import { UserStatisticI } from "@/models/userStatistic.model";
import { StatsOverviewPrompI } from "@/types/compInterfaces";
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
      next: { revalidate: 60 }, 
    });

    if (!res.ok) return null;

    const data = await res.json(); 
    return data; 
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    return null;
  }
}

async function ProfilePg({username}: { username: string }) {

  const [session, userData] = await Promise.all([
    serverSession(),
    getUserProfile(username),
  ]);

  if (!userData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            User Not Found
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            The profile yo&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  const userStats = await getUserStats(userData._id.toString());

  const createdAt = userData?.createdAt?.toString() || "";

  return (
    <div>
      <ProfileHeader
        sessionUserId={session ? session.user.id.toString() : ""}
        userId={userData._id.toString()}
        createdAt={createdAt as string}
        {...userData}
        languages={userStats?.languages || []}
        level={userStats?.level || 1}
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

export default ProfilePg;
