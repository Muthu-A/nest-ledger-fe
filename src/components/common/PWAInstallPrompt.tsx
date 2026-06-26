import { useEffect, useState } from "react";
import { Download, RefreshCcw, Smartphone, X } from "lucide-react";
import { updateSW } from "../../main";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];

  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;

  prompt(): Promise<void>;
}

const DISMISS_KEY = "nl-pwa-dismiss-until";
const DISMISS_DAYS = 3;

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [showInstall, setShowInstall] = useState(false);

  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone;

    if (standalone) return;

    const beforeInstall = (event: Event) => {
      event.preventDefault();

      const dismissedUntil = Number(localStorage.getItem(DISMISS_KEY) || 0);

      if (Date.now() < dismissedUntil) return;

      setDeferredPrompt(event as BeforeInstallPromptEvent);

      setShowInstall(true);
    };

    const installed = () => {
      setDeferredPrompt(null);
      setShowInstall(false);

      localStorage.removeItem(DISMISS_KEY);

      console.log("Nest Ledger installed.");
    };

    const updateListener = () => {
      setUpdateAvailable(true);
    };

    window.addEventListener("beforeinstallprompt", beforeInstall);

    window.addEventListener("appinstalled", installed);

    window.addEventListener("pwa-update-available", updateListener);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstall);

      window.removeEventListener("appinstalled", installed);

      window.removeEventListener("pwa-update-available", updateListener);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();

    const result = await deferredPrompt.userChoice;

    if (result.outcome === "accepted") {
      setDeferredPrompt(null);
      setShowInstall(false);

      localStorage.removeItem(DISMISS_KEY);
    } else {
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    const nextPrompt = Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000;

    localStorage.setItem(DISMISS_KEY, String(nextPrompt));

    setShowInstall(false);
  };

  const handleUpdate = async () => {
    await updateSW(true);
  };

  if (updateAvailable) {
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
              New Version Available
            </div>

            <div
              style={{
                color: "#4b5563",
                fontSize: 13,
                marginTop: 2,
              }}
            >
              A newer version of Nest Ledger is ready.
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
            onClick={handleUpdate}
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
            Update
          </button>
        </div>
      </div>

      //   <div className="fixed bottom-5 left-1/2 z-[9999] w-[95%] max-w-xl -translate-x-1/2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white shadow-2xl">
      //     <div className="flex items-center gap-4">
      //       <RefreshCcw size={26} />

      //       <div className="flex-1">
      //         <h3 className="font-semibold text-lg">
      //           New Version Available
      //         </h3>

      //         <p className="text-sm opacity-90">
      //           A newer version of Nest Ledger is ready.
      //         </p>
      //       </div>

      //       <button
      //         onClick={handleUpdate}
      //         className="rounded-lg bg-white px-4 py-2 font-semibold text-blue-700 transition hover:scale-105"
      //       >
      //         Update
      //       </button>
      //     </div>
      //   </div>
    );
  }

  if (!showInstall || !deferredPrompt) return null;

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
          onClick={handleDismiss}
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
          onClick={handleInstall}
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
          onClick={handleDismiss}
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
    // <div className="fixed bottom-5 left-1/2 z-[9999] w-[95%] max-w-xl -translate-x-1/2 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 p-5 text-white shadow-2xl">

    //   <button
    //     onClick={handleDismiss}
    //     className="absolute right-3 top-3 rounded-full p-1 hover:bg-white/20"
    //   >
    //     <X size={18} />
    //   </button>

    //   <div className="flex items-center gap-4">

    //     <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20">
    //       <Smartphone size={28} />
    //     </div>

    //     <div className="flex-1">
    //       <h3 className="text-lg font-semibold">
    //         Install Nest Ledger
    //       </h3>

    //       <p className="mt-1 text-sm text-green-100">
    //         Install Nest Ledger for faster access, offline support
    //         and instant push notifications.
    //       </p>
    //     </div>
    //   </div>

    //   <div className="mt-5 flex justify-end gap-3">

    //     <button
    //       onClick={handleDismiss}
    //       className="rounded-lg border border-white/30 px-4 py-2 transition hover:bg-white/10"
    //     >
    //       Later
    //     </button>

    //     <button
    //       onClick={handleInstall}
    //       className="flex items-center gap-2 rounded-lg bg-white px-5 py-2 font-semibold text-green-700 transition hover:scale-105"
    //     >
    //       <Download size={18} />
    //       Install
    //     </button>

    //   </div>

    // </div>
  );
}
