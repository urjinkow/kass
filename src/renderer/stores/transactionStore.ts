import { create } from 'zustand';

interface Category {
  id: number;
  name: string;
  name_mn: string;
}

interface TransactionState {
  incomeCategories: Category[];
  expenseCategories: Category[];
  loadCategories: () => Promise<void>;
  addIncome: (data: any) => Promise<{ success: boolean; error?: string; transaction?: any }>;
  addExpense: (data: any) => Promise<{ success: boolean; error?: string; transaction?: any }>;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  incomeCategories: [],
  expenseCategories: [],

  loadCategories: async () => {
    try {
      const categories = await window.api.getCategories();
      set({
        incomeCategories: categories.income,
        expenseCategories: categories.expense,
      });
    } catch (error) {
      console.error('Load categories error:', error);
    }
  },

  addIncome: async (data: any) => {
    try {
      const result = await window.api.addIncome(data);
      return result;
    } catch (error) {
      console.error('Add income error:', error);
      return { success: false, error: 'Орлого нэмэхэд алдаа гарлаа' };
    }
  },

  addExpense: async (data: any) => {
    try {
      const result = await window.api.addExpense(data);
      return result;
    } catch (error) {
      console.error('Add expense error:', error);
      return { success: false, error: 'Зарлага нэмэхэд алдаа гарлаа' };
    }
  },
}));
