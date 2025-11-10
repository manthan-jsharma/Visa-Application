"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { UploadIcon } from "lucide-react";

// Define the structure for the config
type VisaConfig = {
  [country: string]: {
    types: string[];
    documents: {
      [type: string]: string[];
    };
  };
};
interface EvaluationFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  loading: boolean;
}

export function EvaluationForm({ onSubmit, loading }: EvaluationFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    country: "",
    visaType: "",
    language: "en",
    documents: null as FileList | null,
  });
  const [visaConfig, setVisaConfig] = useState<VisaConfig>({});

  useEffect(() => {
    fetch("/api/evaluations/config")
      .then((res) => res.json())
      .then((data) => {
        setVisaConfig(data);
        if (data["United States"]) {
          setFormData((prev) => ({
            ...prev,
            country: "United States",
            visaType: "EB1",
          }));
        }
      })
      .catch((err) => console.error("Failed to fetch visa config:", err));
  }, []);

  const handleCountryChange = (country: string) => {
    setFormData({
      ...formData,
      country: country,
      visaType: "",
    });
  };

  const handleVisaTypeChange = (visaType: string) => {
    setFormData({ ...formData, visaType: visaType });
  };

  const handleLanguageChange = (language: string) => {
    setFormData({ ...formData, language: language });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, documents: e.target.files });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append("fullName", formData.fullName);
    submitData.append("email", formData.email);
    submitData.append("country", formData.country);
    submitData.append("visaType", formData.visaType);
    submitData.append("language", formData.language);

    if (formData.documents) {
      Array.from(formData.documents).forEach((doc) => {
        submitData.append("documents", doc);
      });
    }
    onSubmit(submitData);
  };

  const requiredDocs =
    formData.country && formData.visaType
      ? visaConfig[formData.country]?.documents[formData.visaType] || []
      : [];

  const visaTypes = formData.country
    ? visaConfig[formData.country]?.types || []
    : [];

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">
          Get Your Free U.S. Visa Evaluation
        </CardTitle>
        <CardDescription>
          Upload your resume to discover the best U.S. visa options for your
          profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                required
                value={formData.fullName}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={formData.country}
                onValueChange={handleCountryChange}
                required
                disabled={loading}
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(visaConfig).map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="visaType">Visa Type</Label>
              <Select
                value={formData.visaType}
                onValueChange={handleVisaTypeChange}
                required
                disabled={loading || !formData.country}
              >
                <SelectTrigger id="visaType">
                  <SelectValue placeholder="Select Visa Type" />
                </SelectTrigger>
                <SelectContent>
                  {visaTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={formData.language}
                onValueChange={handleLanguageChange}
                required
                disabled={loading}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="hi">hindi</SelectItem>
                  <SelectItem value="ru">Russian</SelectItem>
                  {/* Add more languages here */}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume">
              Upload Documents
              {requiredDocs.length > 0 && (
                <span className="text-muted-foreground text-sm ml-2">
                  (e.g., {requiredDocs.join(", ")})
                </span>
              )}
            </Label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="resume-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-purple-300 hover:border-purple-400"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadIcon className="w-10 h-10 mb-3 text-purple-600" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX (MAX. 10MB)
                  </p>
                </div>
                <input
                  id="resume-upload"
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                  disabled={loading}
                />
              </label>
            </div>
            {formData.documents && (
              <div className="text-sm text-muted-foreground">
                {formData.documents.length} file(s) selected.
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            style={{ backgroundColor: "#7C3AED" }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" /> Evaluating...
              </>
            ) : (
              "Start Evaluation"
            )}
          </Button>
          <p className="text-xs text-center text-gray-500">
            Your data is encrypted and securely stored. We share your
            information nowhere.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
