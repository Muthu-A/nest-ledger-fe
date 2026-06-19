import { useEffect, useMemo, useRef, useState } from "react";
import ExpenseForm from "./ExpenseForm";
import Modal from "../../components/common/Modal";
import { useExpenses } from "../../hooks/useExpenses";
import { formatCurrency } from "../../utils/currency";
import { categories } from "../../constants/categories";
import { Mic, Plus } from "lucide-react";
import {
  expenseService,
  type ExpenseCreatePayload,
} from "../../services/expenseService";
import type { Expense } from "../../types/expense";
import ExpensePageSkeleton from "./ExpensePageSkeleton";
import Button from "../../components/common/Button";

/* ---------- category meta (emoji + tint class) ---------- */
const CATEGORY_META: Record<string, { emoji: string; tint: string }> = {
  food: { emoji: "🍔", tint: "tint-food" },
  grocery: { emoji: "🛒", tint: "tint-grocery" },
  rent: { emoji: "🏠", tint: "tint-rent" },
  bill: { emoji: "💡", tint: "tint-bill" },
  travel: { emoji: "✈️", tint: "tint-travel" },
  petrol: { emoji: "⛽", tint: "tint-travel" },
  fuel: { emoji: "⛽", tint: "tint-travel" },
  shopping: { emoji: "🛍️", tint: "tint-shopping" },
  medical: { emoji: "💊", tint: "tint-medical" },
  health: { emoji: "💊", tint: "tint-medical" },
  kid: { emoji: "🧸", tint: "tint-kids" },
  school: { emoji: "✏️", tint: "tint-kids" },
  movie: { emoji: "🎬", tint: "tint-fun" },
  recharge: { emoji: "📱", tint: "tint-bill" },
  salary: { emoji: "💼", tint: "tint-income" },
};

function getMeta(label: string) {
  const v = label.toLowerCase();
  for (const key of Object.keys(CATEGORY_META)) {
    if (v.includes(key)) return CATEGORY_META[key];
  }
  return { emoji: "🌿", tint: "tint-default" };
}

/* ---------- date grouping helpers ---------- */
function dayKey(d: string | Date) {
  const date = new Date(d);
  return date.toISOString().slice(0, 10);
}
function dayLabel(d: string | Date) {
  const date = new Date(d);
  const today = new Date();
  const yest = new Date();
  yest.setDate(today.getDate() - 1);
  if (dayKey(date) === dayKey(today)) return "Today";
  if (dayKey(date) === dayKey(yest)) return "Yesterday";
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function ExpensePage() {
  const { backendExpenses, loading } = useExpenses();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setExpenses(backendExpenses);
  }, [backendExpenses]);

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, item) => sum + item.amount, 0),
    [expenses],
  );

  /* group by day, newest first */
  const grouped = useMemo(() => {
    const map = new Map<string, Expense[]>();
    [...expenses]
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
      .forEach((e) => {
        const k = dayKey(e.date);
        if (!map.has(k)) map.set(k, []);
        map.get(k)!.push(e);
      });
    return Array.from(map.entries()).map(([k, items]) => ({
      key: k,
      label: dayLabel(k),
      items,
      total: items.reduce((s, i) => s + i.amount, 0),
    }));
  }, [expenses]);

  /* ---------- voice state (unchanged logic) ---------- */
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [voiceItems, setVoiceItems] = useState<
    Array<{ id: string; subCategory: string; amount: string; date: string }>
  >([]);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const shouldContinueListeningRef = useRef(false);
  const recognitionRef = useRef<any>(null);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  async function handleCreate(expense: ExpenseCreatePayload) {
    setIsSubmitLoading(true);
    try {
      const created = await expenseService.create({
        ...expense,
        category: expense.subCategory,
      });
      setExpenses((c) => [created, ...c]);
    } catch {
      setVoiceError("Failed to save expense. Please try again.");
    } finally {
      setIsSubmitLoading(false);
      setIsModalOpen(false);
    }
  }

  function getMatchedCategory(phrase: string) {
    const normalized = phrase.trim().toLowerCase();
    const allItems = categories.flatMap((g) =>
      g.items.map((item) => ({ item, group: g.label })),
    );
    const exact = allItems.find((e) => e.item.toLowerCase() === normalized);
    const partial = allItems.find(
      (e) =>
        e.item.toLowerCase().includes(normalized) ||
        normalized.includes(e.item.toLowerCase()),
    );
    const groupMatch = categories.find(
      (g) => g.label.toLowerCase() === normalized,
    );
    return {
      category:
        exact?.group ??
        partial?.group ??
        groupMatch?.label ??
        categories[0].label,
      subCategory: exact?.item ?? partial?.item ?? phrase.trim(),
    };
  }

  function parseVoiceTranscript(text: string) {
    const normalized = text.replace(/and/gi, " ").replace(/[,.]/g, " ");
    const matches = Array.from(
      normalized.matchAll(/([a-zA-Z ]+?)\s+(\d+(?:\.\d+)?)/g),
    );
    return matches.map((m, i) => {
      const matched = getMatchedCategory(m[1].trim());
      return {
        id: `voice-${Date.now()}-${i}`,
        subCategory: matched.subCategory,
        amount: m[2],
        date: new Date().toISOString().slice(0, 10),
      };
    });
  }

  function handleVoiceItemChange(
    id: string,
    field: "subCategory" | "amount",
    value: string,
  ) {
    setVoiceItems((c) =>
      c.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  }

  async function handleVoiceSubmit() {
    setIsSubmitLoading(true);
    try {
      const created = await Promise.all(
        voiceItems.map((item) =>
          expenseService.create({
            category: item.subCategory,
            subCategory: item.subCategory,
            amount: Number(item.amount),
            date: item.date,
          }),
        ),
      );
      setExpenses((c) => [...created, ...c]);
      handleVoiceClose();
    } catch {
      setVoiceError("Failed to save voice expenses. Please try again.");
    } finally {
      setIsSubmitLoading(false);
    }
  }

  function resetVoiceState() {
    setVoiceTranscript("");
    setVoiceError(null);
    setVoiceItems([]);
    setIsListening(false);
    shouldContinueListeningRef.current = false;
    recognitionRef.current = null;
  }

  function handleVoiceClose() {
    recognitionRef.current?.stop?.();
    resetVoiceState();
    setVoiceModalOpen(false);
  }

  function startVoiceRecognition() {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) {
      setVoiceError("Speech recognition is not supported in this browser.");
      setVoiceModalOpen(true);
      return;
    }
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      setIsListening(true);
      setVoiceError(null);
    };
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join(" ")
        .trim();
      const stop = /\bstop\b/gi.test(transcript);
      const cleaned = transcript.replace(/\bstop\b/gi, "").trim();
      setVoiceTranscript(cleaned);
      const items = parseVoiceTranscript(cleaned);
      setVoiceItems(items);
      if (!items.length) {
        setVoiceError(
          "Could not understand any expense item. Try saying “Groceries 200, rent 50, food 300”.",
        );
      }
      if (stop) {
        shouldContinueListeningRef.current = false;
        recognition.stop();
      }
    };
    recognition.onerror = () => {
      setVoiceError("Speech recognition failed. Please try again.");
      setIsListening(false);
      shouldContinueListeningRef.current = false;
    };
    recognition.onend = () => {
      setIsListening(false);
      if (shouldContinueListeningRef.current) {
        recognitionRef.current = null;
        startVoiceRecognition();
      }
    };
    recognitionRef.current = recognition;
    recognition.start();
  }

  function handleVoiceStart() {
    resetVoiceState();
    setVoiceModalOpen(true);
    shouldContinueListeningRef.current = true;
    startVoiceRecognition();
  }

  if (loading) {
    return <ExpensePageSkeleton />;
  }

  return (
    <section className="page expense-page">
      {/* ---------- Warm summary header ---------- */}
      <div className="expense-hero">
        <div className="hero-text">
          <p className="hero-eyebrow">This month</p>
          <h1 className="hero-amount">{formatCurrency(totalExpenses)}</h1>
          <p className="hero-sub">
            across {expenses.length}{" "}
            {expenses.length === 1 ? "entry" : "entries"}
          </p>
        </div>
        <div className="hero-actions">
          <button
            type="button"
            className="button primary"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={16} /> Add
          </button>
          <button
            type="button"
            className="button primary"
            onClick={handleVoiceStart}
          >
            <Mic size={16} /> Voice
          </button>
        </div>
      </div>

      {/* ---------- Date-grouped ledger ---------- */}
      <div className="ledger">
        {grouped.length === 0 && (
          <div className="ledger-empty">
            <span>🌱</span>
            <p>No spending yet — your jar is full.</p>
          </div>
        )}

        {grouped.map((group) => (
          <section key={group.key} className="ledger-group">
            <header className="ledger-day">
              <span className="day-label">{group.label}</span>
              <span className="day-total">−{formatCurrency(group.total)}</span>
            </header>

            <ul className="ledger-list">
              {group.items.map((item) => {
                const meta = getMeta(item.subCategory);
                return (
                  <li key={item.id} className="ledger-row">
                    <div className={`row-icon ${meta.tint}`}>{meta.emoji}</div>
                    <div className="row-main">
                      <p className="row-title">
                        {item.subCategory.replace(/\b\w/g, (c) =>
                          c.toUpperCase(),
                        )}
                      </p>
                      {item.notes && <p className="row-note">{item.notes}</p>}
                    </div>
                    <span className="row-amount">
                      −{formatCurrency(item.amount)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      {isModalOpen && (
        <Modal title="Add expense" onClose={() => setIsModalOpen(false)}>
          <ExpenseForm
            onCreate={(e) => {
              handleCreate(e);
            }}
            onClose={() => setIsModalOpen(false)}
            loading={isSubmitLoading}
          />
        </Modal>
      )}

      {voiceModalOpen && (
        <Modal title="Voice expense entry" onClose={handleVoiceClose}>
          <div className="voice-modal">
            <p className="voice-hint" style={{ color: "var(--ink)" }}>
              {isListening
                ? "Listening… say items like “groceries 200, rent 50, food 300” and say stop when done."
                : voiceError
                  ? voiceError
                  : voiceTranscript
                    ? `Transcript: ${voiceTranscript}`
                    : "Click listen and speak multiple expense items separated by commas."}
            </p>
            <div className="voice-actions">
              <button
                type="button"
                className="button secondary"
                style={{ color: "var(--ink)" }}
                onClick={handleVoiceStart}
              >
                {isListening ? "Restart listening" : "Listen"}
              </button>
              {isListening && (
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => recognitionRef.current?.stop()}
                  style={{ color: "var(--ink)" }}
                >
                  Stop
                </button>
              )}
              <button
                type="button"
                style={{ color: "var(--ink)" }}
                className="button secondary"
                onClick={handleVoiceClose}
              >
                Close
              </button>
            </div>
            {voiceItems.length > 0 && (
              <div className="voice-items">
                {voiceItems.map((item) => (
                  <div key={item.id} className="voice-item-row">
                    <div className="voice-field">
                      <label style={{ color: "var(--ink)" }}>Item</label>
                      <input
                        style={{ color: "var(--ink)" }}
                        type="text"
                        value={item.subCategory.replace(/\b\w/g, (c) =>
                          c.toUpperCase(),
                        )}
                        onChange={(e) =>
                          handleVoiceItemChange(
                            item.id,
                            "subCategory",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="voice-field">
                      <label style={{ color: "var(--ink)" }}>Amount</label>
                      <input
                        style={{ color: "var(--ink)" }}
                        type="number"
                        value={item.amount.replace(/\b\w/g, (c) =>
                          c.toUpperCase(),
                        )}
                        onChange={(e) =>
                          handleVoiceItemChange(
                            item.id,
                            "amount",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
                <div className="form-actions voice-submit-actions">
                  <Button text='Submit recognized expenses' onClick={()=>handleVoiceSubmit()} loading={isSubmitLoading}/>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </section>
  );
}
