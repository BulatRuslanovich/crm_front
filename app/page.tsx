'use client'

import { useAuth } from '@/lib/authContext'

const Page = () => {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <section className="flex-center min-h-[calc(100vh-200px)]">
        <p className="text-light-200">Загрузка...</p>
      </section>
    )
  }

  
    return (
      <section id="home" className="flex-center min-h-[calc(100vh-200px)] flex-col gap-8">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-gradient">
            Добро пожаловать в Farm CRM
          </h1>
          
          <p className="subheading">
            Современная система управления взаимоотношениями с клиентами для фармацевтических компаний. 
            Управляйте визитами, отслеживайте активность и повышайте эффективность работы вашей команды.
          </p>
        </div>
      </section>
    )
  
}

export default Page
