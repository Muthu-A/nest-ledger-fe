import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function JoinFamilyModal({ open, onClose }: Props) {
  const auth = useAuth();
  const navigate = useNavigate()
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await auth.joinFamily(code);
      onClose();
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.message || "Failed to join family");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Join a Family" onClose={onClose}>
      {error && <p className="text-sm text-muted">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="page-form"
        style={{ marginTop: "-20px" }}
      >
        <div className="form-grid">
          <label style={{ color: "var(--ink)" }}>Invitation code</label>
          <input
            style={{ color: "var(--ink)" }}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <div
          style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            text="Join family"
            onClick={handleSubmit as any}
            loading={loading}
          />
        </div>
      </form>
    </Modal>
  );
}
