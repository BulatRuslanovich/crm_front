export interface SignUpCredentials {
  name: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  isEmailVerified: boolean | null;
  user: User | null;
}

export type FormState = "IDLE" | "LOADING" | "SUCCESS" | "ERROR";
