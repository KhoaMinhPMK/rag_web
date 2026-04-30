import { z } from 'zod'

// ============================================================================
// RBAC & Auth
// ============================================================================

export const RoleSchema = z.enum(['clinician', 'radiologist', 'researcher', 'admin'])
export type Role = z.infer<typeof RoleSchema>

export const UserSessionSchema = z.object({
  userId: z.string(),
  role: RoleSchema,
  department: z.string().optional(),
  displayName: z.string(),
})
export type UserSession = z.infer<typeof UserSessionSchema>

// ============================================================================
// Episode & Patient Context
// ============================================================================

export const PatientContextSchema = z.object({
  episodeId: z.string(),
  patientId: z.string(),
  age: z.string(),
  gender: z.string(),
  admittedAt: z.string(),
  department: z.string(),
  sensitivityLevel: z.string(),
  dataStatus: z.string(),
})
export type PatientContext = z.infer<typeof PatientContextSchema>

export const EpisodeSchema = z.object({
  id: z.string(),
  episodeId: z.string(),
  patientContext: PatientContextSchema,
  imageId: z.string().optional(),
  imagePath: z.string().optional(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type Episode = z.infer<typeof EpisodeSchema>

// ============================================================================
// Detector & Model Output
// ============================================================================

export const DetectorFindingSchema = z.object({
  bbox: z.tuple([z.number(), z.number(), z.number(), z.number()]),
  label: z.string(),
  score: z.number(),
})
export type DetectorFinding = z.infer<typeof DetectorFindingSchema>

export const DetectorOutputSchema = z.object({
  imageId: z.string(),
  detections: z.array(DetectorFindingSchema),
  modelName: z.string(),
  modelVersion: z.string(),
  generatedAt: z.string(),
})
export type DetectorOutput = z.infer<typeof DetectorOutputSchema>

export const LLMReadyPayloadSchema = z.object({
  findingCount: z.number(),
  topFinding: z.string().optional(),
  findings: z.array(
    z.object({
      label: z.string(),
      score: z.number(),
      rank: z.number(),
    })
  ),
  requiresHumanReview: z.boolean(),
  usageGuardrails: z.object({
    intendedUse: z.string(),
    notForDiagnosis: z.boolean(),
  }),
})
export type LLMReadyPayload = z.infer<typeof LLMReadyPayloadSchema>

// ============================================================================
// Knowledge & Citations
// ============================================================================

export const StatusKindSchema = z.enum([
  'draft',
  'under_review',
  'approved',
  'needs_evidence',
  'policy_blocked',
  'low_confidence',
  'outdated_source',
])
export type StatusKind = z.infer<typeof StatusKindSchema>

export const CitationSchema = z.object({
  id: z.string(),
  ordinal: z.number(),
  title: z.string(),
  owner: z.string(),
  version: z.string(),
  effectiveDate: z.string(),
  excerpt: z.string(),
  status: StatusKindSchema,
})
export type Citation = z.infer<typeof CitationSchema>

export const AnswerCardSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
  citations: z.array(CitationSchema),
  modelVersion: z.string(),
  generatedAt: z.string(),
  confidence: z.number().optional(),
  uncertainty: z.string().optional(),
  status: z.enum(['success', 'insufficient_evidence', 'out_of_scope', 'error']),
})
export type AnswerCard = z.infer<typeof AnswerCardSchema>

// ============================================================================
// Draft Reports
// ============================================================================

export const FieldSourceSchema = z.enum(['ai', 'auto', 'manual', 'locked'])
export type FieldSource = z.infer<typeof FieldSourceSchema>

export const DraftFieldSchema = z.object({
  id: z.string(),
  section: z.string(),
  label: z.string(),
  value: z.string(),
  source: FieldSourceSchema,
  status: StatusKindSchema,
  required: z.boolean(),
  citationId: z.string(),
  warning: z.string().optional(),
  changed: z.boolean().optional(),
})
export type DraftField = z.infer<typeof DraftFieldSchema>

export const DraftReportSchema = z.object({
  id: z.string(),
  draftId: z.string(),
  episodeId: z.string(),
  templateId: z.string(),
  templateVersion: z.string(),
  fields: z.array(DraftFieldSchema),
  status: StatusKindSchema,
  createdBy: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  approvedBy: z.string().optional(),
  approvedAt: z.string().optional(),
})
export type DraftReport = z.infer<typeof DraftReportSchema>

export const TemplateRecordSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  intendedUse: z.string(),
  requiredFields: z.number(),
  optionalFields: z.number(),
  lockedFields: z.number(),
  active: z.boolean(),
})
export type TemplateRecord = z.infer<typeof TemplateRecordSchema>

// ============================================================================
// Worklist & Dashboard
// ============================================================================

export const WorklistItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  patientLabel: z.string(),
  department: z.string(),
  status: StatusKindSchema,
  dueDate: z.string(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
})
export type WorklistItem = z.infer<typeof WorklistItemSchema>

export const DashboardWidgetSchema = z.object({
  title: z.string(),
  value: z.string(),
  detail: z.string(),
  status: StatusKindSchema,
  trend: z.string().optional(),
})
export type DashboardWidget = z.infer<typeof DashboardWidgetSchema>

// ============================================================================
// Audit
// ============================================================================

export const AuditEventSchema = z.object({
  id: z.string(),
  eventType: z.string(),
  userId: z.string(),
  episodeId: z.string().optional(),
  draftId: z.string().optional(),
  action: z.string(),
  details: z.string(),
  timestamp: z.string(),
})
export type AuditEvent = z.infer<typeof AuditEventSchema>
