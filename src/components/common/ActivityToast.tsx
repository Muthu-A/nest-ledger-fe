import React, { useEffect, useRef, useState } from "react";
import { useRealtime } from "../../context/RealtimeContext";
import useAuth from "../../hooks/useAuth";

function playBeep() {
  try {
    const AudioCtx =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 900;
    o.connect(g);
    g.connect(ctx.destination);
    g.gain.value = 0.0001;
    const now = ctx.currentTime;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
    o.start(now);
    g.gain.exponentialRampToValueAtTime(0.00001, now + 0.6);
    o.stop(now + 0.65);
  } catch (e) {
    // ignore audio errors
  }
}

const activityStyles = {
  income: {
    icon: "💰",
    color: "#22c55e",
  },
  expense: {
    icon: "💸",
    color: "#ef4444",
  },
  budget: {
    icon: "📊",
    color: "#3b82f6",
  },
  goal: {
    icon: "🎯",
    color: "#f59e0b",
  },
  default: {
    icon: "🔔",
    color: "#6366f1",
  },
};

export default function ActivityToast() {
  const { activities } = useRealtime();
  console.log("activities", activities);
  const { user } = useAuth();
  console.log("user", user);

  const seenRef = useRef(new Set<string>());
  const queueRef = useRef<any[]>([]);
  const [current, setCurrent] = useState<any | null>(null);
  const timerRef = useRef<number | null>(null);
  // removed unused seenPairRef

  useEffect(() => {
    if (!activities || activities.length === 0) return;
    const currentUserId = user?.id;
    // enqueue new activities in order; handle items without `id` by using a fingerprint
    for (const a of activities) {
      // skip activities created by current user (if event includes actor/user info)
      const actorId = a?.actor?.id ?? a?.actorId ?? a?.userId ?? null
      if (actorId && currentUserId && String(actorId) === String(currentUserId)) continue
      try {
        const fingerprint = JSON.stringify(a);
        if (!seenRef.current.has(fingerprint)) {
          seenRef.current.add(fingerprint);
          queueRef.current.push(a);
        }
      } catch (e) {
        // fallback: if serialization fails, attempt to use message/meta keys
        const key =
          a?.id ??
          a?._id ??
          a?.meta?.incomeId ??
          a?.message ??
          String(Math.random());
        if (!seenRef.current.has(key)) {
          seenRef.current.add(key);
          queueRef.current.push(a);
        }
      }
    }

    // if nothing is showing, start next
    if (!current && queueRef.current.length > 0) {
      showNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities]);

  function showNext() {
    const next = queueRef.current.shift();
    if (!next) {
      setCurrent(null);
      return;
    }
    setCurrent(next);
    // play beep
    playBeep();
    // auto-hide after 3500ms
    timerRef.current = window.setTimeout(() => {
      setCurrent(null);
      timerRef.current = null;
      // show further items after brief gap
      setTimeout(() => {
        if (queueRef.current.length > 0) showNext();
      }, 150);
    }, 3500);
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!current) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 18,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1600,
      }}
    >
      <div
        style={{
          minWidth: 320,
          maxWidth: 720,
          background: "rgba(20,20,20,0.96)",
          color: "#fff",
          padding: "12px 16px",
          borderRadius: 8,
          boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
          display: "flex",
          gap: 12,
          alignItems: "center",
          fontSize: 14,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: "rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}
        >
          🔔
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600 }}>
            {current?.message ?? current?.title ?? "Activity"}
          </div>
          {current?.meta?.type && (
            <div style={{ opacity: 0.85, marginTop: 6, fontSize: 13 }}>
              {current?.meta?.type}
            </div>
          )}
        </div>

        <button
          aria-label="Dismiss activity"
          onClick={() => {
            if (timerRef.current) clearTimeout(timerRef.current);
            setCurrent(null);
            setTimeout(() => {
              if (queueRef.current.length > 0) showNext();
            }, 150);
          }}
          style={{
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.8)",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
