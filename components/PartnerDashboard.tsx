"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API_BASE_URL =
  process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_API_URL : "";

interface Lead {
  _id: string;
  fullName: string;
  email: string;
  visaType: string;
  country: string;
  score: number;
  createdAt: string;
}

export function PartnerDashboard() {
  const [apiKey, setApiKey] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const fetchLeads = async () => {
    if (!apiKey) {
      setError("Please enter an API key.");
      return;
    }
    setLoading(true);
    setError("");
    setLeads([]);

    try {
      const response = await fetch(`${API_BASE_URL}/api/partners/evaluations`, {
        headers: {
          "x-api-key": apiKey,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch leads");
      setLeads(data);
      localStorage.setItem("partnerApiKey", apiKey);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePartner = async () => {
    if (!partnerName) {
      setCreateError("Please enter a name for your organization.");
      return;
    }
    setCreateLoading(true);
    setCreateError("");
    setNewlyGeneratedKey("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/partners/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: partnerName }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to create partner");
      setNewlyGeneratedKey(data.apiKey);
      setApiKey(data.apiKey);
      setPartnerName("");
      localStorage.setItem("partnerApiKey", data.apiKey);
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>New Partner? Create Your API Key</CardTitle>
          <CardDescription>
            Sign up here to get an API key for your organization.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="partnerName">Your Organization Name</Label>
            <div className="flex gap-2">
              <Input
                id="partnerName"
                placeholder="e.g., Test Law Firm"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
              />
              <Button onClick={handleCreatePartner} disabled={createLoading}>
                {createLoading ? <Spinner className="mr-2" /> : "Create Key"}
              </Button>
            </div>
            {createError && (
              <p className="text-red-600 text-sm mt-2">{createError}</p>
            )}
          </div>
          {newlyGeneratedKey && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md space-y-4">
              <div>
                <Label className="text-green-800">
                  Your New API Key (Save this!)
                </Label>
                <p className="font-mono bg-white p-2 rounded-md break-all">
                  {newlyGeneratedKey}
                </p>
              </div>
              <div>
                <Label className="text-green-800">Your Embed Code</Label>
                <p className="text-sm text-gray-600 mb-1">
                  Copy and paste this HTML code into your website:
                </p>
                <p className="font-mono bg-white p-2 rounded-md break-all text-sm">
                  {/* This will only work once you replace YOUR_WEBSITE.com with your live Vercel URL */}
                  {`<iframe src="https://YOUR_WEBSITE.com/embed/${newlyGeneratedKey}" width="100%" height="800" frameborder="0"></iframe>`}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Partner Lead Dashboard (Login)</CardTitle>
          <CardDescription>
            Already have a key? Enter it here to see your leads.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Your API Key</Label>
            <div className="flex gap-2">
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your secret partner API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Button onClick={fetchLeads} disabled={loading}>
                {loading ? <Spinner className="mr-2" /> : "Get Leads"}
              </Button>
            </div>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>
        </CardContent>
      </Card>

      {leads.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Your Leads ({leads.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Visa Type</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead._id}>
                    <TableCell>{lead.fullName}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>
                      {lead.visaType} ({lead.country})
                    </TableCell>
                    <TableCell>{lead.score}</TableCell>
                    <TableCell>
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
