import type { Income } from '../types/income'
import { apiGet, apiPost, apiPut, apiDelete } from './api'


export const incomeService = {
  getAll(month?: string): Promise<Income[]> {
    return apiGet<any[]>('/income', month ? { month } : undefined).then((data) =>
      data.map((item) => ({ ...item, id: item._id || item.id }))
    );
  },

  create(income: any): Promise<Income> {
    return apiPost<any>('/income', income).then((item) => ({ ...item, id: item._id || item.id }));
  },

  update(id: string, income: Partial<Income>): Promise<Income> {
    return apiPut<any>(`/income/${id}`, income).then((item) => ({ ...item, id: item._id || item.id }));
  },

  delete(id: string): Promise<void> {
    return apiDelete(`/income/${id}`);
  },
}
