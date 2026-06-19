import "./budget.css";

export default function BudgetPlanningSkeleton() {
  return (
    <div className="budget-page">
      {/* Header */}
      <div className="page-header">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-button" />
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="modern-card">
            <div className="modern-card-top">
              <div className="skeleton skeleton-icon" />
              <div className="skeleton skeleton-badge" />
            </div>

            <div className="modern-card-body">
              <div className="skeleton skeleton-label" />
              <div className="skeleton skeleton-value" />
            </div>

            <div className="progress-track">
              <div className="skeleton skeleton-progress" />
            </div>
          </div>
        ))}
      </div>

      {/* Smart Planner */}
      <div className="planner-container">
        {/* Header */}
        <div className="planner-header">
          <div className="skeleton skeleton-icon" />
          <div className="skeleton skeleton-subtitle" />
        </div>

        {/* Score Card */}
        <div className="planner-card score-card">
          <div style={{ flex: 1 }}>
            <div className="skeleton skeleton-label" />
            <div
              className="skeleton"
              style={{
                width: "80%",
                height: 14,
                borderRadius: 6,
                marginTop: 10,
              }}
            />
          </div>

          <div className="skeleton skeleton-score-circle" />
        </div>

        {/* Allocation Cards */}
        <div className="planner-card">
          <div className="skeleton skeleton-subtitle" />

          <div className="allocation-grid">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="allocation-item"
              >
                <div className="skeleton skeleton-icon" />

                <div className="skeleton skeleton-label" />

                <div className="skeleton skeleton-value-small" />

                <div className="skeleton skeleton-small" />
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="planner-card">
          <div className="skeleton skeleton-subtitle" />

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="recommendation-item"
              style={{ marginTop: 12 }}
            >
              <div className="skeleton skeleton-icon" />

              <div style={{ flex: 1 }}>
                <div className="skeleton skeleton-label" />

                <div
                  className="skeleton"
                  style={{
                    width: "90%",
                    height: 12,
                    borderRadius: 6,
                    marginTop: 8,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Budget Cards */}
      <div className="budget-section">
        <div className="skeleton skeleton-subtitle" />

        <div className="budget-list">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="category-budget-card"
            >
              <div className="category-header">
                <div className="skeleton skeleton-label" />
                <div
                  className="skeleton"
                  style={{
                    width: 40,
                    height: 16,
                    borderRadius: 4,
                  }}
                />
              </div>

              <div className="budget-progress">
                <div className="skeleton skeleton-progress" />
              </div>

              <div className="category-footer">
                <div
                  className="skeleton"
                  style={{
                    width: 70,
                    height: 16,
                    borderRadius: 4,
                  }}
                />
                <div
                  className="skeleton"
                  style={{
                    width: 70,
                    height: 16,
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="report-panel-table">
        <div className="skeleton skeleton-subtitle" />

        <div className="report-table-wrapper">
          <table className="report-table">
            <thead>
              <tr>
                {[1, 2, 3, 4].map((item) => (
                  <th key={item}>
                    <div
                      className="skeleton"
                      style={{
                        width: 80,
                        height: 16,
                        borderRadius: 4,
                      }}
                    />
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {[1, 2, 3, 4, 5].map((row) => (
                <tr key={row}>
                  {[1, 2, 3, 4].map((col) => (
                    <td key={col}>
                      <div
                        className="skeleton"
                        style={{
                          width: "90%",
                          height: 16,
                          borderRadius: 4,
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}