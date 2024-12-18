import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { IncomeService } from '../../services/income.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Income, IncomeResponse } from '../../types/income';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [TableModule, ButtonModule, RouterModule, CommonModule, ConfirmDialogModule,ToastModule  ],
  templateUrl: './income.component.html',
  styleUrl: './income.component.css',
  providers: [ConfirmationService, MessageService]
})
export class IncomeComponent {
  incomeService = inject(IncomeService);
  incomes$: Observable<IncomeResponse[]> = this.incomeService.getIncomes();
  isEdit = false;
  editIncome!: IncomeResponse;
  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) {}

  visible = false;
  showDialog() {
    this.visible = true;
}
  handleChange(val: boolean){
    this.visible = val;
  }

  deleteIncome(docId: string) {
    this.incomeService.deteleIncome(docId);
  }
  openEditIncome(income: IncomeResponse) {
    this.isEdit = true;
    this.editIncome = income;
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
            this.deleteIncome(docId);
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
        },
    });
}


}
