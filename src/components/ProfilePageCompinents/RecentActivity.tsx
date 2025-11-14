'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { CheckCircle, Clock, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const activities = [
  {
    id: 1,
    problem: 'Two Sum',
    difficulty: 'Easy',
    status: 'Accepted',
    timestamp: '2 hours ago',
    statusIcon: CheckCircle,
    statusColor: 'text-green-500',
  },
  {
    id: 2,
    problem: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    status: 'Accepted',
    timestamp: '5 hours ago',
    statusIcon: CheckCircle,
    statusColor: 'text-green-500',
  },
  {
    id: 3,
    problem: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    status: 'Accepted',
    timestamp: '1 day ago',
    statusIcon: CheckCircle,
    statusColor: 'text-green-500',
  },
  {
    id: 4,
    problem: 'Container With Most Water',
    difficulty: 'Medium',
    status: 'Pending',
    timestamp: '2 days ago',
    statusIcon: Clock,
    statusColor: 'text-yellow-500',
  },
  {
    id: 5,
    problem: 'Regular Expression Matching',
    difficulty: 'Hard',
    status: 'Rejected',
    timestamp: '3 days ago',
    statusIcon: AlertCircle,
    statusColor: 'text-red-500',
  },
]

const myList = [
  {
    id: 1,
    problem: 'Reverse Integer',
    difficulty: 'Easy',
    status: 'Todo',
    timestamp: 'Added 1 week ago',
    statusIcon: Clock,
    statusColor: 'text-blue-500',
  },
  {
    id: 2,
    problem: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    status: 'In Progress',
    timestamp: 'Added 3 days ago',
    statusIcon: Clock,
    statusColor: 'text-yellow-500',
  },
]

const challenges = [
  {
    id: 1,
    problem: '30-Day Challenge: Arrays',
    difficulty: 'Medium',
    status: 'In Progress',
    timestamp: '15 of 30 completed',
    statusIcon: CheckCircle,
    statusColor: 'text-blue-500',
  },
  {
    id: 2,
    problem: 'Weekly Challenge: Dynamic Programming',
    difficulty: 'Hard',
    status: 'Active',
    timestamp: '5 of 7 solved',
    statusIcon: Clock,
    statusColor: 'text-yellow-500',
  },
]

export default function RecentActivity() {
  const [currentPage, setCurrentPage] = useState(0)
  const [activeTab, setActiveTab] = useState<'recent' | 'list' | 'challenges'>('recent')
  const itemsPerPage = 5

  const getTabData = () => {
    switch (activeTab) {
      case 'list':
        return myList
      case 'challenges':
        return challenges
      default:
        return activities
    }
  }

  const currentData = getTabData()

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500/20 text-green-700 dark:text-green-400'
      case 'Medium':
        return 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
      case 'Hard':
        return 'bg-red-500/20 text-red-700 dark:text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-400'
    }
  }

  const handleTabChange = (tab: 'recent' | 'list' | 'challenges') => {
    setActiveTab(tab)
    setCurrentPage(0)
  }

  const TabButton = ({ tab, label }: { tab: 'recent' | 'list' | 'challenges'; label: string }) => (
    <button
      onClick={() => handleTabChange(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
        activeTab === tab
          ? 'bg-[oklch(0.76_0.22_86.3)] text-black'
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

      <div className='flex gap-2 mb-6 border-b border-border pb-2'>
        <TabButton tab='recent' label='Recent Activity' />
        <TabButton tab='list' label='My List' />
        <TabButton tab='challenges' label='Challenges' />
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b border-border'>
              <th className='text-left py-3 px-2 font-semibold text-muted-foreground'>Problem</th>
              <th className='text-left py-3 px-2 font-semibold text-muted-foreground'>Difficulty</th>
              <th className='text-left py-3 px-2 font-semibold text-muted-foreground hidden sm:table-cell'>Status</th>
              <th className='text-left py-3 px-2 font-semibold text-muted-foreground hidden md:table-cell'>
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((activity) => {
              const StatusIcon = activity.statusIcon
              return (
                <tr key={activity.id} className='border-b border-border hover:bg-card-foreground/5 transition-colors'>
                  <td className='py-4 px-2'>
                    <p className='font-medium truncate'>{activity.problem}</p>
                  </td>
                  <td className='py-4 px-2'>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(activity.difficulty)}`}>
                      {activity.difficulty}
                    </span>
                  </td>
                  <td className='py-4 px-2 hidden sm:table-cell'>
                    <div className='flex items-center gap-2'>
                      <StatusIcon className={`w-4 h-4 ${activity.statusColor}`} />
                      <span className='text-xs'>{activity.status}</span>
                    </div>
                  </td>
                  <td className='py-4 px-2 hidden md:table-cell text-xs text-muted-foreground'>
                    {activity.timestamp}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className='flex items-center justify-between mt-6 pt-6 border-t border-border'>
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
      </div>
    </Card>
  )
}
