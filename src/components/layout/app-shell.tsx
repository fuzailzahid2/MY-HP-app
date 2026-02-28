"use client";

import * as React from "react";
import { useUIStore } from "@/lib/stores/ui-store";
import { useStoreHydration } from "@/lib/hooks/use-store-hydration";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const hydrated = useStoreHydration();
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
  const sidebarMobileOpen = useUIStore((s) => s.sidebarMobileOpen);
  const setSidebarMobileOpen = useUIStore((s) => s.setSidebarMobileOpen);

  // Prevent rendering until Zustand stores have rehydrated from localStorage
  // to avoid React hydration mismatches between server and client
  if (!hydrated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F5F5F5]">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-screen w-full overflow-hidden bg-[#F5F5F5]">
        {/* Desktop sidebar — always visible on md+ */}
        <div className="hidden md:flex flex-col shrink-0 h-full">
          <Sidebar />
        </div>

        {/* Mobile sidebar — rendered inside a Sheet overlay */}
        <Sheet open={sidebarMobileOpen} onOpenChange={setSidebarMobileOpen}>
          <SheetContent
            side="left"
            className="p-0 w-64 border-0 bg-slate-900"
            aria-label="Navigation menu"
          >
            <Sidebar className="h-full w-full" />
          </SheetContent>
        </Sheet>

        {/* Main content column */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          {/* Fixed header */}
          <Header />

          {/* Scrollable page content */}
          <main className="flex-1 overflow-y-auto">
            <div className="min-h-full p-4 md:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
