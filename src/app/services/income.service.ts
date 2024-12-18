import { inject, Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, onSnapshot, query, updateDoc, where } from '@angular/fire/firestore';
import { Income, IncomeResponse } from '../types/income';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  firestore = inject(Firestore);

  constructor(private authService: AuthService) { }




  async createIncome(income: Income) {
    const incomeCollection = collection(this.firestore, 'incomes');
    await addDoc(incomeCollection, {...income, uid: this.authService.getCurrentUser()?.uid });
    return 
  }

  getIncomes(): Observable<IncomeResponse[]> {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      throw new Error('User is not authenticated');
    }
  
    const incomeCollection = collection(this.firestore, 'incomes');

    const userIncomesQuery = query(
      incomeCollection, 
      where('uid', '==', currentUser.uid)
    );
    
    return new Observable<IncomeResponse[]>(subscriber => {
      const unsubscribe = onSnapshot(userIncomesQuery, (snapshot) => {
        const incomes: IncomeResponse[] = snapshot.docs.map(doc => 
          ({ ...doc.data(), docId: doc.id } as IncomeResponse)
        );
        subscriber.next(incomes);
      });
      return unsubscribe;
    });
    }
  getIncomeById(docId: string): Observable<IncomeResponse> {
    const incomeCollection = collection(this.firestore, 'incomes');
    const docRef = doc(incomeCollection, docId);
    return new Observable<IncomeResponse>(subscriber => {
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        subscriber.next({ ...snapshot.data(), docId: snapshot.id } as IncomeResponse);
      });
      return unsubscribe;
    });
  }

  updateIncome(docId: string, income: Income) {
    const incomeCollection = collection(this.firestore, 'incomes');

    const docToUpdate = doc(incomeCollection, docId);
     return updateDoc(docToUpdate,{...income, uid: this.authService.getCurrentUser()?.uid });
  }
  deteleIncome(docId: string) {

    const incomeCollection = collection(this.firestore, 'incomes');
    const docToDelete = doc(incomeCollection, docId);
    return deleteDoc(docToDelete);
 
  }
}
