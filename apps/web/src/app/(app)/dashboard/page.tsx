'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MOCK_DASHBOARD_WIDGETS, MOCK_WORKLIST_ITEMS } from '@/lib/mock/fixtures'
import { StatusChip, IntendedUseTag } from '@/components/medical'
import type { Role } from '@/types'

export default function DashboardPage() {
  const router = useRouter()
  const [role, setRole] = useState<Role | null>(null)

  useEffect(() => {
    const storedRole = sessionStorage.getItem('userRole') as Role | null
    if (!storedRole) {
      router.push('/login')
      return
    }
    setRole(storedRole)
  }, [router])

  if (!role) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">Vai trò: {role}</p>
            </div>
            <button
              onClick={() => {
                sessionStorage.removeItem('userRole')
                router.push('/login')
              }}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <IntendedUseTag className="mb-6" />

        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_DASHBOARD_WIDGETS.map((widget, idx) => (
            <div key={idx} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">{widget.title}</h3>
                <StatusChip status={widget.status} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{widget.value}</p>
              <p className="mt-2 text-sm text-gray-600">{widget.detail}</p>
              {widget.trend && <p className="mt-1 text-xs text-gray-500">{widget.trend}</p>}
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Worklist</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {MOCK_WORKLIST_ITEMS.map((item) => (
              <div
                key={item.id}
                className="cursor-pointer px-6 py-4 hover:bg-gray-50"
                onClick={() => {
                  if (item.status === 'under_review') {
                    router.push(`/draft/${item.id}`)
                  } else {
                    router.push(`/episode/${item.id}`)
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                      <span>{item.patientLabel}</span>
                      <span>•</span>
                      <span>{item.department}</span>
                      <span>•</span>
                      <span>Hạn: {item.dueDate}</span>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    {item.priority && (
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium ${
                          item.priority === 'high'
                            ? 'bg-red-100 text-red-700'
                            : item.priority === 'medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {item.priority === 'high'
                          ? 'Cao'
                          : item.priority === 'medium'
                            ? 'Trung bình'
                            : 'Thấp'}
                      </span>
                    )}
                    <StatusChip status={item.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
