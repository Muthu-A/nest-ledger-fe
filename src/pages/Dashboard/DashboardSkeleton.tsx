import '../Dashboard/dashboard.css'
export default function DashboardSkeleton() {
  return (
    <section className="page dashboard-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="skeleton skeleton-text skeleton-eyebrow" />
          <div className="skeleton skeleton-title" />
        </div>

        <div className="skeleton skeleton-select" />
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        {[1, 2, 3, 4].map((item) => (
          <article key={item} className="modern-card">
            <div className="modern-card-top">
              <div className="skeleton skeleton-icon" />
              <div className="skeleton skeleton-badge" />
            </div>

            <div className="modern-card-body">
              <div className="skeleton skeleton-label" />
              <div className="skeleton skeleton-value" />
            </div>

            <div className="modern-card-footer">
              <div className="skeleton skeleton-progress" />
            </div>
          </article>
        ))}
      </div>

      {/* Charts */}
      <div className="dashboard-panels">
        <section className="panel">
          <div className="skeleton skeleton-panel-title" />
          <div className="skeleton skeleton-chart" />
        </section>

        <section className="panel">
          <div className="skeleton skeleton-panel-title" />
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="expense-item">
              <div className="expense-item-header">
                <div className="expense-info">
                  <div className="skeleton skeleton-circle" />
                  <div>
                    <div className="skeleton skeleton-label" />
                    <div className="skeleton skeleton-small" />
                  </div>
                </div>

                <div className="skeleton skeleton-small-value" />
              </div>

              <div className="skeleton skeleton-progress" />
            </div>
          ))}
        </section>
      </div>

      {/* Bottom Panels */}
      <div className="dashboard-panels">
        <section className="panel">
          <div className="skeleton skeleton-panel-title" />

          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="activity-card">
              <div className="activity-left">
                <div className="skeleton skeleton-circle" />

                <div>
                  <div className="skeleton skeleton-label" />
                  <div className="skeleton skeleton-small" />
                </div>
              </div>

              <div className="skeleton skeleton-count" />
            </div>
          ))}
        </section>

        <section className="panel">
          <div className="skeleton skeleton-panel-title" />

          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="activity-card">
              <div className="activity-left">
                <div className="skeleton skeleton-circle" />

                <div>
                  <div className="skeleton skeleton-label" />
                  <div className="skeleton skeleton-small" />
                </div>
              </div>

              <div className="skeleton skeleton-small-value" />
            </div>
          ))}
        </section>
      </div>
    </section>
  );
}