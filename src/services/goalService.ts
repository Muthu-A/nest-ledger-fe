import { apiGet, apiPost, apiPut, apiDelete } from './api'

const API_BASE = '' // kept for backward compatibility in some paths

interface Goal {
  goalId: string;
  goalName: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  progress: number;
  remainingAmount: number;
  targetDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  notes?: string;
}

interface Contribution {
  contributionId: string;
  amount: number;
  date: string;
  notes?: string;
}

interface CreateGoalPayload {
  goalName: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  notes?: string;
}

interface UpdateGoalPayload {
  goalName?: string;
  targetAmount?: number;
  targetDate?: string;
  notes?: string;
}

interface ContributionPayload {
  amount: number;
  date: string;
  notes?: string;
}

export const goalService = {
  // Create Goal
  createGoal(goalData: CreateGoalPayload) {
    return apiPost('/goals', goalData)
  },

  // Get All Goals
  getAllGoals() {
    return apiGet('/goals')
  },

  // Get Goal Details
  getGoalById(goalId: string) {
    return apiGet(`/goals/${goalId}`)
  },

  // Update Goal
  updateGoal(goalId: string, goalData: UpdateGoalPayload) {
    return apiPut(`/goals/${goalId}`, goalData)
  },

  // Delete Goal
  deleteGoal(goalId: string) {
    return apiDelete(`/goals/${goalId}`)
  },

  // Add Contribution
  addContribution(goalId: string, contributionData: ContributionPayload) {
    return apiPost(`/goals/${goalId}/contributions`, contributionData)
  },

  // Get Contribution History
  getContributions(goalId: string) {
    return apiGet(`/goals/${goalId}/contributions`)
  },

  // Update Contribution
  updateContribution(contributionId: string, contributionData: Partial<ContributionPayload>) {
    return apiPut(`/goals/contributions/${contributionId}`, contributionData)
  },

  // Delete Contribution
  deleteContribution(contributionId: string) {
    return apiDelete(`/goals/contributions/${contributionId}`)
  },

  // Goal Dashboard Summary
  getDashboardSummary() {
    return apiGet('/goals/summary')
  },
}
