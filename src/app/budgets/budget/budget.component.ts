import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Budget } from '../../types/budget';
import { Observable } from 'rxjs';
import { BudgetService } from '../../services/budget.service';
import { BudgetsService } from '../../services/budgets.service';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [TableModule, ButtonModule, RouterModule, CommonModule, ConfirmDialogModule,ToastModule  ],

  providers: [ConfirmationService, MessageService],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css'
})
export class BudgetComponent {

    bugetService = inject(BudgetsService);
    budget$: Observable<Budget[]> = this.bugetService.getBudgets();
    constructor(private confirmationService: ConfirmationService, private messageService: MessageService) {}
    

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
            this.bugetService.deleteBudget(docId);

            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
          },
          reject: () => {
              this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
          },
      });
  }
  
}
