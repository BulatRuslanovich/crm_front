// Общие типы для пользователя
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  login: string;
}

// Типы для форм
export interface LoginForm {
  login: string;
  password: string;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  middleName: string;
  login: string;
  password: string;
  confirmPassword: string;
}

export interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Типы для активностей
export interface Activity {
  activId: number;
  usrId: number;
  orgId: number;
  statusId: number;
  visitDate: string;
  startTime: string;
  endTime: string;
  description: string;
}

export interface HumActivity {
  activId: number;
  usrId: number;
  orgName: string;
  statusName: string;
  visitDate: string;
  startTime: string;
  endTime: string;
  description: string;
}

export interface CreateActivityForm {
  orgId: number;
  visitDate: string;
  startTime: string;
  endTime: string;
  description: string;
}

export interface UpdateActivityForm {
  statusId: number;
  visitDate: string;
  startTime: string;
  endTime: string;
  description: string;
}

// Типы для организаций
export interface Organization {
  orgId: number;
  name: string;
  inn: string;
  latitude: number;
  longitude: number;
  address: string;
}

// Типы для статусов
export interface Status {
  statusId: number;
  name: string;
}

// Типы для API ответов
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Типы для форм
export interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

// Типы для состояний загрузки
export interface LoadingState {
  loading: boolean;
  error: string | null;
  success: boolean;
}
