'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  MOCK_ANSWER_SUCCESS,
  MOCK_ANSWER_INSUFFICIENT,
  MOCK_ANSWER_OUT_OF_SCOPE,
} from '@/lib/mock/fixtures'
import { IntendedUseTag, StatusChip, ProvenanceChip } from '@/components/medical'
import type { AnswerCard } from '@/types'

export default function QueryPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState<AnswerCard | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCitation, setSelectedCitation] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)

    // Mock query processing
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock response based on query content
    if (query.toLowerCase().includes('liều kháng sinh')) {
      setAnswer(MOCK_ANSWER_INSUFFICIENT)
    } else if (query.toLowerCase().includes('ung thư')) {
      setAnswer(MOCK_ANSWER_OUT_OF_SCOPE)
    } else {
      setAnswer(MOCK_ANSWER_SUCCESS)
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Knowledge Query</h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Về Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <IntendedUseTag className="mb-6" />

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <label htmlFor="query" className="mb-2 block text-sm font-medium text-gray-700">
              Câu hỏi tra cứu
            </label>
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Ví dụ: Tiêu chuẩn chẩn đoán viêm phổi trên X-quang ngực trẻ em theo WHO?"
            />
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Hệ thống chỉ trả lời dựa trên tài liệu nội bộ đã được phê duyệt
              </p>
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {isLoading ? 'Đang xử lý...' : 'Tra cứu'}
              </button>
            </div>
          </div>
        </form>

        {answer && (
          <div className="space-y-6">
            {answer.status === 'success' && (
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-start justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Kết quả</h2>
                  <div className="flex items-center gap-2">
                    {answer.confidence && (
                      <span className="text-xs text-gray-500">
                        Độ tin cậy: {(answer.confidence * 100).toFixed(0)}%
                      </span>
                    )}
                    <StatusChip status="approved" />
                  </div>
                </div>

                <div className="prose prose-sm max-w-none text-gray-700">
                  <p>{answer.answer}</p>
                </div>

                {answer.citations.length > 0 && (
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h3 className="mb-3 text-sm font-medium text-gray-900">Nguồn trích dẫn</h3>
                    <div className="space-y-3">
                      {answer.citations.map((citation) => (
                        <div
                          key={citation.id}
                          className="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-4 hover:bg-gray-100"
                          onClick={() => setSelectedCitation(citation.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="mb-1 flex items-center gap-2">
                                <ProvenanceChip citationId={`[${citation.ordinal}]`} />
                                <h4 className="text-sm font-medium text-gray-900">
                                  {citation.title}
                                </h4>
                              </div>
                              <p className="mb-2 text-xs text-gray-600">
                                {citation.owner} • {citation.version} • Hiệu lực:{' '}
                                {citation.effectiveDate}
                              </p>
                              <p className="text-sm text-gray-700">{citation.excerpt}</p>
                            </div>
                            <StatusChip status={citation.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 text-xs text-gray-500">
                  Model: {answer.modelVersion} • Generated: {answer.generatedAt}
                </div>
              </div>
            )}

            {answer.status === 'insufficient_evidence' && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-medium text-amber-900">Không đủ bằng chứng</h3>
                    <p className="text-sm text-amber-800">{answer.uncertainty}</p>
                  </div>
                </div>
              </div>
            )}

            {answer.status === 'out_of_scope' && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-medium text-red-900">Ngoài phạm vi</h3>
                    <p className="text-sm text-red-800">{answer.uncertainty}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
