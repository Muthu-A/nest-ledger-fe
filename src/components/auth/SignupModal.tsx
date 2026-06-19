import React, { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import useAuth from "../../hooks/useAuth";

export default function SignupModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const auth = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    if (password !== confirm) return setError("Passwords do not match");
    try {
      await auth.signup(name, email, password);
      onClose();
    } catch (err: any) {
      setError(err.message || "Signup failed");
    }
  }

  return (
    <Modal title="Create Your Account" onClose={onClose}>
      {error && <p className="text-sm text-muted">{error}</p>}

      <form onSubmit={submit} className="page-form">
        <div className="form-grid">
          <label style={{ color: "var(--ink)" }}>Name</label>
          <input
            style={{ color: "var(--ink)" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label style={{ color: "var(--ink)" }}>Email</label>
          <input
            style={{ color: "var(--ink)" }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label style={{ color: "var(--ink)" }}>Password</label>
          <input
            style={{ color: "var(--ink)" }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label style={{ color: "var(--ink)" }}>Confirm</label>
          <input
            style={{ color: "var(--ink)" }}
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
        <div className="flex justify-end" style={{ marginTop: 16 }}>
          <Button
            text="Create account"
            onClick={submit as any}
            loading={auth.loading}
          />
        </div>
      </form>
    </Modal>
  );
}
