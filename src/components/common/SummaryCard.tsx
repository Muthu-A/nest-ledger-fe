import React from "react";

interface SummaryCardProps {
  icon: React.ReactNode;
  badge: string;
  label: string;
  value: string | number;
  progress?: number;
  cardType?: "income" | "expense" | "savings" | "balance";
}

export default function SummaryCard({
  icon,
  badge,
  label,
  value,
  progress = 100,
  cardType = "income",
}: SummaryCardProps) {
  return (
    <article className={`modern-card modern-card-${cardType}`}>
      <div className="modern-card-top">
        <div className="modern-card-icon">{icon}</div>

        <span className="modern-card-badge">{badge}</span>
      </div>

      <div className="modern-card-body">
        <span className="modern-card-label">{label}</span>

        <h2>{value}</h2>
      </div>

      <div className="modern-card-footer">
        <div className="progress-track">
          <div
            className={`progress-fill progress-${cardType}`}
            style={{
              width: `${Math.min(progress, 100)}%`,
            }}
          />
        </div>
      </div>
    </article>
  );
}
