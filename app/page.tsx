"use client"

import { useState } from "react"

const VISA_CONFIG = {
  "United States": {
    types: ["H1B", "F1", "EB1", "EB2"],
    documents: {
      H1B: ["resume", "job_offer", "degree"],
      F1: ["i20", "financial_proof", "resume"],
      EB1: ["resume", "publications", "awards"],
      EB2: ["resume", "degree", "labor_cert"],
    },
  },
  Canada: {
    types: ["Express Entry", "Provincial Nominee", "Study Permit"],
    documents: {
      "Express Entry": ["resume", "language_test", "education_docs"],
      "Provincial Nominee": ["resume", "job_offer", "language_test"],
      "Study Permit": ["acceptance_letter", "financial_proof", "passport"],
    },
  },
  Germany: {
    types: ["Work Visa", "Student Visa", "EU Blue Card"],
    documents: {
      "Work Visa": ["resume", "job_offer", "degree"],
      "Student Visa": ["acceptance_letter", "financial_proof", "language_proof"],
      "EU Blue Card": ["resume", "degree", "job_contract"],
    },
  },
  Australia: {
    types: ["Skilled Migration", "Student Visa", "Work Holiday"],
    documents: {
      "Skilled Migration": ["resume", "skills_assessment", "language_test"],
      "Student Visa": ["acceptance_letter", "financial_proof", "passport"],
      "Work Holiday": ["passport", "police_clearance", "medical"],
    },
  },
}

export default function Page() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    country: "",
    visaType: "",
    documents: [],
  })

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCountryChange = (e) => {
    setFormData({
      ...formData,
      country: e.target.value,
      visaType: "",
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const submitData = new FormData()
      submitData.append("fullName", formData.fullName)
      submitData.append("email", formData.email)
      submitData.append("country", formData.country)
      submitData.append("visaType", formData.visaType)

      formData.documents.forEach((doc) => {
        submitData.append("documents", doc)
      })

      const response = await fetch("/api/evaluations/submit", {
        method: "POST",
        body: submitData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Submission failed")
      }

      setResult(data.evaluation)
      setFormData({ fullName: "", email: "", country: "", visaType: "", documents: [] })
    } catch (err) {
      setError(err.message || "Submission failed")
    } finally {
      setLoading(false)
    }
  }

  const requiredDocs =
    formData.country && formData.visaType ? VISA_CONFIG[formData.country]?.documents[formData.visaType] || [] : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Visa Evaluation Tool</h1>
        <p className="text-gray-600 mb-6">Get an instant assessment of your visa application</p>

        {result ? (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-green-700 mb-2">Your Evaluation Result</h2>
            <div className="text-5xl font-bold text-green-600 mb-4">{result.score}/100</div>
            <p className="text-gray-700 mb-4">{result.summary}</p>
            <button
              onClick={() => setResult(null)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded"
            >
              New Evaluation
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <select
                required
                value={formData.country}
                onChange={handleCountryChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select Country</option>
                {Object.keys(VISA_CONFIG).map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {formData.country && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Visa Type</label>
                <select
                  required
                  value={formData.visaType}
                  onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select Visa Type</option>
                  {VISA_CONFIG[formData.country].types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {requiredDocs.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Documents ({requiredDocs.join(", ")})
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFormData({ ...formData, documents: Array.from(e.target.files) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            )}

            {error && <div className="text-red-600 bg-red-50 p-3 rounded">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              {loading ? "Evaluating..." : "Submit for Evaluation"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
