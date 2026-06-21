import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from '../../hooks/useAuth'

export default function Header({ onMenuClick }: any) {
  const auth = useAuth()

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="menu-btn"
          onClick={onMenuClick}
          aria-label="Open Menu"
        >
          <Menu size={24} />
        </button>

        <Link
          to="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
          }}
        >
          <span
            style={{
              fontSize: "1.1rem",
              fontWeight: "800",
              color: "#4ade80",
              letterSpacing: "-1px",
              fontFamily: "monospace",
            }}
          >
            [NL]
          </span>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1px",
            }}
          >
            <span
              style={{
                fontSize: "1.2rem",
                fontWeight: "800",
                color: "#1c3829",
                letterSpacing: "-0.5px",
                lineHeight: 1.1,
              }}
            >
              Nest<span style={{ color: "#16a34a" }}>Ledger</span>
            </span>

            <span
              className="header-subtitle"
              style={{
                fontSize: "0.62rem",
                fontWeight: "600",
                color: "#16a34a",
                letterSpacing: "2.8px",
                textTransform: "uppercase",
              }}
            >
              Family Budget Tracker
            </span>
          </div>
        </Link>
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        
        {auth.user && (
          <button onClick={() => auth.openFamilyManagement()} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <div style={{ width: 36, height: 36,color: "#4ade80", borderRadius: 18, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {auth.user.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ fontWeight: 700 ,color: "#4ade80"}}>{auth.user.name}</div>
              <div style={{ fontSize: 12, color: '#666' }}>{auth.user.email}</div>
            </div>
          </button>
        )}
      </div>

      {/* Family management modal is rendered at layout level */}
    </header>
  )
}