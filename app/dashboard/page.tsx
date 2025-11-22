'use client'

import { ProtectedRoute } from '@/lib/protectedRoute'
import { useAuth } from '@/lib/authContext'

const DashboardContent = () => {
  const { user } = useAuth()

  return (
      <div className="max-w-4xl w-full mx-auto p-6">

          <p className="text-light-200 mb-6">
            Добро пожаловать, {user?.firstName} {user?.lastName}!
          </p>
      </div>
  )
}

const DashboardPage = () => {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}

export default DashboardPage