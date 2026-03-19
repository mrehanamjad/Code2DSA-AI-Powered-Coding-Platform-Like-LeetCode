'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import RecentACTable from './RecentACTable'
import Link from 'next/link'
import UserListsSection from '../Lists/UserListsSection'


export default function RecentActivity({ userId }: { userId: string }) {
  const [activeTab, setActiveTab] = useState<'recent' | 'list' | 'challenges'>('recent')




  const handleTabChange = (tab: 'recent' | 'list' | 'challenges') => {
    setActiveTab(tab)
    // setCurrentPage(0)
  }

  const TabButton = ({ tab, label }: { tab: 'recent' | 'list' | 'challenges'; label: string }) => (
    <button
      onClick={() => handleTabChange(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }`}
    >
      {label}
    </button>
  )

  return (
    <Card className='p-6 mt-4'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
        <h3 className='text-lg font-bold'>Activity</h3>
      </div>

      <div className='flex gap-2 mb-3 border-b border-border pb-2'>
        <TabButton tab='recent' label='Recent Activity' />
        <TabButton tab='list' label='My List' />
        {/* <TabButton tab='challenges' label='Challenges' /> */}
      </div>

      {activeTab === 'recent' && <div className='overflow-x-auto'>
        <div className='flex flex-row-reverse'>
          <Link href={'/progress'} ><Button variant={'ghost'} size={"sm"} className='text-sm cursor-pointer'>View All Submissions <ArrowRight /> </Button></Link>
        </div>
        <RecentACTable userId={userId} />
      </div>}

      {activeTab === 'list' && (<div className='overflow-x-auto'>
        <UserListsSection listPage={false} userId={userId} />
      </div>)}



      {/* pagination: */}
      {/* <div className='flex items-center justify-between mt-6 pt-6 border-t border-border'>
        <p className='text-sm text-muted-foreground'>
          Showing {currentPage * itemsPerPage + 1} to {Math.min((currentPage + 1) * itemsPerPage, currentData.length)} of {currentData.length}
        </p>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
          >
            <ChevronLeft className='w-4 h-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={(currentPage + 1) * itemsPerPage >= currentData.length}
          >
            <ChevronRight className='w-4 h-4' />
          </Button>
        </div>
      </div> */}
    </Card>
  )
}
