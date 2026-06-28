import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Target,
  CheckCircle,
  Zap,
  TrendingUp,
  Pencil,
  Trash2,
} from "lucide-react";
import GoalProgressChart from "./GoalProgressChart";
import "./goals.css";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import CreateGoalModal from "./CreateGoalModal";
import { goalService } from "../../services/goalService";
import GoalsSkeleton from "./GoalsSkeleton";
import SummaryCard from "../../components/common/SummaryCard";

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

interface Goal {
  id?: string;
  goalId?: string;
  goalName: string;
  category?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  notes?: string;
  status: "ACTIVE" | "COMPLETED" | "PAUSED";
  progress?: number;
  remainingAmount?: number;
}

export default function GoalsPage() {
  const [isContributionOpen, setIsContributionOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  // derive goals from query result
  // const [goalsData, setGoalsData] = useState<Goal[]>([]);
  const [contributionHistory, setContributionHistory] = useState<any[]>([]);
  const [showContributionHistory, setShowContributionHistory] = useState(false);
  const [editingContribution, setEditingContribution] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: goalsResp,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["goals"],
    queryFn: () => goalService.getAllGoals(),
  });

  // normalize response shape
  const respData = (goalsResp && (goalsResp.data ?? goalsResp)) || [];

  // map API response to local Goal interface
  const mappedGoals = respData.map((g: any) => ({
    id: g.goalId,
    goalId: g.goalId,
    goalName: g.goalName,
    category: g.category,
    targetAmount: g.targetAmount,
    currentAmount: g.currentAmount,
    targetDate: g.targetDate,
    status: g.status,
    progress: g.progress,
    remainingAmount: g.remainingAmount,
  })) as Goal[];

  const goals = mappedGoals;

  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalGoals = goals.length;
  const activeGoals = goals.filter((goal) => goal.status === "ACTIVE").length;

  const chartData = goals.map((goal) => ({
    name: goal.goalName,
    saved: goal.currentAmount,
    remaining: goal.targetAmount - goal.currentAmount,
  }));

  const summaryCards = [
    {
      icon: <Target size={22} />,
      badge: "Total",
      label: "Total Goals",
      value: totalGoals,
      progress: 100,
      cardType: "income" as const,
    },
    {
      icon: <CheckCircle size={22} />,
      badge: "Active",
      label: "Active Goals",
      value: activeGoals,
      progress: 100,
      cardType: "expense" as const,
    },
    {
      icon: <Zap size={22} />,
      badge: "Target",
      label: "Target Amount",
      value: formatIndianAmount(totalTarget),
      progress: 100,
      cardType: "savings" as const,
    },
    {
      icon: <TrendingUp size={22} />,
      badge: "Progress",
      label: "Saved Amount",
      value: formatIndianAmount(totalSaved),
      progress: totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0,
      cardType: "balance" as const,
    },
  ];

  const handleAddContribution = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsContributionOpen(true);
  };

  const handleSaveContribution = async () => {
    if (!selectedGoal || !selectedGoal.goalId || !amount) return;
    setLoading(true);
    try {
      const response = await goalService.addContribution(selectedGoal.goalId, {
        amount: Number(amount),
        date: new Date().toISOString().split("T")[0],
        notes: notes || "",
      });
      if (response.success) {
        setAmount("");
        setNotes("");
        setIsContributionOpen(false);
        await queryClient.invalidateQueries(["goals"]);
      }
    } catch (error) {
      console.error("Failed to add contribution:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (data: any) => {
    try {
      setLoading(true);
      let response;
      if (editingGoal && editingGoal.goalId) {
        // Update existing goal
        response = await goalService.updateGoal(editingGoal.goalId, data);
      } else {
        // Create new goal
        response = await goalService.createGoal(data);
      }
      if (response.success) {
        setShowGoalModal(false);
        setEditingGoal(null);
        await queryClient.invalidateQueries(["goals"]);
      }
    } catch (error) {
      console.error("Failed to save goal:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      setLoading(true);
      const response = await goalService.deleteGoal(goalId);
      if (response.success) {
        await queryClient.invalidateQueries(["goals"]);
      }
    } catch (error) {
      console.error("Failed to delete goal:", error);
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
      setLoading(false);
    }
  };

  const handleViewContributions = async (goal: Goal) => {
    if (!goal.goalId) return;
    try {
      const response = await goalService.getContributions(goal.goalId);
      if (response.success) {
        setContributionHistory(response.data || []);
        setSelectedGoal(goal);
        setShowContributionHistory(true);
      }
    } catch (error) {
      console.error("Failed to load contributions:", error);
    }
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setShowGoalModal(true);
  };

  const handleDeleteContribution = async (contributionId: string) => {
    try {
      setLoading(true);
      const response = await goalService.deleteContribution(contributionId);
      if (response.success) {
        if (selectedGoal && selectedGoal.goalId) {
          handleViewContributions(selectedGoal);
        }
        await queryClient.invalidateQueries(["goals"]);
      }
    } catch (error) {
      console.error("Failed to delete contribution:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditContribution = async (
    contributionId: string,
    updatedAmount: number,
    updatedNotes: string,
  ) => {
    setLoading(true);
    try {
      const response = await goalService.updateContribution(contributionId, {
        amount: updatedAmount,
        notes: updatedNotes,
      });
      if (response.success) {
        setEditingContribution(null);
        if (selectedGoal && selectedGoal.goalId) {
          handleViewContributions(selectedGoal);
        }
        await queryClient.invalidateQueries(["goals"]);
      }
    } catch (error) {
      console.error("Failed to update contribution:", error);
    } finally {
      setLoading(false);
    }
  };

  const activeGoalsList = goals.filter((goal) => goal.status === "ACTIVE");
  const completedGoals = goals.filter((goal) => goal.status === "COMPLETED");

  if (isLoading || loading) {
    return <GoalsSkeleton />;
  }

  return (
    <div className="goals-page">
      {/* Header */}
      <div className="page-header">
        <h1 style={{ color: "var(--ink)" }}>Goals</h1>
        <Button
          text="+ Create Goal"
          onClick={() => setShowGoalModal(true)}
          loading={false}
        />
      </div>
      {/* Summary Cards */}
      <div className="summary-grid">
        {summaryCards.map((card) => (
          <SummaryCard
            key={card.label}
            icon={card.icon}
            badge={card.badge}
            label={card.label}
            value={card.value}
            progress={card.progress}
            cardType={card.cardType}
          />
        ))}
      </div>
      {/* Progress Chart */}
      <GoalProgressChart data={chartData} />
      {/* Goal Cards */}
      <div className="card-header">
        <h3>Active Goals</h3>
      </div>
      <div className="goal-grid">
        {activeGoalsList &&
          activeGoalsList.length > 0 &&
          activeGoalsList.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;

            return (
              <div key={goal.goalId || goal.id} className="goal-card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <h3>{goal.goalName}</h3>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      style={{
                        color: "grey",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 4,
                      }}
                      title="Edit"
                      onClick={() => handleEditGoal(goal)}
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      style={{
                        color: "red",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 4,
                      }}
                      title="Delete"
                      onClick={() => {
                        setShowDeleteModal(true);
                        setDeleteId(goal.goalId || goal.id || "");
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="goal-stats">
                  <div>
                    <span>Saved</span>
                    <strong>
                      ₹{goal.currentAmount.toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div>
                    <span>Target</span>
                    <strong>
                      ₹{goal.targetAmount.toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <div
                  className="category-footer"
                  style={{ marginBottom: "10px" }}
                >
                  <p className="progress-text">
                    {progress.toFixed(0)}% Completed
                  </p>
                  <p className="progress-text">
                    Target Date:{" "}
                    {goal.targetDate
                      ? new Date(goal.targetDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </p>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <Button
                    text="Add Contribution"
                    onClick={() => handleAddContribution(goal)}
                    loading={false}
                  />
                  <Button
                    text="History"
                    onClick={() => handleViewContributions(goal)}
                    loading={false}
                  />
                </div>
              </div>
            );
          })}
      </div>
      {activeGoalsList.length === 0 && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <span>📈</span>
          <p>No Active Goals Found.</p>
        </div>
      )}

      
      {completedGoals.length > 0 && (
       <div className="card-header">
        <h3>Completed Goals</h3>
      </div>
      )}
      {completedGoals.length > 0 && (
      <div className="goal-grid">
        {completedGoals?.map((goal) => (
          <div key={goal.goalId || goal.id} className="completed-goal-card">
            <div className="celebration-bg"></div>

            <div className="completed-header">
              <div>
                <span className="completed-badge">🎉 GOAL ACHIEVED</span>
                <h3>{goal.goalName}</h3>
              </div>

              <div className="trophy">🏆</div>
            </div>

            <div className="completed-message">
              Congratulations! You reached your savings target.
            </div>

            <div className="goal-stats">
              <div>
                <span>Saved</span>
                <strong>₹{goal.currentAmount.toLocaleString("en-IN")}</strong>
              </div>

              <div>
                <span>Target</span>
                <strong>₹{goal.targetAmount.toLocaleString("en-IN")}</strong>
              </div>
            </div>

            <div className="progress-bar completed-progress">
              <div className="progress-fill completed-fill"></div>
            </div>

            <div className="completed-footer">
              <span>✅ 100% Completed</span>

              <span>
                {goal.targetDate
                  ? new Date(goal.targetDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "-"}
              </span>
            </div>
          </div>
        ))}
      </div>
      )}

      {showDeleteModal && deleteId && (
        <Modal
          title="Delete Goal"
          onClose={() => {
            setShowDeleteModal(false);
            setDeleteId(null);
          }}
        >
          <div style={{ color: "var(--ink)", marginBottom: "20px" }}>
            <p>Are you sure you want to delete this Goal?</p>
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
              onClick={() => handleDeleteGoal(deleteId)}
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
      {isContributionOpen && (
        <Modal
          title="Add Contribution"
          onClose={() => setIsContributionOpen(false)}
        >
          <div className="form-grid">
            <p style={{ color: "var(--ink)" }}>
              Goal:
              <strong>{selectedGoal?.goalName}</strong>
            </p>

            <label style={{ color: "var(--ink)" }}>
              Amount
              <input
                style={{ color: "var(--ink)" }}
                type="number"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                min="0"
                required
              />
            </label>
            <label style={{ color: "var(--ink)" }}>
              Notes
              <input
                style={{ color: "var(--ink)" }}
                type="text"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </label>

            <div className="form-actions">
              <button
                style={{ color: "var(--ink)" }}
                type="button"
                className="button secondary"
                onClick={() => setIsContributionOpen(false)}
              >
                Cancel
              </button>
              <Button
                text="Submit Contribution"
                onClick={() => handleSaveContribution()}
                loading={loading}
              />
            </div>
          </div>
        </Modal>
      )}
      {showContributionHistory && selectedGoal && (
        <Modal
          title={`Contribution History - ${selectedGoal.goalName}`}
          onClose={() => setShowContributionHistory(false)}
        >
          <div style={{ maxHeight: 400, overflowY: "auto" }}>
            {contributionHistory && contributionHistory.length > 0 ? (
              <div>
                {contributionHistory.map((contribution) => (
                  <div
                    key={contribution.contributionId}
                    style={{
                      padding: 12,
                      border: "1px solid #e0e0e0",
                      borderRadius: 8,
                      marginBottom: 8,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong style={{ color: "var(--ink)" }}>
                        ₹{contribution.amount.toLocaleString("en-IN")}
                      </strong>
                      <p
                        style={{
                          color: "var(--ink-soft)",
                          fontSize: 12,
                          margin: "4px 0 0 0",
                        }}
                      >
                        {new Date(contribution.date).toLocaleDateString(
                          "en-IN",
                        )}
                      </p>
                      {contribution.notes && (
                        <p
                          style={{
                            color: "var(--ink-soft)",
                            fontSize: 12,
                            margin: "4px 0 0 0",
                          }}
                        >
                          {contribution.notes}
                        </p>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        style={{
                          color: "grey",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 4,
                        }}
                        onClick={() => setEditingContribution(contribution)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        style={{
                          color: "red",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 4,
                        }}
                        onClick={() =>
                          handleDeleteContribution(contribution.contributionId)
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--ink)", textAlign: "center" }}>
                No contributions yet
              </p>
            )}
          </div>
        </Modal>
      )}
      {editingContribution && (
        <Modal
          title="Edit Contribution"
          onClose={() => setEditingContribution(null)}
        >
          <EditContributionForm
            contribution={editingContribution}
            onSave={(amount, notes) => {
              handleEditContribution(
                editingContribution.contributionId,
                amount,
                notes,
              );
            }}
            onCancel={() => setEditingContribution(null)}
          />
        </Modal>
      )}
      <CreateGoalModal
        open={showGoalModal}
        onClose={() => {
          setShowGoalModal(false);
          setEditingGoal(null);
        }}
        onSubmit={handleCreateGoal}
        initialGoal={editingGoal}
      />
    </div>
  );
}

function EditContributionForm({
  contribution,
  onSave,
  onCancel,
  loading,
}: any) {
  const [amount, setAmount] = useState(contribution.amount);
  const [notes, setNotes] = useState(contribution.notes || "");

  return (
    <div className="form-grid">
      <label style={{ color: "var(--ink)" }}>
        Amount
        <input
          style={{ color: "var(--ink)" }}
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          min="0"
        />
      </label>
      <label style={{ color: "var(--ink)" }}>
        Notes
        <input
          style={{ color: "var(--ink)" }}
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </label>
      <div className="form-actions">
        <button className="button secondary" onClick={onCancel}>
          Cancel
        </button>
        <Button
          text={"Save"}
          loading={loading}
          onClick={() => onSave(amount, notes)}
        />
      </div>
    </div>
  );
}
