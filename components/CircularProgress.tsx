"use client";

import React from "react";

interface CircularProgressProps {
  value: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
}) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const safeValue = Number(value) || 0;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-32 h-32" viewBox="0 0 120 120">
        <circle
          className="text-gray-200"
          strokeWidth="12"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        <circle
          className="text-blue-600"
          strokeWidth="12"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.35s",
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
          }}
        />
      </svg>
      <span className="absolute text-3xl font-bold text-blue-600">
        {safeValue}%
      </span>
    </div>
  );
};
