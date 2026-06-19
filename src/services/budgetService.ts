const API_BASE = 'http://localhost:5001/api';

interface Budget {
  budgetId: string;
  category: string;
  budget: number;
  spent: number;
  remaining: number;
  progress: number;
}

interface CreateBudgetPayload {
  month: string;
  category: string;
  budgetAmount: number;
}

interface UpdateBudgetPayload {
  budgetAmount?: number;
}

interface BudgetSummary {
  monthlyIncome: number;
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  budgetUtilizationPercentage: number;
}

import { apiGet, apiPost, apiPut, apiDelete } from './api'

export const budgetService = {
  // Create Budget
  createBudget(budgetData: CreateBudgetPayload): Promise<{ success: boolean; message: string; data: { budgetId: string } }> {
    return apiPost('/budgets', budgetData)
  },

  // Get Budget List
  getBudgetList(month: string): Promise<{ success: boolean; data: Budget[] }> {
    return apiGet('/budgets', { month })
  },

  // Update Budget
  updateBudget(budgetId: string, budgetData: UpdateBudgetPayload): Promise<{ success: boolean; message: string }> {
    return apiPut(`/budgets/${budgetId}`, budgetData)
  },

  // Delete Budget
  deleteBudget(budgetId: string): Promise<{ success: boolean; message: string }> {
    return apiDelete(`/budgets/${budgetId}`)
  },

  // Get Budget Summary
  getBudgetSummary(month: string): Promise<{ success: boolean; data: BudgetSummary }> {
    return apiGet('/budgets/summary', { month })
  },
};
