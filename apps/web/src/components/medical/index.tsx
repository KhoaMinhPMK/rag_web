import { cva, type VariantProps } from 'class-variance-authority'
import { AlertCircle, CheckCircle2, Lock, Sparkles, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StatusKind, FieldSource } from '@/types'

// ============================================================================
// StatusChip - Medical status indicator
// ============================================================================

const statusVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
  {
    variants: {
      status: {
        draft: 'bg-gray-100 text-gray-700',
        under_review: 'bg-blue-100 text-blue-700',
        approved: 'bg-green-100 text-green-700',
        needs_evidence: 'bg-amber-100 text-amber-700',
        policy_blocked: 'bg-red-100 text-red-700',
        low_confidence: 'bg-orange-100 text-orange-700',
        outdated_source: 'bg-purple-100 text-purple-700',
      },
    },
    defaultVariants: {
      status: 'draft',
    },
  }
)

interface StatusChipProps extends VariantProps<typeof statusVariants> {
  status: StatusKind
  className?: string
}

export function StatusChip({ status, className }: StatusChipProps) {
  const labels: Record<StatusKind, string> = {
    draft: 'Nháp',
    under_review: 'Đang review',
    approved: 'Đã duyệt',
    needs_evidence: 'Cần bằng chứng',
    policy_blocked: 'Bị chặn',
    low_confidence: 'Độ tin cậy thấp',
    outdated_source: 'Nguồn cũ',
  }

  return <span className={cn(statusVariants({ status }), className)}>{labels[status]}</span>
}

// ============================================================================
// FieldBadge - Draft field source indicator
// ============================================================================

const fieldVariants = cva(
  'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium',
  {
    variants: {
      source: {
        ai: 'bg-medical-ai/10 text-medical-ai border border-medical-ai/20',
        auto: 'bg-blue-50 text-blue-700 border border-blue-200',
        manual: 'bg-medical-manual/10 text-medical-manual border border-medical-manual/20',
        locked: 'bg-medical-locked/10 text-medical-locked border border-medical-locked/20',
      },
    },
    defaultVariants: {
      source: 'ai',
    },
  }
)

interface FieldBadgeProps extends VariantProps<typeof fieldVariants> {
  source: FieldSource
  className?: string
}

export function FieldBadge({ source, className }: FieldBadgeProps) {
  const config: Record<FieldSource, { icon: React.ReactNode; label: string }> = {
    ai: { icon: <Sparkles className="h-3 w-3" />, label: 'AI' },
    auto: { icon: <CheckCircle2 className="h-3 w-3" />, label: 'Tự động' },
    manual: { icon: <User className="h-3 w-3" />, label: 'Thủ công' },
    locked: { icon: <Lock className="h-3 w-3" />, label: 'Khóa' },
  }

  const { icon, label } = config[source]

  return (
    <span className={cn(fieldVariants({ source }), className)}>
      {icon}
      {label}
    </span>
  )
}

// ============================================================================
// IntendedUseTag - System intended use reminder
// ============================================================================

export function IntendedUseTag({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900',
        className
      )}
    >
      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
      <p>
        <strong>Intended use:</strong> Hệ thống hỗ trợ tri thức và draft có kiểm soát. Không thay
        thế kết luận chuyên môn của bác sĩ.
      </p>
    </div>
  )
}

// ============================================================================
// WarningBanner - Field-level or system warning
// ============================================================================

const warningVariants = cva('flex items-start gap-2 rounded-lg border p-3 text-sm', {
  variants: {
    severity: {
      warning: 'border-amber-200 bg-amber-50 text-amber-900',
      danger: 'border-red-200 bg-red-50 text-red-900',
      info: 'border-blue-200 bg-blue-50 text-blue-900',
    },
  },
  defaultVariants: {
    severity: 'warning',
  },
})

interface WarningBannerProps extends VariantProps<typeof warningVariants> {
  message: string
  className?: string
}

export function WarningBanner({ message, severity, className }: WarningBannerProps) {
  return (
    <div className={cn(warningVariants({ severity }), className)}>
      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
      <p>{message}</p>
    </div>
  )
}

// ============================================================================
// ProvenanceChip - Citation/evidence link indicator
// ============================================================================

export function ProvenanceChip({
  citationId,
  onClick,
  className,
}: {
  citationId: string
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-200',
        className
      )}
    >
      [{citationId}]
    </button>
  )
}
