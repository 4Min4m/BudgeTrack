import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Receipt, Budget, ShoppingList, Category } from '../types';
import * as XLSX from 'xlsx';

interface State {
  userId: string | null;
  receipts: Receipt[];
  budgets: Budget[];
  shoppingLists: ShoppingList[];
  initializeUser: (userId: string) => Promise<void>;
  addReceipt: (receipt: Receipt) => Promise<void>;
  updateReceipt: (receipt: Receipt) => Promise<void>;
  deleteReceipt: (id: string) => Promise<void>;
  updateBudget: (budget: Budget) => Promise<void>;
  addShoppingList: (list: ShoppingList) => Promise<void>;
  updateShoppingList: (list: ShoppingList) => Promise<void>;
  deleteShoppingList: (id: string) => Promise<void>;
  exportData: () => Promise<void>;
}

export const useStore = create<State>((set, get) => ({
  userId: null,
  receipts: [],
  budgets: [],
  shoppingLists: [],

  initializeUser: async (userId: string) => {
    set({ userId });

    const [receiptsRes, budgetsRes, listsRes] = await Promise.all([
      supabase.from('receipts').select('*').eq('user_id', userId),
      supabase.from('budgets').select('*').eq('user_id', userId),
      supabase.from('shopping_lists').select('*, shopping_items(*)').eq('user_id', userId),
    ]);

    if (receiptsRes.error) throw receiptsRes.error;
    if (budgetsRes.error) throw budgetsRes.error;
    if (listsRes.error) throw listsRes.error;

    const formattedReceipts = receiptsRes.data.map((receipt) => ({
      id: receipt.id,
      date: new Date(receipt.date),
      total: receipt.total,
      items: receipt.items || [], // اگر items وجود نداشته باشه، آرایه خالی برگردون
      category: receipt.category,
      imageUrl: receipt.image_url,
      notes: receipt.notes,
      createdAt: new Date(receipt.created_at),
      updatedAt: new Date(receipt.updated_at),
    }));

    set({
      receipts: formattedReceipts,
      budgets: budgetsRes.data,
      shoppingLists: listsRes.data,
    });
  },

  addReceipt: async (receipt: Receipt) => {
    const { userId } = get();
    if (!userId) return;

    const receiptForDb = {
      id: receipt.id,
      date: receipt.date.toISOString(),
      total: receipt.total,
      items: receipt.items || [], // مطمئن می‌شیم که items همیشه یه آرایه باشه
      category: receipt.category,
      image_url: receipt.imageUrl,
      notes: receipt.notes,
      created_at: receipt.createdAt.toISOString(),
      updated_at: receipt.updatedAt.toISOString(),
      user_id: userId,
    };

    const { data, error } = await supabase
      .from('receipts')
      .insert([receiptForDb])
      .select()
      .single();

    if (error) {
      console.error('Error adding receipt to Supabase:', error);
      throw error;
    }

    const formattedReceipt = {
      ...data,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };

    set((state) => ({
      receipts: [...state.receipts, formattedReceipt],
    }));
  },

  updateReceipt: async (receipt: Receipt) => {
    const receiptForDb = {
      id: receipt.id,
      date: receipt.date.toISOString(),
      total: receipt.total,
      items: receipt.items || [],
      category: receipt.category,
      image_url: receipt.imageUrl,
      notes: receipt.notes,
      created_at: receipt.createdAt.toISOString(),
      updated_at: receipt.updatedAt.toISOString(),
    };

    const { error } = await supabase
      .from('receipts')
      .update(receiptForDb)
      .eq('id', receipt.id);

    if (error) throw error;

    set((state) => ({
      receipts: state.receipts.map((r) => (r.id === receipt.id ? receipt : r)),
    }));
  },

  deleteReceipt: async (id: string) => {
    const { error } = await supabase.from('receipts').delete().eq('id', id);

    if (error) throw error;

    set((state) => ({
      receipts: state.receipts.filter((r) => r.id !== id),
    }));
  },

  updateBudget: async (budget: Budget) => {
    const { userId } = get();
    if (!userId) return;

    const { error } = await supabase
      .from('budgets')
      .upsert({ ...budget, user_id: userId });

    if (error) throw error;

    set((state) => ({
      budgets: state.budgets.map((b) => (b.id === budget.id ? budget : b)),
    }));
  },

  addShoppingList: async (list: ShoppingList) => {
    const { userId } = get();
    if (!userId) return;

    const { data, error } = await supabase
      .from('shopping_lists')
      .insert([{ ...list, user_id: userId }])
      .select()
      .single();

    if (error) throw error;

    set((state) => ({
      shoppingLists: [...state.shoppingLists, data],
    }));
  },

  updateShoppingList: async (list: ShoppingList) => {
    const { error: listError } = await supabase
      .from('shopping_lists')
      .update({ name: list.name, updated_at: list.updatedAt })
      .eq('id', list.id);

    if (listError) throw listError;

    const { error: itemsError } = await supabase
      .from('shopping_items')
      .upsert(
        list.items.map((item) => ({
          ...item,
          list_id: list.id,
        }))
      );

    if (itemsError) throw itemsError;

    set((state) => ({
      shoppingLists: state.shoppingLists.map((l) => (l.id === list.id ? list : l)),
    }));
  },

  deleteShoppingList: async (id: string) => {
    const { error } = await supabase.from('shopping_lists').delete().eq('id', id);

    if (error) throw error;

    set((state) => ({
      shoppingLists: state.shoppingLists.filter((l) => l.id !== id),
    }));
  },

  exportData: async () => {
    const { receipts, budgets, shoppingLists } = get();

    const workbook = XLSX.utils.book_new();

    const receiptsWS = XLSX.utils.json_to_sheet(receipts);
    XLSX.utils.book_append_sheet(workbook, receiptsWS, 'Receipts');

    const budgetsWS = XLSX.utils.json_to_sheet(budgets);
    XLSX.utils.book_append_sheet(workbook, budgetsWS, 'Budgets');

    const shoppingListsWS = XLSX.utils.json_to_sheet(shoppingLists);
    XLSX.utils.book_append_sheet(workbook, shoppingListsWS, 'Shopping Lists');

    XLSX.writeFile(workbook, 'finance-data.xlsx');
  },
}));