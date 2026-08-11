import api from './api';

export const expenseTargetService = {
  getTarget: () => api.get('/expense-target'),
  setTarget: (data) => api.post('/expense-target', data),
  deleteTarget: () => api.delete('/expense-target'),
  getStatus: () => api.get('/expense-target/status'),
};
