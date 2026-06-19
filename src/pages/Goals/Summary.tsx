interface Goal {
  id: string;
  goalName: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  status: "ACTIVE" | "COMPLETED" | "PAUSED";
}

interface Props {
  goals: Goal[];
}

export default function GoalSummary({
  goals,
}: Props) {
  const totalTarget = goals.reduce(
    (sum, goal) => sum + goal.targetAmount,
    0
  );

  const totalSaved = goals.reduce(
    (sum, goal) => sum + goal.currentAmount,
    0
  );

  return (
    <div className="summary-grid">
      <div className="summary-card">
        <h4>Total Goals</h4>
        <h2>{goals.length}</h2>
      </div>

      <div className="summary-card">
        <h4>Active Goals</h4>
        <h2>
          {
            goals.filter(
              g => g.status === "ACTIVE"
            ).length
          }
        </h2>
      </div>

      <div className="summary-card">
        <h4>Target</h4>
        <h2>₹{totalTarget.toLocaleString()}</h2>
      </div>

      <div className="summary-card">
        <h4>Saved</h4>
        <h2>₹{totalSaved.toLocaleString()}</h2>
      </div>
    </div>
  );
}