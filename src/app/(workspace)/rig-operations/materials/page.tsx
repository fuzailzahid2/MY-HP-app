"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/data-table";
import { TabNavigation } from "@/components/shared/tab-navigation";
import {
  INVENTORY_ITEMS,
  MATERIAL_ALLOCATIONS,
  MATERIAL_ORDERS,
} from "@/lib/dummy-data";
import { InventoryItem, ItemCategory, StockStatus } from "@/lib/dummy-data";
import type { MaterialAllocation, MaterialOrder, AllocationStatus, OrderStatus } from "@/lib/types/index";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Package, Users, ShoppingCart, Search } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const CURRENT_RIG_ID = "AD-201";
const CURRENT_RIG_NAME = "Rig Alpha";

// ─── Utility helpers ──────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: number | string;
  color: string;
  bg: string;
  border: string;
}

function KpiCard({ label, value, color, bg, border }: KpiCardProps) {
  return (
    <div className={cn("rounded-lg border px-4 py-3", bg, border)}>
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <p className={cn("text-2xl font-bold mt-0.5", color)}>{value}</p>
    </div>
  );
}

// =============================================================================
// TAB 1: INVENTORY
// =============================================================================

const ALL_CATEGORIES: { label: string; value: string }[] = [
  { label: "All Categories", value: "all" },
  { label: "PPE", value: "ppe" },
  { label: "Safety Equipment", value: "safety_equipment" },
  { label: "Spares — Mechanical", value: "spares_mechanical" },
  { label: "Spares — Electrical", value: "spares_electrical" },
  { label: "Spares — Well Control", value: "spares_well_control" },
  { label: "Capital Goods", value: "capital_goods" },
  { label: "Drill String", value: "drill_string" },
  { label: "Tubular Goods", value: "tubular_goods" },
  { label: "Tools — Hand", value: "tools_hand" },
  { label: "Tools — Power", value: "tools_power" },
  { label: "Mud Chemicals", value: "mud_chemicals" },
  { label: "Cement Chemicals", value: "cement_chemicals" },
  { label: "Consumables", value: "consumables" },
];

const CATEGORY_LABEL_MAP: Record<string, string> = {
  ppe: "PPE",
  safety_equipment: "Safety Equipment",
  spares_mechanical: "Spares — Mechanical",
  spares_electrical: "Spares — Electrical",
  spares_well_control: "Spares — Well Control",
  capital_goods: "Capital Goods",
  drill_string: "Drill String",
  tubular_goods: "Tubular Goods",
  tools_hand: "Tools — Hand",
  tools_power: "Tools — Power",
  mud_chemicals: "Mud Chemicals",
  cement_chemicals: "Cement Chemicals",
  consumables: "Consumables",
};

const CATEGORY_COLORS: Record<string, { color: string; bg: string }> = {
  ppe: { color: "text-blue-700", bg: "bg-blue-50" },
  safety_equipment: { color: "text-violet-700", bg: "bg-violet-50" },
  spares_mechanical: { color: "text-orange-700", bg: "bg-orange-50" },
  spares_electrical: { color: "text-yellow-700", bg: "bg-yellow-50" },
  spares_well_control: { color: "text-red-700", bg: "bg-red-50" },
  capital_goods: { color: "text-slate-700", bg: "bg-slate-50" },
  drill_string: { color: "text-emerald-700", bg: "bg-emerald-50" },
  tubular_goods: { color: "text-teal-700", bg: "bg-teal-50" },
  tools_hand: { color: "text-amber-700", bg: "bg-amber-50" },
  tools_power: { color: "text-orange-700", bg: "bg-orange-50" },
  mud_chemicals: { color: "text-cyan-700", bg: "bg-cyan-50" },
  cement_chemicals: { color: "text-gray-700", bg: "bg-gray-50" },
  consumables: { color: "text-pink-700", bg: "bg-pink-50" },
};

function getStockLabel(status: StockStatus): string {
  const MAP: Record<StockStatus, string> = {
    in_stock: "In Stock",
    low_stock: "Low Stock",
    out_of_stock: "Out of Stock",
    on_order: "On Order",
    quarantine: "Quarantine",
    reserved: "Reserved",
  };
  return MAP[status] ?? status;
}

function getStockConfig(item: InventoryItem): {
  color: string;
  bg: string;
  border: string;
} {
  const pct = item.currentStock / (item.minStockLevel || 1);
  if (item.status === "out_of_stock" || item.currentStock === 0) {
    return { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" };
  }
  if (item.status === "low_stock" || pct < 1.2) {
    return { color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" };
  }
  if (item.status === "quarantine") {
    return { color: "#7C3AED", bg: "#F3E8FF", border: "#DDD6FE" };
  }
  if (item.status === "on_order") {
    return { color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" };
  }
  return { color: "#059669", bg: "#ECFDF5", border: "#A7F3D0" };
}

function buildInventoryColumns(): Column<InventoryItem>[] {
  return [
    {
      key: "description",
      header: "Item Name",
      sortable: true,
      render: (v: string, row: InventoryItem) => (
        <div>
          <p className="text-sm font-medium text-slate-800 line-clamp-2 max-w-xs">{v}</p>
          <p className="text-xs text-slate-400 mt-0.5">{row.manufacturer}</p>
        </div>
      ),
    },
    {
      key: "partNumber",
      header: "Part Number",
      sortable: true,
      width: "160px",
      render: (v: string) => (
        <span className="font-mono text-xs text-slate-600">{v}</span>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      width: "160px",
      render: (v: string) => {
        const cfg = CATEGORY_COLORS[v] ?? { color: "text-slate-700", bg: "bg-slate-50" };
        return (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
              cfg.color,
              cfg.bg
            )}
          >
            {CATEGORY_LABEL_MAP[v] ?? v}
          </span>
        );
      },
    },
    {
      key: "currentStock",
      header: "Quantity",
      sortable: true,
      width: "90px",
      render: (v: number, row: InventoryItem) => {
        const config = getStockConfig(row);
        return (
          <span className="text-sm font-bold" style={{ color: config.color }}>
            {v.toLocaleString()}
          </span>
        );
      },
    },
    {
      key: "unit",
      header: "Unit",
      width: "80px",
      render: (v: string) => (
        <span className="text-xs text-slate-500 capitalize">{v}</span>
      ),
    },
    {
      key: "minStockLevel",
      header: "Min Stock",
      sortable: true,
      width: "90px",
      render: (v: number) => (
        <span className="text-xs text-slate-600">{v.toLocaleString()}</span>
      ),
    },
    {
      key: "location",
      header: "Location",
      width: "180px",
      render: (v: string) => (
        <span className="text-xs text-slate-500 line-clamp-2">{v}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      width: "120px",
      render: (v: StockStatus, row: InventoryItem) => {
        const config = getStockConfig(row);
        return (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{
              color: config.color,
              backgroundColor: config.bg,
              border: `1px solid ${config.border}`,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            {getStockLabel(v)}
          </span>
        );
      },
    },
  ];
}

function InventoryTab() {
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");

  const rigItems = React.useMemo(() => {
    return INVENTORY_ITEMS.filter((item) =>
      item.applicableRigs.includes(CURRENT_RIG_ID)
    );
  }, []);

  const filteredItems = React.useMemo(() => {
    if (categoryFilter === "all") return rigItems;
    return rigItems.filter((item) => item.category === categoryFilter);
  }, [rigItems, categoryFilter]);

  const total = rigItems.length;
  const inStock = rigItems.filter(
    (i) => i.status === "in_stock" && i.currentStock > i.minStockLevel * 1.2
  ).length;
  const lowStock = rigItems.filter(
    (i) =>
      i.status === "low_stock" ||
      (i.currentStock > 0 && i.currentStock <= i.minStockLevel * 1.2)
  ).length;
  const outOfStock = rigItems.filter(
    (i) => i.status === "out_of_stock" || i.currentStock === 0
  ).length;
  const onOrder = rigItems.filter((i) => i.status === "on_order").length;

  const columns = React.useMemo(() => buildInventoryColumns(), []);

  return (
    <div className="p-5 flex flex-col gap-4">
      <div>
        <h3 className="text-base font-semibold text-slate-800">
          Inventory Overview
        </h3>
        <p className="text-sm text-slate-500 mt-0.5">
          All materials and consumables tracked for {CURRENT_RIG_NAME}
        </p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <KpiCard
          label="Total Items"
          value={total}
          color="text-slate-800"
          bg="bg-white"
          border="border border-slate-200"
        />
        <KpiCard
          label="In Stock"
          value={inStock}
          color="text-emerald-700"
          bg="bg-emerald-50"
          border="border border-emerald-200"
        />
        <KpiCard
          label="Low Stock"
          value={lowStock}
          color="text-amber-700"
          bg="bg-amber-50"
          border="border border-amber-200"
        />
        <KpiCard
          label="Out of Stock"
          value={outOfStock}
          color="text-red-700"
          bg="bg-red-50"
          border="border border-red-200"
        />
        <KpiCard
          label="On Order"
          value={onOrder}
          color="text-blue-700"
          bg="bg-blue-50"
          border="border border-blue-200"
        />
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-3">
        <Label className="text-sm text-slate-600 shrink-0">Category:</Label>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-64 h-9 text-sm">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            {ALL_CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {categoryFilter !== "all" && (
          <span className="text-xs text-slate-500">
            Showing {filteredItems.length} item
            {filteredItems.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Data Table */}
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <DataTable<InventoryItem>
          data={filteredItems}
          columns={columns}
          searchPlaceholder="Search items, part numbers..."
          searchKeys={["description", "partNumber", "manufacturer", "oemPartNumber"]}
          filters={[
            {
              key: "status",
              label: "Stock Status",
              options: [
                { label: "In Stock", value: "in_stock" },
                { label: "Low Stock", value: "low_stock" },
                { label: "Out of Stock", value: "out_of_stock" },
                { label: "On Order", value: "on_order" },
                { label: "Quarantine", value: "quarantine" },
              ],
            },
          ]}
          emptyMessage="No items found for the selected filters."
          itemLabel="items"
          pageSize={10}
        />
      </div>
    </div>
  );
}

// =============================================================================
// TAB 2: ALLOCATION
// =============================================================================

function getAllocationStatusConfig(status: AllocationStatus): {
  color: string;
  bg: string;
  border: string;
  label: string;
} {
  switch (status) {
    case "active":
      return {
        color: "#059669",
        bg: "#ECFDF5",
        border: "#A7F3D0",
        label: "Active",
      };
    case "returned":
      return {
        color: "#64748B",
        bg: "#F1F5F9",
        border: "#CBD5E1",
        label: "Returned",
      };
    case "lost":
      return {
        color: "#DC2626",
        bg: "#FEF2F2",
        border: "#FECACA",
        label: "Lost",
      };
  }
}

function buildAllocationColumns(
  onReturn: (alloc: MaterialAllocation) => void
): Column<MaterialAllocation>[] {
  return [
    {
      key: "itemName",
      header: "Item Name",
      sortable: true,
      render: (v: string, row: MaterialAllocation) => (
        <div>
          <p className="text-sm font-medium text-slate-800 line-clamp-2 max-w-xs">{v}</p>
          <p className="font-mono text-xs text-slate-400 mt-0.5">{row.partNumber}</p>
        </div>
      ),
    },
    {
      key: "allocatedToName",
      header: "Allocated To",
      sortable: true,
      width: "180px",
      render: (v: string) => (
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-semibold text-blue-700">
              {v
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </span>
          </div>
          <span className="text-sm text-slate-700">{v}</span>
        </div>
      ),
    },
    {
      key: "quantity",
      header: "Qty",
      sortable: true,
      width: "60px",
      render: (v: number, row: MaterialAllocation) => (
        <span className="text-sm font-semibold text-slate-800">
          {v} <span className="text-xs font-normal text-slate-400">{row.unit}</span>
        </span>
      ),
    },
    {
      key: "allocatedDate",
      header: "Allocated Date",
      sortable: true,
      width: "130px",
      render: (v: string) => (
        <span className="text-xs text-slate-600">{formatDate(v)}</span>
      ),
    },
    {
      key: "returnDate",
      header: "Return Date",
      width: "120px",
      render: (v: string | null) => (
        <span className="text-xs text-slate-500">{formatDate(v)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      width: "110px",
      render: (v: AllocationStatus) => {
        const cfg = getAllocationStatusConfig(v);
        return (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{
              color: cfg.color,
              backgroundColor: cfg.bg,
              border: `1px solid ${cfg.border}`,
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: cfg.color }} />
            {cfg.label}
          </span>
        );
      },
    },
    {
      key: "id",
      header: "Actions",
      width: "90px",
      render: (_v: string, row: MaterialAllocation) =>
        row.status === "active" ? (
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onReturn(row);
            }}
          >
            Return
          </Button>
        ) : null,
    },
  ];
}

interface AllocateItemDialogProps {
  open: boolean;
  onClose: () => void;
}

function AllocateItemDialog({ open, onClose }: AllocateItemDialogProps) {
  const [personnel, setPersonnel] = React.useState("");
  const [item, setItem] = React.useState("");
  const [quantity, setQuantity] = React.useState("1");
  const [notes, setNotes] = React.useState("");

  const personnelOptions = [
    { id: "usr-emp-001", name: "Ahmed Al-Rashid" },
    { id: "usr-emp-002", name: "Emma Richards" },
    { id: "usr-emp-003", name: "Khalid Al-Zahrani" },
    { id: "usr-emp-004", name: "James Okafor" },
    { id: "usr-emp-005", name: "Fatima Al-Otaibi" },
    { id: "usr-emp-006", name: "Marco Pellegrini" },
    { id: "usr-emp-007", name: "Saud Al-Mutairi" },
    { id: "usr-emp-008", name: "Ravi Shankar" },
    { id: "usr-emp-009", name: "Abdullah Hassan" },
    { id: "usr-emp-010", name: "Carlos Rivera" },
  ];

  const itemOptions = INVENTORY_ITEMS.filter((i) =>
    i.applicableRigs.includes(CURRENT_RIG_ID)
  ).slice(0, 20);

  function handleSubmit() {
    onClose();
    setPersonnel("");
    setItem("");
    setQuantity("1");
    setNotes("");
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Allocate Item to Personnel</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="alloc-personnel">Personnel</Label>
            <Select value={personnel} onValueChange={setPersonnel}>
              <SelectTrigger id="alloc-personnel" className="h-9">
                <SelectValue placeholder="Select personnel..." />
              </SelectTrigger>
              <SelectContent>
                {personnelOptions.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="alloc-item">Item</Label>
            <Select value={item} onValueChange={setItem}>
              <SelectTrigger id="alloc-item" className="h-9">
                <SelectValue placeholder="Select item..." />
              </SelectTrigger>
              <SelectContent>
                {itemOptions.map((i) => (
                  <SelectItem key={i.id} value={i.id}>
                    <span className="truncate">{i.description}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="alloc-qty">Quantity</Label>
            <Input
              id="alloc-qty"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="alloc-notes">Notes</Label>
            <Textarea
              id="alloc-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any allocation notes..."
              rows={3}
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!personnel || !item}>
            Allocate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ReturnItemDialogProps {
  allocation: MaterialAllocation | null;
  onClose: () => void;
}

function ReturnItemDialog({ allocation, onClose }: ReturnItemDialogProps) {
  const [notes, setNotes] = React.useState("");

  if (!allocation) return null;

  return (
    <Dialog open={!!allocation} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Return Item</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
            <p className="text-sm font-medium text-slate-800">
              {allocation.itemName}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Allocated to:{" "}
              <span className="font-medium">{allocation.allocatedToName}</span>
            </p>
            <p className="text-xs text-slate-500">
              Quantity: {allocation.quantity} {allocation.unit}
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="return-notes">Return Notes</Label>
            <Textarea
              id="return-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Condition of returned item, any damage notes..."
              rows={3}
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>Confirm Return</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AllocationTab() {
  const [allocateOpen, setAllocateOpen] = React.useState(false);
  const [returnAlloc, setReturnAlloc] = React.useState<MaterialAllocation | null>(null);
  const [lookupSearch, setLookupSearch] = React.useState("");

  const allocations = MATERIAL_ALLOCATIONS;

  const activeCount = allocations.filter((a) => a.status === "active").length;
  const itemsOut = allocations
    .filter((a) => a.status === "active")
    .reduce((sum, a) => sum + a.quantity, 0);
  const personnelWithAllocations = new Set(
    allocations
      .filter((a) => a.status === "active")
      .map((a) => a.allocatedToId)
  ).size;

  const columns = React.useMemo(
    () => buildAllocationColumns((alloc) => setReturnAlloc(alloc)),
    []
  );

  const lookupPersonnelOptions = Array.from(
    new Map(allocations.map((a) => [a.allocatedToId, a.allocatedToName])).entries()
  ).map(([id, name]) => ({ id, name }));

  const lookupItems = lookupSearch
    ? allocations.filter(
        (a) =>
          a.status === "active" &&
          (a.allocatedToName.toLowerCase().includes(lookupSearch.toLowerCase()) ||
            a.allocatedToId === lookupSearch)
      )
    : [];

  return (
    <div className="p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-800">
            Item Allocation
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Track PPE and equipment issued to personnel on {CURRENT_RIG_NAME}
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setAllocateOpen(true)}
          className="shrink-0"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Allocate Item
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <KpiCard
          label="Active Allocations"
          value={activeCount}
          color="text-emerald-700"
          bg="bg-emerald-50"
          border="border border-emerald-200"
        />
        <KpiCard
          label="Items Out"
          value={itemsOut}
          color="text-blue-700"
          bg="bg-blue-50"
          border="border border-blue-200"
        />
        <KpiCard
          label="Personnel With Allocations"
          value={personnelWithAllocations}
          color="text-slate-800"
          bg="bg-white"
          border="border border-slate-200"
        />
      </div>

      {/* Allocation Table */}
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <DataTable<MaterialAllocation>
          data={allocations}
          columns={columns}
          searchPlaceholder="Search by item name or person..."
          searchKeys={["itemName", "allocatedToName", "partNumber"]}
          filters={[
            {
              key: "status",
              label: "Status",
              options: [
                { label: "Active", value: "active" },
                { label: "Returned", value: "returned" },
                { label: "Lost", value: "lost" },
              ],
            },
          ]}
          emptyMessage="No allocations found."
          itemLabel="allocations"
          pageSize={10}
        />
      </div>

      {/* Personnel Allocation Lookup */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-4 w-4 text-slate-500" />
          <h4 className="text-sm font-semibold text-slate-800">
            Personnel Allocation Lookup
          </h4>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          Search for an employee to see all items currently allocated to them.
        </p>
        <div className="relative max-w-sm mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={lookupSearch}
            onChange={(e) => setLookupSearch(e.target.value)}
            placeholder="Search employee name..."
            className="pl-9 h-9 text-sm"
          />
        </div>

        {lookupSearch && lookupItems.length === 0 && (
          <p className="text-sm text-slate-400 italic">
            No active allocations found for &ldquo;{lookupSearch}&rdquo;.
          </p>
        )}

        {lookupItems.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-slate-600">
              Active items for:{" "}
              <span className="font-semibold text-slate-800">
                {lookupItems[0].allocatedToName}
              </span>{" "}
              ({lookupItems.length} item{lookupItems.length !== 1 ? "s" : ""})
            </p>
            <div className="flex flex-col divide-y divide-slate-100 rounded-lg border border-slate-200">
              {lookupItems.map((alloc) => (
                <div
                  key={alloc.id}
                  className="flex items-center justify-between gap-3 px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {alloc.itemName}
                    </p>
                    <p className="font-mono text-xs text-slate-400">
                      {alloc.partNumber}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-slate-700">
                      {alloc.quantity} {alloc.unit}
                    </p>
                    <p className="text-xs text-slate-400">
                      Since {formatDate(alloc.allocatedDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!lookupSearch && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">
              Quick Select
            </p>
            <div className="flex flex-wrap gap-2">
              {lookupPersonnelOptions
                .filter((p) =>
                  allocations.some(
                    (a) => a.allocatedToId === p.id && a.status === "active"
                  )
                )
                .map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setLookupSearch(p.name)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                  >
                    <span className="h-4 w-4 rounded-full bg-blue-100 flex items-center justify-center text-[9px] font-bold text-blue-700">
                      {p.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                    {p.name}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      <AllocateItemDialog
        open={allocateOpen}
        onClose={() => setAllocateOpen(false)}
      />
      <ReturnItemDialog
        allocation={returnAlloc}
        onClose={() => setReturnAlloc(null)}
      />
    </div>
  );
}

// =============================================================================
// TAB 3: MATERIAL ORDERING
// =============================================================================

function getOrderStatusConfig(status: OrderStatus): {
  color: string;
  bg: string;
  border: string;
  label: string;
} {
  switch (status) {
    case "draft":
      return {
        color: "#64748B",
        bg: "#F1F5F9",
        border: "#CBD5E1",
        label: "Draft",
      };
    case "submitted":
      return {
        color: "#D97706",
        bg: "#FFFBEB",
        border: "#FDE68A",
        label: "Submitted",
      };
    case "approved":
      return {
        color: "#2563EB",
        bg: "#EFF6FF",
        border: "#BFDBFE",
        label: "Approved",
      };
    case "ordered":
      return {
        color: "#7C3AED",
        bg: "#F3E8FF",
        border: "#DDD6FE",
        label: "Ordered",
      };
    case "shipped":
      return {
        color: "#0891B2",
        bg: "#ECFEFF",
        border: "#A5F3FC",
        label: "Shipped",
      };
    case "received":
      return {
        color: "#059669",
        bg: "#ECFDF5",
        border: "#A7F3D0",
        label: "Received",
      };
  }
}

function buildOrderColumns(): Column<MaterialOrder>[] {
  return [
    {
      key: "orderNumber",
      header: "Order Number",
      sortable: true,
      width: "160px",
      render: (v: string) => (
        <span className="font-mono text-xs font-semibold text-slate-700">{v}</span>
      ),
    },
    {
      key: "supplier",
      header: "Supplier",
      sortable: true,
      render: (v: string, row: MaterialOrder) => (
        <div>
          <p className="text-sm font-medium text-slate-800">{v}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {row.items.length} item{row.items.length !== 1 ? "s" : ""}
          </p>
        </div>
      ),
    },
    {
      key: "totalAmount",
      header: "Total Amount",
      sortable: true,
      width: "140px",
      render: (v: number) => (
        <span className="text-sm font-semibold text-slate-800">
          {formatCurrency(v)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      width: "120px",
      render: (v: OrderStatus) => {
        const cfg = getOrderStatusConfig(v);
        return (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{
              color: cfg.color,
              backgroundColor: cfg.bg,
              border: `1px solid ${cfg.border}`,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: cfg.color }}
            />
            {cfg.label}
          </span>
        );
      },
    },
    {
      key: "requestDate",
      header: "Request Date",
      sortable: true,
      width: "120px",
      render: (v: string) => (
        <span className="text-xs text-slate-600">{formatDate(v)}</span>
      ),
    },
    {
      key: "expectedDelivery",
      header: "Expected Delivery",
      sortable: true,
      width: "140px",
      render: (v: string) => (
        <span className="text-xs text-slate-600">{formatDate(v)}</span>
      ),
    },
    {
      key: "requestedBy",
      header: "Requested By",
      width: "150px",
      render: (v: string) => (
        <span className="text-sm text-slate-700">{v}</span>
      ),
    },
  ];
}

interface NewOrderDialogProps {
  open: boolean;
  onClose: () => void;
}

interface OrderLineItem {
  id: string;
  itemId: string;
  itemName: string;
  partNumber: string;
  quantity: string;
  unit: string;
  unitPrice: string;
}

function NewOrderDialog({ open, onClose }: NewOrderDialogProps) {
  const [supplier, setSupplier] = React.useState("");
  const [expectedDelivery, setExpectedDelivery] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [lineItems, setLineItems] = React.useState<OrderLineItem[]>([
    {
      id: "line-1",
      itemId: "",
      itemName: "",
      partNumber: "",
      quantity: "1",
      unit: "each",
      unitPrice: "0",
    },
  ]);

  const inventoryOptions = INVENTORY_ITEMS.filter((i) =>
    i.applicableRigs.includes(CURRENT_RIG_ID)
  );

  function addLine() {
    setLineItems((prev) => [
      ...prev,
      {
        id: `line-${Date.now()}`,
        itemId: "",
        itemName: "",
        partNumber: "",
        quantity: "1",
        unit: "each",
        unitPrice: "0",
      },
    ]);
  }

  function removeLine(id: string) {
    setLineItems((prev) => prev.filter((l) => l.id !== id));
  }

  function updateLine(id: string, field: keyof OrderLineItem, value: string) {
    setLineItems((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        if (field === "itemId") {
          const inv = inventoryOptions.find((i) => i.id === value);
          if (inv) {
            return {
              ...l,
              itemId: value,
              itemName: inv.description,
              partNumber: inv.partNumber,
              unit: inv.unit,
            };
          }
        }
        return { ...l, [field]: value };
      })
    );
  }

  const totalAmount = lineItems.reduce(
    (sum, l) =>
      sum + (parseFloat(l.quantity) || 0) * (parseFloat(l.unitPrice) || 0),
    0
  );

  function handleSubmit() {
    onClose();
    setSupplier("");
    setExpectedDelivery("");
    setNotes("");
    setLineItems([
      {
        id: "line-1",
        itemId: "",
        itemName: "",
        partNumber: "",
        quantity: "1",
        unit: "each",
        unitPrice: "0",
      },
    ]);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Material Order</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="order-supplier">Supplier</Label>
              <Input
                id="order-supplier"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="e.g. National Oilwell Varco"
                className="h-9"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="order-delivery">Expected Delivery</Label>
              <Input
                id="order-delivery"
                type="date"
                value={expectedDelivery}
                onChange={(e) => setExpectedDelivery(e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          {/* Line items */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Order Items</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={addLine}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Item
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {lineItems.map((line, idx) => (
                <div
                  key={line.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Item {idx + 1}
                    </span>
                    {lineItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLine(line.id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2">
                      <Select
                        value={line.itemId}
                        onValueChange={(v) => updateLine(line.id, "itemId", v)}
                      >
                        <SelectTrigger className="h-8 text-sm bg-white">
                          <SelectValue placeholder="Select inventory item..." />
                        </SelectTrigger>
                        <SelectContent>
                          {inventoryOptions.map((i) => (
                            <SelectItem key={i.id} value={i.id}>
                              <span className="truncate text-sm">
                                {i.description}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label className="text-xs">Quantity</Label>
                      <Input
                        type="number"
                        min={1}
                        value={line.quantity}
                        onChange={(e) =>
                          updateLine(line.id, "quantity", e.target.value)
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label className="text-xs">Unit Price (USD)</Label>
                      <Input
                        type="number"
                        min={0}
                        value={line.unitPrice}
                        onChange={(e) =>
                          updateLine(line.id, "unitPrice", e.target.value)
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {totalAmount > 0 && (
              <div className="flex items-center justify-end gap-2 pt-1">
                <span className="text-sm text-slate-500">Order Total:</span>
                <span className="text-base font-bold text-slate-800">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="order-notes">Notes</Label>
            <Textarea
              id="order-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Order justification, urgency notes..."
              rows={3}
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleSubmit}
            disabled={!supplier}
          >
            Save as Draft
          </Button>
          <Button onClick={handleSubmit} disabled={!supplier}>
            Submit Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OrderingTab() {
  const [newOrderOpen, setNewOrderOpen] = React.useState(false);

  const orders = MATERIAL_ORDERS;

  const totalOrders = orders.length;
  const pending = orders.filter((o) =>
    ["draft", "submitted"].includes(o.status)
  ).length;
  const inTransit = orders.filter((o) =>
    ["ordered", "shipped"].includes(o.status)
  ).length;

  const currentMonth = "2026-02";
  const receivedThisMonth = orders.filter(
    (o) => o.status === "received" && o.requestDate.startsWith(currentMonth)
  ).length;

  const columns = React.useMemo(() => buildOrderColumns(), []);

  return (
    <div className="p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-800">
            Material Ordering
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Purchase orders and material replenishment requests for{" "}
            {CURRENT_RIG_NAME}
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setNewOrderOpen(true)}
          className="shrink-0"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          New Order
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard
          label="Total Orders"
          value={totalOrders}
          color="text-slate-800"
          bg="bg-white"
          border="border border-slate-200"
        />
        <KpiCard
          label="Pending"
          value={pending}
          color="text-amber-700"
          bg="bg-amber-50"
          border="border border-amber-200"
        />
        <KpiCard
          label="In Transit"
          value={inTransit}
          color="text-violet-700"
          bg="bg-violet-50"
          border="border border-violet-200"
        />
        <KpiCard
          label="Received This Month"
          value={receivedThisMonth}
          color="text-emerald-700"
          bg="bg-emerald-50"
          border="border border-emerald-200"
        />
      </div>

      {/* Order Table */}
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <DataTable<MaterialOrder>
          data={orders}
          columns={columns}
          searchPlaceholder="Search orders, suppliers..."
          searchKeys={["orderNumber", "supplier", "requestedBy", "notes"]}
          filters={[
            {
              key: "status",
              label: "Status",
              options: [
                { label: "Draft", value: "draft" },
                { label: "Submitted", value: "submitted" },
                { label: "Approved", value: "approved" },
                { label: "Ordered", value: "ordered" },
                { label: "Shipped", value: "shipped" },
                { label: "Received", value: "received" },
              ],
            },
          ]}
          emptyMessage="No orders found."
          itemLabel="orders"
          pageSize={10}
        />
      </div>

      <NewOrderDialog
        open={newOrderOpen}
        onClose={() => setNewOrderOpen(false)}
      />
    </div>
  );
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

const MAIN_TABS = [
  { key: "inventory", label: "Inventory", icon: Package },
  { key: "allocation", label: "Allocation", icon: Users },
  { key: "ordering", label: "Material Ordering", icon: ShoppingCart },
];

export default function MaterialsPage() {
  const [activeTab, setActiveTab] = React.useState("inventory");

  // Header stats
  const allRigItems = INVENTORY_ITEMS.filter((i) =>
    i.applicableRigs.includes(CURRENT_RIG_ID)
  );
  const lowCount = allRigItems.filter((i) => i.status === "low_stock").length;
  const critCount = allRigItems.filter(
    (i) => i.status === "out_of_stock" || i.currentStock === 0
  ).length;
  const activeAllocations = MATERIAL_ALLOCATIONS.filter(
    (a) => a.status === "active"
  ).length;
  const pendingOrders = MATERIAL_ORDERS.filter((o) =>
    ["draft", "submitted", "approved", "ordered", "shipped"].includes(o.status)
  ).length;

  const tabBadges: Record<string, number> = {
    inventory: allRigItems.length,
    allocation: activeAllocations,
    ordering: pendingOrders,
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-200 bg-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Materials</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {CURRENT_RIG_NAME} — Inventory, Allocations & Ordering
            </p>
          </div>
          <div className="flex items-center gap-3">
            {lowCount > 0 && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-center">
                <p className="text-xs text-amber-600 font-medium">Low Stock</p>
                <p className="text-lg font-bold text-amber-800">{lowCount}</p>
              </div>
            )}
            {critCount > 0 && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-center">
                <p className="text-xs text-red-600 font-medium">Out of Stock</p>
                <p className="text-lg font-bold text-red-800">{critCount}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <TabNavigation
        tabs={MAIN_TABS.map((t) => ({
          key: t.key,
          label: t.label,
          badge: tabBadges[t.key],
        }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      <div className="flex-1 bg-slate-50">
        {activeTab === "inventory" && <InventoryTab />}
        {activeTab === "allocation" && <AllocationTab />}
        {activeTab === "ordering" && <OrderingTab />}
      </div>
    </div>
  );
}
