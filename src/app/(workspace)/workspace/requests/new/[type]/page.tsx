"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  CheckCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Type Definitions ─────────────────────────────────────────────────────────

type RequestTypeKey =
  | "equipment"
  | "material"
  | "service"
  | "rental"
  | "rig_move"
  | "inspection"
  | "document_review"
  | "manpower"
  | "qc_support"
  | "moc"
  | "nco"
  | "hr"
  | "logistics"
  | "maintenance"
  | "gate_pass";

const REQUEST_TYPE_LABELS: Record<RequestTypeKey, string> = {
  equipment: "Equipment",
  material: "Material",
  service: "Service",
  rental: "Rental",
  rig_move: "Rig Move",
  inspection: "Inspection",
  document_review: "Document Review",
  manpower: "Manpower",
  qc_support: "QC Support",
  moc: "Management of Change",
  nco: "Non-Conformance",
  hr: "HR",
  logistics: "Logistics",
  maintenance: "Maintenance",
  gate_pass: "Gate Pass",
};

const RIGS = [
  { value: "AD-201", label: "Rig Alpha (AD-201)" },
  { value: "AD-202", label: "Rig Bravo (AD-202)" },
  { value: "AD-203", label: "Rig Charlie (AD-203)" },
  { value: "base", label: "Dammam Base" },
];

// ─── Zod v4 compatible enum helper ──────────────────────────────────────────

function reqEnum<T extends [string, ...string[]]>(values: T) {
  return z.enum(values).refine((v) => v.length > 0, { error: "Selection is required" });
}

// ─── Common Schema ─────────────────────────────────────────────────────────────

const commonSchema = z.object({
  priority: z.enum(["critical", "urgent", "high", "routine", "planned"]),
  requiredBy: z.string().min(1, "Required by date is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(1, "Location is required"),
});

// ─── Type-Specific Schemas ────────────────────────────────────────────────────

const equipmentSchema = commonSchema.extend({
  equipmentType: z.string().min(1, "Equipment type is required"),
  quantity: z.string().min(1, "Quantity is required"),
  specifications: z.string().optional(),
  justification: z.string().min(1, "Justification is required"),
  purchaseType: z.enum(["internal", "new_purchase"]),
});

const materialSchema = commonSchema.extend({
  materialName: z.string().min(1, "Material name is required"),
  partNumber: z.string().optional(),
  quantity: z.string().min(1, "Quantity is required"),
  unit: z.string().min(1, "Unit is required"),
  category: z.enum(["ppe", "spares", "capital", "tools"]),
  urgencyReason: z.string().optional(),
});

const serviceSchema = commonSchema.extend({
  serviceType: z.string().min(1, "Service type is required"),
  vendor: z.string().optional(),
  scopeOfWork: z.string().min(1, "Scope of work is required"),
  duration: z.string().min(1, "Duration is required"),
  specialRequirements: z.string().optional(),
});

const rentalSchema = commonSchema.extend({
  equipmentName: z.string().min(1, "Equipment name is required"),
  rentalFrom: z.string().min(1, "Rental start date is required"),
  rentalTo: z.string().min(1, "Rental end date is required"),
  vendorPreference: z.string().optional(),
  dailyRate: z.string().optional(),
});

const rigMoveSchema = commonSchema.extend({
  rigId: z.string().min(1, "Rig is required"),
  fromLocation: z.string().min(1, "From location is required"),
  toLocation: z.string().min(1, "To location is required"),
  plannedDate: z.string().min(1, "Planned date is required"),
  specialRequirements: z.string().optional(),
});

const inspectionSchema = commonSchema.extend({
  assetEquipment: z.string().min(1, "Equipment/Asset is required"),
  inspectionType: z.enum(["third_party", "internal", "regulatory"]),
  scope: z.string().min(1, "Scope is required"),
});

const documentReviewSchema = commonSchema.extend({
  documentNumber: z.string().min(1, "Document number is required"),
  documentTitle: z.string().min(1, "Document title is required"),
  revisionNumber: z.string().min(1, "Revision number is required"),
  reviewType: z.enum(["new", "revision", "update"]),
  comments: z.string().optional(),
});

const manpowerSchema = commonSchema.extend({
  positionRequired: z.string().min(1, "Position is required"),
  quantity: z.string().min(1, "Quantity is required"),
  skillsCertifications: z.string().min(1, "Skills/certifications are required"),
  duration: z.string().min(1, "Duration is required"),
  startDate: z.string().min(1, "Start date is required"),
});

const qcSupportSchema = commonSchema.extend({
  supportType: z.string().min(1, "Support type is required"),
  relatedDocumentAsset: z.string().optional(),
  needDescription: z.string().min(1, "Description of need is required"),
});

const mocSchema = commonSchema.extend({
  changeTitle: z.string().min(1, "Change title is required"),
  changeType: z.enum(["permanent", "temporary", "emergency"]),
  justification: z.string().min(1, "Justification is required"),
});

const ncoSchema = commonSchema.extend({
  title: z.string().min(1, "Title is required"),
  severity: z.enum(["critical", "major", "minor"]),
  ncoType: z.enum(["process", "product", "supplier", "system", "documentation"]),
  immediateContainment: z.string().min(1, "Immediate containment action is required"),
});

const hrSchema = commonSchema.extend({
  hrRequestType: z.enum(["leave", "training", "grievance", "other"]),
  details: z.string().min(1, "Details are required"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

const logisticsSchema = commonSchema.extend({
  transportType: z.enum(["material", "equipment", "personnel"]),
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  itemsDescription: z.string().min(1, "Items description is required"),
  urgency: z.string().optional(),
});

const maintenanceSchema = commonSchema.extend({
  equipmentTagNumber: z.string().min(1, "Equipment tag number is required"),
  issueDescription: z.string().min(1, "Issue description is required"),
  maintenanceType: z.enum(["preventive", "corrective", "emergency"]),
});

const gatePassSchema = commonSchema.extend({
  visitorName: z.string().min(1, "Visitor name is required"),
  company: z.string().min(1, "Company is required"),
  purpose: z.string().min(1, "Purpose of visit is required"),
  host: z.string().min(1, "Host is required"),
  validFrom: z.string().min(1, "Valid from date is required"),
  validUntil: z.string().min(1, "Valid until date is required"),
  itemsCarried: z.string().optional(),
});

// ─── Schema Map ───────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SCHEMA_MAP: Record<RequestTypeKey, z.ZodObject<any>> = {
  equipment: equipmentSchema,
  material: materialSchema,
  service: serviceSchema,
  rental: rentalSchema,
  rig_move: rigMoveSchema,
  inspection: inspectionSchema,
  document_review: documentReviewSchema,
  manpower: manpowerSchema,
  qc_support: qcSupportSchema,
  moc: mocSchema,
  nco: ncoSchema,
  hr: hrSchema,
  logistics: logisticsSchema,
  maintenance: maintenanceSchema,
  gate_pass: gatePassSchema,
};

// ─── Suppress unused import warning ──────────────────────────────────────────
void reqEnum;

// ─── Form Fields Props ─────────────────────────────────────────────────────────

interface FormFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: (name: string, options?: any) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: Record<string, any>;
}

// ─── Field Components ──────────────────────────────────────────────────────────

function FormField({
  label,
  required = false,
  error,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <Label className="text-slate-700 font-medium text-sm">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertTriangle className="size-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-full">
      <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-1">
        {children}
      </h3>
    </div>
  );
}

// ─── Type-Specific Form Sections ──────────────────────────────────────────────

function EquipmentFields({ register, control, errors }: FormFieldsProps) {
  return (
    <>
      <SectionTitle>Equipment Details</SectionTitle>
      <FormField label="Equipment Type" required error={errors.equipmentType?.message}>
        <Input
          {...register("equipmentType")}
          placeholder="e.g. Mud Pump, BOP, Top Drive"
          className="h-9"
        />
      </FormField>
      <FormField label="Quantity" required error={errors.quantity?.message}>
        <Input
          {...register("quantity")}
          placeholder="e.g. 2 units"
          className="h-9"
        />
      </FormField>
      <FormField label="Specifications" error={errors.specifications?.message} className="col-span-full">
        <Textarea
          {...register("specifications")}
          placeholder="Technical specifications, model numbers, ratings..."
          rows={3}
        />
      </FormField>
      <FormField label="Justification" required error={errors.justification?.message} className="col-span-full">
        <Textarea
          {...register("justification")}
          placeholder="Business justification for this request..."
          rows={3}
        />
      </FormField>
      <FormField label="Procurement Type" required error={errors.purchaseType?.message}>
        <Controller
          name="purchaseType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Select procurement type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="internal">Internal (From Stock / Transfer)</SelectItem>
                <SelectItem value="new_purchase">New Purchase</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormField>
    </>
  );
}

function MaterialFields({ register, control, errors }: FormFieldsProps) {
  return (
    <>
      <SectionTitle>Material Details</SectionTitle>
      <FormField label="Material Name" required error={errors.materialName?.message}>
        <Input
          {...register("materialName")}
          placeholder="e.g. Mud Pump Liner Assembly"
          className="h-9"
        />
      </FormField>
      <FormField label="Part Number" error={errors.partNumber?.message}>
        <Input
          {...register("partNumber")}
          placeholder="e.g. NAT-12P-LIN-065"
          className="h-9"
        />
      </FormField>
      <FormField label="Quantity" required error={errors.quantity?.message}>
        <Input
          {...register("quantity")}
          placeholder="e.g. 3"
          className="h-9"
        />
      </FormField>
      <FormField label="Unit of Measure" required error={errors.unit?.message}>
        <Input
          {...register("unit")}
          placeholder="e.g. Sets, EA, Meters, KG"
          className="h-9"
        />
      </FormField>
      <FormField label="Category" required error={errors.category?.message}>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ppe">PPE (Personal Protective Equipment)</SelectItem>
                <SelectItem value="spares">Spares & Consumables</SelectItem>
                <SelectItem value="capital">Capital Goods</SelectItem>
                <SelectItem value="tools">Tools & Equipment</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormField>
      <FormField label="Urgency Reason" error={errors.urgencyReason?.message} className="col-span-full">
        <Textarea
          {...register("urgencyReason")}
          placeholder="Reason for urgency (if applicable)..."
          rows={3}
        />
      </FormField>
    </>
  );
}

function ServiceFields({ register, control, errors }: FormFieldsProps) {
  return (
    <>
      <SectionTitle>Service Details</SectionTitle>
      <FormField label="Service Type" required error={errors.serviceType?.message}>
        <Input
          {...register("serviceType")}
          placeholder="e.g. Crane Inspection, Electrical Maintenance"
          className="h-9"
        />
      </FormField>
      <FormField label="Vendor / Service Provider" error={errors.vendor?.message}>
        <Input
          {...register("vendor")}
          placeholder="Third-party vendor name (if applicable)"
          className="h-9"
        />
      </FormField>
      <FormField label="Scope of Work" required error={errors.scopeOfWork?.message} className="col-span-full">
        <Textarea
          {...register("scopeOfWork")}
          placeholder="Detailed scope of work required..."
          rows={4}
        />
      </FormField>
      <FormField label="Estimated Duration" required error={errors.duration?.message}>
        <Input
          {...register("duration")}
          placeholder="e.g. 3 days, 8 hours"
          className="h-9"
        />
      </FormField>
      <FormField label="Special Requirements" error={errors.specialRequirements?.message} className="col-span-full">
        <Textarea
          {...register("specialRequirements")}
          placeholder="Access restrictions, safety requirements, certifications needed..."
          rows={3}
        />
      </FormField>
    </>
  );
}

function RentalFields({ register, errors }: FormFieldsProps) {
  return (
    <>
      <SectionTitle>Rental Details</SectionTitle>
      <FormField label="Equipment Name" required error={errors.equipmentName?.message} className="col-span-full">
        <Input
          {...register("equipmentName")}
          placeholder="e.g. 200-ton Mobile Crane"
          className="h-9"
        />
      </FormField>
      <FormField label="Rental From" required error={errors.rentalFrom?.message}>
        <Input
          {...register("rentalFrom")}
          type="date"
          className="h-9"
        />
      </FormField>
      <FormField label="Rental To" required error={errors.rentalTo?.message}>
        <Input
          {...register("rentalTo")}
          type="date"
          className="h-9"
        />
      </FormField>
      <FormField label="Vendor Preference" error={errors.vendorPreference?.message}>
        <Input
          {...register("vendorPreference")}
          placeholder="Preferred vendor or 'No preference'"
          className="h-9"
        />
      </FormField>
      <FormField label="Estimated Daily Rate (SAR)" error={errors.dailyRate?.message}>
        <Input
          {...register("dailyRate")}
          placeholder="e.g. 15,000"
          className="h-9"
        />
      </FormField>
    </>
  );
}

function RigMoveFields({ register, control, errors }: FormFieldsProps) {
  return (
    <>
      <SectionTitle>Rig Move Details</SectionTitle>
      <FormField label="Rig" required error={errors.rigId?.message}>
        <Controller
          name="rigId"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Select rig" />
              </SelectTrigger>
              <SelectContent>
                {RIGS.map((rig) => (
                  <SelectItem key={rig.value} value={rig.value}>
                    {rig.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>
      <FormField label="Planned Move Date" required error={errors.plannedDate?.message}>
        <Input
          {...register("plannedDate")}
          type="date"
          className="h-9"
        />
      </FormField>
      <FormField label="From Location" required error={errors.fromLocation?.message}>
        <Input
          {...register("fromLocation")}
          placeholder="e.g. Well ADB-47 Location"
          className="h-9"
        />
      </FormField>
      <FormField label="To Location" required error={errors.toLocation?.message}>
        <Input
          {...register("toLocation")}
          placeholder="e.g. Well ADB-48 Location"
          className="h-9"
        />
      </FormField>
      <FormField label="Special Requirements" error={errors.specialRequirements?.message} className="col-span-full">
        <Textarea
          {...register("specialRequirements")}
          placeholder="Road permits, heavy transport requirements, mobilization notes..."
          rows={3}
        />
      </FormField>
    </>
  );
}

function InspectionFields({ register, control, errors }: FormFieldsProps) {
  return (
    <>
      <SectionTitle>Inspection Details</SectionTitle>
      <FormField label="Equipment / Asset" required error={errors.assetEquipment?.message}>
        <Input
          {...register("assetEquipment")}
          placeholder="e.g. AD-201-BOP-001, Shale Shaker #3"
          className="h-9"
        />
      </FormField>
      <FormField label="Inspection Type" required error={errors.inspectionType?.message}>
        <Controller
          name="inspectionType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Select inspection type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="third_party">Third Party</SelectItem>
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="regulatory">Regulatory / Statutory</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormField>
      <FormField label="Scope of Inspection" required error={errors.scope?.message} className="col-span-full">
        <Textarea
          {...register("scope")}
          placeholder="Describe the inspection scope, standards to be applied..."
          rows={4}
        />
      </FormField>
    </>
  );
}

function DocumentReviewFields({ register, control, errors }: FormFieldsProps) {
  return (
    <>
      <SectionTitle>Document Details</SectionTitle>
      <FormField label="Document Number" required error={errors.documentNumber?.message}>
        <Input
          {...register("documentNumber")}
          placeholder="e.g. ADI-OPS-PROC-028"
          className="h-9"
        />
      </FormField>
      <FormField label="Revision Number" required error={errors.revisionNumber?.message}>
        <Input
          {...register("revisionNumber")}
          placeholder="e.g. Rev 5"
          className="h-9"
        />
      </FormField>
      <FormField label="Document Title" required error={errors.documentTitle?.message} className="col-span-full">
        <Input
          {...register("documentTitle")}
          placeholder="e.g. BOP Testing Procedure"
          className="h-9"
        />
      </FormField>
      <FormField label="Review Type" required error={errors.reviewType?.message}>
        <Controller
          name="reviewType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Select review type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New Document</SelectItem>
                <SelectItem value="revision">Revision</SelectItem>
                <SelectItem value="update">Update / Amendment</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormField>
      <FormField label="Reviewer Comments" error={errors.comments?.message} className="col-span-full">
        <Textarea
          {...register("comments")}
          placeholder="Additional comments or context for the reviewer..."
          rows={3}
        />
      </FormField>
    </>
  );
}

function ManpowerFields({ register, errors }: FormFieldsProps) {
  return (
    <>
      <SectionTitle>Manpower Details</SectionTitle>
      <FormField label="Position Required" required error={errors.positionRequired?.message}>
        <Input
          {...register("positionRequired")}
          placeholder="e.g. IWCF Certified Driller"
          className="h-9"
        />
      </FormField>
      <FormField label="Number of Personnel" required error={errors.quantity?.message}>
        <Input
          {...register("quantity")}
          placeholder="e.g. 2"
          className="h-9"
        />
      </FormField>
      <FormField label="Required Skills / Certifications" required error={errors.skillsCertifications?.message} className="col-span-full">
        <Textarea
          {...register("skillsCertifications")}
          placeholder="IWCF Supervisor Level, 5+ years land rig experience, valid medical..."
          rows={3}
        />
      </FormField>
      <FormField label="Duration" required error={errors.duration?.message}>
        <Input
          {...register("duration")}
          placeholder="e.g. 4 weeks, 28 days"
          className="h-9"
        />
      </FormField>
      <FormField label="Required Start Date" required error={errors.startDate?.message}>
        <Input
          {...register("startDate")}
          type="date"
          className="h-9"
        />
      </FormField>
    </>
  );
}

function QcSupportFields({ register, errors }: FormFieldsProps) {
  return (
    <>
      <SectionTitle>QC Support Details</SectionTitle>
      <FormField label="Support Type" required error={errors.supportType?.message}>
        <Input
          {...register("supportType")}
          placeholder="e.g. Cement Job QC, Pipe Inspection Oversight"
          className="h-9"
        />
      </FormField>
      <FormField label="Related Document / Asset" error={errors.relatedDocumentAsset?.message}>
        <Input
          {...register("relatedDocumentAsset")}
          placeholder="e.g. ADI-OPS-PROC-041, NCO-2025-018"
          className="h-9"
        />
      </FormField>
      <FormField label="Description of Need" required error={errors.needDescription?.message} className="col-span-full">
        <Textarea
          {...register("needDescription")}
          placeholder="Describe the QC support required in detail..."
          rows={4}
        />
      </FormField>
    </>
  );
}

function MocFields({ register, control, errors }: FormFieldsProps) {
  return (
    <>
      <SectionTitle>Management of Change Details</SectionTitle>
      <FormField label="Change Title" required error={errors.changeTitle?.message} className="col-span-full">
        <Input
          {...register("changeTitle")}
          placeholder="e.g. Rotary Table Bearing Replacement — Alternative Part"
          className="h-9"
        />
      </FormField>
      <FormField label="Change Type" required error={errors.changeType?.message}>
        <Controller
          name="changeType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Select change type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="permanent">Permanent</SelectItem>
                <SelectItem value="temporary">Temporary</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormField>
      <FormField label="Justification" required error={errors.justification?.message} className="col-span-full">
        <Textarea
          {...register("justification")}
          placeholder="Justification and business case for the change..."
          rows={4}
        />
      </FormField>
    </>
  );
}

function NcoFields({ register, control, errors }: FormFieldsProps) {
  return (
    <>
      <SectionTitle>Non-Conformance Details</SectionTitle>
      <FormField label="NCO Title" required error={errors.title?.message} className="col-span-full">
        <Input
          {...register("title")}
          placeholder="e.g. Substandard Drill Pipe Wall Thickness"
          className="h-9"
        />
      </FormField>
      <FormField label="Severity" required error={errors.severity?.message}>
        <Controller
          name="severity"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="major">Major</SelectItem>
                <SelectItem value="minor">Minor</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormField>
      <FormField label="NCO Type" required error={errors.ncoType?.message}>
        <Controller
          name="ncoType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Select NCO type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="process">Process</SelectItem>
                <SelectItem value="product">Product / Material</SelectItem>
                <SelectItem value="supplier">Supplier</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="documentation">Documentation</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormField>
      <FormField label="Immediate Containment Action" required error={errors.immediateContainment?.message} className="col-span-full">
        <Textarea
          {...register("immediateContainment")}
          placeholder="Actions taken immediately to contain the non-conformance..."
          rows={3}
        />
      </FormField>
    </>
  );
}

function HrFields({ register, control, errors }: FormFieldsProps) {
  return (
    <>
      <SectionTitle>HR Request Details</SectionTitle>
      <FormField label="Request Type" required error={errors.hrRequestType?.message}>
        <Controller
          name="hrRequestType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Select request type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="leave">Leave Request</SelectItem>
                <SelectItem value="training">Training Request</SelectItem>
                <SelectItem value="grievance">Grievance</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormField>
      <FormField label="Start Date (if applicable)" error={errors.startDate?.message}>
        <Input
          {...register("startDate")}
          type="date"
          className="h-9"
        />
      </FormField>
      <FormField label="End Date (if applicable)" error={errors.endDate?.message}>
        <Input
          {...register("endDate")}
          type="date"
          className="h-9"
        />
      </FormField>
      <FormField label="Details" required error={errors.details?.message} className="col-span-full">
        <Textarea
          {...register("details")}
          placeholder="Provide full details of your HR request..."
          rows={4}
        />
      </FormField>
    </>
  );
}

function LogisticsFields({ register, control, errors }: FormFieldsProps) {
  return (
    <>
      <SectionTitle>Logistics Details</SectionTitle>
      <FormField label="Transport Type" required error={errors.transportType?.message}>
        <Controller
          name="transportType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Select transport type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="material">Material Transport</SelectItem>
                <SelectItem value="equipment">Equipment Transport</SelectItem>
                <SelectItem value="personnel">Personnel Transport</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormField>
      <FormField label="Urgency / Special Handling" error={errors.urgency?.message}>
        <Input
          {...register("urgency")}
          placeholder="e.g. Fragile, Hazardous, Temperature Controlled"
          className="h-9"
        />
      </FormField>
      <FormField label="Origin" required error={errors.origin?.message}>
        <Input
          {...register("origin")}
          placeholder="e.g. Dammam Warehouse, Rig Alpha"
          className="h-9"
        />
      </FormField>
      <FormField label="Destination" required error={errors.destination?.message}>
        <Input
          {...register("destination")}
          placeholder="e.g. Rig Bravo, Well ADB-52"
          className="h-9"
        />
      </FormField>
      <FormField label="Items / Cargo Description" required error={errors.itemsDescription?.message} className="col-span-full">
        <Textarea
          {...register("itemsDescription")}
          placeholder="Describe items, quantities, weights, dimensions..."
          rows={3}
        />
      </FormField>
    </>
  );
}

function MaintenanceFields({ register, control, errors }: FormFieldsProps) {
  return (
    <>
      <SectionTitle>Maintenance Details</SectionTitle>
      <FormField label="Equipment Tag Number" required error={errors.equipmentTagNumber?.message}>
        <Input
          {...register("equipmentTagNumber")}
          placeholder="e.g. AD-201-MP-002"
          className="h-9"
        />
      </FormField>
      <FormField label="Maintenance Type" required error={errors.maintenanceType?.message}>
        <Controller
          name="maintenanceType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Select maintenance type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="preventive">Preventive (PM)</SelectItem>
                <SelectItem value="corrective">Corrective (CM)</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormField>
      <FormField label="Issue Description" required error={errors.issueDescription?.message} className="col-span-full">
        <Textarea
          {...register("issueDescription")}
          placeholder="Describe the fault, symptoms, or maintenance work required..."
          rows={4}
        />
      </FormField>
    </>
  );
}

function GatePassFields({ register, errors }: FormFieldsProps) {
  return (
    <>
      <SectionTitle>Gate Pass Details</SectionTitle>
      <FormField label="Visitor Name" required error={errors.visitorName?.message}>
        <Input
          {...register("visitorName")}
          placeholder="Full name of visitor"
          className="h-9"
        />
      </FormField>
      <FormField label="Company / Organization" required error={errors.company?.message}>
        <Input
          {...register("company")}
          placeholder="Visitor's company name"
          className="h-9"
        />
      </FormField>
      <FormField label="Host (ADI Employee)" required error={errors.host?.message}>
        <Input
          {...register("host")}
          placeholder="Name of the ADI employee hosting the visit"
          className="h-9"
        />
      </FormField>
      <FormField label="Purpose of Visit" required error={errors.purpose?.message} className="col-span-full">
        <Input
          {...register("purpose")}
          placeholder="e.g. Crane Inspection, Vendor Meeting"
          className="h-9"
        />
      </FormField>
      <FormField label="Valid From" required error={errors.validFrom?.message}>
        <Input
          {...register("validFrom")}
          type="date"
          className="h-9"
        />
      </FormField>
      <FormField label="Valid Until" required error={errors.validUntil?.message}>
        <Input
          {...register("validUntil")}
          type="date"
          className="h-9"
        />
      </FormField>
      <FormField label="Items Carried / Tools" error={errors.itemsCarried?.message} className="col-span-full">
        <Textarea
          {...register("itemsCarried")}
          placeholder="List any tools, equipment, or items the visitor is bringing..."
          rows={3}
        />
      </FormField>
    </>
  );
}

// ─── Toast Component ──────────────────────────────────────────────────────────

function SuccessToast({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-white border border-emerald-200 rounded-lg shadow-lg px-4 py-3 max-w-sm animate-in slide-in-from-top-2">
      <CheckCircle className="size-5 text-emerald-600 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900">Request Submitted</p>
        <p className="text-xs text-slate-500 mt-0.5">Your request has been submitted successfully.</p>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 text-xl leading-none font-bold ml-2 shrink-0"
        aria-label="Dismiss"
      >
        &times;
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NewRequestPage() {
  const router = useRouter();
  const params = useParams();
  const rawType =
    typeof params.type === "string"
      ? params.type
      : Array.isArray(params.type)
      ? params.type[0]
      : "";
  const requestType = rawType as RequestTypeKey;
  const typeLabel = REQUEST_TYPE_LABELS[requestType] ?? rawType.replace(/_/g, " ");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const schema = SCHEMA_MAP[requestType] ?? commonSchema;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onSubmit(_data: any) {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        router.push("/workspace");
      }, 2000);
    }, 800);
  }

  function renderTypeFields() {
    const props: FormFieldsProps = {
      register,
      control,
      errors,
    };

    switch (requestType) {
      case "equipment":
        return <EquipmentFields {...props} />;
      case "material":
        return <MaterialFields {...props} />;
      case "service":
        return <ServiceFields {...props} />;
      case "rental":
        return <RentalFields {...props} />;
      case "rig_move":
        return <RigMoveFields {...props} />;
      case "inspection":
        return <InspectionFields {...props} />;
      case "document_review":
        return <DocumentReviewFields {...props} />;
      case "manpower":
        return <ManpowerFields {...props} />;
      case "qc_support":
        return <QcSupportFields {...props} />;
      case "moc":
        return <MocFields {...props} />;
      case "nco":
        return <NcoFields {...props} />;
      case "hr":
        return <HrFields {...props} />;
      case "logistics":
        return <LogisticsFields {...props} />;
      case "maintenance":
        return <MaintenanceFields {...props} />;
      case "gate_pass":
        return <GatePassFields {...props} />;
      default:
        return (
          <div className="col-span-full text-sm text-slate-500 py-4 text-center">
            No additional fields required for this request type.
          </div>
        );
    }
  }

  const priorityError = (errors.priority?.message as string | undefined);
  const requiredByError = (errors.requiredBy?.message as string | undefined);
  const locationError = (errors.location?.message as string | undefined);
  const descriptionError = (errors.description?.message as string | undefined);

  return (
    <div className="min-h-screen bg-slate-50">
      {showToast && <SuccessToast onClose={() => setShowToast(false)} />}

      {/* Page Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => router.push("/workspace")}
              className="flex items-center justify-center h-8 w-8 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
              aria-label="Back to workspace"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div className="min-w-0">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                Workspace / New Request
              </p>
              <h1 className="text-lg font-bold text-slate-900 leading-tight truncate">
                New {typeLabel} Request
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push("/workspace")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="request-form"
              size="sm"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Form Body */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <form id="request-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-8">
            {/* Common Fields Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Common Information
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Required fields for all request types
                </p>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Priority */}
                <FormField label="Priority" required error={priorityError}>
                  <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={(field.value as string) ?? ""}>
                        <SelectTrigger className="w-full h-9">
                          <SelectValue placeholder="Select priority level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">
                            <span className="flex items-center gap-2">
                              <span className="size-2 rounded-full bg-red-600 inline-block shrink-0" />
                              Critical
                            </span>
                          </SelectItem>
                          <SelectItem value="urgent">
                            <span className="flex items-center gap-2">
                              <span className="size-2 rounded-full bg-orange-500 inline-block shrink-0" />
                              Urgent
                            </span>
                          </SelectItem>
                          <SelectItem value="high">
                            <span className="flex items-center gap-2">
                              <span className="size-2 rounded-full bg-amber-500 inline-block shrink-0" />
                              High
                            </span>
                          </SelectItem>
                          <SelectItem value="routine">
                            <span className="flex items-center gap-2">
                              <span className="size-2 rounded-full bg-blue-500 inline-block shrink-0" />
                              Routine
                            </span>
                          </SelectItem>
                          <SelectItem value="planned">
                            <span className="flex items-center gap-2">
                              <span className="size-2 rounded-full bg-slate-400 inline-block shrink-0" />
                              Planned
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>

                {/* Required By */}
                <FormField label="Required By" required error={requiredByError}>
                  <Input
                    {...register("requiredBy")}
                    type="date"
                    className="h-9"
                  />
                </FormField>

                {/* Location / Rig */}
                <FormField label="Location / Rig" required error={locationError}>
                  <Controller
                    name="location"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={(field.value as string) ?? ""}>
                        <SelectTrigger className="w-full h-9">
                          <SelectValue placeholder="Select rig or location" />
                        </SelectTrigger>
                        <SelectContent>
                          {RIGS.map((rig) => (
                            <SelectItem key={rig.value} value={rig.value}>
                              {rig.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>

                {/* Description */}
                <div className="col-span-full">
                  <FormField label="Description" required error={descriptionError}>
                    <Textarea
                      {...register("description")}
                      placeholder="Provide a clear and detailed description of the request..."
                      rows={4}
                    />
                  </FormField>
                </div>
              </div>
            </div>

            {/* Type-Specific Fields Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  {typeLabel} Specific Details
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fields specific to this request type
                </p>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                {renderTypeFields()}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 pb-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/workspace")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[140px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
