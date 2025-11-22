'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ProtectedRoute } from '@/lib/protectedRoute'
import { Activ } from '@/dto/Activ'
import { getStatusColor } from '@/lib/statusColors'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555'

interface ActivityDetail extends Activ {
  orgName?: string
  statusName?: string
}

const ActivityDetailContent = () => {
  const params = useParams()
  const [activity, setActivity] = useState<ActivityDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [formData, setFormData] = useState({
    statusId: '',
    visitDate: '',
    startTime: '',
    endTime: '',
    description: ''
  })

  const activId = params.id as string

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/Activ/${activId}`, {
          credentials: 'include'
        })

        if (!res.ok) {
          throw new Error('Failed to fetch activity')
        }

        const data = await res.json()
        setActivity(data)
        setFormData({
          statusId: data.statusId,
          visitDate: data.visitDate,
          startTime: data.startTime,
          endTime: data.endTime,
          description: data.description || ''
        })
      } catch (err) {
        console.error('Error fetching activity:', err)
        setError('Не удалось загрузить активность')
      } finally {
        setLoading(false)
      }
    }

    fetchActivity()
  }, [activId])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch(`${BASE_URL}/api/Activ/${activId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        throw new Error('Failed to update activity')
      }

      const updatedData = await res.json()
      setActivity(updatedData)
      setIsEditing(false)
      setError('')
    } catch (err) {
      console.error('Error updating activity:', err)
      setError('Не удалось сохранить активность')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setShowDeleteModal(false)
    setIsSaving(true)
    try {
      const res = await fetch(`${BASE_URL}/api/Activ/${activId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!res.ok) {
        throw new Error('Failed to delete activity')
      }

      // Редирект на список активностей
      window.location.href = '/activ'
    } catch (err) {
      console.error('Error deleting activity:', err)
      setError('Не удалось удалить активность')
      setIsSaving(false)
    }
  }

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
    <section className="min-h-[calc(100vh-200px)] w-full p-6">
      <div className="max-w-6xl mx-auto w-full">
        <Link
          href="/activ"
          className="text-primary hover:underline mb-6 inline-block"
        >
          ← Вернуться к активностям
        </Link>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="glass card-shadow rounded-[10px] p-8 border border-dark-200 text-center">
            <p className="text-light-200">Загрузка активности...</p>
          </div>
        ) : activity ? (
          <>
            {isEditing ? (
              // Форма редактирования
              <div className="glass card-shadow rounded-[10px] border border-dark-200 p-12 space-y-6">
                <h2 className="text-3xl font-bold text-gradient">Редактировать активность</h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-light-200 block mb-2">Статус ID</label>
                    <input
                      type="number"
                      value={formData.statusId}
                      onChange={(e) => setFormData({ ...formData, statusId: e.target.value })}
                      className="w-full bg-dark-200 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-light-200 block mb-2">Дата визита</label>
                    <input
                      type="date"
                      value={formData.visitDate}
                      onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                      className="w-full bg-dark-200 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-light-200 block mb-2">Время начала</label>
                      <input
                        type="text"
                        placeholder="HH:MM"
                        value={formData.startTime.substring(0, 5)}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^\d:]/g, '')
                          if (val.length <= 5) setFormData({ ...formData, startTime: val })
                        }}
                        maxLength={5}
                        className="w-full bg-dark-200 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-light-200 block mb-2">Время окончания</label>
                      <input
                        type="text"
                        placeholder="HH:MM"
                        value={formData.endTime.substring(0, 5)}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^\d:]/g, '')
                          if (val.length <= 5) setFormData({ ...formData, endTime: val })
                        }}
                        maxLength={5}
                        className="w-full bg-dark-200 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-light-200 block mb-2">Описание</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={5}
                      className="w-full bg-dark-200 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-primary hover:bg-primary/90 text-black px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    {isSaving ? 'Сохранение...' : 'Сохранить'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-dark-200 hover:bg-dark-300 text-light-200 px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              // Просмотр активности
              <div className="glass card-shadow rounded-[10px] border border-dark-200 p-12 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-5xl font-bold text-gradient mb-4">
                      {activity.orgName || `Активность #${activity.activId}`}
                    </h1>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-primary hover:bg-primary/90 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Удалить
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <p className="text-sm text-light-200">Дата</p>
                    <p className="text-xl text-white font-semibold">{formatDate(activity.visitDate)}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-light-200">Время</p>
                    <p className="text-xl text-white font-semibold">
                      {formatTime(activity.startTime)} - {formatTime(activity.endTime)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-light-200">Статус</p>
                    <div>
                      {(() => {
                        const statusName = activity.statusName || 'Неизвестно'
                        const statusColor = getStatusColor(statusName)
                        return (
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColor.bg} ${statusColor.text}`}
                          >
                            {statusName}
                          </span>
                        )
                      })()}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-dark-300">
                  <p className="text-sm text-light-200 uppercase tracking-wide">Описание</p>
                  <p className="text-white bg-dark-200/50 rounded-lg p-6 min-h-32 leading-relaxed text-lg">
                    {activity.description || 'Нет описания'}
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-8 pt-6 border-t border-dark-300">
                  <div className="space-y-2">
                    <p className="text-xs text-light-200 uppercase tracking-wider">ID активности</p>
                    <p className="text-lg text-gray-300 font-mono">{activity.activId}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-light-200 uppercase tracking-wider">ID организации</p>
                    <p className="text-lg text-gray-300 font-mono">{activity.orgId}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-light-200 uppercase tracking-wider">ID пользователя</p>
                    <p className="text-lg text-gray-300 font-mono">{activity.usrId}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-light-200 uppercase tracking-wider">ID статуса</p>
                    <p className="text-lg text-gray-300 font-mono">{activity.statusId}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : null}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="glass card-shadow rounded-[10px] border border-dark-200 p-8 max-w-md w-full mx-4 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Удалить активность?
                </h2>
                <p className="text-light-200">
                  Вы собираетесь удалить активность <span className="font-semibold text-white">&quot;{activity?.orgName || `#${activity?.activId}`}&quot;</span>. Это действие невозможно отменить.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 bg-dark-200 hover:bg-dark-300 text-light-200 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Отмена
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Удаление...' : 'Удалить'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

const ActivityDetailPage = () => {
  return (
    <ProtectedRoute>
      <ActivityDetailContent />
    </ProtectedRoute>
  )
}

export default ActivityDetailPage
