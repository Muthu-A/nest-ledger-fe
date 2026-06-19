import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../components/common/Modal";

interface BudgetFormData {
  month: string;
  category: string;
  budgetAmount: number;
  notes: string;
}

interface CreateBudgetModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BudgetFormData) => void;
  initialData?: BudgetFormData | null;
}

const categories = [
  "Food",
  "Transport",
  "Rent",
  "EMI",
  "Utilities",
  "Shopping",
  "Medical",
  "Education",
  "Entertainment",
  "Travel",
  "Others",
];

export default function CreateBudgetModal({
  open,
  onClose,
  onSubmit,
  initialData,
}: CreateBudgetModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetFormData>();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        month: new Date().toISOString().slice(0, 7),
        category: "",
        budgetAmount: 0,
        notes: "",
      });
    }
  }, [initialData, reset]);

  if (!open) return null;

  const submitHandler = (data: BudgetFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <Modal title={"Create Budget"} onClose={() => onClose()}>
      <form onSubmit={handleSubmit(submitHandler)} className="form-grid">
        <div className="form-group">
          <label style={{ color: "var(--ink)" }}>Month *</label>

          <input
          style={{ color: "var(--ink)" }}
            type="month"
            {...register("month", {
              required: "Month is required",
            })}
          />

          {errors.month && (
            <span className="error">{errors.month.message}</span>
          )}
        </div>

        <div className="form-group">
          <label style={{ color: "var(--ink)" }}>Category *</label>

          <select
          style={{ color: "var(--ink)" }}
            {...register("category", {
              required: "Category is required",
            })}
          >
            <option style={{ color: "var(--ink)" }} value="">Select Category</option>

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

        <div className="form-group">
          <label style={{ color: "var(--ink)" }}>Budget Amount *</label>

          <input
          style={{ color: "var(--ink)" }}
            type="number"
            placeholder="Enter amount"
            {...register("budgetAmount", {
              required: "Budget amount is required",
              valueAsNumber: true,
              min: {
                value: 1,
                message: "Amount must be greater than 0",
              },
            })}
          />

          {errors.budgetAmount && (
            <span className="error">{errors.budgetAmount.message}</span>
          )}
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
            {initialData ? "Update Budget" : "Create Budget"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
