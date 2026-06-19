import '../Income/income.css'
export default function IncomePageSkeleton() {
  return (
    <section className="page income-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="skeleton skeleton-eyebrow" />
          <div className="skeleton skeleton-page-title" />
        </div>

        <div className="skeleton skeleton-add-btn" />
      </div>

      {/* One Income Card */}
      <div className="income-cards-container">
        <div className="salary-hero-card skeleton-card">
          {/* Header */}
          <div className="salary-card-header">
            <div>
              <div className="skeleton skeleton-label" />
              <div className="skeleton skeleton-card-title" />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div className="skeleton skeleton-badge" />
              <div className="skeleton skeleton-icon-btn" />
              <div className="skeleton skeleton-icon-btn" />
            </div>
          </div>

          {/* Body */}
          <div className="salary-card-body">
            <div className="salary-left">
              <div className="skeleton skeleton-small-text" />

              <div className="skeleton skeleton-source-name" />

              <div className="skeleton skeleton-salary-amount" />

              <div className="skeleton skeleton-quote" />
              <div className="skeleton skeleton-quote short" />
            </div>

            <div className="skeleton skeleton-circle" />
          </div>

          {/* Footer */}
          <div className="salary-card-footer">
            <div>
              <div className="skeleton skeleton-footer-label" />
              <div className="skeleton skeleton-footer-value" />
            </div>

            <div>
              <div className="skeleton skeleton-footer-label" />
              <div className="skeleton skeleton-footer-value" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}