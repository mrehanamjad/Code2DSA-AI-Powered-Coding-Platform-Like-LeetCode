import Achievements from '@/components/ProfilePageCompinents/Achievements'
import { ProfileHeader } from '@/components/ProfilePageCompinents/ProfileHeader'
import RecentActivity from '@/components/ProfilePageCompinents/RecentActivity'
import { SkillsAndLang } from '@/components/ProfilePageCompinents/SkillsAndLang'
import { StatsOverview } from '@/components/ProfilePageCompinents/StatsOverview'
import React from 'react'

function page() {
  return (
    <div>
        <ProfileHeader />
        <div className='md:grid md:grid-cols-4 gap-6 py-10 px-4 max-md:flex-col-reverse'>
        <div className='md:col-span-3 mb-4'>
          <StatsOverview />
          <Achievements />
          <RecentActivity />
          </div>
        <div className='md:col-span-1'><SkillsAndLang /></div>
        </div>
    </div>
  )
}

export default page