"use client";

import React, { useEffect, useState } from "react";
import { WifiOff, Download, RefreshCw, X, ShieldCheck } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaManager() {
  const [isOnline, setIsOnline] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // 1. Online / Offline status tracking
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // 2. Service Worker Registration
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            reg.addEventListener("updatefound", () => {
              const newWorker = reg.installing;
              if (newWorker) {
                newWorker.addEventListener("statechange", () => {
                  if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                    setHasUpdate(true);
                  }
                });
              }
            });
          })
          .catch((err) => {
            console.info("PWA SW registration note:", err.message);
          });
      }

      // 3. BeforeInstallPrompt handling
      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        setInstallPrompt(e as BeforeInstallPromptEvent);
        setShowInstallBanner(true);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstall);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === "accepted") {
        setShowInstallBanner(false);
      }
      setInstallPrompt(null);
    } else {
      setShowInstructions(true);
    }
  };

  const handleReloadUpdate = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <>
      {/* Offline Alert Banner */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-zinc-950 px-4 py-2 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg">
          <WifiOff className="w-4 h-4 animate-bounce" />
          <span>You are currently offline. Safe cached pages remain accessible. Any new bookings will sync once reconnected.</span>
        </div>
      )}

      {/* New Version Update Banner */}
      {hasUpdate && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-electric-600 text-white p-4 rounded-xl shadow-2xl border border-electric-400 flex items-center gap-4 max-w-md animate-pulse">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <div className="text-sm">
            <p className="font-bold">New Version Available</p>
            <p className="text-xs text-electric-100">JK Washing Center was updated with performance improvements.</p>
          </div>
          <button
            onClick={handleReloadUpdate}
            className="px-3 py-1.5 bg-white text-electric-700 font-bold text-xs rounded-lg hover:bg-slate-100 transition"
          >
            Update
          </button>
        </div>
      )}

      {/* PWA Install Banner */}
      {showInstallBanner && (
        <div className="fixed bottom-20 md:bottom-6 left-6 z-40 bg-zinc-900/95 text-white p-4 rounded-2xl shadow-2xl border border-electric-500/40 backdrop-blur-md max-w-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-electric-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-electric-500/30">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white truncate">Install JK Washing App</h4>
            <p className="text-xs text-zinc-400">Add to home screen for faster booking &amp; offline access.</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 bg-electric-500 hover:bg-electric-600 text-white text-xs font-semibold rounded-lg transition shadow"
            >
              Install
            </button>
            <button
              onClick={() => setShowInstallBanner(false)}
              className="p-1 text-zinc-400 hover:text-white transition"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Manual Install Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-electric-400 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-electric-400" />
                How to Install PWA
              </h3>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 text-sm text-zinc-300">
              <div className="p-3 bg-zinc-800/60 rounded-xl">
                <p className="font-semibold text-white mb-1">On Google Chrome / Edge (Desktop):</p>
                <p className="text-xs">Click the install icon in the URL search bar, or go to Menu (⋮) &gt; &quot;Install JK Washing Center&quot;.</p>
              </div>
              <div className="p-3 bg-zinc-800/60 rounded-xl">
                <p className="font-semibold text-white mb-1">On Android (Chrome):</p>
                <p className="text-xs">Tap the top-right menu (⋮) and select &quot;Add to Home screen&quot; or &quot;Install app&quot;.</p>
              </div>
              <div className="p-3 bg-zinc-800/60 rounded-xl">
                <p className="font-semibold text-white mb-1">On iPhone / iPad (Safari):</p>
                <p className="text-xs">Tap the Share button (square with arrow pointing up) and select &quot;Add to Home Screen&quot;.</p>
              </div>
            </div>
            <button
              onClick={() => setShowInstructions(false)}
              className="mt-6 w-full py-2.5 bg-electric-600 hover:bg-electric-500 rounded-xl font-semibold text-sm transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
