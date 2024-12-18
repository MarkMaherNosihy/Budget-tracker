export interface BudgetCategory {
    id?: string;
    name: string;
  }
  
  export interface Budget {
    id?: string;
    title: string;
    amount: number;
    category: BudgetCategory;
  }