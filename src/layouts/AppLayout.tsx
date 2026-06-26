import { Outlet } from "react-router-dom";
import { useRef, useState } from "react";

import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import MobileNav from "../components/common/MobileNav";
import FamilyManagementModal from '../components/family/FamilyManagementModal'
import useAuth from '../hooks/useAuth'
import { MonthProvider } from '../context/MonthContext'
import { useState as useLocalState } from 'react'
import { Mic } from 'lucide-react'
// import VoiceAssistant from '../components/voice/VoiceAssistant'
import ActivityToast from '../components/common/ActivityToast'
import { useRealtime } from '../context/RealtimeContext'
import { handleParsedVoiceCommands } from '../utils/voiceCommandHandler'

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useLocalState(false)
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      return localStorage.getItem('notification-sound-enabled') === 'true'
    } catch {
      return false
    }
  })
  const audioContextRef = useRef<any>(null)
  const auth = useAuth()
  const realtime = useRealtime()

  const enableSound = async () => {
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        const ctx = new AudioCtx()
        audioContextRef.current = ctx
        if (ctx.state === 'suspended') {
          await ctx.resume()
        }
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        gain.gain.value = 0
        osc.start()
        osc.stop(ctx.currentTime + 0.01)
      }
      localStorage.setItem('notification-sound-enabled', 'true')
      setSoundEnabled(true)
    } catch (e) {
      console.warn('Failed to unlock audio:', e)
      setSoundEnabled(true)
    }
  }

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main">
        <ActivityToast soundEnabled={soundEnabled} />
        <Header
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        <MonthProvider>
          <main className="app-content">
            <Outlet />
          </main>
          {/* Global floating voice button */}
          {!soundEnabled && (
            <button
              aria-label="Enable notification sound"
              onClick={enableSound}
              style={{
                position: 'fixed',
                right: 24,
                bottom: 96,
                padding: '10px 16px',
                borderRadius: 999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--primary, #3b82f6)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                zIndex: 1200,
                boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
              }}
            >
              Enable sound
            </button>
          )}

          {/* <button
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
          </button> */}

          {/* <VoiceAssistant
            open={voiceOpen}
            onClose={() => setVoiceOpen(false)}
            onConfirmParsed={async (parsed) => {
              try {
                await handleParsedVoiceCommands(parsed)
                try {
                  realtime.addActivity({ message: 'Voice command executed', meta: { type: 'default', parsed } })
                } catch (e) {
                  // ignore activity push failures
                }
              } catch (error) {
                console.error('Voice command processing failed', error)
              }
            }}
          /> */}
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