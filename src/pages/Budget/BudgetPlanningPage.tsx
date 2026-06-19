import {
  Wallet,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Pencil,
  Trash2,
} from "lucide-react";
import "./budget.css";
import { useState } from "react";
import { useQuery, useQueryClient } from '@tanstack/react-query'
import CreateBudgetModal from "./CreateBudgetModal";
import Button from "../../components/common/Button";
import SmartFinancialPlanner from "../SmartPlanner/SmartFinancialPlanner";
import BudgetPlanningSkeleton from "./BudgetPlanningSkeleton";
import { budgetService } from "../../services/budgetService";
import { useMonth } from '../../context/MonthContext'
import Modal from "../../components/common/Modal";

interface Budget {
  budgetId: string;
  category: string;
  budget: number;
  spent: number;
  remaining: number;
  progress: number;
}

const formatIndianAmount = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  } else {
    return `₹${amount.toFixed(0)}`;
  }
};

export default function BudgetPlanningPage() {
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  // derive budgets and summary from queries
  
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { month: currentMonth } = useMonth()

  const queryClient = useQueryClient()

  const { data: budgetsResp, isLoading: budgetsLoading } = useQuery({
    queryKey: ['budgets', currentMonth],
    queryFn: () => budgetService.getBudgetList(currentMonth),
  })

  const { data: summaryResp, isLoading: summaryLoading } = useQuery({
    queryKey: ['budgetSummary', currentMonth],
    queryFn: () => budgetService.getBudgetSummary(currentMonth),
  })

  const budgetsData = (budgetsResp && (budgetsResp.data ?? budgetsResp)) || []
  const summaryData = (summaryResp && (summaryResp.data ?? summaryResp)) || null

  const budgets = budgetsData
  const summary = summaryData || {
    monthlyIncome: 0,
    totalBudget: 0,
    totalSpent: 0,
    remainingBudget: 0,
    budgetUtilizationPercentage: 0,
  }

  // don't set state during render; use derived loading for initial skeleton

  const handleCreateBudget = async (data: any) => {
    try {
      const payload = {
        month: currentMonth,
        category: data.category,
        budgetAmount: data.budgetAmount,
      };

      let response;
      if (editingBudget) {
        response = await budgetService.updateBudget(editingBudget.budgetId, {
          budgetAmount: data.budgetAmount,
        });
      } else {
        response = await budgetService.createBudget(payload);
      }

      if (response.success) {
        setShowBudgetModal(false);
        setEditingBudget(null);
        await queryClient.invalidateQueries(['budgets'])
        await queryClient.invalidateQueries(['budgetSummary'])
      }
    } catch (error) {
      console.error("Failed to save budget:", error);
    }
  };

  const handleDeleteBudget = async (budgetId: string) => {
    try {
      const response = await budgetService.deleteBudget(budgetId);
      if (response.success) {
        setShowDeleteModal(false);
        setDeleteId(null);
        await queryClient.invalidateQueries(['budgets'])
        await queryClient.invalidateQueries(['budgetSummary'])
      }
    } catch (error) {
      console.error("Failed to delete budget:", error);
    }
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setShowBudgetModal(true);
  };

  if (budgetsLoading || summaryLoading || loading) {
    return <BudgetPlanningSkeleton />;
  }

  return (
    <div className="budget-page">
      {/* Header */}
      <div className="page-header">
        <h1 style={{ color: "var(--ink)" }}>Budget Planning</h1>
        <Button
          text="+ Create Budget"
          onClick={() => setShowBudgetModal(true)}
        />
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        {/* Monthly Income */}
        <article className="modern-card modern-card-income">
          <div className="modern-card-top">
            <div className="modern-card-icon">
              <Wallet size={22} />
            </div>
            <span className="modern-card-badge">Income</span>
          </div>

          <div className="modern-card-body">
            <span className="modern-card-label">Monthly Income</span>

            <h2>{formatIndianAmount(summary.monthlyIncome)}</h2>
          </div>

          <div className="modern-card-footer">
            <div className="progress-track">
              <div
                className="progress-fill progress-income"
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </article>

        {/* Budget Allocated */}
        <article className="modern-card modern-card-expense">
          <div className="modern-card-top">
            <div className="modern-card-icon">
              <PiggyBank size={22} />
            </div>

            <span className="modern-card-badge">Planned</span>
          </div>

          <div className="modern-card-body">
            <span className="modern-card-label">Total Budget</span>

            <h2>{formatIndianAmount(summary.totalBudget)}</h2>
          </div>

          <div className="modern-card-footer">
            <div className="progress-track">
              <div
                className="progress-fill progress-expense"
                style={{
                  width: `${Math.min((summary.totalBudget / summary.monthlyIncome) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </article>

        {/* Actual Spent */}
        <article className="modern-card modern-card-savings">
          <div className="modern-card-top">
            <div className="modern-card-icon">
              <TrendingDown size={22} />
            </div>

            <span className="modern-card-badge">Used</span>
          </div>

          <div className="modern-card-body">
            <span className="modern-card-label">Actual Spending</span>

            <h2>{formatIndianAmount(summary.totalSpent)}</h2>
          </div>

          <div className="modern-card-footer">
            <div className="progress-track">
              <div
                className="progress-fill progress-savings"
                style={{
                  width: `${Math.min((summary.totalSpent / summary.totalBudget) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </article>

        {/* Remaining Budget */}
        <article className="modern-card modern-card-balance">
          <div className="modern-card-top">
            <div className="modern-card-icon">
              <TrendingUp size={22} />
            </div>

            <span className="modern-card-badge">Left</span>
          </div>

          <div className="modern-card-body">
            <span className="modern-card-label">Remaining Budget</span>

            <h2>{formatIndianAmount(summary.remainingBudget)}</h2>
          </div>

          <div className="modern-card-footer">
            <div className="progress-track">
              <div
                className="progress-fill progress-balance"
                style={{
                  width: `${Math.max((summary.remainingBudget / summary.totalBudget) * 100, 0)}%`,
                }}
              />
            </div>
          </div>
        </article>
      </div>

      <SmartFinancialPlanner />

      {/* Category Budget Cards */}
      <div className="budget-section">
        <div className="section-header">
          <h3>Category Budgets</h3>
        </div>

        <div className="budget-list">
          {budgets && budgets.length > 0 ? (
            budgets.map((item) => {
              return (
                <div key={item.budgetId} className="category-budget-card">
                  <div className="category-header">
                    <span>{item.category}</span>

                    <span>{item.progress.toFixed(0)}%</span>
                  </div>

                  <div className="budget-progress">
                    <div
                      className={`budget-progress-fill ${
                        item.progress > 100
                          ? "danger"
                          : item.progress > 80
                            ? "warning"
                            : "success"
                      }`}
                      style={{
                        width: `${Math.min(item.progress, 100)}%`,
                      }}
                    />
                  </div>

                  <div className="category-footer">
                    <span>
                      Spend: ₹{item.spent.toLocaleString()}. Remaining: ₹
                      {item.remaining.toLocaleString()}
                    </span>

                    <span>Budget: ₹{item.budget.toLocaleString()}</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginTop: "12px",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      onClick={() => handleEditBudget(item)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "4px",
                        color: "var(--ink)",
                      }}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteId(item.budgetId);
                        setShowDeleteModal(true);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "4px",
                        color: 'red',
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="ledger-empty">
              <span>📈</span>
              <p>No Budget planning are available</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteId && (
        <Modal
          title="Delete Budget"
          onClose={() => {
            setShowDeleteModal(false);
            setDeleteId(null);
          }}
        >
          <div style={{ color: "var(--ink)", marginBottom: "20px" }}>
            <p>Are you sure you want to delete this budget?</p>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--ink-soft)",
                marginTop: "10px",
              }}
            >
              This action cannot be undone.
            </p>
          </div>
          <div className="form-actions">
            <button
              className="button secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteId(null);
              }}
            >
              Cancel
            </button>
            <button
              className="button primary"
              style={{ backgroundColor: "#ef4444" }}
              onClick={() => handleDeleteBudget(deleteId)}
            >
              Delete
            </button>
          </div>
        </Modal>
      )}

      {/* Budget Table removed (unused) */}

      <CreateBudgetModal
        open={showBudgetModal}
        onClose={() => {
          setShowBudgetModal(false);
          setEditingBudget(null);
        }}
        onSubmit={handleCreateBudget}
        initialData={
          editingBudget
            ? {
                month: currentMonth,
                category: editingBudget.category,
                budgetAmount: editingBudget.budget,
                notes: "",
              }
            : undefined
        }
      />
    </div>
  );
}
