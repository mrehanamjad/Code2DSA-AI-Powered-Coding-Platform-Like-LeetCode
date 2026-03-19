// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { StatsOverviewPrompI } from "@/types/compInterfaces";
// import {
//   TrendingUp,
//   Code2,
//   Trophy,
//   Zap,
//   CheckCircle2,
//   Target,
//   Flame,
//   Activity,
//   LucideIcon,
// } from "lucide-react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Tooltip as RechartsTooltip,
//   Legend,
// } from "recharts";

// // --- Reusable Stat Card Component ---
// interface StatCardProps {
//   title: string;
//   value: string | number;
//   icon: LucideIcon;
//   description?: string;
//   className?: string;
//   iconColor?: string;
//   bgColor?: string;
// }

// const StatCard = ({
//   title,
//   value,
//   icon: Icon,
//   iconColor = "text-primary",
//   bgColor = "bg-primary/10",
// }: StatCardProps) => (
//   <Card className="overflow-hidden transition-all duration-200 border-border/50 hover:shadow-md hover:border-primary/20">
//     <div className="p-6 flex items-start justify-between">
//       <div className="space-y-1">
//         <p className="text-sm font-medium text-muted-foreground">{title}</p>
//         <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
//       </div>
//       <div className={`p-3 rounded-xl ${bgColor} ring-1 ring-inset ring-white/10`}>
//         <Icon className={`w-5 h-5 ${iconColor}`} />
//       </div>
//     </div>
//   </Card>
// );

// // --- Main Component ---
// export function StatsOverview({ data }: { data: StatsOverviewPrompI }) {
//   const totalProblems =
//     data.problemSolved.easy + data.problemSolved.medium + data.problemSolved.hard;

//   // Data for the Donut Chart
//   const chartData = [
//     { name: "Easy", value: data.problemSolved.easy, color: "#10b981" }, // Emerald-500
//     { name: "Medium", value: data.problemSolved.medium, color: "#f59e0b" }, // Amber-500
//     { name: "Hard", value: data.problemSolved.hard, color: "#f43f5e" }, // Rose-500
//   ];

//   // If no problems solved, show a grey placeholder to avoid chart breaking
//   const hasData = chartData.some((d) => d.value > 0);
//   const displayData = hasData
//     ? chartData
//     : [{ name: "None", value: 1, color: "#3f3f46" }]; // Zinc-700

//   return (
//     <div className="space-y-6">
//       {/* 1. Hero Stats Row (Most Important) */}
//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <StatCard
//           title="Total Solved"
//           value={totalProblems}
//           icon={CheckCircle2}
//           iconColor="text-emerald-500"
//           bgColor="bg-emerald-500/10"
//         />
//         <StatCard
//           title="Current Streak"
//           value={data.currentStreak.value}
//           icon={Flame}
//           iconColor="text-orange-500"
//           bgColor="bg-orange-500/10"
//         />
//         <StatCard
//           title="Level"
//           value={`${data.level}`}
//           icon={Trophy}
//           iconColor="text-yellow-500"
//           bgColor="bg-yellow-500/10"
//         />
//         <StatCard
//           title="Total XP"
//           value={data.xp.toLocaleString()}
//           icon={Zap}
//           iconColor="text-purple-500"
//           bgColor="bg-purple-500/10"
//         />
//       </div>

//       {/* 2. Detail Stats & Chart Split */}
//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        
//         {/* Left: Secondary Metrics (4 columns wide) */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-4 h-fit">
//           <StatCard
//             title="Total Submissions"
//             value={data.totalSubmissions.toLocaleString()}
//             icon={Code2}
//             iconColor="text-blue-500"
//             bgColor="bg-blue-500/10"
//           />
//           <StatCard
//             title="Score"
//             value={data.score.toLocaleString()}
//             icon={Target}
//             iconColor="text-rose-500"
//             bgColor="bg-rose-500/10"
//           />
//           <StatCard
//             title="Max Streak"
//             value={data.maxStreak}
//             icon={Activity}
//             iconColor="text-cyan-500"
//             bgColor="bg-cyan-500/10"
//           />
//           <StatCard
//             title="Growth Rate"
//             value="+2.4%" // Example placeholder or calculate real growth
//             icon={TrendingUp}
//             iconColor="text-green-500"
//             bgColor="bg-green-500/10"
//           />
//         </div>

//         {/* Right: Difficulty Donut Chart (3 columns wide) */}
//         <Card className="flex flex-col border-border/50 lg:col-span-3 min-h-[300px]">
//           <CardHeader className="items-center pb-0">
//             <CardTitle className="text-base font-medium">Solved Difficulty</CardTitle>
//           </CardHeader>
//           <CardContent className="flex-1 pb-0">
//             <div className="h-[250px] w-full relative">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={displayData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={80}
//                     paddingAngle={5}
//                     dataKey="value"
//                     stroke="none"
//                   >
//                     {displayData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <RechartsTooltip
//                     contentStyle={{
//                       backgroundColor: "hsl(var(--card))",
//                       borderColor: "hsl(var(--border))",
//                       borderRadius: "0.5rem",
//                       color: "hsl(var(--foreground))",
//                     }}
//                     itemStyle={{ color: "hsl(var(--foreground))" }}
//                   />
//                   <Legend 
//                     verticalAlign="bottom" 
//                     height={36}
//                     iconType="circle"
//                   />
//                 </PieChart>
//               </ResponsiveContainer>
              
//               {/* Center Text Overlay */}
//               <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 text-center pointer-events-none">
//                 <div className="text-3xl font-bold">{totalProblems}</div>
//                 <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Solved</div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }




"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsOverviewPrompI } from "@/types/compInterfaces";
import {
  Code2,
  Zap,
  CheckCircle2,
  Target,
  Flame,
  Activity,
  LucideIcon,
  TrendingUp,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
}

const StatCard = ({ title, value, icon: Icon, iconColor, bgColor }: StatCardProps) => (
  <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50">
    <CardContent className="p-5 flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
          {title}
        </p>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
      </div>
      <div className={cn("p-3 rounded-2xl transition-colors duration-300", bgColor)}>
        <Icon className={cn("w-5 h-5", iconColor)} />
      </div>
    </CardContent>
  </Card>
);

export function StatsOverview({ data }: { data: StatsOverviewPrompI }) {
  const totalProblems =
    data.problemSolved.easy + data.problemSolved.medium + data.problemSolved.hard;

  const chartData = [
    { name: "Easy", value: data.problemSolved.easy, color: "hsl(142, 71%, 45%)" },
    { name: "Medium", value: data.problemSolved.medium, color: "hsl(38, 92%, 50%)" },
    { name: "Hard", value: data.problemSolved.hard, color: "hsl(346, 84%, 61%)" },
  ];

  const hasData = totalProblems > 0;
  const displayData = hasData ? chartData : [{ name: "No Data", value: 1, color: "hsl(var(--muted))" }];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT SIDE: STAT CARDS (Spans 7/12 columns on desktop) */}
      <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2  gap-4">
        <StatCard
          title="Total Solved"
          value={totalProblems}
          icon={CheckCircle2}
          iconColor="text-emerald-500"
          bgColor="bg-emerald-500/10 group-hover:bg-emerald-500/20"
        />
        <StatCard
          title="Current Streak"
          value={`${data.currentStreak.value} Days`}
          icon={Flame}
          iconColor="text-orange-500"
          bgColor="bg-orange-500/10 group-hover:bg-orange-500/20"
        />
        <StatCard
          title="Total XP"
          value={data.xp.toLocaleString()}
          icon={Zap}
          iconColor="text-purple-500"
          bgColor="bg-purple-500/10 group-hover:bg-purple-500/20"
        />
        <StatCard
          title="Submissions"
          value={data.totalSubmissions.toLocaleString()}
          icon={Code2}
          iconColor="text-blue-500"
          bgColor="bg-blue-500/10 group-hover:bg-blue-500/20"
        />
        <StatCard
          title="Global Score"
          value={data.score.toLocaleString()}
          icon={Target}
          iconColor="text-rose-500"
          bgColor="bg-rose-500/10 group-hover:bg-rose-500/20"
        />
        <StatCard
          title="Max Streak"
          value={data.maxStreak}
          icon={Activity}
          iconColor="text-cyan-500"
          bgColor="bg-cyan-500/10 group-hover:bg-cyan-500/20"
        />
      </div>

      {/* RIGHT SIDE: DIFFICULTY CHART (Spans 5/12 columns on desktop) */}
      <Card className="lg:col-span-5 flex flex-col border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-bold">Difficulty Ratio</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex-1 pb-6">
          <div className="h-[240px] w-full relative mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {displayData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} className="outline-none focus:outline-none" />
                  ))}
                </Pie>
                <RechartsTooltip 
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border border-border px-3 py-2 rounded-lg shadow-xl text-xs font-bold">
                          {`${payload[0].name}: ${payload[0].value}`}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Centered Summary */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black tracking-tighter">{totalProblems}</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Total Solved</span>
            </div>
          </div>

          {/* Custom Modern Legend */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {chartData.map((item) => (
              <div key={item.name} className="flex flex-col items-center p-2 rounded-xl bg-muted/30">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">{item.name}</span>
                </div>
                <span className="text-sm font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}