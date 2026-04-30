'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MOCK_EPISODES, MOCK_DETECTOR_OUTPUT, MOCK_LLM_READY_PAYLOAD } from '@/lib/mock/fixtures'
import { IntendedUseTag, StatusChip, WarningBanner } from '@/components/medical'
import type { Episode } from '@/types'

export default function EpisodePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [episode, setEpisode] = useState<Episode | null>(null)

  useEffect(() => {
    const role = sessionStorage.getItem('userRole')
    if (!role) {
      router.push('/login')
      return
    }

    // Mock episode fetch
    const found = MOCK_EPISODES.find((e) => e.id === params.id)
    if (found) {
      setEpisode(found)
    } else {
      setEpisode(MOCK_EPISODES[0] || null)
    }
  }, [params.id, router])

  if (!episode) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    )
  }

  const { patientContext } = episode
  const detectorOutput = MOCK_DETECTOR_OUTPUT
  const llmPayload = MOCK_LLM_READY_PAYLOAD

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Episode Workspace</h1>
              <p className="text-sm text-gray-600">{episode.episodeId}</p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Về Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <IntendedUseTag className="mb-6" />

        {/* Patient Context Bar */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <div>
              <span className="text-gray-500">Mã BN:</span>
              <span className="ml-2 font-medium text-gray-900">{patientContext.patientId}</span>
            </div>
            <div>
              <span className="text-gray-500">Tuổi:</span>
              <span className="ml-2 font-medium text-gray-900">{patientContext.age}</span>
            </div>
            <div>
              <span className="text-gray-500">Giới tính:</span>
              <span className="ml-2 font-medium text-gray-900">{patientContext.gender}</span>
            </div>
            <div>
              <span className="text-gray-500">Khoa:</span>
              <span className="ml-2 font-medium text-gray-900">{patientContext.department}</span>
            </div>
            <div>
              <span className="text-gray-500">Nhập viện:</span>
              <span className="ml-2 font-medium text-gray-900">{patientContext.admittedAt}</span>
            </div>
            <div>
              <span className="text-gray-500">Độ nhạy:</span>
              <span className="ml-2 font-medium text-gray-900">
                {patientContext.sensitivityLevel}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">Trạng thái dữ liệu:</span>
              <span className="ml-2 font-medium text-amber-600">{patientContext.dataStatus}</span>
            </div>
          </div>
        </div>

        {patientContext.dataStatus.includes('Thiếu') && (
          <WarningBanner
            severity="warning"
            message="Dữ liệu chưa đầy đủ. Kết quả phân tích có thể có độ tin cậy thấp hơn."
            className="mb-6"
          />
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Detector Output */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Detector Output</h2>
              <StatusChip status="approved" />
            </div>

            <div className="mb-4 flex aspect-square w-full items-center justify-center rounded-lg border border-gray-300 bg-gray-100">
              <p className="text-sm text-gray-500">[Mock X-ray image với bounding boxes]</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">
                Phát hiện ({detectorOutput.detections.length})
              </h3>
              {detectorOutput.detections.map((detection, idx) => (
                <div key={idx} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{detection.label}</span>
                    <span className="text-xs text-gray-600">
                      Score: {(detection.score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">BBox: [{detection.bbox.join(', ')}]</div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-xs text-gray-500">
              Model: {detectorOutput.modelName} v{detectorOutput.modelVersion} • Generated:{' '}
              {detectorOutput.generatedAt}
            </div>
          </div>

          {/* XAI / Post-processed Explanation */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Giải thích hỗ trợ (XAI)</h2>
              <StatusChip status="under_review" />
            </div>

            <WarningBanner
              severity="info"
              message={llmPayload.usageGuardrails.intendedUse}
              className="mb-4"
            />

            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-900">Tổng quan</h3>
                <p className="text-sm text-gray-700">
                  Phát hiện {llmPayload.findingCount} tổn thương. Tổn thương chính:{' '}
                  <span className="font-medium">{llmPayload.topFinding}</span>
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-900">Chi tiết phát hiện</h3>
                <div className="space-y-2">
                  {llmPayload.findings.map((finding, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
                    >
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          #{finding.rank} {finding.label}
                        </span>
                      </div>
                      <span className="text-xs text-gray-600">
                        {(finding.score * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {llmPayload.requiresHumanReview && (
                <WarningBanner
                  severity="warning"
                  message="Yêu cầu review bởi bác sĩ trước khi sử dụng kết quả này."
                  className="mt-4"
                />
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => router.push(`/draft/${episode.id}`)}
                className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Tạo Draft Report
              </button>
              <button
                onClick={() => router.push('/query')}
                className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Tra cứu tri thức
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
