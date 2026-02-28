import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserRole, Department } from "@/lib/types/index";

// Re-export for convenience so other modules import from one place
export type { User, UserRole, Department };

interface UserState {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
}

const defaultUser: User = {
  id: "usr-rm-001",
  name: "Emma Richards",
  initials: "ER",
  email: "emma.richards@myhp.com",
  role: "rig_manager",
  department: "rig_operations",
  rigAssignment: "rig-alpha",
  avatarColor: "#1E3A5F",
  jobTitle: "Rig Manager",
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: defaultUser,
      setCurrentUser: (user) => set({ currentUser: user }),
    }),
    {
      name: "myhp-user-store",
    }
  )
);
