export default function ReportsPageSkeleton() {
  return (
    <section className="page reports-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="skeleton skeleton-eyebrow" />
          <div className="skeleton skeleton-page-title" />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        {[1, 2, 3, 4].map((item) => (
          <article key={item} className="modern-card">
            <div className="modern-card-top">
              <div className="skeleton skeleton-card-icon" />
              <div className="skeleton skeleton-card-badge" />
            </div>

            <div className="modern-card-body">
              <div className="skeleton skeleton-card-label" />
              <div className="skeleton skeleton-card-value" />
            </div>

            <div className="modern-card-footer">
              <div className="skeleton skeleton-progress" />
            </div>
          </article>
        ))}
      </div>

      {/* Monthly Performance */}
      <section className="report-panel report-chart-panel">
        <div
          className="skeleton"
          style={{ width: 220, height: 24, marginBottom: 24 }}
        />

        <div className="dashboard-panels">
          {/* Left Card */}
          <section className="panel">
            <div
              className="skeleton"
              style={{ width: 180, height: 22, marginBottom: 24 }}
            />

            <div className="report-highlights">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="highlight-item">
                  <div
                    className="skeleton"
                    style={{ width: 100, height: 26 }}
                  />
                  <div
                    className="skeleton"
                    style={{
                      width: 140,
                      height: 14,
                      marginTop: 10,
                    }}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Right Card */}
          <section className="panel">
            <div
              className="skeleton"
              style={{ width: 180, height: 22, marginBottom: 24 }}
            />

            <div className="report-donut">
              <div className="skeleton skeleton-donut" />
            </div>

            <div className="donut-legend">
              <div className="skeleton skeleton-legend" />
              <div className="skeleton skeleton-legend" />
              <div className="skeleton skeleton-legend" />
            </div>
          </section>
        </div>
      </section>

      {/* Table */}
      <div className="report-panel-table">
        <h2 style={{ color: "var(--text)" }}>Monthly history</h2>

        <div className="report-table-wrapper">
          <table className="report-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Income</th>
                <th>Expense</th>
                <th>Savings</th>
              </tr>
            </thead>

            <tbody>
              {[...Array(2)].map((_, index) => (
                <tr key={index}>
                  <td>
                    <div className="skeleton skeleton-amount" />
                  </td>

                  <td>
                    <div className="skeleton skeleton-amount" />
                  </td>

                  <td>
                    <div className="skeleton skeleton-amount" />
                  </td>

                  <td>
                    <div className="skeleton skeleton-amount" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
