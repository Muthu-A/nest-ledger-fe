import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import IncomeForm from "./IncomeForm";
import Modal from "../../components/common/Modal";
import { useIncome } from "../../hooks/useIncome";
import { incomeService } from "../../services/incomeService";
import { formatCurrency } from "../../utils/currency";
import { formatDate } from "../../utils/helpers";
import type { Income } from "../../types/income";
import IncomePageSkeleton from "./IncomePageSkeleton";

export default function IncomePage() {
  const { backendIncome, loading } = useIncome();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIncome, setEditIncome] = useState<Income | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setIncomes(backendIncome);
  }, [backendIncome]);

  async function handleCreate(income: any) {
    try {
      const createdIncome = await incomeService.create(income);
      setIncomes((current) => [createdIncome, ...current]);
    } catch {
      // In a real app, display a proper error message here.
      setIncomes((current) => [
        {
          id: `${Date.now()}`,
          source: income.source,
          amount: income.amount,
          date: income.date,
          notes: income.notes,
        },
        ...current,
      ]);
    }
  }

  async function handleDelete(id: string) {
    try {
      await incomeService.delete(id);
      setIncomes((current) => current.filter((i) => i.id !== id));
    } catch {
      // Optionally show error
    }
    setDeleteId(null);
  }

  async function handleEdit(id: string, updated: Partial<Income>) {
    try {
      const updatedIncome = await incomeService.update(id, updated);
      setIncomes((current) =>
        current.map((i) => (i.id === id ? updatedIncome : i)),
      );
      setEditIncome(null);
    } catch {
      // Optionally show error
    }
  }

  if (loading) {
    return <IncomePageSkeleton />;
  }

  return (
    <section className="page income-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Income</p>
          <h1 style={{ color: "var(--ink)" }}>Salary and sources</h1>
        </div>
        <div className="page-header-actions">
          <button
            type="button"
            className="button primary"
            onClick={() => setIsModalOpen(true)}
          >
            + Add income
          </button>
        </div>
      </div>

      <div className="income-cards-container">
        {incomes.length === 0 ? (
          <div className="ledger-empty">
            <span>💼</span>
            <p>No income records yet — add your first salary source.</p>
          </div>
        ) : (
          incomes.map((income) => (
            <div key={income.id} className="salary-hero-card">
              <div className="salary-card-header">
                <div>
                  <span className="salary-label">MONTHLY SALARY</span>
                  <h2>Salary Wallet</h2>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="salary-month-badge">
                    {new Date(income.date).toLocaleDateString("en-IN", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>

                  <button
                    className="icon-button"
                    title="Edit"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 4,
                    }}
                    onClick={() => setEditIncome(income)}
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    className="icon-button"
                    title="Delete"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 4,
                    }}
                    onClick={() => setDeleteId(income.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="salary-card-body">
                <div className="salary-left">
                  <span className="salary-source-label">PRIMARY SOURCE</span>
                  <h1 className="salary-source-name">{income.source}</h1>
                  <div className="salary-amount">
                    {formatCurrency(income.amount)}
                  </div>

                  <p className="salary-quote">
                    "Every salary is a reward for yesterday's effort and an
                    investment in tomorrow's goals."
                  </p>
                </div>

                <div className="salary-icon-circle">💼</div>
              </div>

              <div className="salary-card-footer">
                <div>
                  <span>Salary Date</span>
                  <strong>{formatDate(income.date)}</strong>
                </div>

                <div>
                  <span>Source</span>
                  <strong>{income.source}</strong>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <Modal title="Add income" onClose={() => setIsModalOpen(false)}>
          <IncomeForm
            onCreate={(income) => {
              handleCreate(income);
              setIsModalOpen(false);
            }}
            onClose={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
      {editIncome && (
        <Modal title="Edit income" onClose={() => setEditIncome(null)}>
          <IncomeForm
            onCreate={(income) => {
              handleEdit(editIncome.id, income);
              setEditIncome(null);
            }}
            onClose={() => setEditIncome(null)}
            initialValues={editIncome}
          />
        </Modal>
      )}
      {deleteId && (
        <Modal title="Delete income?" onClose={() => setDeleteId(null)}>
          <div
            style={{
              color: "var(--ink)",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            Are you sure you want to delete this income? <br />
            <strong>This leads to losing your entire month data.</strong>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button
              className="button secondary"
              style={{ color: "var(--ink)" }}
              onClick={() => setDeleteId(null)}
            >
              Cancel
            </button>
            <button
              className="button danger"
              style={{ backgroundColor: "red" }}
              onClick={() => handleDelete(deleteId)}
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}
