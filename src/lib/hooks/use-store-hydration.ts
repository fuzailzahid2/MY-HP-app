"use client";

import { useState, useEffect } from "react";

/**
 * Returns false on server and first client render (before hydration),
 * then true once the client has mounted and Zustand stores have
 * rehydrated from localStorage.  Use this to gate UI that depends
 * on persisted store values so the server and first-paint markup match.
 */
export function useStoreHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
