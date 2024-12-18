import { inject, Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, getDoc, onSnapshot, orderBy, query, updateDoc, where } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Expense, ExpenseResponse } from '../types/expense';
import { Observable } from 'rxjs';
import { BudgetCategory } from '../types/budget';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {


  firestore = inject(Firestore);

  constructor(private authService: AuthService) { }




  async createExpense(expense: Expense) {
    const expenseCollection = collection(this.firestore, 'expenses');
    await addDoc(expenseCollection, {...expense, uid: this.authService.getCurrentUser()?.uid });
    return 
  }

  getExpenses(): Observable<ExpenseResponse[]> {
    const expensesCol = collection(this.firestore, 'expenses');
        const currentUser = this.authService.getCurrentUser();
    
        if (!currentUser) {
          throw new Error('User is not authenticated');
        }
    
        const userExpensesQuery = query(
          expensesCol, 
          where('uid', '==', currentUser.uid)
        );
    

    return new Observable<ExpenseResponse[]>(subscriber => {
      const unsubscribe = onSnapshot(userExpensesQuery, async (snapshot) => {
        const budgets: ExpenseResponse[] = [];
  
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
            docId: docSnapshot.id,
            category: category || { id: categoryId, name: 'Unknown Category' }
          } as ExpenseResponse);
        }
        subscriber.next(budgets);
      });
  
      return unsubscribe;
    });

  }
  getExpenseById(docId: string): Observable<ExpenseResponse> {
    const expenseCollection = collection(this.firestore, 'expenses');
    const docRef = doc(expenseCollection, docId);
    return new Observable<ExpenseResponse>(subscriber => {
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        subscriber.next({ ...snapshot.data(), docId: snapshot.id } as ExpenseResponse);
      });
      return unsubscribe;
    });
  }

  updateExpense(docId: string, expense: Expense) {
    const expenseCollection = collection(this.firestore, 'expenses');

    const docToUpdate = doc(expenseCollection, docId);
     return updateDoc(docToUpdate,{...expense, uid: this.authService.getCurrentUser()?.uid });
  }
  deteleExpense(docId: string) {
    const expenseCollection = collection(this.firestore, 'expenses');
    const docToDelete = doc(expenseCollection, docId);
    return deleteDoc(docToDelete);
 
  }

}
