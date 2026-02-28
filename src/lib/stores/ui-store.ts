import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  selectedRigId: string;
  toggleSidebar: () => void;
  setSidebarMobileOpen: (open: boolean) => void;
  setSelectedRigId: (rigId: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      sidebarMobileOpen: false,
      selectedRigId: "rig-alpha",
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarMobileOpen: (open) => set({ sidebarMobileOpen: open }),
      setSelectedRigId: (rigId) => set({ selectedRigId: rigId }),
    }),
    {
      name: "myhp-ui-store",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        selectedRigId: state.selectedRigId,
      }),
    }
  )
);
