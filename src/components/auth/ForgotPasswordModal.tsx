import React, { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { authService } from "../../services/authService";

export default function ForgotPasswordModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  if (!open) return null;

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    setMessage(null);
    if (password !== confirm) return setMessage("Passwords do not match");
    setLoading(true);
    try {
      // calling reset without token as requested (backend must accept this flow)
      await authService.reset(email, password);
      setMessage("Password updated");
      setTimeout(onClose, 800);
    } catch (err: any) {
      setMessage(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Reset password" onClose={onClose}>
      {message && <p className="text-sm text-muted">{message}</p>}

      <form onSubmit={submit} className="page-form">
        <div className="form-grid">
          <label style={{ color: "var(--ink)" }}>Email</label>
          <input
            style={{ color: "var(--ink)" }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label style={{ color: "var(--ink)" }}>
            New password
            <input
              type="password"
              style={{ color: "var(--ink)" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label style={{ color: "var(--ink)" }}>
            Confirm password
            <input
              type="password"
              style={{ color: "var(--ink)" }}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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
          <Button
            text="Reset password"
            onClick={submit as any}
            loading={loading}
          />
        </div>
      </form>
    </Modal>
  );
}
