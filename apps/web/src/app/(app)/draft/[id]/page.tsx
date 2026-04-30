'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MOCK_DRAFT_REPORT, MOCK_CITATIONS } from '@/lib/mock/fixtures'
import {
  IntendedUseTag,
  StatusChip,
  FieldBadge,
  WarningBanner,
  ProvenanceChip,
} from '@/components/medical'
import { formatRelativeTime } from '@/lib/utils'
import type { DraftReport, DraftField } from '@/types'

export default function DraftPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [draft, setDraft] = useState<DraftReport | null>(null)
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false)

  useEffect(() => {
    const role = sessionStorage.getItem('userRole')
    if (!role) {
      router.push('/login')
      return
    }

    // Mock draft fetch
    setDraft(MOCK_DRAFT_REPORT)
    setSelectedField(MOCK_DRAFT_REPORT.fields[0]?.id || null)
  }, [params.id, router])

  if (!draft) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    )
  }

  const hasBlockers = draft.fields.some(
    (f) => f.status === 'policy_blocked' || f.status === 'needs_evidence'
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Draft Review</h1>
              <p className="text-sm text-gray-600">
                {draft.draftId} • Episode: {draft.episodeId}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusChip status={draft.status} />
              <button
                onClick={() => router.push('/dashboard')}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← Về Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <IntendedUseTag className="mb-6" />

        <WarningBanner
          severity="info"
          message="Đây là nháp do hệ thống hỗ trợ sinh. Cần người được phân quyền rà soát trước khi sử dụng."
          className="mb-6"
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Fields List */}
          <div className="space-y-4 lg:col-span-2">
            {draft.fields.map((field) => (
              <div
                key={field.id}
                className={`cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-colors ${
                  selectedField === field.id
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedField(field.id)}
              >
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="text-sm font-medium text-gray-900">{field.label}</h3>
                      <FieldBadge source={field.source} />
                      {field.changed && (
                        <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                          Đã sửa
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{field.section}</p>
                  </div>
                  <StatusChip status={field.status} />
                </div>

                <p className="mb-2 text-sm text-gray-700">{field.value}</p>

                {field.warning && (
                  <WarningBanner
                    severity={field.status === 'policy_blocked' ? 'danger' : 'warning'}
                    message={field.warning}
                    className="mt-2"
                  />
                )}

                <div className="mt-2 flex items-center gap-2">
                  <ProvenanceChip
                    citationId={field.citationId}
                    onClick={() => {
                      // Open citation drawer
                    }}
                  />
                  {field.required && <span className="text-xs text-gray-500">• Bắt buộc</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Template Info */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-medium text-gray-900">Template</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">ID:</span>
                  <span className="ml-2 font-medium text-gray-900">{draft.templateId}</span>
                </div>
                <div>
                  <span className="text-gray-500">Version:</span>
                  <span className="ml-2 font-medium text-gray-900">{draft.templateVersion}</span>
                </div>
              </div>
            </div>

            {/* Audit Timeline */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-medium text-gray-900">Lịch sử</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-900">Tạo draft</p>
                    <p className="text-xs text-gray-500">{formatRelativeTime(draft.createdAt)}</p>
                    <p className="text-xs text-gray-500">Bởi: {draft.createdBy}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-amber-500" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-900">Cập nhật</p>
                    <p className="text-xs text-gray-500">{formatRelativeTime(draft.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-medium text-gray-900">Hành động</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setIsApprovalModalOpen(true)}
                  disabled={hasBlockers}
                  className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  Phê duyệt
                </button>
                <button
                  onClick={() => {
                    // Return for edit
                  }}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Trả lại sửa
                </button>
                <button
                  onClick={() => {
                    // Reject
                  }}
                  className="w-full rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                >
                  Từ chối
                </button>
              </div>

              {hasBlockers && (
                <WarningBanner
                  severity="danger"
                  message="Không thể phê duyệt khi còn blocker chưa giải quyết."
                  className="mt-3"
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Approval Modal Placeholder */}
      {isApprovalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Xác nhận phê duyệt</h2>
            <p className="mb-6 text-sm text-gray-700">
              Bạn có chắc chắn muốn phê duyệt draft này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsApprovalModalOpen(false)}
                className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  // Approve
                  setIsApprovalModalOpen(false)
                  router.push('/dashboard')
                }}
                className="flex-1 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
