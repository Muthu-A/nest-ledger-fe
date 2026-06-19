import '../Expenses/expenses.css'
export default function ExpensePageSkeleton() {
  return (
    <section className="page expense-page">
      {/* Hero */}
      <div className="expense-hero skeleton-card">
        <div className="hero-text">
          <div className="skeleton skeleton-eyebrow" />
          <div className="skeleton skeleton-amount" />
          <div className="skeleton skeleton-subtext" />
        </div>

        <div className="hero-actions">
          <div className="skeleton skeleton-button" />
          <div className="skeleton skeleton-button" />
        </div>
      </div>

      {/* Ledger */}
      <div className="ledger">
        {[1, 2, 3].map((group) => (
          <section key={group} className="ledger-group">
            <header className="ledger-day">
              <div className="skeleton skeleton-day-label" />
              <div className="skeleton skeleton-day-total" />
            </header>

            <ul className="ledger-list">
              {[1, 2, 3, 4].map((row) => (
                <li key={row} className="ledger-row">
                  <div className="skeleton skeleton-avatar" />

                  <div className="row-main">
                    <div className="skeleton skeleton-title" />
                    <div className="skeleton skeleton-note" />
                  </div>

                  <div className="skeleton skeleton-amount-small" />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}