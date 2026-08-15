"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import nookies from "nookies";
import { toast } from "sonner";
import { logout } from "@/lib/store/slices/authSlice";
import { signOut } from "@/lib/auth/api";
import { AUTH_COOKIE_NAME } from "@/lib/auth/routes";

const IDLE_TIMEOUT_MS = 15 * 60 * 1000;
const WARNING_BEFORE_MS = 60 * 1000;
const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "click"] as const;
const ACTIVITY_WRITE_THROTTLE_MS = 1000;
const POLL_INTERVAL_MS = 1000;
const STORAGE_KEY = "ekobuja_admin_last_activity_at";

export function useIdleLogout() {
  const dispatch = useDispatch();
  const router = useRouter();
  const authToken = useSelector((state: { auth: { authToken: string | null } }) => state.auth.authToken);

  const [showWarning, setShowWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  const lastActivityRef = useRef(Date.now());
  const lastWriteRef = useRef(0);
  const loggedOutRef = useRef(false);

  const markActive = useCallback((broadcast = true) => {
    const now = Date.now();
    lastActivityRef.current = now;
    setShowWarning(false);

    if (broadcast && now - lastWriteRef.current > ACTIVITY_WRITE_THROTTLE_MS) {
      lastWriteRef.current = now;
      try {
        localStorage.setItem(STORAGE_KEY, String(now));
      } catch {
        // localStorage unavailable (private mode etc.) — cross-tab sync degrades gracefully.
      }
    }
  }, []);

  const stayLoggedIn = useCallback(() => {
    markActive();
  }, [markActive]);

  useEffect(() => {
    if (!authToken) return;

    loggedOutRef.current = false;
    markActive(true);

    const handleActivity = () => markActive(true);
    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, handleActivity, { passive: true }));

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      const otherTabActivity = Number(event.newValue);
      if (otherTabActivity > lastActivityRef.current) {
        lastActivityRef.current = otherTabActivity;
        setShowWarning(false);
      }
    };
    window.addEventListener("storage", handleStorage);

    const interval = setInterval(async () => {
      if (loggedOutRef.current) return;

      const elapsed = Date.now() - lastActivityRef.current;
      const remainingMs = IDLE_TIMEOUT_MS - elapsed;

      if (remainingMs <= 0) {
        loggedOutRef.current = true;
        setShowWarning(false);

        try {
          await signOut();
        } catch {
          // Clear local session even if sign-out request fails
        } finally {
          dispatch(logout());
          nookies.destroy(null, AUTH_COOKIE_NAME, { path: "/" });
          toast.info("You were logged out due to inactivity.");
          router.push("/login");
        }
        return;
      }

      if (remainingMs <= WARNING_BEFORE_MS) {
        setShowWarning(true);
        setSecondsRemaining(Math.ceil(remainingMs / 1000));
      }
    }, POLL_INTERVAL_MS);

    return () => {
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, handleActivity));
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, [authToken, dispatch, router, markActive]);

  return { showWarning, secondsRemaining, stayLoggedIn };
}

export default useIdleLogout;
