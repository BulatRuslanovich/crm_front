'use client';

interface User {
  firstName: string;
  lastName: string;
  middleName: string;
  login: string;
}

interface UserDashboardProps {
  user: User;
}

export default function UserDashboard({ user }: UserDashboardProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="card rounded-2xl p-8 fade-in max-w-2xl mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-bg flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {user.firstName[0]}{user.lastName[0]}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Привет, {user.lastName} {user.firstName} {user.middleName}!
          </h1>
          
          <p className="text-lg" style={{ color: 'var(--muted-foreground)' }}>
            Добро пожаловать в вашу CRM систему
          </p>
          
          <div className="mt-6 p-4 rounded-xl" style={{ background: 'var(--muted)' }}>
            <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
              Логин: <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                {user.login}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
