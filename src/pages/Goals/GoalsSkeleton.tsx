import "./goals.css";

export default function GoalsSkeleton() {
  return (
    <div className="goals-page">
      {/* Header */}
      <div className="page-header">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-button" />
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="modern-card skeleton-card">
            <div className="skeleton skeleton-icon" />
            <div className="skeleton skeleton-label" />
            <div className="skeleton skeleton-value" />
            <div className="skeleton skeleton-progress" />
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="chart-card">
        <div className="skeleton skeleton-chart-title" />
        <div className="skeleton skeleton-chart" />
      </div>

      {/* Goal Cards */}
      <div className="goal-grid">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="goal-card">
            <div className="goal-card-header">
              <div className="skeleton skeleton-goal-title" />

              <div style={{ display: "flex", gap: 8 }}>
                <div className="skeleton skeleton-action" />
                <div className="skeleton skeleton-action" />
              </div>
            </div>

            <div className="goal-stats">
              <div>
                <div className="skeleton skeleton-stat-label" />
                <div className="skeleton skeleton-stat-value" />
              </div>

              <div>
                <div className="skeleton skeleton-stat-label" />
                <div className="skeleton skeleton-stat-value" />
              </div>
            </div>

            <div className="skeleton skeleton-progress-bar" />

            <div className="skeleton skeleton-progress-text" />

            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 12,
              }}
            >
              <div className="skeleton skeleton-btn" />
              <div className="skeleton skeleton-btn" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}