import {
  LayoutDashboard,
  HandCoins,
  Receipt,
  PieChart,
  GoalIcon,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/nestledger_logo.svg";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Income", to: "/income", icon: HandCoins },
  { label: "Goals", to: "/goals", icon: GoalIcon },
  { label: "Budget", to: "/budget", icon: PieChart },
  { label: "Expenses", to: "/expenses", icon: Receipt },
  { label: "Reports", to: "/reports", icon: PieChart },
];

export default function MobileSidebar({ open, onClose }: any) {
  if (!open) return null;

  return (
    <>
      <div className="sidebar-overlay" onClick={onClose} />

      <aside className="mobile-sidebar">
        <div className="mobile-sidebar-header">
          <img
            src={logo}
            alt="NestLedger Logo"
            width="772px"
            height="72"
            className="brand-logo"
          />
          <div style={{ marginLeft: "-60px" }}>
            <button
              style={{ color: "var(--ink)" }}
              className="close-btn"
              onClick={onClose}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  isActive ? "mobile-nav-link active" : "mobile-nav-link"
                }
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
