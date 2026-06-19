import { Outlet } from "react-router-dom";
import { useState } from "react";

import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import MobileNav from "../components/common/MobileNav";
import FamilyManagementModal from '../components/family/FamilyManagementModal'
import useAuth from '../hooks/useAuth'
import { MonthProvider } from '../context/MonthContext'

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const auth = useAuth()

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main">
        <Header
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        <MonthProvider>
          <main className="app-content">
            <Outlet />
          </main>
          {/* render family management modal at top-level so it overlays the whole screen */}
          <FamilyManagementModal open={auth.showFamilyMgmt} onClose={() => auth.closeFamilyManagement()} />

          <MobileNav
            open={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          />
        </MonthProvider>
      </div>
    </div>
  );
}