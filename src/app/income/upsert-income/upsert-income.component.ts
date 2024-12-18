import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import {DialogModule } from 'primeng/dialog';
import { InputNumber, InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { IncomeService } from '../../services/income.service';
import { IncomeResponse } from '../../types/income';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-upsert-income',
  standalone: true,
  imports: [ButtonModule, InputNumberModule, RouterModule, InputTextModule, FormsModule, ReactiveFormsModule],
  templateUrl: './upsert-income.component.html',
  styleUrl: './upsert-income.component.css'
})
export class UpsertIncomeComponent {
  incomeForm!: FormGroup;
  incomeService = inject(IncomeService);
  router = inject(Router);
  route = inject(ActivatedRoute)

  isEditMode = false;
  incomeId: string | null = null;

  constructor(private fb: FormBuilder) {
    this.incomeForm = this.fb.group({
      title: ['', [Validators.required]],
      source: ['', [Validators.required]],
      amount: [null, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.incomeId = params.get('id');
      
      if (this.incomeId) {
        this.isEditMode = true;
        this.loadIncome();
      }
    });

  }


  loadIncome() {
    if(this.incomeId === null) return;
    this.incomeService.getIncomeById(this.incomeId).subscribe(income => {
      if (income) {
        this.incomeForm.patchValue(income);
      }
    });
  }

  onSubmit(): void {

    if (this.incomeForm.valid) {
      if (this.isEditMode && this.incomeId) {
        this.incomeService.updateIncome(this.incomeId, this.incomeForm.value).then(()=>{
          this.router.navigate(['/income']);
        }).catch((error)=>{
          console.error(error);
        });

      }else{          
        this.incomeService.createIncome(this.incomeForm.value).then(()=>{
          this.router.navigate(['/income']);
        }).catch((error)=>{
          console.error(error);
        });
      }

    } else {
      console.error('Form is invalid!');
    }
  }


}
