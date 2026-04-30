'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MOCK_ROLES } from '@/lib/mock/fixtures'
import { IntendedUseTag } from '@/components/medical'
import type { Role } from '@/types'

export default function LoginPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<Role>('clinician')

  const handleLogin = () => {
    // Store role in sessionStorage for MVP
    sessionStorage.setItem('userRole', selectedRole)
    router.push('/')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">RAG Y Tế Nhi Khoa</h1>
          <p className="mt-2 text-sm text-gray-600">Hệ thống hỗ trợ chẩn đoán viêm phổi Nhi khoa</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
          <IntendedUseTag className="mb-6" />

          <div className="space-y-4">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Chọn vai trò
              </label>
              <select
                id="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as Role)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {MOCK_ROLES.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Landing: {MOCK_ROLES.find((r) => r.id === selectedRole)?.landing}
              </p>
            </div>

            <button
              onClick={handleLogin}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Đăng nhập
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-gray-500">MVP - Mock authentication only</p>
        </div>
      </div>
    </div>
  )
}
