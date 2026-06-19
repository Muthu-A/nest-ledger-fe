import { Car } from "lucide-react";

export interface Goal {
  id: string;
  goalName: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  status: "ACTIVE" | "COMPLETED" | "PAUSED";
}

export default function GoalCard({
  goal,
}: {
  goal: Goal;
}) {
  const progress =
    (goal.currentAmount /
      goal.targetAmount) *
    100;

  const remaining =
    goal.targetAmount -
    goal.currentAmount;

  return (
    <div className="goal-card">
      <div className="goal-header">
        <Car size={22} />
        <h3>{goal.goalName}</h3>
      </div>

      <div className="goal-values">
        <div>
          <span>Saved</span>
          <strong>
            ₹{goal.currentAmount.toLocaleString()}
          </strong>
        </div>

        <div>
          <span>Target</span>
          <strong>
            ₹{goal.targetAmount.toLocaleString()}
          </strong>
        </div>
      </div>

      <div className="progress">
        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <p>{progress.toFixed(0)}%</p>

      <div className="goal-footer">
        <span>
          Remaining ₹
          {remaining.toLocaleString()}
        </span>

        <button>
          Add Contribution
        </button>
      </div>
    </div>
  );
}