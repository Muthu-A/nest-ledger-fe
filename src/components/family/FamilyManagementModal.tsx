import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import useAuth from "../../hooks/useAuth";
import Button from "../common/Button";
import MemberCard from "../common/MemberCard";
import { useLocation, useNavigate } from "react-router-dom";
import DeleteConfirmModal from "../common/DeleteConfirmModal";
import {FamilySettingsSkeleton} from "../family/FamilySettingsSkeleton";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function FamilyManagementModal({ open, onClose }: Props) {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [members, setMembers] = useState([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const isOwner = auth.user?.id === auth.family?.ownerId;

  // useEffect(() => {
  //   setMembers(fam?.members ?? []);
  // }, [fam]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!open) return;
      setLoading(true);
      try {
        // refresh family from server to get latest members
        const response: any = await auth.refreshFamily();
        if (!mounted) return;
        setMembers(response?.members ?? []);
      } catch (err) {
        console.error("Failed to refresh family members", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [open]);

  if (!open) return null;

  const owner = members.find((m: any) => m.role === "owner") || auth.user;

  const visibleMembers = members.filter((m: any) => m.role !== "owner");

  async function handleAdd() {
    if (!newEmail) return;
    const id = `temp-${Date.now()}`;
    const member = {
      id,
      name: newName || newEmail.split("@")[0],
      email: newEmail,
      role: "viewer" as const,
    };
    setMembers((s) => [...s, member]);
    setNewName("");
    setNewEmail("");
    setAddSuccess(true);
    setTimeout(() => setAddSuccess(false), 2000);
    setShowAddForm(false);
  }

  async function handleRemove(id: string) {
    // if (!id.startsWith("temp-")) {
    setLoading(true);
    try {
      await auth.removeMember(id);
      setLoading(false);
      const response: any = await auth.refreshFamily();
      setMembers(response?.members ?? []);
      // setMembers(auth.family?.members ?? []);
    } catch (e) {
      console.log(e);
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
    // } else setMembers((s) => s.filter((m: any) => m.id !== id));
  }

  async function handleProceed() {
    setLoading(true);
    const temp = members.filter((m: any) => String(m.id).startsWith("temp-"));
    for (const m of temp) {
      try {
        await auth.inviteMember(m.email);
      } catch (err) {
        // ignore per-member errors
      }
    }
    setLoading(false);
    onClose();
    if (location.pathname === "/family/setup") navigate("/dashboard");
  }

  const styles = {
    container: {
      height:'70vh',
      maxHeight: "75vh",
      overflowY: "auto",
      paddingRight: "6px", // prevents text from touching scrollbar
      scrollbarWidth: "none", // Firefox
    },

    section: {
      display: "flex",
      flexDirection: "column" as const,
      gap: 12,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 600,
      letterSpacing: 0.5,
      textTransform: "uppercase" as const,
      color: "#6b7280",
      margin: 0,
    },
    ownerCard: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: 16,
      borderRadius: 12,
      background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
      border: "1px solid #e5e7eb",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
      transition: "all 0.2s ease",
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      fontSize: 20,
      color: "#ffffff",
      flexShrink: 0,
      boxShadow: "0 2px 8px rgba(16, 185, 129, 0.2)",
    },
    ownerInfo: {
      flex: 1,
      display: "flex",
      flexDirection: "column" as const,
      gap: 4,
    },
    ownerName: {
      fontSize: 16,
      fontWeight: 700,
      color: "#1f2937",
      margin: 0,
    },
    ownerEmail: {
      fontSize: 13,
      color: "#6b7280",
      margin: 0,
    },
    badge: {
      padding: "6px 12px",
      background: "#10b981",
      color: "#ffffff",
      borderRadius: 6,
      fontWeight: 600,
      fontSize: 11,
      letterSpacing: 0.5,
      whiteSpace: "nowrap" as const,
      boxShadow: "0 2px 4px rgba(16, 185, 129, 0.15)",
    },
    membersGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: 12,
    },
    addFormContainer: {
      display: "flex",
      flexDirection: "column" as const,
      gap: 12,
      padding: 16,
      borderRadius: 12,
      background: "#f9fafb",
      border: "1px solid #e5e7eb",
    },
    formInputs: {
      display: "flex",
      gap: 12,
      flexDirection: "column" as const,
    },
    formRow: {
      display: "flex",
      gap: 8,
      alignItems: "flex-end",
    },
    input: {
      flex: 1,
      padding: "10px 12px",
      fontSize: 14,
      border: "1px solid #d1d5db",
      borderRadius: 8,
      color: "var(--ink)",
      background: "#ffffff",
      fontFamily: "inherit",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    } as React.CSSProperties,
    inputFocus: {
      borderColor: "#10b981",
      boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.1)",
      outline: "none",
    },
    addButton: {
      flexShrink: 0,
    },
    successMessage: {
      padding: "10px 12px",
      background: "#d1fae5",
      border: "1px solid #6ee7b7",
      borderRadius: 8,
      color: "#047857",
      fontSize: 13,
      fontWeight: 500,
      animation: "slideIn 0.3s ease",
    },
    toggleAddButton: {
      padding: "10px 16px",
      fontSize: 14,
      fontWeight: 500,
      border: "1px solid #d1d5db",
      borderRadius: 8,
      background: "#ffffff",
      color: "#1f2937",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    toggleAddButtonHover: {
      borderColor: "#10b981",
      color: "#10b981",
      background: "#f0fdf4",
    },
    actionContainer: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 8,
      paddingTop: 8,
      borderTop: "1px solid #e5e7eb",
      marginTop: 8,
    },
    emptyState: {
      textAlign: "center" as const,
      padding: 24,
      color: "#6b7280",
      fontSize: 14,
    },
  };

  if (loading) {
  return (
    <Modal title="Family settings" onClose={onClose}>
      <div className="modal-scroll" style={{ height:'70vh',
      maxHeight: "75vh",
      overflowY: "auto",
      paddingRight: "6px", // prevents text from touching scrollbar
      scrollbarWidth: "none",}}>
        <FamilySettingsSkeleton />
      </div>
    </Modal>
  );
}

  return (
    <Modal title="Family settings" onClose={onClose}>
      <div style={styles.container}>
        {/* Owner Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Household Admin</h3>
          <div style={styles.ownerCard}>
            <div style={styles.avatar}>
              {owner?.userId?.name
                ? owner.userId.name.charAt(0).toUpperCase()
                : auth.user?.name?.charAt(0)}
            </div>
            <div style={styles.ownerInfo}>
              <p style={styles.ownerName}>
                {owner?.userId?.name ?? auth.user?.name}
              </p>
              <p style={styles.ownerEmail}>
                {owner?.userId?.email ?? auth.user?.email}
              </p>
            </div>
            <div style={styles.badge}>Owner</div>
          </div>
        </div>

        {/* Members Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>
            Household members ({visibleMembers.length})
          </h3>
          {visibleMembers.length > 0 ? (
            <div>
              {visibleMembers.map((m: any) => (
                <MemberCard
                  key={m.id}
                  member={m}
                  isOwner={auth.user.id === auth.family?.ownerId}
                  onRemove={(id) => {
                    setShowDeleteModal(true);
                    setDeleteId(id);
                  }}
                />
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              No family members yet. Add someone to share this account.
            </div>
          )}
        </div>

        {showDeleteModal && (
          <DeleteConfirmModal
            title={"Delete User"}
            description={"User"}
            onClose={() => {
              setShowDeleteModal(false);
              setDeleteId(null);
            }}
            handleSubmit={() => handleRemove(deleteId as string)}
          />
        )}

        {/* Add Member Section */}
        {isOwner && (
          <div style={styles.section}>
            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                style={styles.toggleAddButton}
                onMouseEnter={(e) => {
                  Object.assign(
                    e.currentTarget.style,
                    styles.toggleAddButtonHover,
                  );
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#d1d5db";
                  e.currentTarget.style.color = "#1f2937";
                  e.currentTarget.style.background = "#ffffff";
                }}
              >
                + Add family member
              </button>
            ) : (
              <div style={styles.addFormContainer}>
                <div style={styles.formInputs}>
                  <input
                    placeholder="Full name (optional)"
                    style={{
                      ...styles.input,
                    }}
                    type="text"
                    value={newName}
                    onChange={(event) => setNewName(event.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAdd();
                      }
                    }}
                  />
                  <input
                    placeholder="Email address"
                    style={{
                      ...styles.input,
                    }}
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAdd();
                      }
                    }}
                  />
                </div>

                {addSuccess && (
                  <div style={styles.successMessage}>
                    ✓ Member added. They'll be invited after you finish.
                  </div>
                )}

                <div style={styles.formRow}>
                  <button
                    onClick={() => setShowAddForm(false)}
                    style={{
                      ...styles.toggleAddButton,
                      flex: 1,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f3f4f6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#ffffff";
                    }}
                  >
                    Cancel
                  </button>
                  <div style={styles.addButton}>
                    <Button
                      text="Add member"
                      onClick={() => handleAdd()}
                      loading={loading}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {isOwner && (
          <div style={styles.actionContainer}>
            <Button
              text={
                location.pathname === "/family/setup"
                  ? "Proceed to dashboard"
                  : "Save changes"
              }
              onClick={handleProceed as any}
              // loading={loading}
            />
          </div>
        )}
      </div>
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
          outline: none;
        }
      `}</style>
    </Modal>
  );
}
