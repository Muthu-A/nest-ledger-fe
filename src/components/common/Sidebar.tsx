import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  HandCoins,
  Receipt,
  PieChart,
  GoalIcon
} from 'lucide-react'
import { LogOut } from 'lucide-react'

import logo from '../../assets/nestledger_logo.svg'
import useAuth from '../../hooks/useAuth'

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Income', to: '/income', icon: HandCoins },
  { label: 'Goals', to: '/goals', icon: GoalIcon },
  { label: 'Budget', to: '/budget', icon: PieChart },
  { label: 'Expenses', to: '/expenses', icon: Receipt },
  { label: 'Reports', to: '/reports', icon: PieChart },
]

export default function Sidebar() {
  const auth = useAuth()
  return (
    <aside className="sidebar">
      <div
        className="sidebar-brand"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <img
          src={logo}
          alt="NestLedger Logo"
          width="772px"
          height="72"
          className="brand-logo"
        />
      </div>

      <nav>
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              <Icon className="nav-icon" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <button
        aria-label="Logout"
        onClick={() => auth.logout()}
        style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          background: 'transparent',
          border: 'none',
          color: '#dc2626',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
          fontWeight: 600,
          justifyContent: 'flex-start',
          padding: 0,
        }}
      >
        <LogOut />
        <span>Logout</span>
      </button>
    </aside>
  )
}