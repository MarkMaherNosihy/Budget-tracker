import { Injectable } from '@angular/core';
import { collection, Firestore, onSnapshot, orderBy, query, where } from '@angular/fire/firestore';
import { map, Observable, of, switchMap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  constructor(private firestore: Firestore, private authService: AuthService) { }
  getIncomeTotal(): Observable<number> {

    const incomeCollection = collection(this.firestore, 'incomes');
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      throw new Error('User is not authenticated');
    }

    const incomeQuery = query(
      incomeCollection, 
      where('uid', '==', currentUser.uid)
    );

    return new Observable<number>(subscriber => {
      const unsubscribe = onSnapshot(incomeQuery, (snapshot) => {
        const incomes = snapshot.docs.map(doc => doc.data()['amount']);
        const totalIncome = incomes.reduce((acc, income) => acc + income, 0);
        subscriber.next(totalIncome);
      });
      return unsubscribe;
    });
  }

  getExpensesTotal(): Observable<number> {
    const expenseCollection = collection(this.firestore, 'expenses');

    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      throw new Error('User is not authenticated');
    }

    const expenseQuery = query(
      expenseCollection, 
      where('uid', '==', currentUser.uid)
    );

    return new Observable<number>(subscriber => {
      const unsubscribe = onSnapshot(expenseQuery, (snapshot) => {
        const expenses = snapshot.docs.map(doc => doc.data()['amount']);
        const totalExpenses = expenses.reduce((acc, expense) => acc + expense, 0);
        subscriber.next(totalExpenses);
      });
      return unsubscribe;
    });  }


  getBudget(): Observable<number> {

    return this.getIncomeTotal().pipe(
      switchMap(income => {
        return this.getExpensesTotal().pipe(
          map(expenses => income - expenses)
        );
      })
    );
  }


  

}
