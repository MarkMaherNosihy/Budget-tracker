import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { addDoc, collection, deleteDoc, doc, Firestore, getDoc, onSnapshot, query, updateDoc, where } from '@angular/fire/firestore';
import { Budget, BudgetCategory } from '../types/budget';
import { combineLatest, map, Observable } from 'rxjs';
import { Expense } from '../types/expense';
import { ExpenseService } from './expense.service';

@Injectable({
  providedIn: 'root'
})
export class BudgetsService {

  firestore = inject(Firestore);
  
  constructor(private authService: AuthService, private expenseService: ExpenseService) { }

  createBudget(budget: Budget) {
    const budgetCollection = collection(this.firestore, 'budgets');
    return addDoc(budgetCollection, { ...budget, uid: this.authService.getCurrentUser()?.uid });
  }


  getBudgets() {
    const budgetCol = collection(this.firestore, 'budgets');

    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      throw new Error('User is not authenticated');
    }

    const budgetsQuery = query(
      budgetCol, 
      where('uid', '==', currentUser.uid)
    );

    return new Observable<Budget[]>(subscriber => {
      const unsubscribe = onSnapshot(budgetsQuery, async (snapshot) => {

        const budgets: Budget[] = [];
  
        // Loop through each budget document
        for (const docSnapshot of snapshot.docs) {
          const budgetData = docSnapshot.data();
          const categoryId = budgetData['category']; // categoryId from budget
  
          let category: BudgetCategory | null = null;
  
          // Fetch the category details if categoryId exists
          if (categoryId) {
            const categoryRef = doc(this.firestore, 'categories', categoryId);
            const categorySnapshot = await getDoc(categoryRef);
  
            if (categorySnapshot.exists()) {
              console.log("Exists");
              category = { id: categorySnapshot.id, ...categorySnapshot.data() } as BudgetCategory;
            }
          }
  
          // Add budget with category details
          budgets.push({
            ...budgetData,
            id: docSnapshot.id,
            category: category || { id: categoryId, name: 'Unknown Category' }
          } as Budget);
        }
  
        subscriber.next(budgets);
      });
  
      return unsubscribe;
    });
    }


    getTotalExpensesByBudgetCategory(): Observable<{ [categoryName: string]: number }> {
      return combineLatest([this.getBudgets(), this.expenseService.getExpenses()]).pipe(
        map(([budgets, expenses]) => {
          const categoryTotals: { [categoryName: string]: number } = {};
          
          // Initialize totals for each budget category
          budgets.forEach(budget => {
            const categoryName = budget.category.name;
            categoryTotals[categoryName] = 0; // Start with 0
          });
    
          // Sum expenses based on category
          expenses.forEach(expense => {
            const expenseCategoryName = expense.category.name;
    
            if (expenseCategoryName in categoryTotals) {
              categoryTotals[expenseCategoryName] += expense.amount;
            }
          });
    
          return categoryTotals;
        })
      );
    }
    
  getCategories() {
    const categoriesCollection = collection(this.firestore, 'categories');
    return new Observable<BudgetCategory[]>(subscriber => {
      const unsubscribe = onSnapshot(categoriesCollection, (snapshot) => {
        const cats: BudgetCategory[] = snapshot.docs.map(doc => 
          ({ ...doc.data(), id: doc.id } as BudgetCategory)
        );
        subscriber.next(cats);
      });
      return unsubscribe;
    });
  }


  updateBudget(budgetId: string, budgetData: Partial<Budget>): Promise<void> {
    // Remove the id and category object from the data to be updated
    const { id, ...updateData } = budgetData;
    
    // If there's a new category, we only want to store the category ID
    const dataToUpdate = {
      ...updateData,
      uid: this.authService.getCurrentUser()?.uid
    };
  
    // Get reference to the budget document
    const budgetRef = doc(this.firestore, 'budgets', budgetId);
    
    // Update the budget document
    return updateDoc(budgetRef, dataToUpdate);
  }

    getBudgetById(docId: string): Observable<Budget> {
      const budgetCol = collection(this.firestore, 'budgets');
      const docRef = doc(budgetCol, docId);
      return new Observable<Budget>(subscriber => {
        const unsubscribe = onSnapshot(docRef, (snapshot) => {
          subscriber.next({ ...snapshot.data(), id: snapshot.id } as Budget);
        });
        return unsubscribe;
      });
    }
  
      deleteBudget(docId: string) {
        const budgetCol = collection(this.firestore, 'budgets');
        const docToDelete = doc(budgetCol, docId);
        return deleteDoc(docToDelete);
     
      }
    
}

