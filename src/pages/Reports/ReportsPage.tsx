import { BarChart3, CreditCard, DollarSign, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { categories } from "../../constants/categories";
import { useReports } from "../../hooks/useReports";
import { formatCurrency } from "../../utils/currency";
import type { Report } from "../../types/report";
import type { RecentTransaction } from "../../types/dashboard";
import ReportsPageSkeleton from "./ReportsPageSkeleton";
import { useRecentTransactions } from '../../hooks/useRecentTransactions'

export default function ReportsPage() {
  const reports = useReports();
  const [loading, setLoading] = useState(true);
  const recentQuery = useRecentTransactions()
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([])

  useEffect(() => {
    if (recentQuery.isLoading) return
    setRecentTransactions((recentQuery.data as any)?.recentTransactions || (recentQuery.data as any) || [])
    setLoading(false)
  }, [recentQuery.data, recentQuery.isLoading])

  const totals = useMemo(
    () => ({
      income: reports.reduce((sum, item) => sum + item.income, 0),
      expense: reports.reduce((sum, item) => sum + item.expense, 0),
      savings: reports.reduce((sum, item) => sum + item.savings, 0),
    }),
    [reports],
  );

  const summaryCards = [
    {
      label: "Total income",
      value: formatCurrency(totals.income),
      icon: DollarSign,
      variant: "total-income",
    },
    {
      label: "Total expense",
      value: formatCurrency(totals.expense),
      icon: CreditCard,
      variant: "total-expense",
    },
    {
      label: "Savings",
      value: formatCurrency(totals.savings),
      icon: ShieldCheck,
      variant: "total-savings",
    },
    {
      label: "Balance",
      value: formatCurrency(totals.income - totals.expense),
      icon: BarChart3,
      variant: "total-balance",
    },
  ];

  const monthsCount = reports.length;
  const averageIncome = monthsCount ? totals.income / monthsCount : 0;
  const averageExpense = monthsCount ? totals.expense / monthsCount : 0;
  const highestExpenseMonth = reports.reduce(
    (best, item) => (item.expense > best.expense ? item : best),
    { month: "", income: 0, expense: 0, savings: 0 } as Report,
  );
  const highestSavingsMonth = reports.reduce(
    (best, item) => (item.savings > best.savings ? item : best),
    { month: "", income: 0, expense: 0, savings: 0 } as Report,
  );

  const latestMonth = reports[reports.length - 1]?.month ?? "";

  if (loading) {
  return <ReportsPageSkeleton />;
}

  return (
    <section className="page reports-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Reports</p>
          <h1 style={{ color: "var(--ink)" }}>Spending insights</h1>
        </div>
      </div>

      <div className="summary-grid">
        {summaryCards.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.label}
              className={`modern-card modern-card-${item.variant}`}
            >
              <div className="modern-card-top">
                <div className="modern-card-icon">
                  <Icon size={22} />
                </div>

                <span className="modern-card-badge">This Month</span>
              </div>

              <div className="modern-card-body">
                <span
                  className="modern-card-label"
                  style={{ color: "var(--text)" }}
                >
                  {item.label}
                </span>

                <h2>{item.value}</h2>
              </div>

              <div className="modern-card-footer">
                <div className="progress-track">
                  <div className={`progress-fill progress-${item.variant}`} />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <section className="report-panel report-chart-panel">
        <h2 style={{ color: "var(--text)" }}>Monthly performance</h2>

        <div className="dashboard-panels">
          {/* LEFT CARD */}
          <section className="panel">
            <h2 className="chart-label" style={{ color: "var(--text)" }}>
              Report highlights
            </h2>

            <div className="report-highlights">
              <div className="highlight-item">
                <strong style={{ color: "var(--text)" }}>{monthsCount}</strong>
                <span style={{ color: "var(--text)" }}>Months analyzed</span>
              </div>

              <div className="highlight-item">
                <strong style={{ color: "var(--text)" }}>{formatCurrency(averageIncome)}</strong>
                <span style={{ color: "var(--text)" }}>Avg monthly income</span>
              </div>

              <div className="highlight-item">
                <strong style={{ color: "var(--text)" }}>{formatCurrency(averageExpense)}</strong>
                <span style={{ color: "var(--text)" }}>Avg monthly expense</span>
              </div>

              <div className="highlight-item">
                <strong style={{ color: "var(--text)" }}>{highestExpenseMonth.month || "-"}</strong>
                <span style={{ color: "var(--text)" }}>Highest expense month</span>
              </div>

              <div className="highlight-item">
                <strong style={{ color: "var(--text)" }}>{highestSavingsMonth.month || "-"}</strong>
                <span style={{ color: "var(--text)" }}>Highest savings month</span>
              </div>
            </div>
          </section>

          {/* RIGHT CARD */}
          <section className="panel">
            <h2 className="chart-label" style={{ color: "var(--text)" }}>
              Latest month split
            </h2>

            <div className="report-donut">
              <div className="donut-segment income" />
              <div className="donut-segment expense" />
              <div className="donut-center">{latestMonth || "-"}</div>
            </div>

            <div className="donut-legend">
              <span className="legend-item income" style={{ color: "var(--text)" }}>
                Income
              </span>
              <span className="legend-item expense" style={{ color: "var(--text)" }}>
                Expense
              </span>
              <span className="legend-item savings" style={{ color: "var(--text)" }}>
                Savings
              </span>
            </div>
          </section>
        </div>
      </section>

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
            {reports.map((report: Report) => (
              <tr key={report.month}>
                <td>{report.month}</td>
                <td>{formatCurrency(report.income)}</td>
                <td>{formatCurrency(report.expense)}</td>
                <td>{formatCurrency(report.savings)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </section>
  );
}
