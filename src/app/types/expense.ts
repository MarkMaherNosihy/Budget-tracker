import { BudgetCategory } from "./budget";

export interface Expense{
    title: string;
    amount: number,
    categoryId: string
}

export interface ExpenseResponse{
    amount: number,
    title: string,   
    docId: string,
    category: BudgetCategory
}