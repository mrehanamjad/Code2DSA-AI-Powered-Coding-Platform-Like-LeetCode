// import { Problem } from "@/types/problem";
// import { Badge } from "@/components/ui/badge";
// import { Card } from "@/components/ui/card";
// import ReactMarkdown from "react-markdown";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs";

// interface ProblemPanelProps {
//   problems: Problem[];
//   selectedProblem: Problem;
//   onProblemChange: (problemId: string) => void;
// }

// export function ProblemPanel({
//   problems,
//   selectedProblem,
//   onProblemChange,
// }: ProblemPanelProps) {
//   const difficultyColor = {
//     Easy: "bg-success text-success-foreground",
//     Medium: "bg-warning text-warning-foreground",
//     Hard: "bg-error text-error-foreground",
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="p-4 border-b border-border">
//         <Select
//           value={selectedProblem.id}
//           onValueChange={onProblemChange}
//         >
//           <SelectTrigger className="w-full">
//             <SelectValue placeholder="Select a problem" />
//           </SelectTrigger>
//           <SelectContent className="bg-popover">
//             {problems.map((problem) => (
//               <SelectItem key={problem.id} value={problem.id}>
//                 {problem.title}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="flex-1 overflow-y-auto">
//         <div className="flex items-center gap-2 p-4 pb-0">
//           <h1 className="text-2xl font-bold text-foreground">
//             {selectedProblem.title}
//           </h1>
//           <Badge className={difficultyColor[selectedProblem.difficulty]}>
//             {selectedProblem.difficulty}
//           </Badge>
//         </div>

//         <Tabs defaultValue="description" className="w-full">
//           <TabsList className="w-full justify-start rounded-none border-b px-4">
//             <TabsTrigger value="description">Description</TabsTrigger>
//             <TabsTrigger value="solutions">Solutions</TabsTrigger>
//             <TabsTrigger value="submissions">Submissions</TabsTrigger>
//           </TabsList>

//           <TabsContent value="description" className="p-4 space-y-4">
//             <Card className="p-4 bg-card">
//               <div className="prose prose-sm dark:prose-invert max-w-none">
//                 <ReactMarkdown>{selectedProblem.description}</ReactMarkdown>
//               </div>
//             </Card>

//             <div className="space-y-3">
//               <h3 className="text-lg font-semibold text-foreground">
//                 Examples
//               </h3>
//               {selectedProblem.examples.map((example, idx) => (
//                 <Card key={idx} className="p-4 bg-card">
//                   <p className="font-semibold text-foreground mb-2">
//                     Example {idx + 1}:
//                   </p>
//                   <div className="space-y-1 text-sm">
//                     <p className="text-muted-foreground">
//                       <span className="font-semibold text-foreground">
//                         Input:
//                       </span>{" "}
//                       {example.input}
//                     </p>
//                     <p className="text-muted-foreground">
//                       <span className="font-semibold text-foreground">
//                         Output:
//                       </span>{" "}
//                       {example.output}
//                     </p>
//                     {example.explanation && (
//                       <p className="text-muted-foreground">
//                         <span className="font-semibold text-foreground">
//                           Explanation:
//                         </span>{" "}
//                         {example.explanation}
//                       </p>
//                     )}
//                   </div>
//                 </Card>
//               ))}
//             </div>

//             <div className="space-y-2">
//               <h3 className="text-lg font-semibold text-foreground">
//                 Constraints
//               </h3>
//               <Card className="p-4 bg-card">
//                 <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
//                   {selectedProblem.constraints.map((constraint, idx) => (
//                     <li key={idx}>{constraint}</li>
//                   ))}
//                 </ul>
//               </Card>
//             </div>
//           </TabsContent>

//           <TabsContent value="solutions" className="p-4">
//             <Card className="p-6 bg-card">
//               <p className="text-muted-foreground text-center">
//                 Solutions will be available after you solve the problem.
//               </p>
//             </Card>
//           </TabsContent>

//           <TabsContent value="submissions" className="p-4">
//             <Card className="p-6 bg-card">
//               <p className="text-muted-foreground text-center">
//                 No submissions yet. Submit your solution to see your submission
//                 history.
//               </p>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// }


import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ProblemI } from "@/models/problem.model";

interface ProblemPanelProps {
  selectedProblem: ProblemI;
}

export function ProblemPanel({
  selectedProblem,
}: ProblemPanelProps) {
  const difficultyColor = {
    Easy: "bg-success text-success-foreground",
    Medium: "bg-warning text-warning-foreground",
    Hard: "bg-error text-error-foreground",
  };

  return (
    <div className="flex flex-col h-full">

      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center gap-2 p-4 pb-0">
          <h1 className="text-2xl font-bold text-foreground">
            {selectedProblem && selectedProblem.title || "title"}
          </h1>
          <Badge className={selectedProblem && difficultyColor[selectedProblem.difficulty]}>
            {selectedProblem && selectedProblem.difficulty}
          </Badge>
        </div>

        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b px-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="solutions">Solutions</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="p-4 space-y-4">
            <Card className="p-4 bg-card">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{selectedProblem && selectedProblem.description}</ReactMarkdown>
              </div>
            </Card>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">
                Examples
              </h3>
              {selectedProblem && selectedProblem.examples.map((example, idx) => (
                <Card key={idx} className="p-4 bg-card">
                  <p className="font-semibold text-foreground mb-2">
                    Example {idx + 1}:
                  </p>
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        Input:
                      </span>{" "}
                      {example.input}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        Output:
                      </span>{" "}
                      {example.output}
                    </p>
                    {example.explanation && (
                      <p className="text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          Explanation:
                        </span>{" "}
                        {example.explanation}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Constraints
              </h3>
              <Card className="p-4 bg-card">
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {selectedProblem && selectedProblem.constraints.map((constraint, idx) => (
                    <li key={idx}>{constraint}</li>
                  ))}
                </ul>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="solutions" className="p-4">
            <Card className="p-6 bg-card">
              <p className="text-muted-foreground text-center">
                Solutions will be available after you solve the problem.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="submissions" className="p-4">
            <Card className="p-6 bg-card">
              <p className="text-muted-foreground text-center">
                No submissions yet. Submit your solution to see your submission
                history.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
