import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Expense, ExpenseResponse } from '../../types/expense';
import { ExpenseService } from '../../services/expense.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [TableModule, ButtonModule, RouterModule, CommonModule, ConfirmDialogModule,ToastModule  ],

  providers: [ConfirmationService, MessageService],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css'
})
export class ExpenseComponent {

  expenseService = inject(ExpenseService);
  expense$: Observable<ExpenseResponse[]> = this.expenseService.getExpenses();
  isEdit = false;
  editExpense!: ExpenseResponse;
  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) {}

  visible = false;
  showDialog() {
    this.visible = true;
}
  handleChange(val: boolean){
    this.visible = val;
  }

  deleteExpense(docId: string) {
    this.expenseService.deteleExpense(docId);
  }
  openEditExpense(expense: ExpenseResponse) {
    this.isEdit = true;
    this.editExpense = expense;
    this.showDialog();
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
            this.deleteExpense(docId);
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
        },
    });
}

}
