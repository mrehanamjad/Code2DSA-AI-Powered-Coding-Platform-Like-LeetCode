import { Card } from '@/components/ui/card'
import { Star, Trophy, Flame, Code, Clock, Target } from 'lucide-react'

const badges = [
  { icon: Star, label: 'First Problem', description: 'Solved your first problem' },
  { icon: Trophy, label: 'Guardian', description: 'Reached Guardian rank' },
  { icon: Flame, label: '30 Day Streak', description: 'Maintained 30 day streak' },
  { icon: Code, label: '100 Problems', description: 'Solved 100+ problems' },
  { icon: Target, label: 'Hard Solver', description: 'Solved 10 hard problems' },
  { icon: Clock, label: 'Night Owl', description: 'Solved 50 problems at night' },
]

export default function Achievements() {
  return (
    <Card className='p-6 mt-4'>
      <h3 className='text-lg font-bold mb-6'>Achievements & Badges</h3>
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4'>
        {badges.map((badge, index) => {
          const Icon = badge.icon
          return (
            <div
              key={index}
              className='group flex flex-col items-center gap-3 p-4 rounded-lg bg-card-foreground/5 hover:bg-accent/10 transition-colors cursor-pointer'
            >
              <div className='w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors'>
                <Icon className='w-6 h-6 text-yellow-500' />
              </div>
              <div className='text-center'>
                <p className='text-xs font-semibold text-card-foreground'>{badge.label}</p>
                <p className='text-xs text-muted-foreground mt-1'>{badge.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
