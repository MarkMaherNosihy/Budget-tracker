import { Component, inject, OnInit } from '@angular/core';
import { IncomeChartComponent } from "./income-chart/income-chart.component";
import { ExpenseChartComponent } from './expense-chart/expense-chart.component';
import { Observable, switchMap } from 'rxjs';
import { GoalsResponse } from '../types/goals';
import { GoalService } from '../services/goal.service';
import { BudgetService } from '../services/budget.service';
import { ProgressBar } from 'primeng/progressbar';
import { BadgeModule } from 'primeng/badge';
import { Card, CardModule } from 'primeng/card';
import { Budget } from '../types/budget';
import { BudgetsService } from '../services/budgets.service';
import { CommonModule } from '@angular/common';
import { BudgetVarianceComponent } from "./budget-variance/budget-variance.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [IncomeChartComponent, ExpenseChartComponent, ProgressBar, BadgeModule, CardModule, CommonModule, BudgetVarianceComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  goalService = inject(GoalService);
  budgetService = inject(BudgetService);
  budgetsService = inject(BudgetsService);
  goals$: Observable<GoalsResponse[]> = this.goalService.getGoals();
  goals: GoalsResponse[] = [];
  budget! : number;
  budgets: Budget[] = [];
  totalIncome!: number;
  totalExpenses!: number;
  balance!: number;
  categoryExpenses: { [categoryName: string]: number } = {};
  checkedGoalsIds:string[] = [];
  
    ngOnInit(): void {
      this.budgetService.getIncomeTotal().subscribe(income => {
        this.totalIncome = income;
      });
      this.budgetsService.getBudgets().subscribe(budgets => {
        this.budgets = budgets;
      })
      this.budgetService.getExpensesTotal().subscribe(expense => {
        this.totalExpenses = expense;
      });
      this.budgetsService.getTotalExpensesByBudgetCategory().subscribe(categoryExpenses => {
        this.categoryExpenses = categoryExpenses;
        console.log(this.categoryExpenses);
      });
      this.budgetService.getBudget()
      .pipe(
        switchMap(budget => {
          console.log("Budget Loaded:", budget);
          this.budget = budget; // Save the budget locally
          this.balance = budget;
          return this.goals$; // Trigger goals$ observable after budget
        })
      )
      .subscribe(goals => {
        this.goals = goals;
        console.log("Goals Loaded:", this.goals);
        this.precomputeProgress(); // Precompute progress after loading goals
      });
  
    }
    round(val: number){
      return Math.round(val);
    }
    checkGoal(goal: GoalsResponse) {
      return this.checkedGoalsIds.includes(goal.docId);
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
  
  check(value: number){
    return value < 0 ? 0 : value;

  }
}
