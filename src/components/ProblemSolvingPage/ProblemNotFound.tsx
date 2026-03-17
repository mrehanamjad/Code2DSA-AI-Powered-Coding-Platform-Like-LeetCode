import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProblemNotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="bg-muted p-6 rounded-full mb-6 animate-in zoom-in duration-300">
        <FileQuestion className="h-12 w-12 text-muted-foreground" />
      </div>
      
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Problem Not Found
      </h2>
      
      <p className="text-muted-foreground max-w-md mb-8">
        The problem you are looking for doesn&apos;t exist, has been removed, or the URL is incorrect.
      </p>

      <Button asChild variant="default" size="lg">
        <Link href="/problems?page=1&sort=oldest" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Problems
        </Link>
      </Button>
    </div>
  );
}