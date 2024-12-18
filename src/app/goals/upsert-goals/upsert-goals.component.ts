import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GoalService } from '../../services/goal.service';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-upsert-goals',
  standalone: true,
  imports: [ButtonModule, InputNumberModule, RouterModule, InputTextModule, FormsModule, ReactiveFormsModule],
  templateUrl: './upsert-goals.component.html',
  styleUrl: './upsert-goals.component.css'
})
export class UpsertGoalsComponent {
  goalsForm!: FormGroup;
  goalsService = inject(GoalService);
  router = inject(Router);
  route = inject(ActivatedRoute)
  numberOfGoals!: number;
  isEditMode = false;
  goalId: string | null = null;

  constructor(private fb: FormBuilder) {
    this.goalsForm = this.fb.group({
      title: ['', [Validators.required]],
      priority: [null, []],
      amount: [null, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    console.log("heeee");
    this.goalsService.getGoals().subscribe(goals => { 
      console.log("goals", goals);
      this.numberOfGoals = goals.length;
    });
    this.route.paramMap.subscribe(params => {
      this.goalId = params.get('id');
      
      if (this.goalId) {
        this.isEditMode = true;
        this.loadGoal();
      }
    });

  }


  loadGoal() {
    if(this.goalId === null) return;
    this.goalsService.getGoalById(this.goalId).subscribe(goal => {
      if (goal) {
        this.goalsForm.patchValue(goal);
      }
    });
  }

  onSubmit(): void {

    if(!this.isEditMode){
      this.goalsForm.controls['priority'].setValue(this.numberOfGoals + 1);
    }
    if (this.goalsForm.valid) {
      if (this.isEditMode && this.goalId) {
         this.goalsService.updateGoal(this.goalId, this.goalsForm.value).then(()=>{
          this.router.navigate(['/goals']);
        }).catch((error)=>{
          console.error(error);
        });

      }else{          
        this.goalsService.addGoal(this.goalsForm.value).then(()=>{
          this.router.navigate(['/goals']);
        }).catch((error)=>{
          console.error(error);
        });
      }

    } else {
      console.error('Form is invalid!');
    }
  }


}
