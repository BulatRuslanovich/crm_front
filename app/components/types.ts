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
