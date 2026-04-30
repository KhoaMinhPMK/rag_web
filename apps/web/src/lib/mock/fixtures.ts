import type {
  Role,
  UserSession,
  Episode,
  PatientContext,
  DetectorOutput,
  LLMReadyPayload,
  Citation,
  AnswerCard,
  DraftReport,
  DraftField,
  TemplateRecord,
  WorklistItem,
  DashboardWidget,
  AuditEvent,
  StatusKind,
  FieldSource,
} from '@/types'

// ============================================================================
// ROLES
// ============================================================================

export const MOCK_ROLES: Array<{ id: Role; label: string; landing: string }> = [
  { id: 'clinician', label: 'Bác sĩ lâm sàng', landing: 'Worklist theo khoa' },
  { id: 'radiologist', label: 'Bác sĩ CĐHA', landing: 'Draft đang chờ duyệt' },
  { id: 'researcher', label: 'Nghiên cứu viên', landing: 'Dữ liệu & so sánh' },
  { id: 'admin', label: 'Quản trị hệ thống', landing: 'Kiểm toán & sức khỏe hệ thống' },
]

// ============================================================================
// PATIENT CONTEXT & EPISODES
// ============================================================================

export const MOCK_PATIENT_CONTEXT: PatientContext = {
  episodeId: 'EP-PED-2404-0187',
  patientId: 'PT-2404-0187',
  age: '38 tháng',
  gender: 'Nam',
  admittedAt: '29/04/2026 08:42',
  department: 'Khoa Hô hấp',
  sensitivityLevel: 'Nội bộ – lâm sàng',
  dataStatus: 'Thiếu 1 kết quả CRP',
}

export const MOCK_EPISODES: Episode[] = [
  {
    id: '1',
    episodeId: 'EP-PED-2404-0187',
    patientContext: MOCK_PATIENT_CONTEXT,
    imageId: 'img-001',
    imagePath: '/mock/xray-001.jpg',
    status: 'active',
    createdAt: '2026-04-29T08:42:00Z',
    updatedAt: '2026-04-30T09:15:00Z',
  },
]

// ============================================================================
// DETECTOR OUTPUT
// ============================================================================

export const MOCK_DETECTOR_OUTPUT: DetectorOutput = {
  imageId: 'img-001',
  detections: [
    {
      bbox: [525, 666, 934, 1126],
      label: 'Consolidation',
      score: 0.81,
    },
    {
      bbox: [154, 435, 346, 627],
      label: 'Pleural effusion',
      score: 0.67,
    },
  ],
  modelName: 'pcxr-detector-v2',
  modelVersion: '2.1.0',
  generatedAt: '2026-04-30T09:10:00Z',
}

export const MOCK_LLM_READY_PAYLOAD: LLMReadyPayload = {
  findingCount: 2,
  topFinding: 'consolidation',
  findings: [
    { label: 'Consolidation', score: 0.81, rank: 1 },
    { label: 'Pleural effusion', score: 0.67, rank: 2 },
  ],
  requiresHumanReview: true,
  usageGuardrails: {
    intendedUse: 'Hỗ trợ đọc phim, không thay thế chẩn đoán',
    notForDiagnosis: true,
  },
}

// ============================================================================
// CITATIONS
// ============================================================================

export const MOCK_CITATIONS: Citation[] = [
  {
    id: 'cit-01',
    ordinal: 1,
    title: 'WHO Standardized Interpretation of Paediatric Chest Radiographs',
    owner: 'Khoa CĐHA',
    version: 'v2.1',
    effectiveDate: '2025-01-15',
    excerpt:
      'Consolidation is defined as a dense opacity that may be a lobar or segmental distribution...',
    status: 'approved',
  },
  {
    id: 'cit-02',
    ordinal: 2,
    title: 'Hướng dẫn chẩn đoán viêm phổi Nhi khoa',
    owner: 'Khoa Hô hấp',
    version: 'v3.2',
    effectiveDate: '2025-01-15',
    excerpt: 'Viêm phổi thùy thường biểu hiện mờ đồng nhất vùng thùy phổi...',
    status: 'approved',
  },
  {
    id: 'cit-03',
    ordinal: 3,
    title: 'SOP đọc phim X-quang ngực trẻ em',
    owner: 'Khoa CĐHA',
    version: 'v2.7',
    effectiveDate: '2024-11-20',
    excerpt: 'Cần đối chiếu với triệu chứng lâm sàng và xét nghiệm viêm...',
    status: 'outdated_source',
  },
]

// ============================================================================
// ANSWER CARDS (Knowledge Query)
// ============================================================================

export const MOCK_ANSWER_SUCCESS: AnswerCard = {
  id: 'ans-001',
  question: 'Tiêu chuẩn chẩn đoán viêm phổi trên X-quang ngực trẻ em theo WHO?',
  answer:
    'Theo WHO, viêm phổi trên X-quang ngực trẻ em được chẩn đoán khi có mờ đồng đặc (consolidation) hoặc tràn dịch màng phổi. Consolidation là vùng mờ đậm đặc có thể theo phân bố thùy hoặc phân thùy, che khuất bờ tim hoặc cơ hoành. Cần đối chiếu với triệu chứng lâm sàng (sốt, ho, khó thở) và xét nghiệm viêm.',
  citations: [MOCK_CITATIONS[0]!, MOCK_CITATIONS[1]!],
  modelVersion: 'rag-v1.2.0',
  generatedAt: '2026-04-30T09:20:00Z',
  confidence: 0.92,
  status: 'success',
}

export const MOCK_ANSWER_INSUFFICIENT: AnswerCard = {
  id: 'ans-002',
  question: 'Liều kháng sinh cho trẻ 2 tuổi viêm phổi nặng?',
  answer: '',
  citations: [],
  modelVersion: 'rag-v1.2.0',
  generatedAt: '2026-04-30T09:21:00Z',
  status: 'insufficient_evidence',
  uncertainty: 'Không đủ bằng chứng nội bộ để trả lời an toàn cho yêu cầu này.',
}

export const MOCK_ANSWER_OUT_OF_SCOPE: AnswerCard = {
  id: 'ans-003',
  question: 'Cách điều trị ung thư phổi giai đoạn cuối?',
  answer: '',
  citations: [],
  modelVersion: 'rag-v1.2.0',
  generatedAt: '2026-04-30T09:22:00Z',
  status: 'out_of_scope',
  uncertainty: 'Yêu cầu này vượt phạm vi sử dụng đã phê duyệt của hệ thống.',
}

// ============================================================================
// DRAFT REPORTS
// ============================================================================

export const MOCK_DRAFT_FIELDS: DraftField[] = [
  {
    id: 'field-findings',
    section: 'Phát hiện',
    label: 'Tổn thương chính',
    value: 'Mờ khu trú vùng đáy phổi phải, cần đối chiếu dấu hiệu lâm sàng và diễn tiến sốt.',
    source: 'ai',
    status: 'needs_evidence',
    required: true,
    citationId: 'cit-01',
    warning: 'Evidence chưa đủ để kết luận viêm phổi, cần người duyệt xác nhận.',
  },
  {
    id: 'field-uncertainty',
    section: 'Nhận định',
    label: 'Mức độ không chắc chắn',
    value: 'Trung bình–cao do thiếu CRP và phim chụp chưa tối ưu.',
    source: 'ai',
    status: 'low_confidence',
    required: true,
    citationId: 'cit-01',
    warning: 'Uncertainty cao: không cho phê duyệt nếu chưa ghi nhận caveat.',
  },
  {
    id: 'field-context',
    section: 'Bối cảnh',
    label: 'Thông tin lâm sàng liên quan',
    value: 'Ho, sốt 2 ngày, SpO2 95% khi thở khí phòng, chưa có kết quả CRP.',
    source: 'manual',
    status: 'under_review',
    required: true,
    citationId: 'cit-01',
    changed: true,
  },
  {
    id: 'field-policy',
    section: 'Policy',
    label: 'Giới hạn sử dụng',
    value: 'Đây là nháp do hệ thống hỗ trợ sinh, cần bác sĩ được phân quyền duyệt.',
    source: 'locked',
    status: 'policy_blocked',
    required: true,
    citationId: 'cit-03',
    warning: 'Field khóa theo policy và không thể chỉnh sửa.',
  },
]

export const MOCK_DRAFT_REPORT: DraftReport = {
  id: '1',
  draftId: 'DR-1842',
  episodeId: 'EP-PED-2404-0187',
  templateId: 'tpl-pcxr',
  templateVersion: 'v2.7',
  fields: MOCK_DRAFT_FIELDS,
  status: 'under_review',
  createdBy: 'system',
  createdAt: '2026-04-30T09:15:00Z',
  updatedAt: '2026-04-30T09:25:00Z',
}

// ============================================================================
// TEMPLATES
// ============================================================================

export const MOCK_TEMPLATES: TemplateRecord[] = [
  {
    id: 'tpl-pcxr',
    name: 'Báo cáo PCXR có cấu trúc',
    version: 'v2.7',
    intendedUse: 'Hỗ trợ đọc phim X-quang ngực Nhi khoa',
    requiredFields: 8,
    optionalFields: 5,
    lockedFields: 3,
    active: true,
  },
]

// ============================================================================
// WORKLIST & DASHBOARD
// ============================================================================

export const MOCK_WORKLIST_ITEMS: WorklistItem[] = [
  {
    id: '1',
    title: 'Draft DR-1842 cần review',
    patientLabel: 'EP-PED-2404-0187',
    department: 'Khoa Hô hấp',
    status: 'under_review',
    dueDate: '2026-04-30',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Episode EP-PED-2404-0188 cần giải thích',
    patientLabel: 'EP-PED-2404-0188',
    department: 'Khoa Hô hấp',
    status: 'needs_evidence',
    dueDate: '2026-04-30',
    priority: 'medium',
  },
]

export const MOCK_DASHBOARD_WIDGETS: DashboardWidget[] = [
  {
    title: 'Draft cần review',
    value: '18',
    detail: '6 draft có warning cần xử lý trong hôm nay',
    status: 'under_review',
    trend: '+4 so với trực trước',
  },
  {
    title: 'Chờ phê duyệt',
    value: '7',
    detail: '2 hồ sơ có blocker về evidence',
    status: 'needs_evidence',
    trend: 'Ưu tiên CĐHA',
  },
  {
    title: 'Citation bị flag',
    value: '5',
    detail: '1 tài liệu có nguy cơ superseded',
    status: 'outdated_source',
    trend: 'Cần QA xem lại',
  },
]

// ============================================================================
// AUDIT EVENTS
// ============================================================================

export const MOCK_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'evt-001',
    eventType: 'query_submitted',
    userId: 'user-001',
    action: 'Query submitted với filter tài liệu đang hiệu lực',
    details: 'Question: Tiêu chuẩn chẩn đoán viêm phổi...',
    timestamp: '2026-04-30T09:20:00Z',
  },
  {
    id: 'evt-002',
    eventType: 'citation_opened',
    userId: 'user-001',
    action: 'Citation cit-01 mở từ answer card',
    details: 'WHO Standardized Interpretation...',
    timestamp: '2026-04-30T09:21:00Z',
  },
  {
    id: 'evt-003',
    eventType: 'field_edited',
    userId: 'user-001',
    draftId: 'DR-1842',
    action: 'Field "Thông tin lâm sàng" được sửa',
    details: 'Changed by BS Nguyễn Minh Khang',
    timestamp: '2026-04-30T09:25:00Z',
  },
]

// ============================================================================
// MICROCOPY
// ============================================================================

export const MICROCOPY = {
  intendedUse:
    'Hệ thống hỗ trợ tri thức và draft có kiểm soát. Không thay thế kết luận chuyên môn của bác sĩ.',
  draftBanner:
    'Đây là nháp do hệ thống hỗ trợ sinh. Cần người được phân quyền rà soát trước khi sử dụng.',
  insufficientEvidence: 'Không đủ bằng chứng nội bộ để trả lời an toàn cho yêu cầu này.',
  outOfScope: 'Yêu cầu này vượt phạm vi sử dụng đã phê duyệt của hệ thống.',
  citationFlagged: 'Một hoặc nhiều trích dẫn cần được kiểm tra lại trước khi tiếp tục.',
  compareModeWarning:
    'Chế độ này chỉ dùng cho nghiên cứu và không phục vụ phát hành nội dung lâm sàng.',
} as const
