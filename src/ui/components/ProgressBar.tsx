/**
 * Progress Bar Component
 */

import React from "react";

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="mb-3">
      {label && <small className="text-muted d-block mb-2">{label}</small>}
      <div className="progress" style={{ height: "24px" }}>
        <div
          className="progress-bar bg-success"
          role="progressbar"
          style={{ width: `${percentage}%` }}
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span className="text-dark fw-bold">
            {current}/{total}
          </span>
        </div>
      </div>
      <small className="text-muted d-block mt-1">
        {Math.round(percentage)}% completado
      </small>
    </div>
  );
}

export default ProgressBar;
