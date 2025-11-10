import { PartnerDashboard } from "@/components/PartnerDashboard";

// This component just sets up the page layout
export default function PartnerDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="py-6 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="text-2xl font-bold">
          <span className="text-purple-600">Manthan</span>
          <span className="text-gray-800">SPHERE</span>
          <span className="text-gray-500 font-normal ml-4">
            | Partner Portal
          </span>
        </div>
      </header>
      <main className="flex flex-col items-center justify-start px-4 pb-12">
        <PartnerDashboard />
      </main>
    </div>
  );
}
