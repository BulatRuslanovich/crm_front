'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ProtectedRoute } from '@/lib/protectedRoute'
import { useAuth } from '@/lib/authContext'
import { HumActiv } from '@/dto/HumActiv'
import { getStatusColor } from '@/lib/statusColors'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555'

const ActivitiesContent = () => {
  const { user } = useAuth()
  const [activities, setActivities] = useState<HumActiv[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return

    const fetchActivities = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/User/${user.usrId}/activ`, {
          credentials: 'include'
        })

        if (!res.ok) {
          throw new Error('Failed to fetch activities')
        }

        const data = await res.json()
        setActivities(data)
      } catch (err) {
        console.error('Error fetching activities:', err)
        setError('Не удалось загрузить активности')
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [user])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeStr: string) => {
    return timeStr.substring(0, 5)
  }

  return (
    <section className="min-h-[calc(100vh-200px)] flex-col gap-8 p-6">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gradient">Мои активности</h1>
          <div className="flex gap-3">
            <Link
              href="/activ/create"
              className="bg-primary hover:bg-primary/90 text-black px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              + Новая
            </Link>
            <Link
              href="/dashboard"
              className="bg-dark-200 hover:bg-dark-300 text-light-200 px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Назад
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="glass card-shadow rounded-[10px] p-8 border border-dark-200 text-center">
            <p className="text-light-200">Загрузка активностей...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="glass card-shadow rounded-[10px] p-8 border border-dark-200 text-center">
            <p className="text-light-200">Нет активностей</p>
          </div>
        ) : (
          <div className="glass card-shadow rounded-[10px] border border-dark-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-200 border-b border-dark-300">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-light-200">
                      Организация
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-light-200">
                      Дата
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-light-200">
                      Время
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-light-200">
                      Статус
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-light-200">
                      Описание
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => {
                    const statusColor = getStatusColor(activity.statusName)
                    return (
                      <tr
                        key={activity.activId}
                        className="border-b border-dark-300 hover:bg-dark-200/50 transition-colors cursor-pointer"
                        onClick={() => {
                          window.location.href = `/activ/${activity.activId}`
                        }}
                      >
                        <td className="px-6 py-4 text-sm text-light-200">
                          {activity.orgName}
                        </td>
                        <td className="px-6 py-4 text-sm text-light-200">
                          {formatDate(activity.visitDate)}
                        </td>
                        <td className="px-6 py-4 text-sm text-light-200">
                          {formatTime(activity.startTime)} - {formatTime(activity.endTime)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full ${statusColor.bg} ${statusColor.text}`}>
                            {activity.statusName}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-light-200 max-w-xs truncate">
                          {activity.description || '-'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

const ActivitiesPage = () => {
  return (
    <ProtectedRoute>
      <ActivitiesContent />
    </ProtectedRoute>
  )
}

export default ActivitiesPage