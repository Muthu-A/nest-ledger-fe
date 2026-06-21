import { CreditCard, DollarSign, PiggyBank, ShieldCheck } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import { useMonth } from "../../context/MonthContext";
// import { categories } from "../../constants/categories";
// dashboardService is accessed via hooks; direct import removed
import type {
  DashboardSummary,
  RecentTransaction,
} from "../../types/dashboard";
import { useDashboardSummary } from "../../hooks/useDashboardSummary";
import { useRecentTransactions } from "../../hooks/useRecentTransactions";
import { useCategories } from "../../hooks/useCategories";
import useMonthlyExpenses from "../../hooks/useMonthlyExpenses";
import DashboardSkeleton from "./DashboardSkeleton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const defaultSummary: DashboardSummary = {
  month: "",
  income: 0,
  expense: 0,
  savings: 0,
  balance: 0,
  breakdown: [],
};

const getCategoryGroupIcon = (label: string) => {
  const value = label.toLowerCase();

  if (value.includes("house")) return "🏠";
  if (value.includes("food")) return "🍔";
  if (value.includes("transport")) return "🚗";
  if (value.includes("health")) return "💊";
  if (value.includes("education")) return "📚";
  if (value.includes("entertainment")) return "📺";
  if (value.includes("investment")) return "📈";
  if (value.includes("shopping")) return "🛒";

  return "💰";
};

const getCategoryEmoji = (category: string) => {
  const value = category?.toLowerCase() || "";

  if (value.includes("rent") || value.includes("house")) return "🏠";

  if (value.includes("grocery")) return "🛒";

  if (value.includes("food")) return "🍔";

  if (value.includes("entertainment")) return "📺";

  if (value.includes("petrol")) return "⛽";

  if (value.includes("medical")) return "💊";

  if (value.includes("insurance")) return "🔑";

  if (value.includes("education")) return "📚";

  if (value.includes("travel")) return "✈️";

  return "💰";
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

const BAR_COLORS = [
  "#22C55E",
  "#3B82F6",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#14B8A6",
];

// intentionally left small helper removed (not used)

export default function DashboardPage() {
  const [monthlySummary, setMonthlySummary] = useState<DashboardSummary[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<
    RecentTransaction[]
  >([]);
  const [categories, setCategories] = useState<any[]>([]);
  // selected month is now stored in MonthContext so other pages react to it
  const { month: selectedMonth, setMonth: setSelectedMonth } = useMonth();
  const [selectedYear, setSelectedYear] = useState<string>(
    String(new Date().getFullYear()),
  );
  // removed local recent-loaded state; using React Query states instead

  function normalizeToYYYYMM(raw?: string) {
    if (!raw) return "";
    const isoMatch = raw.match(/^(\d{4}-\d{2})/);
    if (isoMatch) return isoMatch[1];

    const tryParse = (s: string) => {
      const d = new Date(s);
      if (!isNaN(d.getTime())) return d;
      const d2 = new Date("1 " + s);
      if (!isNaN(d2.getTime())) return d2;
      return null;
    };

    const d = tryParse(raw);
    if (d) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      return `${y}-${m}`;
    }

    return raw;
  }

  // Use React Query hooks for summary, recent transactions and categories
  const summaryQuery = useDashboardSummary(selectedMonth);
  const recentQuery = useRecentTransactions(selectedMonth);
  const categoriesQuery = useCategories();

  // derive loading from queries
  const isLoading = summaryQuery.isLoading || categoriesQuery.isLoading;

  const monthlyExpensesQuery = useMonthlyExpenses(selectedYear);

  // process summary data when available
  useEffect(() => {
    const summary = summaryQuery.data;
    if (!summary) return;

    let processed: any[] = [];

    if (summary && Array.isArray((summary as any).monthlySummary)) {
      processed = ((summary as any).monthlySummary || []).map((item: any) => ({
        ...item,
        yyyymm: normalizeToYYYYMM(item.month),
      }));
    } else if (Array.isArray(summary)) {
      processed = (summary as any).map((item: any) => ({
        ...item,
        yyyymm: normalizeToYYYYMM(item.month),
      }));
    } else if ((summary as any).month) {
      processed = [
        {
          ...(summary as any),
          yyyymm: normalizeToYYYYMM((summary as any).month),
        },
      ];
    }

    setMonthlySummary(processed);

    // set initial month if not set
    const initialMonth = processed[0]?.yyyymm;
    if (initialMonth && !selectedMonth) setSelectedMonth(initialMonth);
  }, [summaryQuery.data]);

  // process categories
  useEffect(() => {
    const resp = categoriesQuery.data;
    if (!resp) return;

    if (resp && Array.isArray((resp as any).categories)) {
      const categoryObj = (resp as any).categories[0];
      const formatted: any[] = [];
      for (const key in categoryObj) {
        const cat = categoryObj[key];
        if (cat && cat.subcategories) {
          for (const subLabel in cat.subcategories) {
            formatted.push({
              label: subLabel,
              items: cat.subcategories[subLabel],
              group: key,
            });
          }
        }
      }
      setCategories(formatted);
    } else {
      setCategories([]);
    }
  }, [categoriesQuery.data]);

  // process recent transactions
  useEffect(() => {
    const resp = recentQuery.data;
    if (!resp) return;
    setRecentTransactions(
      (resp as any).recentTransactions || (resp as any) || [],
    );
  }, [recentQuery.data]);

  // month changes are handled by React Query hooks (summaryQuery, recentQuery)

  const currentMonthData = useMemo(
    () =>
      monthlySummary.find((item: any) => item.yyyymm === selectedMonth) ??
      monthlySummary[0] ??
      defaultSummary,
    [monthlySummary, selectedMonth],
  );

  const chartData =
    monthlyExpensesQuery.data &&
    Array.isArray((monthlyExpensesQuery.data as any).monthlyExpenses)
      ? (monthlyExpensesQuery.data as any).monthlyExpenses.map((item: any) => ({
          month: item.month,
          amount: item.amount,
        }))
      : monthlySummary.map((item) => ({
          month: item.month,
          amount: item.expense,
        }));

  const hasSummaryData = monthlySummary.length > 0;

  const formatCurrency = (value: number) =>
    hasSummaryData ? `₹${value.toLocaleString()}` : "—";

  const summaryCards = [
    {
      label: "Income",
      value: formatCurrency(currentMonthData.income),
      icon: DollarSign,
      variant: "income",
    },
    {
      label: "Expenses",
      value: formatCurrency(currentMonthData.expense),
      icon: CreditCard,
      variant: "expense",
    },
    {
      label: "Savings",
      value: formatCurrency(currentMonthData.savings),
      icon: ShieldCheck,
      variant: "savings",
    },
    {
      label: "Balance",
      value: formatCurrency(currentMonthData.balance),
      icon: PiggyBank,
      variant: "balance",
    },
  ];

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  console.log("currentMonthData", currentMonthData);

  // Always render the dashboard shell. Show empty placeholders when API returns no data.

  return (
    <section className="page dashboard-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1 style={{ color: "var(--text)" }}>Monthly summary</h1>
        </div>
        <div className="month-selector">
          {/* month select removed in favor of DatePicker */}
          <DatePicker
            selected={
              selectedMonth ? new Date(`${selectedMonth}-01`) : new Date()
            }
            onChange={(date) => {
              if (!date) return;

              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");

              setSelectedMonth(`${year}-${month}`);
            }}
            showMonthYearPicker
            dateFormat="MMMM yyyy"
            className="month-picker"
          />
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
                <span className="modern-card-label">{item.label}</span>

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

      <div className="dashboard-panels">
        <section className="panel">
          <div className="chart-panel-header">
            <div>
              <h2 style={{ color: "var(--ink)" }}>Expense growth</h2>
            </div>
            <div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                style={{ padding: "6px 8px", borderRadius: 6 }}
              >
                {Array.from({ length: 6 }).map((_, idx) => {
                  const y = new Date().getFullYear() - (5 - idx);
                  return (
                    <option key={y} value={String(y)}>
                      {y}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="line-chart">
            {chartData.length ? (
              <div style={{ overflowX: "auto" }}>
                <div style={{ minWidth: 900 }}>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart
                      data={chartData}
                      margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="month"
                        tick={{ fill: "#7b6f63", fontSize: 12 }}
                        axisLine={{ stroke: "black", strokeWidth: 1 }}
                        tickLine={{ stroke: "black" }}
                      />

                      <YAxis
                        tickFormatter={(value) => `₹${value / 1000}k`}
                        tick={{ fill: "#7b6f63", fontSize: 12 }}
                        axisLine={{ stroke: "black", strokeWidth: 1 }}
                        tickLine={{ stroke: "black" }}
                      />
                      <Tooltip
                        formatter={(value: any) =>
                          typeof value === "number"
                            ? `₹${value.toLocaleString()}`
                            : value
                        }
                        contentStyle={{
                          background: "#fff5ef",
                          border: "1px solid rgba(200, 85, 61, 0.16)",
                          color: "var(--ink)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#c8553d"
                        strokeWidth={3}
                        dot={{
                          r: 4,
                          fill: "#c8553d",
                          stroke: "#faf6f0",
                          strokeWidth: 2,
                        }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="ledger-empty">
                <span>📈</span>
                <p>No expense growth data available.</p>
              </div>
            )}
          </div>
        </section>

        <section className="panel recent-transactions-panel">
          <div className="section-header">
            <h3 style={{ color: "var(--ink)" }}>Expense Breakdown</h3>
          </div>
          <div className="expense-breakdown-body">
            {currentMonthData.breakdown.length ? (
              currentMonthData.breakdown.map((item: any, index) => (
                <div key={item.label} className="expense-item">
                  <div className="expense-item-header">
                    <div className="expense-info">
                      <span className="expense-icon">
                        {getCategoryEmoji(item.label)}
                      </span>
                      <div>
                        <h4 style={{ color: "var(--ink)" }}>
                          {item.label.replace(/\b\w/g, (c) => c.toUpperCase())}
                        </h4>
                        <span style={{ color: "var(--ink-soft)" }}>
                          {item.percent}% of expenses
                        </span>
                      </div>
                    </div>
                    <strong style={{ color: "var(--ink)" }}>
                      ₹{item.amount}
                    </strong>
                  </div>
                  <div className="expense-progress">
                    <div
                      className="expense-progress-fill"
                      style={{
                        width: `${item.percent}%`,
                        background: BAR_COLORS[index % BAR_COLORS.length],
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="ledger-empty">
                <span>📊</span>
                <p>No expense breakdown available.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="dashboard-panels">
        <section className="panel expense-categories-panel">
          <h2 className="section-title" style={{ color: "var(--text)" }}>
            Expense Categories
          </h2>
          <div
            className="recent-transactions-body"
            style={{ maxHeight: 480, overflowY: "auto", paddingRight: 8 }}
          >
            {categories.length ? (
              <div className="activity-list">
                {categories.map((cat) => (
                  <div
                    key={cat.group + "-" + cat.label}
                    className="activity-card"
                  >
                    <div className="activity-left">
                      <div className="activity-icon">
                        {getCategoryGroupIcon(cat.label)}
                      </div>
                      <div className="activity-content">
                        <h4>
                          {cat.label.replace(/\b\w/g, (c: string) =>
                            c.toUpperCase(),
                          )}
                        </h4>
                        <p>
                          {Array.isArray(cat.items)
                            ? cat.items.join(" • ")
                            : ""}
                        </p>
                      </div>
                    </div>
                    <div className="category-count">
                      {Array.isArray(cat.items) ? cat.items.length : 0}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">No categories available</div>
            )}
          </div>
        </section>

        <section className="panel recent-transactions-panel">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "15px",
            }}
          >
            <h2 style={{ color: "var(--text)", margin: 0 }}>
              Recent transactions
            </h2>

            <span
              style={{
                color: "var(--text-muted)",
                fontSize: "14px",
              }}
            >
              (Last 10 Transactions)
            </span>
          </div>
          <div className="recent-transactions-body">
            {recentTransactions.length ? (
              <div className="activity-list">
                {recentTransactions.map((transaction: any) => (
                  <div key={transaction.id} className="activity-card">
                    <div className="activity-left">
                      <div className="activity-icon">
                        {getCategoryEmoji(
                          transaction.category || transaction.description,
                        )}
                      </div>
                      <div className="activity-content">
                        <h4>
                          {transaction.description.charAt(0).toUpperCase() +
                            transaction.description.slice(1)}
                        </h4>
                        <p>
                          {transaction.category || "General"} •{" "}
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>
                    <div className="activity-amount">
                      -₹
                      {transaction.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ledger-empty">
                <span>💳</span>
                <p>No recent transactions found.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
