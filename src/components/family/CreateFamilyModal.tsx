import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
// Parent will open FamilyManagementModal after successful creation via `onCreated`
import Button from "../common/Button";
import Modal from "../common/Modal";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: (familyId?: string) => void;
};

export default function CreateFamilyModal({ open, onClose, onCreated }: Props) {
  const auth = useAuth();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const id = await auth.createFamily(name);
      console.log('[CreateFamilyModal] created family id:', id)
      // close current modal first, then notify parent to open management modal
      onClose();
      setTimeout(() => onCreated?.(id || undefined), 50)
    } catch (err: any) {
      setError(err?.message || "Failed to create family");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Create Your Family" onClose={onClose}>
      {error && <p className="text-sm text-muted">{error}</p>}

      <form onSubmit={handleSubmit} className="page-form" style={{marginTop:'-20px'}}>
        <div className="form-grid">
          <label style={{ color: "var(--ink)" }}>Family name</label>
          <input
            style={{ color: "var(--ink)" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end'}}>
          <Button
            text="Create family"
            onClick={handleSubmit as any}
            loading={loading}
          />
        </div>
      </form>
      {/* Management modal is opened by parent via onCreated callback */}
    </Modal>
  );
}
