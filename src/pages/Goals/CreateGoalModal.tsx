import { useForm } from "react-hook-form";
import Modal from "../../components/common/Modal";
import { useEffect } from "react";

interface CreateGoalForm {
  goalName: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  notes: string;
}

interface Goal {
  id?: string;
  goalId?: string;
  goalName: string;
  category?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  notes?: string;
  status?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGoalForm) => void;
  initialGoal?: Goal | null;
}

const categories = [
  "Car",
  "House",
  "Vacation",
  "Emergency Fund",
  "Education",
  "Marriage",
  "Medical",
  "Investment",
  "Other",
];

export default function CreateGoalModal({ open, onClose, onSubmit, initialGoal }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateGoalForm>();

  useEffect(() => {
    if (initialGoal) {
      setValue("goalName", initialGoal.goalName);
      setValue("category", initialGoal.category);
      setValue("targetAmount", initialGoal.targetAmount);
      setValue("currentAmount", initialGoal.currentAmount);
      setValue("targetDate", initialGoal.targetDate
      ? new Date(initialGoal.targetDate).toISOString().split("T")[0]
      : "",);
      setValue("notes", initialGoal.notes);
    } else {
      reset();
    }
  }, [initialGoal, setValue, reset]);

  if (!open) return null;

  const submitHandler = (data: CreateGoalForm) => {
    onSubmit(data);
    reset();
    onClose();
  };

  const modalTitle = initialGoal ? "Edit Your Goal" : "Add Your Goal";

  return (
    <Modal title={modalTitle} onClose={() => onClose()}>
      <form onSubmit={handleSubmit(submitHandler)} className="form-grid">
        <div className="form-group">
          <label style={{ color: "var(--ink)" }}>Goal Name *</label>

          <input
            style={{ color: "var(--ink)" }}
            type="text"
            placeholder="Buy New Car"
            {...register("goalName", {
              required: "Goal name is required",
            })}
          />

          {errors.goalName && (
            <span className="error">{errors.goalName.message}</span>
          )}
        </div>

        {/* Category */}
        <div className="form-group">
          <label style={{ color: "var(--ink)" }}>Category *</label>

          <select
            style={{ color: "var(--ink)" }}
            {...register("category", {
              required: "Category is required",
            })}
          >
            <option value="">Select Category</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {errors.category && (
            <span className="error">{errors.category.message}</span>
          )}
        </div>

        {/* Target Amount */}
        <div className="form-group">
          <label style={{ color: "var(--ink)" }}>Target Amount *</label>

          <input
            type="number"
            style={{ color: "var(--ink)" }}
            {...register("targetAmount", {
              required: "Target amount is required",
              valueAsNumber: true,
              min: {
                value: 1,
                message: "Amount must be greater than 0",
              },
            })}
          />

          {errors.targetAmount && (
            <span className="error">{errors.targetAmount.message}</span>
          )}
        </div>

        {/* Current Saved */}
        <div className="form-group">
          <label style={{ color: "var(--ink)" }}>Current Saved Amount</label>

          <input
            type="number"
            style={{ color: "var(--ink)" }}
            {...register("currentAmount", {
              valueAsNumber: true,
            })}
          />
        </div>

        {/* Target Date */}
        <div className="form-group">
          <label style={{ color: "var(--ink)" }}>Target Date *</label>

          <input
            style={{ color: "var(--ink)" }}
            type="date"
            {...register("targetDate", {
              required: "Target date is required",
            })}
          />

          {errors.targetDate && (
            <span className="error">{errors.targetDate.message}</span>
          )}
        </div>

        {/* Notes */}
        <div className="form-group">
          <label style={{ color: "var(--ink)" }}>Notes</label>

          <input
            style={{ color: "var(--ink)" }}
            type="text"
            placeholder="Optional notes..."
            {...register("notes")}
          />
        </div>

        <div className="form-actions">
          <button
            style={{ color: "var(--ink)" }}
            type="button"
            className="button secondary"
            onClick={() => onClose()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="button primary"
            onClick={() => {}}
          >
            {initialGoal ? "Update Goal" : "Submit Goal"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
