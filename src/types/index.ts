export interface Receipt {
  id: string;
  date: Date;
  total: number;
  items: ReceiptItem[];
  category: Category;
  imageUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: Category;
}

export type Category =
  | 'groceries'
  | 'utilities'
  | 'entertainment'
  | 'dining'
  | 'transport'
  | 'healthcare'
  | 'shopping'
  | 'other';

export interface Budget {
  id: string;
  category: Category;
  limit: number;
  spent: number;
  period: 'weekly' | 'monthly' | 'yearly';
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  completed: boolean;
}