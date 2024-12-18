import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BudgetsService } from '../../services/budgets.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { BudgetCategory } from '../../types/budget';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-budget-upsert',
  standalone: true,
  imports: [TableModule, ButtonModule, RouterModule, CommonModule, ConfirmDialogModule,ToastModule,InputNumberModule,FormsModule, ReactiveFormsModule, InputTextModule, SelectModule],
  providers: [ConfirmationService, MessageService],
    templateUrl: './budget-upsert.component.html',
  styleUrl: './budget-upsert.component.css'
})
export class BudgetUpsertComponent implements OnDestroy {

    budgetForm!: FormGroup;
    budgetService = inject(BudgetsService);
    router = inject(Router);
    route = inject(ActivatedRoute)
    categories:BudgetCategory[] = [];
    isEditMode = false;
    catSubscription: any;
    budgetSubscription: any;
    updateBudgetSubscription: any;
    budgetId: string | null = null;
  
    constructor(private fb: FormBuilder) {
      this.budgetForm = this.fb.group({
        title: ['', [Validators.required]],
        category: ['', [Validators.required]],
        amount: [null, [Validators.required, Validators.min(0)]]
      });
    }
  
    ngOnInit(): void {
      this.catSubscription =   this.budgetService.getCategories().subscribe((categories: BudgetCategory[]) => {
        this.categories = categories;
      });



      this.route.paramMap.subscribe(params => {
        this.budgetId = params.get('id');
        
        if (this.budgetId) {
          this.isEditMode = true;
          this.loadBudget();
        }
      });
  
    }
  
  
    loadBudget() {
      if(this.budgetId === null) return;

      this.budgetSubscription = this.budgetService.getBudgetById(this.budgetId).subscribe(budget => {
        if (budget) {
          this.budgetForm.patchValue(budget);
        }
      });
    }
  
    onSubmit(): void {
  
      if (this.budgetForm.valid) {
        if (this.isEditMode && this.budgetId) {
          this.updateBudgetSubscription = this.budgetService.updateBudget(this.budgetId, this.budgetForm.value).then(()=>{
            this.router.navigate(['/budgets']);
          }).catch((error)=>{
            console.error(error);
          });
  
        }else{          
          this.budgetService.createBudget(this.budgetForm.value).then(()=>{
            this.router.navigate(['/budgets']);
          }).catch((error)=>{
            console.error(error);
          });
        }
  
      } else {
        console.error('Form is invalid!');
      }
    }
  
    ngOnDestroy(): void {
        this.catSubscription.unsubscribe();
        this.budgetSubscription.unsubscribe();
        this.updateBudgetSubscription.unsubscribe();
    }
}
