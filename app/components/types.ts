export interface Activity {
  activId: number;
  usrId: number;
  orgName: string;
  statusName: string;
  visitDate: string;
  startTime: string;
  endTime: string;
  description: string;
}

export interface User {
  firstName: string;
  lastName: string;
  middleName: string;
  login: string;
  id: number;
}

export interface ChartData {
  label: string;
  value: number;
  color: string;
  percentage: number;
}

export interface DashboardStats {
  totalActivities: number;
  completedActivities: number;
  avgVisitFrequency: number;
  visitsThisMonth: number;
  avgVisitDuration: number;
}
