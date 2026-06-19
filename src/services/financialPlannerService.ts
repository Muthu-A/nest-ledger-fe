import { apiGet } from './api'

interface HealthScore {
  score: number;
  grade: string;
}

interface SalaryAllocation {
  name: string;
  amount: number;
  percentage: number;
}

interface Recommendation {
  type: 'GOAL_CONTRIBUTION' | 'ALERT' | 'INVESTMENT' | 'EMERGENCY_FUND';
  title: string;
  message: string;
}

interface FinancialPlannerData {
  healthScore: HealthScore;
  salaryAllocation: SalaryAllocation[];
  recommendations: Recommendation[];
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json() as Promise<T>;
}

export const financialPlannerService = {
  // Get Financial Planner Data (optional month query param)
  getPlannerData(month?: string): Promise<{ success: boolean; data: FinancialPlannerData }> {
    return apiGet('/financial/planner', month ? { month } : undefined)
  },
}
