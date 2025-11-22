'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ProtectedRoute } from '@/lib/protectedRoute'
import { useAuth } from '@/lib/authContext'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555'

const CreateActivityContent = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    orgId: '',
    visitDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    description: ''
  })
  const [orgs, setOrgs] = useState<Array<{ id: number; name: string }>>([])
  const [orgsLoading, setOrgsLoading] = useState(true)

  // Загрузить организации
  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/Org`, {
          credentials: 'include'
        })
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()
        setOrgs(data.map((org: { orgId: number; name: string }) => ({ id: org.orgId, name: org.name })))
      } catch {
        setError('Не удалось загрузить организации')
      } finally {
        setOrgsLoading(false)
      }
    }
    fetchOrgs()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.orgId) {
      setError('Выберите организацию')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${BASE_URL}/api/Activ`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          usrId: user?.usrId,
          orgId: formData.orgId,
          visitDate: formData.visitDate,
          startTime: formData.startTime + ':00',
          endTime: formData.endTime + ':00',
          description: formData.description
        })
      })

      if (!res.ok) {
        throw new Error('Failed to create activity')
      }

      router.push('/activ')
    } catch {
      setError('Не удалось создать активность')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-[calc(100vh-200px)] w-full p-6">
      <div className="max-w-2xl mx-auto w-full">
        <Link href="/activ" className="text-primary hover:underline mb-6 inline-block">
          ← Вернуться к активностям
        </Link>

        <div className="glass card-shadow rounded-[10px] border border-dark-200 p-12 space-y-6">
          <h1 className="text-4xl font-bold text-gradient mb-8">Новая активность</h1>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg p-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-light-200 block mb-2">Организация</label>
              <select
                value={formData.orgId}
                onChange={(e) => setFormData({ ...formData, orgId: e.target.value })}
                disabled={orgsLoading || loading}
                className="w-full bg-dark-200 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              >
                <option value="">{orgsLoading ? 'Загрузка...' : 'Выберите организацию'}</option>
                {orgs.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
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
                  value={formData.startTime}
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
                  value={formData.endTime}
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

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-black px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? 'Создание...' : 'Создать'}
              </button>
              <Link href="/activ" className="bg-dark-200 hover:bg-dark-300 text-light-200 px-6 py-3 rounded-lg font-semibold transition-colors inline-block">
                Отмена
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

const CreateActivityPage = () => {
  return (
    <ProtectedRoute>
      <CreateActivityContent />
    </ProtectedRoute>
  )
}

export default CreateActivityPage
