"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, Code, Trophy, Zap } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

const difficultyData = [
  { name: "Easy", value: 245, fill: "oklch(0.72 0.14 150)" },
  { name: "Medium", value: 189, fill: "oklch(0.52 0.16 250)" },
  { name: "Hard", value: 76, fill: "oklch(0.45 0.12 50)" },
]

const progressData = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  problems: Math.floor(Math.random() * 20) + 10,
}))

export function StatsOverview() {
  const totalProblems = 510
  const globalRank = 1245

  return (
    <div className="space-y-4">
      {/* Top stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
        <Card className="bg-card border-border p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Solved Problems</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{totalProblems}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">↑ 12% this month</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Code className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

         <Card className="bg-card border-border p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Score</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{globalRank}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">↑ 23 positions</p>
            </div>
            <div className="p-3 bg-accent/10 rounded-lg">
              <Trophy className="w-6 h-6 text-accent" />
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Global Rank</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">#{globalRank}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">↑ 23 positions</p>
            </div>
            <div className="p-3 bg-accent/10 rounded-lg">
              <Trophy className="w-6 h-6 text-accent" />
            </div>
          </div>
        </Card>

         <Card className="bg-card border-border p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Max Streak</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">47</p>
              <p className="text-xs text-muted-foreground mt-2">days consecutive</p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">47</p>
              <p className="text-xs text-muted-foreground mt-2">days consecutive</p>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">XP Level</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">Level 25</p>
              <p className="text-xs text-muted-foreground mt-2">8,450 / 10,000 XP</p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <Zap className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Difficulty breakdown */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Problems by Difficulty</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={difficultyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: `1px solid var(--color-border)`,
                    borderRadius: "0.5rem",
                  }}
                  cursor={{ fill: "rgba(0,0,0,0.1)" }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Progress over time */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Progress</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: `1px solid var(--color-border)`,
                    borderRadius: "0.5rem",
                  }}
                  cursor={{ fill: "rgba(0,0,0,0.1)" }}
                />
                <Line
                  type="monotone"
                  dataKey="problems"
                  stroke="var(--color-primary)"
                  strokeWidth={3}
                  dot={{ fill: "var(--color-primary)", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
