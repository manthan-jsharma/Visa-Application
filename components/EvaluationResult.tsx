"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  InfoIcon,
  Download,
  Link,
  RotateCcw,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { CircularProgress } from "./CircularProgress";

// This is the full data structure we now get from the backend
export interface EvaluationResultData {
  id: string;
  score: number;
  summary: string;
  visaType: string;
  criteriaAnalysis?: {
    [key: string]: {
      level: "Weak" | "Medium" | "Strong";
      reason: string;
    };
  };
  conclusion?: {
    keySteps: string[];
    focusAreas: string[];
  };
}

interface EvaluationResultProps {
  result: EvaluationResultData;
  onReset: () => void;
}

// Helper to get badge color
const getBadgeVariant = (level: "Weak" | "Medium" | "Strong") => {
  switch (level) {
    case "Strong":
      return "default"; // Will be blue/primary
    case "Medium":
      return "secondary"; // Will be gray
    case "Weak":
      return "destructive"; // Will be red
    default:
      return "outline";
  }
};

// Helper to format criteria keys
const formatCriteriaName = (key: string) => {
  const names = {
    prizes: "Recognized Prizes or Awards",
    membership: "Membership in Recognized Associations",
    contributions: "Original Contributions to the Field",
    employment: "Employment in Critical Capacity",
    salary: "High Salary or Remuneration",
    media: "Published Material or Media About the Beneficiary",
    articles: "Authorship of Scholarly Articles",
    judging: "Judging Participation in the Field",
  };
  return names[key as keyof typeof names] || key;
};

export function EvaluationResult({ result, onReset }: EvaluationResultProps) {
  const criteria = result.criteriaAnalysis ?? {};
  const conclusion = result.conclusion ?? { keySteps: [], focusAreas: [] };
  const safeScore =
    typeof result.score === "number" && !Number.isNaN(result.score)
      ? result.score
      : 0;
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold">
          Your Evaluation for {result.visaType}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline">
            <Link className="mr-2 h-4 w-4" />
            Copy Public Link
          </Button>
          <Button variant="secondary" onClick={onReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Main Overview Card */}
      <Card className="shadow-lg mb-6">
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-muted-foreground mb-4">
              Chances of Success
            </h3>
            <CircularProgress value={safeScore} />
          </div>
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold mb-2">Overview</h3>
            <p className="text-muted-foreground">{result.summary}</p>
          </div>
        </CardContent>
      </Card>

      {/* Criteria Analysis Card */}
      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle>Criteria Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {Object.entries(criteria).map(([key, value]) => (
              <AccordionItem value={key} key={key}>
                <AccordionTrigger className="text-base font-medium">
                  <div className="flex items-center gap-4">
                    <span>{formatCriteriaName(key)}</span>
                    <Badge variant={getBadgeVariant(value.level)}>
                      {value.level}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <HoverCard>
                      <HoverCardTrigger>
                        <InfoIcon className="h-5 w-5 text-blue-500 mt-1 cursor-pointer" />
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <p className="text-sm">{value.reason}</p>
                      </HoverCardContent>
                    </HoverCard>
                    <span>{value.reason}</span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Conclusion Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Conclusion</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-600">
              Key Steps to Strengthen Your Case
            </h3>
            <ul className="space-y-3">
              {conclusion.keySteps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">{step}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-red-600">
              Focus Areas to Boost Your Application
            </h3>
            <ul className="space-y-3">
              {conclusion.focusAreas.map((area, i) => (
                <li key={i} className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
