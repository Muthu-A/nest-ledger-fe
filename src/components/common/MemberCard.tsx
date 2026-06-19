import React from "react";
import type { Member } from "../../context/AuthContext";

type Props = {
  member: any;
  isOwner?: boolean;
  onRemove?: (id: string) => void;
  onChangeRole?: (id: string, role: Member["role"]) => void;
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 24,
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

export default function MemberCard({
  member,
  isOwner,
  onRemove,
  onChangeRole,
}: Props) {
  return (
    <div style={{...styles.section,marginBottom: 10}}>
      <div style={styles.ownerCard}>
        <div style={styles.avatar}>
          {member?.userId?.name
            ? member.userId.name.charAt(0).toUpperCase()
            : member?.name?.charAt(0)}
        </div>
        <div style={styles.ownerInfo}>
          <p style={styles.ownerName}>
            {member?.userId?.name ?? member?.name}
          </p>
          <p style={styles.ownerEmail}>
            {member?.userId?.email ?? member?.email}
          </p>
        </div>
        <div style={styles.badge}>{member.role}</div>
        {isOwner && (
          <>
            <button
              className="button secondary"
              onClick={() => onRemove?.(member.id)}
            >
              Remove
            </button>
          </>
        )}
      </div>
    </div>
  );
}
