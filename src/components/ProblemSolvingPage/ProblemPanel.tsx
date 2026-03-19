// Remove "use client" from the top!
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
import { SubmissionsForProblem } from "../Problems/SubmissionsForProblem";
import DifficultyBadge from "../DifficultyBadge";
import SaveToListButton from "./SaveToListButton";

interface ProblemPanelProps {
  selectedProblem: ProblemI;
}

export function ProblemPanel({
  selectedProblem,
}: ProblemPanelProps) {
  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between p-4 pb-0 max-w-full">
          <div className="flex items-center gap-3 overflow-hidden">
            <h1 className="text-2xl font-bold text-foreground truncate">
              {selectedProblem?.title || "title"}
            </h1>
            <DifficultyBadge difficulty={selectedProblem?.difficulty as "Easy" | "Medium" | "Hard"} />
          </div>
          
          <div className="flex-shrink-0 ml-2">
            <SaveToListButton problemId={String(selectedProblem._id) || ""} />
          </div>
        </div>

        <Tabs defaultValue="description" className="w-full mt-4">
          <TabsList className="w-full justify-start rounded-none border-b px-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="solutions">Solutions</TabsTrigger>
            <TabsTrigger value="editorial">Editorial</TabsTrigger>
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

             <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Topics
              </h3>
              <Card className="p-4 bg-card">
                <div className="flex flex-wrap gap-2">
                  {selectedProblem && selectedProblem.topics.map((topic, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{topic}</Badge>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="solutions" className="p-4">
            <Card className="p-6 bg-card">
              <p className="text-muted-foreground text-center">
                Solutions coming soon...
              </p>
            </Card>
          </TabsContent>
          
          <TabsContent value="editorial" className="p-4">
            <Card className="p-6 bg-card">
              <p className="text-muted-foreground text-center">
                Editorial coming soon...
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="submissions" className="p-4">
            <SubmissionsForProblem problemId={selectedProblem && selectedProblem._id as string} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}