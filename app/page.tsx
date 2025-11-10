"use client";

import { useState } from "react";
import { EvaluationForm } from "@/components/EvaluationForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import {
  EvaluationResult,
  type EvaluationResultData,
} from "@/components/EvaluationResult";

type ViewState = "form" | "loading" | "result";

function Header() {
  return (
    <header className="py-6 px-4 md:px-8 max-w-6xl mx-auto flex justify-between items-center">
      {" "}
      <div className="text-2xl font-bold">
        <span className="text-purple-600">Manthan</span>
        <span className="text-gray-800">SPHERE</span>
      </div>
      <Button asChild variant="outline">
        <Link href="/partner/dashboard">
          <Briefcase className="mr-2 h-4 w-4" />
          Partner Plugin
        </Link>
      </Button>
    </header>
  );
}

export default function Page() {
  const [viewState, setViewState] = useState<ViewState>("form");
  const [result, setResult] = useState<EvaluationResultData | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (submitData: FormData) => {
    setViewState("loading");
    setError("");

    try {
      const response = await fetch("/api/evaluations/submit", {
        method: "POST",
        body: submitData,

        headers: { "x-api-key": "599c3yzy35t" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setResult(data.evaluation);
      setViewState("result");
    } catch (err: any) {
      setError(err.message || "An unknown error occurred");
      setViewState("form");
    }
  };

  const handleReset = () => {
    setResult(null);
    setViewState("form");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="flex flex-col items-center justify-start px-4 pb-12">
        {error && (
          <div className="text-red-600 bg-red-100 p-4 rounded-md mb-6 max-w-4xl w-full">
            <strong>Error:</strong> {error}
          </div>
        )}

        {viewState !== "result" && (
          <EvaluationForm
            onSubmit={handleSubmit}
            loading={viewState === "loading"}
          />
        )}

        {viewState === "result" && result && (
          <EvaluationResult result={result} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}
