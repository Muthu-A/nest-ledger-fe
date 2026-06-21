import { Outlet } from "react-router-dom";
import { useState } from "react";

import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import MobileNav from "../components/common/MobileNav";
import FamilyManagementModal from '../components/family/FamilyManagementModal'
import useAuth from '../hooks/useAuth'
import { MonthProvider } from '../context/MonthContext'
import { useState as useLocalState } from 'react'
import { Mic } from 'lucide-react'
import VoiceAssistant from '../components/voice/VoiceAssistant'
import ActivityToast from '../components/common/ActivityToast'

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useLocalState(false)
  const auth = useAuth()

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main">
        <ActivityToast />
        <Header
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        <MonthProvider>
          <main className="app-content">
            <Outlet />
          </main>
          {/* Global floating voice button */}
          <button
            aria-label="Open voice assistant"
            onClick={() => setVoiceOpen(true)}
            style={{
              position: 'fixed',
              right: 24,
              bottom: 24,
              width: 56,
              height: 56,
              borderRadius: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--primary, #c8553d)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              zIndex: 1200,
              boxShadow: '0 6px 20px rgba(0,0,0,0.12)'
            }}
          >
            <Mic size={20} />
          </button>

          <VoiceAssistant open={voiceOpen} onClose={() => setVoiceOpen(false)} />
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