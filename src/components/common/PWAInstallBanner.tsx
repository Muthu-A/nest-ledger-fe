import { Download, X } from "lucide-react";

interface Props {
  onInstall: () => void;
  onDismiss: () => void;
}

export default function PWAInstallBanner({
  onInstall,
  onDismiss,
}: Props) {
  return (
    <div
      style={{
        width: "100%",
        background: "linear-gradient(90deg,#e8fff2,#d7fce8)",
        borderBottom: "1px solid #b7efcf",
        padding: "12px 22px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        animation: "slideDown .35s ease",
        zIndex: 999,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 15,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: "#1c3829",
            color: "#4ade80",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Download size={20} />
        </div>

        <div>
          <div
            style={{
              fontWeight: 700,
              color: "#1c3829",
              fontSize: 15,
            }}
          >
            Install Nest Ledger
          </div>

          <div
            style={{
              color: "#4b5563",
              fontSize: 13,
              marginTop: 2,
            }}
          >
            Faster access • Offline support • Push notifications
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <button
          onClick={onDismiss}
          style={{
            border: "none",
            background: "transparent",
            color: "#64748b",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Later
        </button>

        <button
          onClick={onInstall}
          style={{
            background: "#16a34a",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Download size={16} />
          Install App
        </button>

        <button
          onClick={onDismiss}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#64748b",
          }}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}