import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Goals, GoalsResponse } from '../../types/goals';
import { ConfirmationService, MessageService } from 'primeng/api';
import { from, Observable, switchMap } from 'rxjs';
import { GoalService } from '../../services/goal.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { BudgetService } from '../../services/budget.service';
import { ProgressBar } from 'primeng/progressbar';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, RouterModule, CommonModule, ConfirmDialogModule,ToastModule, ProgressBar],
  providers: [ConfirmationService, MessageService],
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.css'
})

export class GoalsComponent implements OnInit {

  goalService = inject(GoalService);
  budgetService = inject(BudgetService);

  goals$: Observable<GoalsResponse[]> = this.goalService.getGoals();
  goals: GoalsResponse[] = [];
  budget! : number;
  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) {}
  checkedGoalsIds:string[] = [];
  
  ngOnInit(): void {
    this.budgetService.getBudget()
    .pipe(
      switchMap(budget => {
        this.budget = budget;
        return this.goals$; 
      })
    )
    .subscribe(goals => {
      this.goals = goals;
      this.precomputeProgress(); 
    });

  }


  confirmDelete(event: Event, docId: string) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Do you want to delete this record?',
        header: 'Danger Zone',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        rejectButtonProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true,
        },
        acceptButtonProps: {
            label: 'Delete',
            severity: 'danger',
        },

        accept: () => {
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
            
            from(this.goalService.deleteGoal(docId))
            .pipe(
              switchMap(() => from(this.budgetService.getBudget())),
              switchMap(budget => {
                this.budget = budget;
                // Reset checked goals and recompute progress
                this.checkedGoalsIds = [];
                return from(this.goalService.getGoals());
              })
            ).subscribe({
              next: (goals) => {
                this.goals = goals;
                this.precomputeProgress();
                this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
              },
              error: (err) => {
                console.error('Error deleting goal:', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete record' });
              }
            });
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
        },
    });
}



  checkGoal(goal: GoalsResponse) {
    return this.checkedGoalsIds.includes(goal.docId); //12000 - 8000 = 4000
  }

  precomputeProgress() {
    this.goals.forEach((goal: GoalsResponse) => {
      if (this.budget && !this.checkGoal(goal)) {
        let progress = Math.min((this.budget / goal.amount) * 100, 100);
        console.log(progress);
        const amountToSubtract = goal.amount * (progress / 100);
        this.budget = this.budget - amountToSubtract;
        this.checkedGoalsIds.push(goal.docId);
        goal.progress = Math.round(progress); // Attach progress directly to the goal
      } else {
      }
    });
    console.log(this.goals);
  }
  


}
