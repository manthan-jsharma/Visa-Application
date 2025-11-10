"use client";

import { EvaluationForm } from "@/components/EvaluationForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";

function Header() {
  return (
    <header className="py-6 px-4 md:px-8 max-w-6xl mx-auto flex justify-between items-center">
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
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="flex flex-col items-center justify-start px-4 pb-12">
        <EvaluationForm />
      </main>
    </div>
  );
}
