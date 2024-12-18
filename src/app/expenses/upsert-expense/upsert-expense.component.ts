import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { BudgetCategory } from '../../types/budget';
import { SelectModule } from 'primeng/select';
import { BudgetsService } from '../../services/budgets.service';

@Component({
  selector: 'app-upsert-expense',
  standalone: true,
  imports: [ButtonModule, InputNumberModule, RouterModule, InputTextModule, FormsModule, ReactiveFormsModule, SelectModule],
  templateUrl: './upsert-expense.component.html',
  styleUrl: './upsert-expense.component.css'
})
export class UpsertExpenseComponent {

  expenseForm!: FormGroup;
  expenseService = inject(ExpenseService);
  budgetService = inject(BudgetsService);

  router = inject(Router);
  route = inject(ActivatedRoute)

  isEditMode = false;
  expenseId: string | null = null;
  categories:BudgetCategory[] = [];

  constructor(private fb: FormBuilder) {
    this.expenseForm = this.fb.group({
      title: ['', [Validators.required]],
      category: ['', [Validators.required]],
      amount: [null, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.budgetService.getCategories().subscribe((categories: BudgetCategory[]) => {
      this.categories = categories;
    });
    this.route.paramMap.subscribe(params => {
      this.expenseId = params.get('id');
      
      if (this.expenseId) {
        this.isEditMode = true;
        this.loadExpense();
      }
    });

  }


  loadExpense() {
    if(this.expenseId === null) return;
    this.expenseService.getExpenseById(this.expenseId).subscribe(expense => {
      if (expense) {
        this.expenseForm.patchValue(expense);
      }
    });
  }

  onSubmit(): void {

    if (this.expenseForm.valid) {
      if (this.isEditMode && this.expenseId) {
        this.expenseService.updateExpense(this.expenseId, this.expenseForm.value).then(()=>{
          this.router.navigate(['/expenses']);
        }).catch((error)=>{
          console.error(error);
        });

      }else{          
        this.expenseService.createExpense(this.expenseForm.value).then(()=>{
          this.router.navigate(['/expenses']);
        }).catch((error)=>{
          console.error(error);
        });
      }

    } else {
      console.error('Form is invalid!');
    }
  }

}
