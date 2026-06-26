import { useState, type FormEvent } from "react";

interface IncomeFormProps {
  onCreate: (income: any) => void;
  onClose?: () => void;
  initialValues?: Partial<any>;
}

export default function IncomeForm({
  onCreate,
  onClose,
  initialValues,
}: IncomeFormProps) {
  const [source, setSource] = useState(initialValues?.source || "Salary");
  const [amount, setAmount] = useState(
    initialValues?.amount ? String(initialValues.amount) : "",
  );
  const [date, setDate] = useState(
    initialValues?.date
      ? new Date(initialValues.date).toISOString().split("T")[0]
      : "",
  );
  const [notes, setNotes] = useState(initialValues?.notes || "");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!amount || !date) {
      return;
    }

    onCreate({
      source,
      amount: Number(amount),
      date,
      notes: notes || undefined,
    });

    setAmount("");
    setDate("");
    setNotes("");
    onClose?.();
  }

  return (
    <form className="page-form" onSubmit={handleSubmit}>
      <div className="form-grid">
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
          Source
          <input
            style={{ color: "var(--ink)" }}
            type="text"
            value={source}
            onChange={(event) => setSource(event.target.value)}
            required
          />
        </label>
        <label style={{ color: "var(--ink)" }}>
          Date
          <input
            style={{ color: "var(--ink)" }}
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
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
      </div>
      <div className="form-actions">
        <button
          style={{ color: "var(--ink)" }}
          type="button"
          className="button secondary"
          onClick={onClose}
        >
          Cancel
        </button>
        <button type="submit" className="button primary">
          Save income
        </button>
      </div>
    </form>
  );
}
