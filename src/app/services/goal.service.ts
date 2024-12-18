import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, onSnapshot, orderBy, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Goals, GoalsResponse } from '../types/goals';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class GoalService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  getGoals(): Observable<GoalsResponse[]> {

    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      throw new Error('User is not authenticated');
    }

    const goalsCollection = collection(this.firestore, 'goals');
    const userGoalsQuery = query(
      goalsCollection, 
      where('uid', '==', currentUser.uid),orderBy('priority', 'asc')
    );
    // Add orderBy to the query for Firestore
    // const orderedQuery = query(goalsCollection, orderBy('priority', 'asc'));
  
    return new Observable<GoalsResponse[]>(subscriber => {
      const unsubscribe = onSnapshot(userGoalsQuery, (snapshot) => {
        const goals: GoalsResponse[] = snapshot.docs.map(doc => 
          ({ ...doc.data(), docId: doc.id } as GoalsResponse)
        );
        subscriber.next(goals);
      });
      return unsubscribe;
    });
    }

  async addGoal(goal: Goals) {
    const goalsCollection = collection(this.firestore, 'goals');
    return  await addDoc(goalsCollection, {...goal, uid: this.authService.getCurrentUser()?.uid });
    

  }
   deleteGoal(docId: string) {
    const goalsCollection = collection(this.firestore, 'goals');
    const docRef = doc(goalsCollection, docId);
    return  deleteDoc(docRef);
  }


  getGoalById(docId: string){
        const goalsCollection = collection(this.firestore, 'goals');
        const docRef = doc(goalsCollection, docId);
        return new Observable<GoalsResponse>(subscriber => {
          const unsubscribe = onSnapshot(docRef, (snapshot) => {
            subscriber.next({ ...snapshot.data(), docId: snapshot.id } as GoalsResponse);
          });
          return unsubscribe;
        });
  }

  updateGoal(docId: string, goal: Partial<Goals>) {
        const goalsCollection = collection(this.firestore, 'goals');
    
        const docToUpdate = doc(goalsCollection, docId);
         return updateDoc(docToUpdate,{...goal, uid: this.authService.getCurrentUser()?.uid });
    
  }
}
