import React from "react";

export default function ProgressBar({ progress }) {
  return (
    <div className="flex items-center space-x-2 w-full max-w-xs">
      {/* Progress container */}
      <div className="w-full bg-gray-200 rounded-full h-3">
        {/* Filled part */}
        <div
          className="bg-blue-500 h-3 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {/* Percentage text */}
      <span className="text-sm font-medium">{progress}%</span>
    </div>
  );
}

