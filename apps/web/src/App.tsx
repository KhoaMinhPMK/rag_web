import { useMemo, useState, useRef, type ReactNode } from 'react'
import {
  Bell,
  CaretDown,
  CaretLeft,
  CaretRight,
  Check,
  ClipboardText,
  FirstAidKit,
  FolderOpen,
  House,
  MagnifyingGlass,
  Pulse,
  ShieldCheck,
  Stethoscope,
  X,
} from '@phosphor-icons/react'
import {
  MICROCOPY,
  auditEvents,
  citations,
  dashboardWidgets,
  draftFields,
  navItems,
  patientContext,
  roles,
  taskItems,
  templates,
  type Citation,
  type DraftField,
  type Role,
  type ScreenId,
} from './data/mvpData'
import {
  FieldBadge,
  IntendedUseTag,
  ProvenanceChip,
  StatusChip,
  WarningBanner,
} from './components/medical'
import { cn } from './lib/cn'

type QueryState = 'idle' | 'searching' | 'answered' | 'refused'

const screenIcon: Record<ScreenId, typeof House> = {
  login: ShieldCheck,
  dashboard: House,
  query: MagnifyingGlass,
  episode: Stethoscope,
  draft: ClipboardText,
}

const screenTitle: Record<ScreenId, string> = {
  login: 'Đăng nhập',
  dashboard: 'Work queue',
  query: 'Tra cứu bằng chứng',
  episode: 'Bàn làm việc ca bệnh',
  draft: 'Rà soát draft',
}

const railLabel: Record<ScreenId, string> = {
  login: 'Đăng nhập',
  dashboard: 'Hàng đợi',
  query: 'Tra cứu',
  episode: 'Ca bệnh',
  draft: 'Rà soát',
}

function citationAt(index: number): Citation {
  const citation = citations[index]
  if (!citation) {
    throw new Error(`Missing synthetic citation fixture at index ${index}`)
  }
  return citation
}

export function App() {
  const [screen, setScreen] = useState<ScreenId>('login')
  const [role, setRole] = useState<Role>('radiologist')
  const [activeCitation, setActiveCitation] = useState<Citation>(citationAt(0))
  const [isCitationOpen, setIsCitationOpen] = useState(false)
  const [isTemplateOpen, setIsTemplateOpen] = useState(false)
  const [isApprovalOpen, setIsApprovalOpen] = useState(false)
  const [queryState, setQueryState] = useState<QueryState>('answered')
  const [selectedFieldId, setSelectedFieldId] = useState(draftFields[1]?.id ?? '')

  const citationById = useMemo(
    () => new Map(citations.map((citation) => [citation.id, citation])),
    [],
  )

  const openCitation = (citation: Citation) => {
    setActiveCitation(citation)
    setIsCitationOpen(true)
  }

  const selectCitation = (citation: Citation) => {
    setActiveCitation(citation)
  }

  const handleNavigate = (target: ScreenId) => {
    setScreen(target)
    if (target === 'draft') {
      const field = draftFields.find((item) => item.id === selectedFieldId) ?? draftFields[0]
      const citation = field ? citationById.get(field.citationId) : undefined
      if (citation) {
        setActiveCitation(citation)
      }
    }
  }

  if (screen === 'login') {
    return (
      <LoginScreen
        role={role}
        setRole={setRole}
        onLogin={() => handleNavigate('dashboard')}
      />
    )
  }

  return (
    <div className="workstation">
      <a className="skip-link" href="#main-content">
        Bỏ qua đến nội dung chính
      </a>

      <WorkstationShell
        activeScreen={screen}
        role={role}
        onNavigate={handleNavigate}
        onOpenAlerts={() => openCitation(citationAt(2))}
      >
        {screen === 'dashboard' && (
          <WorkQueueScreen onNavigate={handleNavigate} onOpenCitation={openCitation} />
        )}
        {screen === 'query' && (
          <EvidenceQueryScreen
            activeCitation={activeCitation}
            queryState={queryState}
            setQueryState={setQueryState}
            onNavigate={handleNavigate}
            onOpenCitation={openCitation}
            onSelectCitation={selectCitation}
          />
        )}
        {screen === 'episode' && (
          <EpisodeWorkspace
            onNavigate={handleNavigate}
            onOpenCitation={openCitation}
            onOpenTemplate={() => setIsTemplateOpen(true)}
          />
        )}
        {screen === 'draft' && (
          <DraftReviewWorkspace
            activeCitation={activeCitation}
            citationById={citationById}
            selectedFieldId={selectedFieldId}
            setSelectedFieldId={setSelectedFieldId}
            onOpenApproval={() => setIsApprovalOpen(true)}
            onOpenCitation={openCitation}
            onSelectCitation={selectCitation}
          />
        )}
      </WorkstationShell>

      {isCitationOpen && (
        <CitationSlideOver citation={activeCitation} onClose={() => setIsCitationOpen(false)} />
      )}

      {isTemplateOpen && (
        <TemplateDialog
          onClose={() => setIsTemplateOpen(false)}
          onCreate={() => {
            setIsTemplateOpen(false)
            handleNavigate('draft')
          }}
        />
      )}

      {isApprovalOpen && <ApprovalDialog onClose={() => setIsApprovalOpen(false)} />}
    </div>
  )
}

function LoginScreen({
  role,
  setRole,
  onLogin,
}: {
  role: Role
  setRole: (role: Role) => void
  onLogin: () => void
}) {
  return (
    <main className="login-workstation" id="main-content">
      <section className="login-product-panel">
        <div className="hospital-lockup">
          <FirstAidKit size={30} weight="duotone" />
          <div>
            <strong>BV Nhi Đồng</strong>
            <span>Mô-đun tri thức lâm sàng RAG</span>
          </div>
        </div>
        <div className="login-scope">
          <span>Mục đích sử dụng</span>
          <p>
            Công cụ tra cứu tri thức nội bộ, sinh nhập giải thích và nhập báo cáo
            có người duyệt. Không phải công cụ chẩn đoán độc lập.
          </p>
        </div>
        <div className="login-requirements">
          <RequirementRow code="RAG-F-04" text="Câu trả lời phải kèm citation và phiên bản." />
          <RequirementRow code="RAG-RP-05" text="Mọi field AI phải truy vết nguồn bằng chứng." />
          <RequirementRow code="RAG-UI-12" text="Lỗi schema hoặc thiếu citation phải fail closed." />
        </div>
      </section>

      <section className="login-form-panel" aria-label="Đăng nhập hệ thống">
        <div className="panel-title">
          <ShieldCheck size={18} weight="bold" />
          <div>
            <h1>Đăng nhập phiên làm việc</h1>
            <p>Mock auth phục vụ UI sprint. Dữ liệu hiển thị là synthetic.</p>
          </div>
        </div>

        <label>
          Tài khoản nội bộ
          <input defaultValue="bs.cdha@benhvien.local" type="email" />
        </label>
        <label>
          Mật khẩu
          <input defaultValue="demo-safe-flow" type="password" />
        </label>
        <label>
          Vai trò sử dụng
          <select value={role} onChange={(event) => setRole(event.target.value as Role)}>
            {roles.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label} – {item.landing}
              </option>
            ))}
          </select>
        </label>

        <button className="button-primary" onClick={onLogin} type="button">
          Mở work queue
        </button>

        <div className="audit-note">
          Hệ thống ghi audit cho login, role, policy bundle và mọi thao tác nghiệp vụ.
        </div>
      </section>
    </main>
  )
}

function RequirementRow({ code, text }: { code: string; text: string }) {
  return (
    <div className="requirement-row">
      <code>{code}</code>
      <span>{text}</span>
    </div>
  )
}

function WorkstationShell({
  activeScreen,
  role,
  onNavigate,
  onOpenAlerts,
  children,
}: {
  activeScreen: ScreenId
  role: Role
  onNavigate: (screen: ScreenId) => void
  onOpenAlerts: () => void
  children: ReactNode
}) {
  const CurrentIcon = screenIcon[activeScreen]
  const [isRailCollapsed, setIsRailCollapsed] = useState(false)

  return (
    <div className={cn('app-frame', isRailCollapsed && 'app-frame-rail-collapsed')}>
      <aside
        className={cn('module-rail', isRailCollapsed && 'module-rail-collapsed')}
        aria-label="Điều hướng module"
      >
        <button
          aria-label={isRailCollapsed ? 'Mở rộng điều hướng' : 'Thu gọn điều hướng'}
          className="rail-toggle"
          onClick={() => setIsRailCollapsed((current) => !current)}
          type="button"
        >
          {isRailCollapsed ? <CaretRight size={11} weight="bold" /> : <CaretLeft size={11} weight="bold" />}
        </button>

        <button className="rail-brand" onClick={() => onNavigate('dashboard')} type="button">
          <div className="rail-brand-mark">
            <FirstAidKit size={22} weight="duotone" />
          </div>
          <div className="rail-brand-copy">
            <strong>RAG</strong>
            <span>Nội bộ</span>
          </div>
        </button>

        <span className="rail-section-label">Modules</span>

        <nav className="rail-nav">
          {navItems.map((item) => {
            const Icon = screenIcon[item.id]
            return (
              <button
                className={cn('rail-item', activeScreen === item.id && 'rail-item-active')}
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={item.label}
                type="button"
              >
                <div className="rail-item-icon">
                  <Icon size={18} weight="bold" />
                </div>
                <div className="rail-item-copy">
                  <strong>{railLabel[item.id]}</strong>
                  <span>{item.code}</span>
                </div>
              </button>
            )
          })}
        </nav>

        <div className="rail-status">
          <Pulse size={17} weight="bold" />
          <div>
            <strong>Online</strong>
            <span>Verifier</span>
          </div>
        </div>
      </aside>

      <section className="workspace-shell">
        <header className="system-toolbar">
          <div className="toolbar-context">
            <CurrentIcon size={19} weight="bold" />
            <div>
              <strong>{screenTitle[activeScreen]}</strong>
              <span>Policy bundle PB-2026.04.29 – verifier online</span>
            </div>
          </div>

          <div className="toolbar-search">
            <MagnifyingGlass size={15} weight="bold" />
            <span>Tìm episode, draft, guideline, sự kiện audit</span>
            <kbd>Ctrl K</kbd>
          </div>

          <div className="toolbar-user">
            <button className="icon-button" onClick={onOpenAlerts} type="button">
              <Bell size={17} weight="bold" />
            </button>
            <div className="user-context">
              <strong>{roles.find((item) => item.id === role)?.label}</strong>
              <span>Khoa Hô hấp</span>
            </div>
          </div>
        </header>

        <main className="workspace-content" id="main-content">
          {children}
        </main>
      </section>
    </div>
  )
}

function PatientContextStrip() {
  return (
    <section className="patient-strip" aria-label="Thông tin ca bệnh">
      <DataCell label="Episode" value={patientContext.episodeId} />
      <DataCell label="Bệnh nhi" value={`${patientContext.age}, ${patientContext.gender}`} />
      <DataCell label="Tiếp nhận" value={patientContext.admittedAt} />
      <DataCell label="Khoa" value={patientContext.department} />
      <DataCell label="Bảo mật" value={patientContext.sensitivityLevel} />
      <div className="patient-strip-status">
        <StatusChip status="needs_evidence" />
        <span>{patientContext.dataStatus}</span>
      </div>
    </section>
  )
}

function DataCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="data-cell">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function WorkQueueScreen({
  onNavigate,
  onOpenCitation,
}: {
  onNavigate: (screen: ScreenId) => void
  onOpenCitation: (citation: Citation) => void
}) {
  return (
    <div className="workspace-grid queue-workspace">
      <section className="workspace-main">
        <ModuleHeader
          code="S01"
          title="Work queue & dashboard vận hành"
          description="Danh sách việc cần xử lý, lọc theo khoa/phiên trực, và cảnh báo hệ thống."
          actions={
            <>
              <button className="button-secondary" onClick={() => onNavigate('query')} type="button">
                Tra cứu tri thức
              </button>
              <button className="button-primary" onClick={() => onNavigate('episode')} type="button">
                Mở episode
              </button>
            </>
          }
        />

        <FilterToolbar
          items={['Tất cả', 'Chờ duyệt', 'Có warning', 'Khoa Hô hấp', 'Hôm nay', 'Owner: tôi']}
        />

        <section className="ops-status-table" aria-label="Trạng thái vận hành">
          <div className="ops-row ops-row-head" role="row">
            <span>Hạng mục</span>
            <span>Số lượng</span>
            <span>Chi tiết</span>
            <span>Trạng thái</span>
          </div>
          {dashboardWidgets.map((widget) => (
            <button
              className="ops-row"
              data-status={widget.status}
              key={widget.title}
              onClick={() =>
                widget.status === 'outdated_source'
                  ? onOpenCitation(citationAt(2))
                  : onNavigate(widget.status === 'draft' ? 'episode' : 'draft')
              }
              type="button"
            >
              <div className="ops-row-label">
                <strong>{widget.title}</strong>
                <small>{widget.trend}</small>
              </div>
              <code>{widget.value}</code>
              <span>{widget.detail}</span>
              <StatusChip status={widget.status} />
            </button>
          ))}
        </section>

        <section className="work-table-panel">
          <div className="table-header">
            <h2>Task đang chờ xử lý</h2>
            <span>{taskItems.length} mục hiển thị</span>
          </div>
          <div className="work-table" role="table" aria-label="Hàng đợi task">
            <div className="work-row work-row-head" role="row">
              <span>Mã</span>
              <span>Nội dung</span>
              <span>Khoa</span>
              <span>Trạng thái</span>
              <span>Hạn</span>
            </div>
            {taskItems.map((task) => (
              <button
                className="work-row"
                key={task.id}
                onClick={() => onNavigate(task.id.startsWith('CIT') ? 'query' : 'draft')}
                role="row"
                type="button"
              >
                <code>{task.id}</code>
                <span>
                  <strong>{task.title}</strong>
                  <small>{task.patientLabel}</small>
                </span>
                <span>{task.department}</span>
                <StatusChip status={task.status} />
                <span>{task.due}</span>
              </button>
            ))}
          </div>
        </section>
      </section>

      <aside className="workspace-side">
        <Panel title="Cảnh báo an toàn">
          <WarningBanner title="Policy guardrail" tone="info">
            Đầu ra clinical phải có citation, model version và trạng thái review trước khi
            đưa vào draft.
          </WarningBanner>
        </Panel>
        <Panel title="Tình trạng hệ thống">
          <div className="health-grid">
            <DataCell label="Retrieval p95" value="1.7s" />
            <DataCell label="Verifier" value="Online" />
            <DataCell label="Schema fail" value="2 ca" />
            <DataCell label="Audit lag" value="4s" />
          </div>
        </Panel>
        <Panel title="Cập nhật tri thức">
          <CompactList
            items={[
              'SOP đọc phim X-quang ngực trẻ em v3.4 đã active',
              'Guideline viêm phổi v2026.02 thêm metadata owner',
              'Bảng kiểm an toàn AI v1.8 cần review trong 21 ngày',
            ]}
          />
        </Panel>
      </aside>
    </div>
  )
}

const QUERY_MAX = 500

function QueryInputPanel({ onSubmit, onRefuse }: { onSubmit: () => void; onRefuse: () => void }) {
  const defaultQuery =
    'Trẻ 38 tháng có mờ khu trú vùng đáy phổi phải trên PCXR. Cần đối chiếu guideline nào trước khi lập nhập báo cáo?'
  const [query, setQuery] = useState(defaultQuery)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const count = query.length
  const isOverLimit = count > QUERY_MAX
  const isEmpty = query.trim().length === 0

  return (
    <div className="query-input-panel">
      <div className="query-textarea-wrap">
        <label className="query-textarea-label" htmlFor="query-textarea">
          Câu hỏi lâm sàng
        </label>
        <textarea
          id="query-textarea"
          ref={textareaRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nhập câu hỏi lâm sàng..."
          className={isOverLimit ? 'query-textarea-over' : ''}
          spellCheck={false}
        />
        <div className="query-char-counter">
          <span className={isOverLimit ? 'query-char-over' : ''}>
            {count} / {QUERY_MAX}
          </span>
          {isOverLimit && <span className="query-char-warning">Vượt giới hạn ký tự</span>}
        </div>
      </div>
      <FilterToolbar
        compact
        items={['Guideline', 'SOP', 'Nhi khoa', 'Khoa Hô hấp', 'Đang hiệu lực', 'Tiếng Việt']}
      />
      <div className="action-row query-action-row">
        <button
          className="button-primary"
          onClick={onSubmit}
          disabled={isEmpty || isOverLimit}
          type="button"
        >
          Gửi truy vấn
        </button>
        <button className="button-secondary" onClick={onRefuse} type="button">
          Từ chối an toàn
        </button>
      </div>
    </div>
  )
}

function EvidenceQueryScreen({
  activeCitation,
  queryState,
  setQueryState,
  onNavigate,
  onOpenCitation,
  onSelectCitation,
}: {
  activeCitation: Citation
  queryState: QueryState
  setQueryState: (state: QueryState) => void
  onNavigate: (screen: ScreenId) => void
  onOpenCitation: (citation: Citation) => void
  onSelectCitation: (citation: Citation) => void
}) {
  return (
    <div className="evidence-workspace">
      <aside className="query-session-pane">
        <ModuleHeader
          code="S02"
          title="Tra cứu bằng chứng"
          description="Truy vấn guideline/SOP nội bộ."
        />

        <QueryInputPanel onSubmit={() => setQueryState('answered')} onRefuse={() => setQueryState('refused')} />

        <Panel title="Lịch sử truy vấn">
          <CompactList
            items={[
              'Q-5521 – PCXR uncertainty / guideline',
              'Q-5518 – SOP đọc phim cấp cứu',
              'Q-5499 – Template caveat bắt buộc',
            ]}
          />
        </Panel>
      </aside>

      <section className="answer-workbench">
        <div className="answer-panel">
          <div className="answer-toolbar">
            <StatusChip status={queryState === 'refused' ? 'policy_blocked' : 'approved'} />
            <span>Model pcxr-rag-v0.4</span>
            <span>Tổng hợp 29/04/2026 12:04</span>
            <span>3 citations</span>
          </div>

          <div className="answer-panel-body">
            <IntendedUseTag compact />

            {queryState === 'refused' ? (
              <WarningBanner title="Không tạo answer" tone="danger">
                {MICROCOPY.insufficientEvidence}
              </WarningBanner>
            ) : (
              <article className="clinical-answer">
                <h2>Cần ghi nhận tổn thương mờ và mức độ không chắc chắn, không kết luận độc lập.</h2>
                <p>
                  Bằng chứng nội bộ yêu cầu đánh giá mức độ nặng bằng tổng hợp dấu hiệu suy
                  hô hấp, SpO2, tuổi, bệnh nền và kết quả hình ảnh. Nếu thiếu CRP hoặc phim
                  chưa tối ưu, answer phải kèm caveat và không tạo khuyến nghị điều trị bắt buộc.
                </p>
                <WarningBanner title="Cần review citation">
                  Tài liệu an toàn AI sắp đến hạn review, chỉ dùng làm guardrail phụ trợ.
                </WarningBanner>
              </article>
            )}
          </div>

          <div className="feedback-strip">
            <button className="feedback-accept" type="button">Chấp nhận</button>
            <button className="feedback-revise" type="button">Cần chỉnh sửa</button>
            <button className="feedback-reject" type="button">Citation không phù hợp</button>
            <button onClick={() => onNavigate('episode')} type="button">
              Mở ngữ cảnh ca bệnh
            </button>
          </div>
        </div>

      </section>

      <aside className="evidence-document-pane">
        <section className="citation-table-panel">
          <div className="table-header">
            <h2>Citations đã truy hồi</h2>
            <span>Nhấn hàng để đổi</span>
          </div>
          <div className="citation-table">
            {citations.map((citation) => (
              <button
                className={cn(
                  'citation-line',
                  activeCitation.id === citation.id && 'citation-line-active',
                )}
                key={citation.id}
                onClick={() => onSelectCitation(citation)}
                type="button"
              >
                <span>{citation.ordinal}</span>
                <strong>{citation.title}</strong>
                <small>{citation.version}</small>
                <StatusChip status={citation.status} />
              </button>
            ))}
          </div>
        </section>
        <EvidencePanel citation={activeCitation} onOpenFull={onOpenCitation} />
      </aside>
    </div>
  )
}

function EpisodeWorkspace({
  onNavigate,
  onOpenCitation,
  onOpenTemplate,
}: {
  onNavigate: (screen: ScreenId) => void
  onOpenCitation: (citation: Citation) => void
  onOpenTemplate: () => void
}) {
  const primaryEvidence = citationAt(0)
  const workflowTasks = [
    {
      title: 'Bổ sung kết quả CRP',
      detail: 'Case chưa đủ dữ liệu để hạ uncertainty xuống mức có thể phát hành draft.',
    },
    {
      title: 'Xác nhận caveat về chất lượng phim',
      detail: 'Phim hít vào chưa tối ưu nên cần giữ cảnh báo trong phần nhận định.',
    },
    {
      title: 'Đối chiếu guideline viêm phổi',
      detail: 'Mở tài liệu nội bộ trước khi chốt mô tả tổn thương và mức độ nguy cơ.',
    },
  ]

  const dataIssues = [
    {
      status: 'needs_evidence' as const,
      title: 'CRP chưa có kết quả',
      detail: 'Cần cập nhật thêm lab trước khi giảm mức độ cảnh báo và uncertainty.',
    },
    {
      status: 'low_confidence' as const,
      title: 'Chất lượng phim trung bình',
      detail: 'Cần ghi nhận caveat imaging vì phim chưa tối ưu cho kết luận độc lập.',
    },
    {
      status: 'policy_blocked' as const,
      title: 'Draft bắt buộc kèm caveat',
      detail: 'Nếu tạo draft ngay, form phải gán cảnh báo uncertainty theo policy.',
    },
  ]

  return (
    <div className="episode-workspace">
      <PatientContextStrip />
      <div className="workspace-grid episode-grid">
        <section className="workspace-main">
          <ModuleHeader
            code="S03"
            title="Bàn làm việc ca bệnh"
            description="Đưa case về trạng thái sẵn sàng tạo draft bằng cách ưu tiên blocker, bằng chứng chính và caveat bắt buộc."
            actions={
              <>
                <button className="button-secondary" onClick={() => onNavigate('query')} type="button">
                  Tra cứu guideline
                </button>
                <button className="button-primary" onClick={onOpenTemplate} type="button">
                  Tạo draft report
                </button>
              </>
            }
          />

          <FilterToolbar items={['Tổng quan', 'Hình ảnh', 'Lâm sàng', 'Tiền sử', 'Draft']} />

          <section className="episode-priority-grid">
            <Panel title="Trạng thái xử lý ca bệnh" className="episode-decision-panel">
              <div className="episode-decision-copy">
                <StatusChip status="needs_evidence" />
                <h3>Chưa sẵn sàng tạo draft</h3>
                <p>
                  Case này còn blocker về evidence và độ tin cậy imaging. Người duyệt cần đối
                  chiếu kết quả CRP, giữ caveat uncertainty và xác nhận lại mô tả tổn thương
                  trước khi đưa vào draft.
                </p>
              </div>

              <div className="episode-metric-grid">
                <EpisodeMetric
                  detail="Tín hiệu cần review cao, chỉ dùng để ưu tiên xử lý."
                  label="Risk signal"
                  value="64%"
                />
                <EpisodeMetric
                  detail="Thiếu CRP và phim chưa tối ưu nên cần caveat bắt buộc."
                  label="Uncertainty"
                  value="Cao"
                />
                <EpisodeMetric
                  detail="Còn blocker về evidence trước khi tạo draft sạch cảnh báo."
                  label="Sẵn sàng draft"
                  value="Bị chặn"
                />
              </div>

              <IntendedUseTag compact />
            </Panel>

            <Panel title="Việc cần xử lý ngay" className="episode-task-panel">
              <div className="episode-task-list">
                {workflowTasks.map((task) => (
                  <div className="episode-task-item" key={task.title}>
                    <strong>{task.title}</strong>
                    <p>{task.detail}</p>
                  </div>
                ))}
              </div>
            </Panel>
          </section>

          <section className="episode-support-grid">
            <Panel title="Tóm tắt hồ sơ">
              <DefinitionList
                rows={[
                  ['Lý do vào viện', 'Ho, sốt 2 ngày, nghi nhiễm trùng hô hấp dưới.'],
                  ['Hình ảnh', '1 PCXR, chất lượng trung bình, cần đối chiếu lâm sàng.'],
                  ['Lab', 'WBC đã có, CRP đang chờ kết quả.'],
                  ['Trạng thái dữ liệu', 'Thiếu 1 kết quả CRP, metadata imaging đã đồng bộ.'],
                ]}
              />
            </Panel>

            <Panel title="Lập luận lâm sàng" className="episode-explanation-panel">
              <div className="episode-narrative">
                <div className="episode-narrative-item">
                  <span>Tóm tắt</span>
                  <p>Cần review tổn thương mờ vùng đáy phổi phải trước khi chốt nội dung draft.</p>
                </div>
                <div className="episode-narrative-item">
                  <span>Bằng chứng chính</span>
                  <p>
                    {primaryEvidence.title} là tài liệu ưu tiên để đối chiếu ngưỡng cảnh báo và
                    mức độ caveat trong nhận định.
                  </p>
                  <button
                    className="button-secondary"
                    onClick={() => onOpenCitation(primaryEvidence)}
                    type="button"
                  >
                    Mở guideline ưu tiên
                  </button>
                </div>
                <div className="episode-narrative-item">
                  <span>Caveat bắt buộc</span>
                  <p>
                    Không đủ dữ liệu để kết luận độc lập về chẩn đoán. Khi tạo draft, caveat
                    uncertainty phải được giữ nguyên trong form.
                  </p>
                </div>
              </div>
            </Panel>

            <Panel title="Chất lượng dữ liệu">
              <div className="episode-issue-stack">
                {dataIssues.map((issue) => (
                  <div className="episode-issue" key={issue.title}>
                    <StatusChip status={issue.status} />
                    <div>
                      <strong>{issue.title}</strong>
                      <p>{issue.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Draft liên quan">
              <CompactList
                items={[
                  'DR-1842 – Báo cáo PCXR – thiếu bằng chứng',
                  'DR-1839 – Hội chẩn hô hấp – đang rà soát',
                  'DR-1811 – Phiếu nghiên cứu – archived',
                ]}
              />
              <button className="button-secondary full-width" onClick={() => onNavigate('draft')} type="button">
                Mở draft đang review
              </button>
            </Panel>
          </section>
        </section>

        <aside className="workspace-side episode-workbench-side">
          <EvidencePanel
            citation={primaryEvidence}
            onOpenFull={onOpenCitation}
            title="Bằng chứng ưu tiên"
          />
          <Panel title="Nhật ký xử lý">
            <TimelineList items={auditEvents} />
          </Panel>
        </aside>
      </div>
    </div>
  )
}

function DraftReviewWorkspace({
  activeCitation,
  citationById,
  selectedFieldId,
  setSelectedFieldId,
  onOpenApproval,
  onOpenCitation,
  onSelectCitation,
}: {
  activeCitation: Citation
  citationById: Map<string, Citation>
  selectedFieldId: string
  setSelectedFieldId: (id: string) => void
  onOpenApproval: () => void
  onOpenCitation: (citation: Citation) => void
  onSelectCitation: (citation: Citation) => void
}) {
  const blockerCount = draftFields.filter(
    (field) => field.status === 'needs_evidence' || field.status === 'policy_blocked',
  ).length

  return (
    <div className="draft-workspace review-console">
      <PatientContextStrip />
      <section className="draft-header compact-draft-header">
        <div>
          <span>S05 – Không gian rà soát draft</span>
          <h1>Báo cáo PCXR có cấu trúc</h1>
        </div>
        <DataCell label="Draft" value="DR-1842" />
        <DataCell label="Template" value="tpl-pcxr v2.7" />
        <DataCell label="Model" value="pcxr-rag-v0.4" />
        <StatusChip status="needs_evidence" />
      </section>

      <div className="review-safety-strip">
        <WarningBanner title="Nhắc lại mục đích sử dụng" tone="info">
          {MICROCOPY.draftBanner}
        </WarningBanner>
      </div>

      <div className="draft-review-grid">
        <aside className="section-filter-pane">
          <h2>Phần</h2>
          {['Tất cả', 'Đã sửa', 'Cảnh báo', 'Bắt buộc', 'Thiếu bằng chứng'].map((item, index) => (
            <button className={index === 0 ? 'active' : ''} key={item} type="button">
              {item}
              <span>{index === 0 ? draftFields.length : index + 1}</span>
            </button>
          ))}
          <div className="diff-box">
            <span>So sánh</span>
            <button type="button">Hiện tại</button>
            <button type="button">AI gốc</button>
            <button type="button">Lần duyệt cuối</button>
          </div>
        </aside>

        <section className="form-editor">
          <div className="form-editor-header">
            <div>
              <h2>Trình soạn thảo form</h2>
              <p>Nhấn field để đổi evidence pane. Field khóa chỉ đọc.</p>
            </div>
            <span>{blockerCount} blocker</span>
          </div>

          {draftFields.map((field) => {
            const citation = citationById.get(field.citationId)
            return (
              <DraftFieldRow
                citation={citation}
                field={field}
                isSelected={field.id === selectedFieldId}
                key={field.id}
                onOpenCitation={onOpenCitation}
                onSelect={() => {
                  setSelectedFieldId(field.id)
                  if (citation) {
                    onSelectCitation(citation)
                  }
                }}
              />
            )
          })}
        </section>

        <aside className="provenance-pane">
          <EvidencePanel citation={activeCitation} onOpenFull={onOpenCitation} />
          <Panel title="Kiểm toán field">
            <CompactList items={auditEvents} />
          </Panel>
        </aside>
      </div>

      <footer className="review-action-bar">
        <div>
          <strong>Phê duyệt bị chặn</strong>
          <span>{blockerCount} blocker cần xử lý trước khi phát hành.</span>
        </div>
        <div className="action-row">
          <button className="button-secondary" type="button">
            Lưu draft
          </button>
          <button className="button-secondary" type="button">
            Gửi review
          </button>
          <button className="button-secondary" onClick={onOpenApproval} type="button">
            Trả về / Từ chối
          </button>
          <button className="button-primary button-disabled" disabled type="button">
            Phê duyệt
          </button>
        </div>
      </footer>
    </div>
  )
}

function DraftFieldRow({
  field,
  citation,
  isSelected,
  onSelect,
  onOpenCitation,
}: {
  field: DraftField
  citation?: Citation
  isSelected: boolean
  onSelect: () => void
  onOpenCitation: (citation: Citation) => void
}) {
  return (
    <article className={cn('draft-field', isSelected && 'draft-field-selected')}>
      <button className="draft-field-select" onClick={onSelect} type="button">
        <div>
          <span>{field.section}</span>
          <h3>{field.label}</h3>
        </div>
        <div className="field-status-group">
          <FieldBadge source={field.source} />
          <StatusChip status={field.status} />
        </div>
      </button>

      <textarea defaultValue={field.value} disabled={field.source === 'locked'} />

      <div className="field-evidence-row">
        {citation && <ProvenanceChip citation={citation} onOpen={onOpenCitation} />}
        {field.required && <span>Bắt buộc</span>}
        {field.changed && <span>Đã sửa thủ công</span>}
      </div>

      {field.warning && (
        <WarningBanner
          title={field.status === 'policy_blocked' ? 'Chặn policy' : 'Cần review'}
          tone={field.status === 'policy_blocked' ? 'danger' : 'warning'}
        >
          {field.warning}
        </WarningBanner>
      )}
    </article>
  )
}

function ModuleHeader({
  code,
  title,
  description,
  actions,
}: {
  code: string
  title: string
  description: string
  actions?: ReactNode
}) {
  return (
    <section className="module-header">
      <div>
        <span>{code}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions && <div className="module-actions">{actions}</div>}
    </section>
  )
}

function ScopeDropdown({ items }: { items: string[] }) {
  const [selected, setSelected] = useState(0)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // close on outside click
  useState(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  })

  return (
    <div className="scope-dropdown" ref={ref}>
      <span className="scope-dropdown-label">Phạm vi</span>
      <button
        className="scope-dropdown-trigger"
        onClick={() => setOpen((o) => !o)}
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span>{items[selected]}</span>
        <CaretDown size={11} weight="bold" className={open ? 'scope-caret-open' : ''} />
      </button>

      {open && (
        <div className="scope-dropdown-menu" role="listbox">
          {items.map((item, index) => (
            <button
              key={item}
              role="option"
              aria-selected={selected === index}
              className={selected === index ? 'scope-option scope-option-active' : 'scope-option'}
              onClick={() => { setSelected(index); setOpen(false) }}
              type="button"
            >
              <span>{item}</span>
              {selected === index && <Check size={12} weight="bold" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function FilterToolbar({ items, compact }: { items: string[]; compact?: boolean }) {
  if (compact) {
    return <ScopeDropdown items={items} />
  }

  return (
    <div className="filter-toolbar" aria-label="Bộ lọc">
      {items.map((item, index) => (
        <button className={index === 0 ? 'active' : ''} key={item} type="button">
          {item}
        </button>
      ))}
    </div>
  )
}

function Panel({
  title,
  className,
  children,
}: {
  title: string
  className?: string
  children: ReactNode
}) {
  return (
    <section className={cn('panel', className)}>
      <div className="panel-heading">
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  )
}

function CompactList({ items }: { items: string[] }) {
  return (
    <div className="compact-list">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  )
}

function DefinitionList({ rows }: { rows: Array<[string, string]> }) {
  return (
    <dl className="definition-list">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  )
}

function EpisodeMetric({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail: string
}) {
  return (
    <div className="episode-metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  )
}

function TimelineList({ items }: { items: string[] }) {
  return (
    <div className="timeline-list">
      {items.map((item) => {
        const [timestamp, detail] = item.split(' – ', 2)

        return (
          <article className="timeline-item" key={item}>
            <span>{detail ? timestamp : 'Audit'}</span>
            <p>{detail ?? item}</p>
          </article>
        )
      })}
    </div>
  )
}

function EvidencePanel({
  citation,
  onOpenFull,
  title = 'Bằng chứng & truy vết',
}: {
  citation: Citation
  onOpenFull?: (citation: Citation) => void
  title?: string
}) {
  return (
    <Panel title={title}>
      <div className="evidence-head">
        <span>CIT-{String(citation.ordinal).padStart(2, '0')}</span>
        <StatusChip status={citation.status} />
      </div>
      <h3>{citation.title}</h3>
      <DefinitionList
        rows={[
          ['Đơn vị', citation.owner],
          ['Phiên bản', citation.version],
          ['Hiệu lực', citation.effective],
        ]}
      />
      <blockquote>{citation.excerpt}</blockquote>
      <div className="action-row">
        <button className="button-secondary" onClick={() => onOpenFull?.(citation)} type="button">
          Mở tài liệu đầy đủ
        </button>
        <button className="button-secondary" type="button">
          Đánh dấu citation
        </button>
      </div>
    </Panel>
  )
}

function CitationSlideOver({ citation, onClose }: { citation: Citation; onClose: () => void }) {
  return (
    <div className="overlay">
      <aside className="slide-over" aria-label="Ngăn kéo citation">
        <div className="dialog-header">
          <div>
            <span>Chi tiết bằng chứng</span>
            <h2>{citation.title}</h2>
          </div>
          <button className="icon-button" onClick={onClose} type="button">
            <X size={17} weight="bold" />
          </button>
        </div>
        <EvidencePanel citation={citation} />
      </aside>
    </div>
  )
}

function TemplateDialog({ onClose, onCreate }: { onClose: () => void; onCreate: () => void }) {
  return (
    <div className="overlay modal-overlay">
      <section className="dialog template-dialog" aria-label="Chọn template">
        <div className="dialog-header">
          <div>
            <span>S04 – Chọn template</span>
            <h2>Chọn template tạo draft</h2>
          </div>
          <button className="icon-button" onClick={onClose} type="button">
            <X size={17} weight="bold" />
          </button>
        </div>

        <div className="template-grid">
          <div className="template-list">
            {templates.map((template) => (
              <button
                className={cn('template-row', !template.active && 'template-row-disabled')}
                disabled={!template.active}
                key={template.id}
                type="button"
              >
                <strong>{template.name}</strong>
                <span>
                  {template.version} – {template.intendedUse}
                </span>
                <StatusChip status={template.active ? 'approved' : 'policy_blocked'} />
              </button>
            ))}
          </div>
          <aside className="template-preview">
            <FolderOpen size={24} weight="duotone" />
            <h3>Báo cáo PCXR có cấu trúc</h3>
            <DefinitionList
              rows={[
                ['Trường bắt buộc', '8'],
                ['Trường tùy chọn', '5'],
                ['Trường khóa', '3'],
                ['Duyệt lần cuối', '29/03/2026'],
              ]}
            />
            <button className="button-primary" onClick={onCreate} type="button">
              Tạo draft
            </button>
          </aside>
        </div>
      </section>
    </div>
  )
}

function ApprovalDialog({ onClose }: { onClose: () => void }) {
  return (
    <div className="overlay modal-overlay">
      <section className="dialog approval-dialog" aria-label="Phê duyệt và từ chối">
        <div className="dialog-header">
          <div>
            <span>S06 – Phê duyệt / Từ chối</span>
            <h2>Xác nhận hành động nghiệp vụ</h2>
          </div>
          <button className="icon-button" onClick={onClose} type="button">
            <X size={17} weight="bold" />
          </button>
        </div>
        <WarningBanner title="Phê duyệt đang bị chặn" tone="danger">
          Draft còn blocker về evidence và policy. Có thể trả về/từ chối kèm lý do.
        </WarningBanner>
        <DefinitionList
          rows={[
            ['Draft', 'DR-1842'],
            ['Episode', patientContext.episodeId],
            ['Template', 'tpl-pcxr v2.7'],
            ['Cảnh báo chưa xử lý', '2'],
          ]}
        />
        <label>
          Lý do trả về/từ chối
          <textarea defaultValue="Cần bổ sung citation và xác nhận caveat về uncertainty trước khi phê duyệt." />
        </label>
        <div className="action-row">
          <button className="button-secondary" onClick={onClose} type="button">
            Hủy
          </button>
          <button className="button-primary" type="button">
            Trả về để sửa
          </button>
        </div>
      </section>
    </div>
  )
}
